import "dotenv/config";
import express from "express";
import path from "node:path";
import multer from "multer";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "node:url";

import { computeFromState } from "./server/prompt_engine.js";
import { normalizePromptRequestState } from "./server/request_state.js";
import {
  MOBILE_PREFIX,
  DESKTOP_PREFERENCE_COOKIE,
  buildRedirectTarget,
  isMobilePath,
  isPhoneHeaders,
  parseCookies,
  shouldSkipVersionRouting,
  withoutViewParam
} from "./server/version_routing.js";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const apiWriteLimiter = rateLimit({
  windowMs: 60_000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // unsafe-inline is needed for some legacy scripts, but we should aim to remove it
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);
app.use(cors({ origin: false })); // lock down behind your reverse proxy / same-origin

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024, files: 13 } });

const __filename = fileURLToPath(import.meta.url);
const publicDir = path.join(path.dirname(__filename), "public");

function setVersionCookie(res, preferDesktop) {
  const value = preferDesktop
    ? `${DESKTOP_PREFERENCE_COOKIE}=1; Path=/; Max-Age=31536000; SameSite=Lax`
    : `${DESKTOP_PREFERENCE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  res.setHeader("Set-Cookie", value);
}

app.use((req, res, next) => {
  res.setHeader("Accept-CH", "Sec-CH-UA-Mobile, Sec-CH-UA-Platform");
  res.append("Vary", "User-Agent");
  res.append("Vary", "Sec-CH-UA-Mobile");
  next();
});

app.use((req, res, next) => {
  if (shouldSkipVersionRouting(req.path)) return next();

  const forcedView = String(req.query?.view || "").trim().toLowerCase();
  if (forcedView !== "mobile" && forcedView !== "desktop") return next();

  const { pathname, search } = withoutViewParam(req.originalUrl);
  const target = buildRedirectTarget(pathname, search, forcedView === "mobile");
  setVersionCookie(res, forcedView === "desktop");
  return res.redirect(302, target);
});

app.use((req, res, next) => {
  if (shouldSkipVersionRouting(req.path) || isMobilePath(req.path)) return next();

  const cookies = parseCookies(req.headers.cookie || "");
  if (cookies[DESKTOP_PREFERENCE_COOKIE] === "1") return next();
  if (!isPhoneHeaders(req.headers)) return next();

  const target = buildRedirectTarget(req.path, req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "", true);
  return res.redirect(302, target);
});

app.use(express.static(publicDir, { etag: false, maxAge: "0" }));

app.get("/", (req, res) => res.sendFile(path.join(publicDir, "index.html")));
app.get(["/mobile", "/mobile/"], (req, res) => {
  res.sendFile(path.join(publicDir, "mobile", "index.html"));
});
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "vpe-prompt-builder", uptime_seconds: Math.round(process.uptime()) });
});
app.get("/ready", (_req, res) => {
  res.json({ ready: true });
});
app.get("/api/ui/buttons", (req, res) => {
  res.sendFile(path.join(publicDir, "config", "ui-buttons.json"));
});

// --- API: prompt generation
app.post("/api/prompt", apiWriteLimiter, upload.array("images", 13), async (req, res) => {
  try {
    let state = {};
    if (req.is("application/json")) {
      state = req.body?.state ?? req.body ?? {};
    } else {
      const raw = req.body?.state;
      state = raw ? JSON.parse(raw) : {};
    }

    state = await normalizePromptRequestState(state, req.files ?? []);

    const out = computeFromState(state);
    res.json({ prompt: out.prompt, json: out.json, warnings: Array.isArray(out.warnings) ? out.warnings : [] });
  } catch (e) {
    res.status(400).json({ error: "Bad request", details: String(e?.message ?? e) });
  }
});

// --- API: compact (placeholder: trims whitespace)
app.post("/api/compact", apiWriteLimiter, (req, res) => {
  const prompt = String(req.body?.prompt ?? "");
  const compacted = prompt.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  res.json({ prompt: compacted });
});

// --- API: translate via MyMemory (same as client, server-side)
app.post("/api/translate", apiWriteLimiter, async (req, res) => {
  try {
    const text = String(req.body?.text ?? "").trim();
    const to = String(req.body?.to ?? "en").trim();
    if (!text) return res.status(400).json({ error: "Empty text" });

    // MyMemory is free but rate-limited; you should swap to a paid provider if needed.
    const url = new URL("https://api.mymemory.translated.net/get");
    url.searchParams.set("q", text);
    url.searchParams.set("langpair", `ru|${to}`);

    const r = await fetch(url.toString(), { method: "GET" });
    if (!r.ok) {
      return res.status(502).json({ error: "Translate upstream failed", status: r.status });
    }
    const j = await r.json();
    const out = j?.responseData?.translatedText ?? "";
    res.json({ text: out || text });
  } catch (e) {
    res.status(500).json({ error: "Translate failed", details: String(e?.message ?? e) });
  }
});

// --- API: enhance (Powered by VeoAIFree backend Proxy)
app.post("/api/enhance", apiWriteLimiter, async (req, res) => {
  const text = String(req.body?.text ?? "").trim();
  if (!text) return res.status(400).json({ error: "Empty text" });

  const ENHANCE_TIMEOUT_MS = 8000;
  const VEOAI_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://veoaifree.com/veo-video-generator/",
    "X-Requested-With": "XMLHttpRequest"
  };

  function makeAbortSignal(ms) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    return { signal: controller.signal, clear: () => clearTimeout(timer) };
  }

  try {
    // 1. Fetch the main page to get the valid nonce
    const { signal: signal1, clear: clear1 } = makeAbortSignal(ENHANCE_TIMEOUT_MS);
    let html;
    try {
      const getRes = await fetch("https://veoaifree.com/veo-video-generator/", { headers: VEOAI_HEADERS, signal: signal1 });
      html = await getRes.text();
    } finally {
      clear1();
    }

    const match = html.match(/"nonce"\s*:\s*"([^"]+)"/);
    if (!match) {
      console.warn("VeoAIFree Enhancement: nonce not found in HTML — returning original");
      return res.json({ text });
    }
    const nonce = match[1];

    // 2. Perform the prompt enhancement request using the extracted nonce
    const bodyForm = new URLSearchParams();
    bodyForm.append("action", "veo_video_generator");
    bodyForm.append("actionType", "main-prompt-generation");
    bodyForm.append("prompt", text);
    bodyForm.append("nonce", nonce);

    const { signal: signal2, clear: clear2 } = makeAbortSignal(ENHANCE_TIMEOUT_MS);
    let enhanced;
    try {
      const tokenRes = await fetch("https://veoaifree.com/wp-admin/admin-ajax.php", {
        method: "POST",
        headers: {
          ...VEOAI_HEADERS,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: bodyForm,
        signal: signal2
      });
      if (!tokenRes.ok) {
        console.error("VeoAIFree Proxy error:", tokenRes.status);
        return res.json({ text });
      }
      enhanced = await tokenRes.text();
    } finally {
      clear2();
    }

    res.json({ text: enhanced || text });
  } catch (e) {
    if (e.name === "AbortError") {
      console.error("Enhance error: request timed out");
    } else {
      console.error("Enhance error:", e.message);
    }
    res.json({ text });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
