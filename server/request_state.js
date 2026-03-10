import sharp from "sharp";

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value ?? {}));
}

async function readImageMetadata(buffer) {
  if (!buffer) return {};
  try {
    const metadata = await sharp(buffer).metadata();
    return {
      width: metadata.width,
      height: metadata.height
    };
  } catch {
    return {};
  }
}

export async function normalizePromptRequestState(rawState, files = []) {
  const state = (rawState && typeof rawState === "object") ? cloneJson(rawState) : {};
  const uploadedFiles = Array.isArray(files) ? files : [];
  const existingReferences = Array.isArray(state.referenceImages) ? state.referenceImages : [];

  if (!uploadedFiles.length) {
    state.referenceImages = existingReferences;
    return state;
  }

  const mergedReferences = [];

  for (let index = 0; index < uploadedFiles.length; index += 1) {
    const file = uploadedFiles[index] || {};
    const previous = (existingReferences[index] && typeof existingReferences[index] === "object")
      ? existingReferences[index]
      : {};
    const meta = await readImageMetadata(file.buffer);

    mergedReferences.push({
      ...previous,
      name: (typeof previous.name === "string" && previous.name.trim())
        ? previous.name
        : (file.originalname || previous.name || ""),
      width: meta.width ?? previous.width,
      height: meta.height ?? previous.height,
      description: typeof previous.description === "string" ? previous.description : "",
      extract: Array.isArray(previous.extract) ? previous.extract.slice() : []
    });
  }

  state.referenceImages = mergedReferences;
  return state;
}
