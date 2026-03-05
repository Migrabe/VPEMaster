import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientLogicCandidates = [
  path.join(__dirname, "..", "public", "js", "client_logic_full.js"),
  path.join(__dirname, "..", "public", "js", "client_logic.js")
];
const clientLogicPath = clientLogicCandidates.find((p) => fs.existsSync(p)) ?? clientLogicCandidates[1];
const CLIENT_LOGIC = fs.readFileSync(clientLogicPath, "utf8");

const taxonomyRulesPath = path.join(__dirname, "..", "public", "config", "taxonomy-rules.json");
let TAXONOMY_RULES = [];
try {
  const taxonomyRaw = fs.readFileSync(taxonomyRulesPath, "utf8");
  const parsed = JSON.parse(taxonomyRaw);
  TAXONOMY_RULES = Array.isArray(parsed?.rules) ? parsed.rules : [];
} catch (_e) {
  // Keep server operational even if taxonomy file is unavailable.
  TAXONOMY_RULES = [];
}

const engineCapabilitiesPath = path.join(__dirname, "..", "public", "config", "engine-capabilities.json");
let ENGINE_CAPABILITIES = {};
try {
  const raw = fs.readFileSync(engineCapabilitiesPath, "utf8");
  const parsed = JSON.parse(raw);
  ENGINE_CAPABILITIES = parsed && typeof parsed === "object" ? parsed : {};
} catch (_e) {
  // Client script contains a fallback map; server can continue if config is missing.
  ENGINE_CAPABILITIES = {};
}

/**
 * Create a permissive dummy DOM element that absorbs any property/method usage.
 */
function createDummyElement() {
  const handler = {
    get(target, prop) {
      if (prop === "classList") {
        return { add() { }, remove() { }, toggle() { }, contains() { return false; } };
      }
      if (prop === "style") return {};
      if (prop === "dataset") return {};
      if (prop === "files") return [];
      if (prop === "value") return "";
      if (prop === "checked") return false;
      if (prop === "textContent") return "";
      if (prop === "innerHTML") return "";
      if (prop === "addEventListener") return () => { };
      if (prop === "removeEventListener") return () => { };
      if (prop === "querySelector") return () => createDummyElement();
      if (prop === "querySelectorAll") return () => [];
      if (prop === "appendChild") return () => { };
      if (prop === "removeChild") return () => { };
      if (prop === "setAttribute") return () => { };
      if (prop === "getAttribute") return () => null;
      if (prop === "hasAttribute") return () => false;
      if (prop === "remove") return () => { };
      if (prop === "insertAdjacentElement") return () => { };
      if (prop === "click") return () => { };
      if (prop === "focus") return () => { };
      if (prop === "blur") return () => { };
      return target[prop];
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    }
  };
  return new Proxy({}, handler);
}

/**
 * Minimal DOM stubs to let the original client script define constants and builder functions.
 * We do not rely on any DOM-dependent behavior at runtime.
 */
function createSandbox() {
  const dummy = createDummyElement();

  const documentStub = {
    getElementById() { return dummy; },
    querySelector() { return dummy; },
    querySelectorAll() { return []; },
    createElement() { return dummy; },
    addEventListener() { },
    removeEventListener() { },
    body: dummy
  };

  const locationStub = { href: "", hostname: "localhost" };

  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    TextEncoder,
    TextDecoder,
    location: locationStub,
    addEventListener() { },
    removeEventListener() { },
    document: documentStub,
    localStorage: {
      getItem() { return null; },
      setItem() { }
    },
    engineCapabilities: deepClone(ENGINE_CAPABILITIES),
    // Some scripts may refer to these:
    navigator: { userAgent: "node" },
    Intl,
    Math,
    Date,
  };

  // In browser code often assumes window === globalThis
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  return sandbox;
}

const sandbox = createSandbox();
const context = vm.createContext(sandbox);

// Execute the extracted browser logic once at startup.
vm.runInContext(CLIENT_LOGIC, context, { filename: "client_logic.js" });

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

// In VM mode DOMContentLoaded does not fire, so inject taxonomy rules directly.
context.taxonomyRules = deepClone(TAXONOMY_RULES);
context.window.taxonomyRules = deepClone(TAXONOMY_RULES);

// Snapshot pristine client state once; each compute request must start from this baseline.
const BASE_STATE = deepClone(context.state || {});

/**
 * Compute prompt and json output using the original builder functions (server-side).
 * IMPORTANT: anything that requires real DOM is not used here.
 */
