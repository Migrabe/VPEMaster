import { computeFromState } from "../server/prompt_engine.js";

const FACE_CONSTRAINTS = [
  "Keep the facial features of the person exactly consistent with the reference image",
  "Do not modify their identity",
  "Preserve all unique identifiers including exact eye color and hair color",
  "Maintain identical bone structure, skin tone, and facial imperfections like moles and scars across all variations"
];

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function assertExactArray(actual, expected, label) {
  assert(Array.isArray(actual), `${label}: expected array`);
  assert(actual.length === expected.length, `${label}: expected ${expected.length} items, got ${actual.length}`);
  expected.forEach((value, i) => {
    assert(actual[i] === value, `${label}: item ${i + 1} mismatch`);
  });
}

function run() {
  const baseState = {
    promptFormat: "flat",
    mainSubject: "portrait of a person",
    maxConsistency: true,
    referenceImages: [{ url: "https://example.com/reference.jpg", width: 1024, height: 1024 }]
  };

  const nbp = computeFromState({ ...baseState, aiModel: "nano-banana-pro" });
  assert(nbp.prompt.startsWith("Face ID locked from reference."), "NBP flat prompt must start with flat face lock text");
  assert(nbp.json && nbp.json.model === "nano-banana-pro", "NBP JSON model mismatch");
  assert(nbp.json.type === "image-to-image", "NBP JSON type must be image-to-image when reference is present");
  assertExactArray(nbp.json.face_constraints, FACE_CONSTRAINTS, "NBP face_constraints");

  const generic = computeFromState({ ...baseState, aiModel: "stable-diffusion" });
  assert(generic.json && generic.json.schema === "vpe-prompt-builder-v2", "Generic JSON schema mismatch");
  assertExactArray(generic.json.face_constraints, FACE_CONSTRAINTS, "Generic face_constraints");

  const structured = computeFromState({ ...baseState, aiModel: "nano-banana-pro", promptFormat: "structured" });
  assert(
    structured.prompt.startsWith("FACE ID LOCKED from reference."),
    "Structured max consistency prefix must keep legacy structured text"
  );

  const midjourneyFormatSync = computeFromState({
    promptFormat: "flat",
    aiModel: "midjourney",
    mainSubject: "cat astronaut",
    aspectRatio: "16:9",
    mjVersion: "7"
  });
  assert(
    /--ar 16:9/.test(midjourneyFormatSync.prompt),
    "Midjourney model must force Midjourney prompt format server-side"
  );
  assert(
    !midjourneyFormatSync.prompt.startsWith("Generate an image."),
    "Midjourney model should not emit flat prompt wrapper text"
  );

  const macroWide = computeFromState({
    promptFormat: "flat",
    aiModel: "stable-diffusion",
    mainSubject: "product still life",
    lens: "shot on Canon EF 100mm f/2.8L Macro IS USM, macro photography, extreme close-up, intricate textures",
    shotSize: "wide shot, full body visible, feet to head, environmental context included, establishing feel"
  });
  assert(/macro|100mm/i.test(macroWide.prompt), "Macro lens should remain in prompt after conflict pruning");
  assert(!/wide shot/i.test(macroWide.prompt), "Macro + wide shotSize must prune incompatible wide shot");

  const flatLayAngle = computeFromState({
    promptFormat: "flat",
    aiModel: "stable-diffusion",
    mainSubject: "desk setup",
    shotSize: "overhead flat lay photography, knolling arrangement, organized composition, geometric order, top-down view",
    angle: "low angle shot, looking up at subject, imposing perspective, heroic stature"
  });
  assert(/flat lay/i.test(flatLayAngle.prompt), "Flat lay shotSize should remain in prompt");
  assert(!/low angle shot/i.test(flatLayAngle.prompt), "Flat lay must prune non-top-down angle");

  const mediumCamera = computeFromState({
    promptFormat: "flat",
    aiModel: "stable-diffusion",
    mainSubject: "portrait study",
    medium: "oil on canvas, thick impasto texture, layered glazing, visible weave",
    cameraBody: "shot on ARRI Alexa 35, digital cinema, organic textures, high dynamic range",
    lens: "shot on Canon EF 50mm f/1.8 STM, classic nifty fifty look, natural rendering, clean bokeh"
  });
  assert(/oil on canvas/i.test(mediumCamera.prompt), "Selected artistic medium should remain in prompt");
  assert(!/shot on arri alexa 35/i.test(mediumCamera.prompt), "Artistic medium must prune camera body");
  assert(!/nifty fifty/i.test(mediumCamera.prompt), "Artistic medium must prune lens");

  const mediumUnicodeRange = computeFromState({
    promptFormat: "flat",
    aiModel: "stable-diffusion",
    mainSubject: "portrait study",
    medium: "graphite pencil 2B\u20136B range, fine cross-hatching, subtle tonal gradation",
    cameraBody: "shot on ARRI Alexa 35, digital cinema, organic textures, high dynamic range",
    lens: "shot on Canon EF 50mm f/1.8 STM, classic nifty fifty look, natural rendering, clean bokeh"
  });
  assert(/graphite pencil 2b/i.test(mediumUnicodeRange.prompt), "Unicode medium token should remain after normalization");
  assert(!/shot on arri alexa 35/i.test(mediumUnicodeRange.prompt), "Unicode medium token must prune camera body");
  assert(!/nifty fifty/i.test(mediumUnicodeRange.prompt), "Unicode medium token must prune lens");

  const artStyleCamera = computeFromState({
    promptFormat: "flat",
    aiModel: "stable-diffusion",
    mainSubject: "portrait study",
    artStyle: "\u0410\u043d\u0438\u043c\u0435",
    cameraBody: "shot on ARRI Alexa 35, digital cinema, organic textures, high dynamic range",
    lens: "shot on Canon EF 50mm f/1.8 STM, classic nifty fifty look, natural rendering, clean bokeh"
  });
  assert(!/shot on arri alexa 35/i.test(artStyleCamera.prompt), "Art style input must prune camera body for API parity");
  assert(!/nifty fifty/i.test(artStyleCamera.prompt), "Art style input must prune lens for API parity");

  const quickVsFashion = computeFromState({
    promptFormat: "flat",
    aiModel: "stable-diffusion",
    mainSubject: "editorial portrait",
    quickStyle: "1917",
    fashionFoodStyle: "vogue-polished"
  });
  assert(
    quickVsFashion.json?.parameters?.quick_style === "1917",
    "Quick Style must win over Fashion/Food when both are provided"
  );
  assert(
    !quickVsFashion.json?.parameters?.fashion_food_style,
    "Fashion/Food style must be cleared when Quick Style is active"
  );

  const photoVsCinema = computeFromState({
    promptFormat: "flat",
    aiModel: "stable-diffusion",
    mainSubject: "editorial portrait",
    photoStyle: "in the style of Annie Leibovitz, dramatic portrait lighting, rich colors",
    cinemaStyle: "shot by Roger Deakins, naturalistic lighting, golden hour realism"
  });
  assert(
    photoVsCinema.json?.parameters?.photo_style,
    "Photo style must be preserved in photoStyle + cinemaStyle conflict"
  );
  assert(
    !photoVsCinema.json?.parameters?.cinema_style,
    "Cinema style must be pruned when photo style conflicts"
  );

  const photoVsDirector = computeFromState({
    promptFormat: "flat",
    aiModel: "stable-diffusion",
    mainSubject: "editorial portrait",
    photoStyle: "in the style of Annie Leibovitz, dramatic portrait lighting, rich colors",
    directorStyle: "in the style of Christopher Nolan, IMAX realism, practical effects"
  });
  assert(
    photoVsDirector.json?.parameters?.photo_style,
    "Photo style must be preserved in photoStyle + directorStyle conflict"
  );
  assert(
    !photoVsDirector.json?.parameters?.director_style,
    "Director style must be pruned when photo style conflicts"
  );

  const nonCollabCinemaDirector = computeFromState({
    promptFormat: "flat",
    aiModel: "stable-diffusion",
    mainSubject: "editorial portrait",
    cinemaStyle: "shot by Roger Deakins, naturalistic lighting, golden hour realism",
    directorStyle: "in the style of Christopher Nolan, IMAX realism, practical effects"
  });
  assert(
    nonCollabCinemaDirector.json?.parameters?.cinema_style,
    "Cinema style must remain when non-collab director/cinema pair conflicts"
  );
  assert(
    !nonCollabCinemaDirector.json?.parameters?.director_style,
    "Non-collab director style must be pruned from output"
  );

  const knownCollabCinemaDirector = computeFromState({
    promptFormat: "flat",
    aiModel: "stable-diffusion",
    mainSubject: "editorial portrait",
    cinemaStyle: "shot by Hoyte van Hoytema, IMAX large format, deep contrast",
    directorStyle: "in the style of Christopher Nolan, IMAX realism, practical effects"
  });
  assert(
    knownCollabCinemaDirector.json?.parameters?.cinema_style &&
    knownCollabCinemaDirector.json?.parameters?.director_style,
    "Known director/cinematographer collaboration must stay enabled"
  );

  const motionBlurVsGenerate = computeFromState({
    promptFormat: "flat",
    aiModel: "stable-diffusion",
    mainSubject: "runner in the rain",
    motionBlurMode: true,
    generateFourMode: true
  });
  assert(
    motionBlurVsGenerate.json?.modes?.motion_blur === true,
    "Motion blur must stay enabled in motionBlur + generate4 conflict"
  );
  assert(
    !motionBlurVsGenerate.prompt.startsWith("Generate 4 distinct variations"),
    "Generate 4 wrapper must be disabled when motion blur is enabled"
  );

  const seamlessVsShot = computeFromState({
    promptFormat: "flat",
    aiModel: "stable-diffusion",
    mainSubject: "fabric pattern",
    seamlessPattern: true,
    shotSize: "medium shot, waist up, standard cinematic framing, character with context, neutral distance"
  });
  assert(
    !/medium shot/i.test(seamlessVsShot.prompt),
    "Seamless pattern must prune non-flat-lay shot size"
  );

  const dallENegative = computeFromState({
    promptFormat: "flat",
    aiModel: "dall-e-3",
    mainSubject: "poster concept",
    negativePrompt: "bad anatomy, blur"
  });
  assert(
    !Object.prototype.hasOwnProperty.call(dallENegative.json || {}, "negative"),
    "DALL-E 3 output must not include negative prompt field"
  );

  const fluxNegative = computeFromState({
    promptFormat: "flat",
    aiModel: "flux",
    mainSubject: "poster concept",
    negativePrompt: "bad anatomy, blur"
  });
  assert(
    !Object.prototype.hasOwnProperty.call(fluxNegative.json || {}, "negative"),
    "Flux output must not include negative prompt field"
  );

  const sdNegative = computeFromState({
    promptFormat: "flat",
    aiModel: "stable-diffusion",
    mainSubject: "poster concept",
    negativePrompt: "bad anatomy, blur"
  });
  assert(sdNegative.json?.negative === "bad anatomy, blur", "Stable Diffusion must keep negative prompt field");

  console.log("Runtime smoke checks passed.");
}

try {
  run();
} catch (error) {
  console.error(`Runtime smoke checks failed: ${error.message}`);
  process.exit(1);
}