export function computeFromState(stateInput) {
  // Rehydrate state from pristine defaults on each request to prevent cross-request leakage.
  // Important: mutate in-place to preserve references captured by client logic closures.
  if (!context.state) context.state = {};
  const incomingState = deepClone(stateInput || {});
  // Use incoming state snapshot as "previous" to make single-shot API requests deterministic.
  const prevState = deepClone({ ...BASE_STATE, ...incomingState });
  for (const key of Object.keys(context.state)) {
    delete context.state[key];
  }
  Object.assign(context.state, deepClone(BASE_STATE), incomingState);

  // Keep server-side computation aligned with UI conflict pruning/normalization logic.
  if (context.appState && typeof context.appState._pruneConflicts === "function") {
    try {
      context.appState._pruneConflicts(prevState);
    } catch (_e) {
      // Fallback: if StateManager internals changed, keep request serving best-effort output.
      if (typeof context.enforceOutputStateRules === "function") {
        context.enforceOutputStateRules(context.state, prevState);
      }
    }
  } else if (typeof context.enforceOutputStateRules === "function") {
    context.enforceOutputStateRules(context.state, prevState);
  }

  // Choose prompt format
  let promptText = "";
  const fmt = context.state.promptFormat || "flat";
  const model = context.state.aiModel || "";
  const normalizedModel = typeof context.normalizeAiModelValue === "function"
    ? (context.normalizeAiModelValue(model) || model)
    : model;
  const isNBP = typeof context.isNBPModel === "function"
    ? !!context.isNBPModel(normalizedModel)
    : ["nano-banana-pro", "nano-banana", "gemini-imagen"].includes(normalizedModel);

  if (fmt === "midjourney") promptText = context.buildMidjourneyPrompt?.() ?? "";
  else if (fmt === "structured") promptText = context.buildStructuredPrompt?.() ?? "";
  else promptText = context.buildFlatPrompt?.() ?? "";

  // Append render boosts for text-only flows.
  // For NBP JSON flows, render boost should stay in structured JSON fields.
  const skinBoostBlock = fmt === "flat"
    ? context.SKIN_RENDER_CONFIG_FLAT
    : context.SKIN_RENDER_CONFIG;
  const hairBoostBlock = fmt === "flat"
    ? context.HAIR_RENDER_CONFIG_FLAT
    : context.HAIR_RENDER_CONFIG;

  if (!isNBP && context.state.skinRenderBoost && skinBoostBlock) {
    promptText += "\n\n" + skinBoostBlock;
  }
  if (!isNBP && context.state.hairRenderBoost && hairBoostBlock) {
    promptText += "\n\n" + hairBoostBlock;
  }

  // Max consistency wrapper
  if (context.state.maxConsistency && context.MAX_CONSISTENCY_PREFIX) {
    const consistencyPrefix = fmt === "flat" && context.MAX_CONSISTENCY_PREFIX_FLAT
      ? context.MAX_CONSISTENCY_PREFIX_FLAT
      : context.MAX_CONSISTENCY_PREFIX;
    promptText = consistencyPrefix + "\n" + promptText;
    if (normalizedModel === "midjourney") {
      promptText = (promptText ?? "").trimEnd() + " --cw 100";
    }
  }

  // 3x3 wrapper
  if (context.state.grid3x3Mode && context.GRID_3X3_PREFIX) {
    if (fmt === "structured" && context.build3x3ForNBP) {
      promptText = context.build3x3ForNBP(promptText);
    } else if (context.build3x3FlatForNBP) {
      promptText = context.build3x3FlatForNBP(promptText);
    } else {
      promptText = context.GRID_3X3_PREFIX + promptText;
    }
  }

  // Generate 4 wrapper (keep original branching, but without client-only bits)
  if (context.state.generateFourMode && context.GENERATE_FOUR_PREFIX) {
    if (isNBP) {
      if (fmt === "structured" && context.buildG4ForNBP) {
        promptText = context.buildG4ForNBP(promptText);
      } else if (context.buildG4FlatForNBP) {
        promptText = context.buildG4FlatForNBP(promptText);
      } else {
        promptText = context.GENERATE_FOUR_PREFIX + "\n\n" + promptText;
      }
    } else {
      promptText = context.GENERATE_FOUR_PREFIX + "\n\n" + promptText;
    }
  }

  // JSON output
  const jsonObj = context.buildJson?.() ?? null;

  return { prompt: (promptText || "").trim(), json: jsonObj };
}
