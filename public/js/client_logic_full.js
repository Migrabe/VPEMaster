// =============================================
// CONFIG
// =============================================
const groupConfig = {
  aiModel: { mode: "single" },
  cameraBody: { mode: "single" },
  aspectRatio: { mode: "single" },
  resolution: { mode: "single" },
  purpose: { mode: "single" },
  format: { mode: "single" },
  medium: { mode: "single" },
  lens: { mode: "single" },
  focalLength: { mode: "single" },
  shotSize: { mode: "single" },
  aperture: { mode: "single" },
  angle: { mode: "single" },
  composition: { mode: "single" },
  quality: { mode: "single" },
  mjVersion: { mode: "single" },
  mjStyle: { mode: "single" },
  fluxModel: { mode: "single" },
  dalleStyle: { mode: "single" },
  dalleQuality: { mode: "single" },
  referenceType: { mode: "single" },
  photoStyle: { mode: "single" },
  cinemaStyle: { mode: "single" },
  directorStyle: { mode: "single" },
  artStyle: { mode: "single" },
  filmStock: { mode: "single" },
  colorPalette: { mode: "single" },
  mood: { mode: "single" },
  lighting: { mode: "multi" },
  lightType: { mode: "single" },
  skinDetail: { mode: "multi" },
  hairDetail: { mode: "multi" },
  material: { mode: "multi" },
  typography: { mode: "multi" },
  quickStyle: { mode: "single" },
  fashionFoodStyle: { mode: "single" },
  emotion: { mode: "single" }
};

const resolutionMap = {
  '1:1': [{ value: '1024x1024', label: '1K (1024×1024)' }, { value: '2048x2048', label: '2K (2048×2048)' }, { value: '4096x4096', label: '4K (4096×4096)' }],
  '16:9': [{ value: '1920x1080', label: 'Full HD (1920×1080)' }, { value: '2560x1440', label: '2K (2560×1440)' }, { value: '3840x2160', label: '4K UHD (3840×2160)' }, { value: '7680x4320', label: '8K (7680×4320)' }],
  '9:16': [{ value: '1080x1920', label: 'Full HD (1080×1920)' }, { value: '1440x2560', label: '2K (1440×2560)' }, { value: '2160x3840', label: '4K UHD (2160×3840)' }],
  '4:3': [{ value: '1024x768', label: 'XGA (1024×768)' }, { value: '2048x1536', label: '2K (2048×1536)' }, { value: '4096x3072', label: '4K (4096×3072)' }],
  '3:4': [{ value: '768x1024', label: 'Портрет (768×1024)' }, { value: '1536x2048', label: '2K (1536×2048)' }, { value: '3072x4096', label: '4K (3072×4096)' }],
  '21:9': [{ value: '2560x1080', label: 'UltraWide (2560×1080)' }, { value: '3440x1440', label: 'UWQHD (3440×1440)' }, { value: '5120x2160', label: '5K UW (5120×2160)' }],
  '2:3': [{ value: '1366x2048', label: '2K (1366×2048)' }, { value: '2732x4096', label: '4K (2732×4096)' }],
  '3:2': [{ value: '2048x1366', label: '2K (2048×1366)' }, { value: '4096x2732', label: '4K (4096×2732)' }]
};

// Model-specific tips
const modelTips = {
  'midjourney': 'MJ: используйте --ar, --v, --s, --cref в конце промпта. Формат «Midjourney» строит правильный синтаксис.',
  'dall-e-3': 'DALL·E 3: пишите естественным языком, как описание сцены. Негативы не поддерживаются.',
  'stable-diffusion': 'SD: поддерживает негативы, веса токенов (word:1.3), LoRA. Используйте формат Flat.',
  'flux': 'Flux: естественный язык, как DALL·E. Поддерживает --ar.',
  'ideogram': 'Ideogram: отлично рендерит текст. Используйте текстовый блок.',
  'gemini-imagen': 'Gemini Imagen: опишите сцену + загрузите референсы в чат.',
  'chatgpt-image': 'ChatGPT Image (GPT-Image-1 / gpt-4o): естественный язык, поддерживает многошаговые инструкции и стилизацию через диалог. Встроенный рендер текста.',
  'nano-banana-pro': 'Nano Banana Pro: быстрая генерация, поддерживает промпты в стиле Stable Diffusion. Оптимизирован для скорости.'
};

// Presets
const presets = [
  {
    name: "🎬 Кинопортрет",
    values: {
      aiModel: "stable-diffusion", cameraBody: "shot on Sony A7R V", aspectRatio: "3:4", purpose: "Cinematic Still", format: "photorealistic",
      lens: "Sony FE 85mm f/1.4 GM", aperture: "f/2.0, gentle depth of field, balanced bokeh, slightly more context than f/1.4", angle: "eye level shot, neutral perspective, straight on angle, direct engagement", composition: "close-up portrait, head and shoulders, emotional connection, facial expression focus, detailed features",
      quality: "4k, high quality, detailed",
      lighting: ["dramatic chiaroscuro", "backlighting silhouette", "golden hour warm sunlight", "rim light"], skinDetail: ["visible skin pores, natural grain", "natural freckles and imperfections"],
      material: [], typography: []
    }
  },
  {
    name: "📦 Предметная съёмка",
    values: {
      aiModel: "stable-diffusion", cameraBody: "shot on Hasselblad X2D 100C", aspectRatio: "1:1", purpose: "Product Photography", format: "photorealistic",
      lens: "Canon RF 100mm f/2.8L Macro IS USM", aperture: "f/8.0, deep focus, optimal lens sharpness, landscape photography sweet spot", angle: "eye level shot, neutral perspective, straight on angle, direct engagement", composition: "overhead flat lay photography, knolling arrangement, organized composition, geometric order, top-down view",
      quality: "8k, masterpiece, best quality, ultra detailed",
      lighting: ["studio three-point lighting", "softbox beauty light", "bright midday sun"], skinDetail: [],
      material: ["matte finish", "polished chrome"], typography: []
    }
  },
  {
    name: "🌃 Неоновый киберпанк",
    values: {
      aiModel: "midjourney", cameraBody: "shot on RED V-Raptor", aspectRatio: "21:9", purpose: "Cinematic Still", format: "photorealistic",
      lens: "ARRI Signature Prime 35mm T1.8", aperture: "f/2.8, balanced depth of field, professional portrait look, controlled background separation", angle: "low angle shot, looking up at subject, imposing perspective, heroic stature", composition: "wide shot, establishing shot, subject in environment, cinematic landscape context, storytelling scale",
      quality: "4k, high quality, detailed",
      lighting: ["neon glow lighting", "dramatic chiaroscuro", "night, artificial lighting", "blue hour twilight", "god rays", "lens flare", "volumetric fog"], skinDetail: [],
      material: ["wet asphalt reflections"], typography: []
    }
  },
  {
    name: "🎨 Концепт-арт",
    values: {
      aiModel: "stable-diffusion", cameraBody: "", aspectRatio: "16:9", purpose: "Concept Art", format: "oil painting",
      lens: "", aperture: "f/2.8, balanced depth of field, professional portrait look, controlled background separation", angle: "eye level shot, neutral perspective, straight on angle, direct engagement", composition: "extreme wide shot, massive scale, tiny subject in vast landscape, epic panorama, environmental dominance",
      quality: "4k, high quality, detailed",
      lighting: ["soft natural light", "golden hour warm sunlight", "volumetric fog", "god rays"], skinDetail: [],
      material: [], typography: []
    }
  },
  {
    name: "💼 Коммерческая съёмка",
    values: {
      aiModel: "stable-diffusion", cameraBody: "shot on Phase One IQ4 150MP", aspectRatio: "4:3", purpose: "Product Photography", format: "photorealistic",
      lens: "Canon RF 50mm f/1.2L USM", aperture: "f/5.6, deep depth of field, group photo sharpness, landscape with foreground interest", angle: "slightly high angle, looking down at subject, submissive perspective", composition: "medium shot, waist up, standard cinematic framing, character with context, neutral distance",
      quality: "8k, masterpiece, best quality, ultra detailed",
      lighting: ["studio three-point lighting", "softbox beauty light", "bright midday sun", "subsurface scattering"], skinDetail: ["visible skin pores, natural grain"],
      material: ["matte finish"], typography: []
    }
  },
  {
    name: "📺 Рекламный ролик",
    values: {
      aiModel: "midjourney", cameraBody: "shot on ARRI ALEXA 35", aspectRatio: "16:9", purpose: "Cinematic Still", format: "photorealistic",
      lens: "Cooke S7/i 50mm T2.0 Full Frame Plus", aperture: "f/2.8, balanced depth of field, professional portrait look, controlled background separation", angle: "slightly low angle, hero shot, up-looking perspective, authoritative stance", composition: "medium close-up shot, chest up, standard dialogue framing, business portrait, interview style",
      quality: "4k, high quality, detailed",
      lighting: ["studio three-point lighting", "backlighting silhouette", "bright midday sun", "golden hour warm sunlight", "rim light", "lens flare"], skinDetail: ["visible skin pores, natural grain", "peach fuzz, vellus hair"],
      material: ["polished chrome"], typography: ["bold sans-serif typography"]
    }
  },
  {
    name: "🔬 Макро реклама",
    values: {
      aiModel: "stable-diffusion", cameraBody: "shot on Canon EOS R5", aspectRatio: "1:1", purpose: "Product Photography", format: "photorealistic",
      lens: "Canon RF 100mm f/2.8L Macro IS USM", aperture: "f/2.8, balanced depth of field, professional portrait look, controlled background separation", angle: "eye level shot, neutral perspective, straight on angle, direct engagement", composition: "extreme close-up shot, detail focus, eyes or lips only, intense intimacy, macro texture",
      quality: "8k, masterpiece, best quality, ultra detailed",
      lighting: ["softbox beauty light", "studio three-point lighting", "bright midday sun", "subsurface scattering", "caustics"], skinDetail: [],
      material: ["frosted glass, translucent diffused", "polished chrome"], typography: []
    }
  },
  {
    name: "🧩 UI Дизайн",
    values: {
      aiModel: "ideogram", cameraBody: "", aspectRatio: "16:9", purpose: "UI Design", format: "vector illustration",
      medium: "vector illustration, clean bezier curves, infinite scalability, flat color blocks, print-ready crisp edges",
      lens: "", aperture: "", angle: "eye level shot, neutral perspective, straight on angle, direct engagement", composition: "modular interface grid, clear information hierarchy, balanced negative space, clean alignment system",
      quality: "8k, masterpiece, best quality, ultra detailed",
      lighting: ["soft natural light", "bright midday sun"], skinDetail: [], hairDetail: [],
      material: ["matte finish"], typography: ["bold sans-serif typography", "clean modern sans-serif typography, swiss style, high legibility, balanced kerning"]
    }
  },
  {
    name: "📊 Инфографика",
    values: {
      aiModel: "ideogram", cameraBody: "", aspectRatio: "4:3", purpose: "Infographic", format: "vector illustration",
      medium: "vector illustration, clean bezier curves, infinite scalability, flat color blocks, print-ready crisp edges",
      lens: "", aperture: "", angle: "eye level shot, neutral perspective, straight on angle, direct engagement", composition: "structured infographic layout, chart-first hierarchy, icon blocks, clean callouts, visual storytelling flow",
      quality: "8k, masterpiece, best quality, ultra detailed",
      lighting: ["soft natural light", "bright midday sun"], skinDetail: [], hairDetail: [],
      material: ["matte finish"], typography: ["bold sans-serif typography", "small text captions, fine print, readable micro typography"]
    }
  },
  {
    name: "✳️ Логотип",
    values: {
      aiModel: "ideogram", cameraBody: "", aspectRatio: "1:1", purpose: "Logo Design", format: "vector illustration",
      medium: "vector illustration, clean bezier curves, infinite scalability, flat color blocks, print-ready crisp edges",
      lens: "", aperture: "", angle: "eye level shot, neutral perspective, straight on angle, direct engagement", composition: "centered logo mark, strict symmetry, strong silhouette, ample clear space, brand-ready lockup",
      quality: "8k, masterpiece, best quality, ultra detailed",
      lighting: ["soft natural light", "bright midday sun"], skinDetail: [], hairDetail: [],
      material: ["matte finish"], typography: ["bold sans-serif typography"]
    }
  },
  {
    name: "🧍 Лист персонажа",
    values: {
      aiModel: "stable-diffusion", cameraBody: "", aspectRatio: "3:4", purpose: "Character Sheet", format: "photorealistic",
      medium: "digital art, Wacom tablet rendering, smooth blending, crisp edges",
      lens: "", aperture: "f/4.0, moderate depth of field, environmental portrait, sharp subject with soft background context", angle: "eye level shot, neutral perspective, straight on angle, direct engagement", composition: "full body shot, head to toe, character in environment, fashion photography style, complete figure",
      quality: "8k, masterpiece, best quality, ultra detailed",
      lighting: ["studio three-point lighting", "rim light", "bright midday sun", "subsurface scattering"], skinDetail: ["visible skin pores, natural grain"], hairDetail: ["ultra detailed individual hair strands, each strand visible, photorealistic hair"],
      material: ["matte finish"], typography: []
    }
  },
  { name: "📷 Естественный портрет", values: { aiModel: "flux", cameraBody: "shot on Sony A7R V", aspectRatio: "3:4", purpose: "Photography", format: "photorealistic", lens: "Sony FE 85mm f/1.4 GM", aperture: "f/1.4, shallow depth of field, creamy bokeh, subject isolation, soft background blur", angle: "eye level shot, neutral perspective, straight on angle, direct engagement", composition: "close-up portrait, head and shoulders, emotional connection, facial expression focus, detailed features", quality: "8k, masterpiece, best quality, ultra detailed", lighting: ["soft natural light", "golden hour warm sunlight", "rim light"], skinDetail: ["visible skin pores, natural grain", "peach fuzz, vellus hair"], hairDetail: ["ultra detailed individual hair strands, each strand visible, photorealistic hair", "flyaway baby hairs, wispy strands, backlit hair glow"], material: [], typography: [], photoStyle: "in the style of Annie Leibovitz, dramatic portrait lighting, rich colors", cinemaStyle: "", directorStyle: "" } },
  { name: "🏙️ Уличный фотореализм", values: { aiModel: "stable-diffusion", cameraBody: "shot on Leica M11", aspectRatio: "3:2", purpose: "Photography", format: "photorealistic", lens: "Leica Summilux-M 50mm f/1.4 ASPH", aperture: "f/2.8, balanced depth of field, professional portrait look, controlled background separation", angle: "eye level shot, neutral perspective, straight on angle, direct engagement", composition: "medium shot, waist up, standard cinematic framing, character with context, neutral distance", quality: "4k, high quality, detailed", lighting: ["soft natural light", "backlighting silhouette", "overcast diffused light", "volumetric fog"], skinDetail: ["visible skin pores, natural grain"], hairDetail: [], material: ["wet asphalt reflections", "rough concrete"], typography: [], photoStyle: "in the style of Steve McCurry, vivid saturated colors, documentary", cinemaStyle: "", directorStyle: "" } },
  { name: "💎 Beauty / Косметика", values: { aiModel: "stable-diffusion", cameraBody: "shot on Hasselblad X2D 100C", aspectRatio: "3:4", purpose: "Advertising campaign", format: "photorealistic", lens: "Canon RF 85mm f/1.2L USM", aperture: "f/2.0, gentle depth of field, balanced bokeh, slightly more context than f/1.4", angle: "slightly high angle, looking down at subject, submissive perspective", composition: "extreme close-up shot, detail focus, eyes or lips only, intense intimacy, macro texture", quality: "8k, masterpiece, best quality, ultra detailed", lighting: ["clamshell lighting, beauty commercial", "softbox beauty light", "bright midday sun", "subsurface scattering", "rim light"], skinDetail: ["visible skin pores, natural grain", "peach fuzz, vellus hair", "subtle under-eye texture"], hairDetail: ["ultra detailed individual hair strands, each strand visible, photorealistic hair", "detailed hair highlights, light catching individual strands, hair shine"], material: ["polished chrome"], typography: [], photoStyle: "in the style of Mario Testino, warm golden tones, glossy fashion", cinemaStyle: "", directorStyle: "" } },

];

// =============================================
// EMOTION PRESETS
// =============================================
const EMOTIONS = {
  "Euphoria": "(genuine euphoria:1.3), Duchenne smile, (crinkled eyes with crow's feet:1.2), zygomaticus major activation, raised cheeks, sparkling eyes with distinct catchlights, natural skin texture stretching over cheekbones, soft warm golden hour lighting, high-key atmosphere",
  "Grief": "(deep grief:1.3), heartbroken expression, (inner eyebrows raised and drawn together:1.4), omega sign on forehead, quivering lower lip, downturned mouth corners, (glassy eyes brimming with unshed tears:1.2), red puffy eyelids, pale complexion, low-key lighting, cool blue tones, heavy shadows obscuring the eyes (toplight)",
  "Rage": "(suppressed rage:1.4), intense micro-expressions, (clenched jaw and pulsing temple vein), flared nostrils, furrowed brow, corrugator supercilii activation, narrowed piercing eyes, fixed stare, lips pressed into a thin line, dramatic side lighting (chiaroscuro), high contrast, deep shadows",
  "Terror": "(sheer terror:1.5), face of pure horror, (eyes wide open showing sclera above iris:1.3), dilated pupils, pale drained skin, sweat beads on forehead, trembling parted lips, tense neck muscles, spooky underlighting (lighting from below), unnatural upward shadows",
  "Disgust": "(visceral disgust:1.3), repulsed expression, (wrinkled nose:1.4), nasalis muscle activation, curled upper lip, narrowed squinting eyes, pulling head back, distinct nasolabial folds, harsh texture accentuating lighting, greenish undertone",
  "Shock": "(state of total shock:1.3), frozen in disbelief, (jaw dropped:1.2), mouth agape, slack jaw, highly raised arched eyebrows, eyes wide open, blank stare, motionless, sharp rim lighting separating subject from background, stillness",
  "Contempt": "(skeptical contempt:1.2), arrogance, (asymmetrical facial expression:1.3), one eyebrow cocked high, unilateral smirk (one lip corner raised), eyelids narrowed in judgment, looking down on viewer, split lighting (side light), sharp shadows",
  "Pain": "(screaming in agony:1.4), physical pain, eyes tightly squeezed shut, teeth gritted or mouth wide open in a scream, (veins popping on forehead and neck), sweat dripping, contorted facial muscles, extreme tension, dramatic high-contrast lighting, gritty texture",
  "Nostalgia": "(bittersweet expression:1.2), emotional complexity, (smiling mouth with sad eyes:1.3), gentle upturned lips paired with teary glistening eyes, soft melancholic gaze, emotional dissonance, nostalgic atmosphere, dreamy backlighting, lens flare, soft focus",
  "Serene": "(serene neutrality:1.3), deadpan face, completely relaxed facial muscles, blank stare, unfocused gaze, slack jaw, no micro-expressions, symmetry, soft diffuse studio lighting, passport photo style",

  // Subtle Emotions
  "Pensive": "(deeply pensive:1.2), lost in thought, slight furrow of brow, gaze drifted away from camera, hand resting on chin or temple, soft melancholy, atmospheric lighting, quiet introspection",
  "Curious": "(mild curiosity:1.2), head slightly tilted, eyebrows raised in interest, focused gaze, lips slightly parted as if about to speak, engaging expression, bright eyes, alertness, soft inviting light",
  "Melancholic": "(gentle melancholy:1.2), soft sadness, downward gaze, relaxed facial muscles with hint of sorrow, subdued atmosphere, muted colors, window light, rainy mood",
  "Hopeful": "(quiet hope:1.2), soft smile reaching the eyes, upward gaze, gentle optimism, warm lighting, golden hour glow, catchlights in eyes, peaceful expression",
  "Skeptical": "(mild skepticism:1.2), one eyebrow slightly raised, head tilted back, appraising look, narrowed eyes, doubted expression, cool lighting, neutral background",
  "Amused": "(amused smirk:1.2), corner of mouth raised, sparkling eyes, holding back a laugh, playful expression, lighthearted atmosphere, warm key light",
  "Determined": "(quiet determination:1.2), set jaw, focused intensity, steady gaze, firm mouth, serious demeanor, dramatic side lighting, resolve",
  "Wistful": "(wistful longing:1.2), looking into distance, soft focus, dreamy expression, slight smile mixed with sadness, nostalgic atmosphere, lens flare, romantic lighting",
  "Relieved": "(sense of relief:1.2), shoulders relaxed, exhale expression, closed eyes or soft gaze, gentle smile, letting go of tension, soft warm light, peaceful",
  "Intrigued": "(intrigued fascination:1.2), leaning forward, intense focus, slight squint, lips parted, captivated expression, dramatic lighting highlighting eyes"
};
window.EMOTIONS = EMOTIONS; // Expose for verification

// =============================================
// QUICK STYLE PRESETS
// =============================================
const QUICK_STYLES = {
  "true-detective": "True Detective HBO noir cinematography aesthetic. LIGHTING: harsh Louisiana sun creating extreme contrast, or dim atmospheric interior lighting with practical sources (desk lamps, neon signs), oppressive heat haze visual quality, golden hour magic light with long shadows, smoky atmospheric diffusion. COLOR GRADING: heavily desaturated with sickly greens and murky browns, swampy atmospheric color palette, crushed blacks and blown highlights for noir effect, melancholic despondent mood, teal shadows with amber highlights, low saturation high contrast. TECHNICAL: extreme shallow depth of field (f/1.4 feel), anamorphic lens flares and aberrations, 35mm film grain texture, wide desolate landscape compositions alternating with claustrophobic close-ups, natural vignetting. ATMOSPHERE: oppressive humidity, existential dread, Southern Gothic decay, time and mortality themes. QUALITY: photorealistic, 8K resolution, Cary Fukunaga directorial style, award-winning cinematography, prestige crime drama aesthetic.",

  "game-of-thrones": "Game of Thrones HBO epic fantasy cinematography. LIGHTING: dramatic natural lighting with overcast skies, torch-lit and candlelit interiors with warm flickering practical lights, cold Northern daylight with diffused sun, dramatic fire and shadow interplay, motivated medieval lighting sources only. COLOR GRADING: desaturated medieval color palette with muted earth tones, cold blue-grey exteriors, warm amber interiors, gritty realistic texture, low saturation to convey harsh realism, teal and orange separation for dramatic scenes. TECHNICAL: sweeping wide establishing shots of landscapes and castles, intimate medium close-ups for dialogue, shallow to medium depth of field (f/2.8-f/5.6), IMAX camera quality for battle sequences, natural film grain, handheld camera for battle chaos. ATMOSPHERE: medieval fantasy realism, political intrigue gravitas, epic scale with intimate character moments, harsh unforgiving world, winter is coming mood. QUALITY: photorealistic, 8K resolution, prestige fantasy television, award-winning cinematography, theatrical production value, gritty realistic medieval aesthetic.",

  "the-last-of-us": "The Last of Us HBO post-apocalyptic cinematography aesthetic. LIGHTING: soft diffused overcast natural light, nature reclaiming urban environments with dappled sunlight through overgrown vegetation, golden hour warmth for emotional moments, cold blue-grey for tension and danger, practical flashlight and lantern sources in dark interiors, atmospheric dust particles in light beams. COLOR GRADING: desaturated with selective warm color pops (rust, autumn leaves, golden light), muted greens of overgrown nature, cold concrete greys, earthy browns and ochres, melancholic yet beautiful color palette, teal shadows with amber highlights in key scenes. TECHNICAL: intimate character-focused cinematography, shallow depth of field for emotional beats (f/2-f/2.8), medium depth for environmental storytelling (f/5.6), natural handheld camera movement, subtle film grain texture, wide shots emphasizing isolation and scale of abandoned cities. ATMOSPHERE: post-pandemic desolation, nature reclaiming civilization, hope amid despair, survival drama, emotional father-daughter relationship undertones, quiet apocalypse beauty, melancholic yet hopeful. QUALITY: photorealistic, 8K resolution, prestige video game adaptation, award-winning cinematography, theatrical production quality, naturalistic performances.",

  "stranger-things": "Stranger Things Netflix 1980s nostalgia cinematography aesthetic. LIGHTING: practical 1980s sources (neon signs, flashlights, Christmas lights, arcade machines), moody atmospheric fog with colored gel lighting, dramatic red and blue police light flashes, warm suburban home interiors with table lamps, eerie Upside Down scenes with cold flickering lights, golden hour suburban Americana. COLOR GRADING: vibrant saturated 1980s color palette with heavy red and teal contrast, neon pink and electric blue accents, warm amber suburban scenes, cold desaturated Upside Down sequences, nostalgic film stock emulation, Spielberg-inspired warm family moments contrasting with horror elements. TECHNICAL: anamorphic lens flares and aberrations, shallow depth of field for character focus (f/2-f/2.8), Steadicam smooth tracking shots, wide establishing shots of suburban Indiana, intimate close-ups during emotional beats, subtle film grain texture, practical special effects aesthetic. ATMOSPHERE: 1980s nostalgia, supernatural mystery, coming-of-age adventure, Spielberg meets Stephen King, suburban horror, friendship and loyalty themes, synth-wave retro vibes. QUALITY: photorealistic, 8K resolution, Netflix prestige series, Duffer Brothers visual style, award-winning cinematography, theatrical production value, 1980s period accuracy.",

  "the-crown": "The Crown Netflix prestige royal drama cinematography aesthetic. LIGHTING: soft diffused natural window light in palace interiors, elegant chandelier and sconce lighting, overcast British daylight, sophisticated three-point studio lighting for formal portraits, natural outdoor light for countryside estates, subtle rim lighting for royal gravitas. COLOR GRADING: rich saturated jewel tones (deep reds, royal blues, emerald greens), warm golden interiors with mahogany and brass, muted British countryside greens and greys, sophisticated color palette, period-accurate color reproduction, elegant restrained grading. TECHNICAL: static composed camera work emphasizing formality and tradition, slow deliberate camera movements, symmetrical framing for power and authority, medium depth of field (f/4-f/5.6), 35mm and 50mm lens aesthetic, classical composition following rule of thirds and golden ratio, pristine clean image quality. ATMOSPHERE: British royal elegance, political intrigue, duty versus desire, historical gravitas, restrained emotion, palace formality, period drama sophistication, understated luxury. QUALITY: photorealistic, 8K resolution, Netflix prestige historical drama, award-winning cinematography, theatrical production quality, meticulous period detail, BBC drama aesthetic elevated.",

  "wednesday": "Wednesday Netflix gothic dark academia cinematography aesthetic. LIGHTING: moody overcast natural light, gothic architecture with dramatic shadows, candlelit and lantern-lit interiors, moonlight through stained glass windows, cold blue-grey daylight, dramatic chiaroscuro contrast, Tim Burton-inspired expressionistic lighting, fog and mist atmospheric effects. COLOR GRADING: heavily desaturated with deep blacks and cool greys, selective color pops (blood red, poison purple, toxic green), monochromatic gothic palette, cold blue undertones, high contrast with crushed blacks, Burton-esque dark whimsy color treatment. TECHNICAL: Dutch angles and off-kilter framing for unease, symmetrical centered compositions for gothic formality, wide shots emphasizing gothic architecture, intimate close-ups with deadpan expressions, shallow to medium depth of field (f/2.8-f/4), Tim Burton visual language, stylized yet grounded aesthetic. ATMOSPHERE: gothic dark comedy, macabre humor, teenage outsider angst, supernatural mystery, Addams Family legacy, dark academia aesthetic, deadpan wit, Burton-meets-teen-drama. QUALITY: photorealistic with stylized gothic elements, 8K resolution, Netflix prestige teen series, Tim Burton directorial style, award-winning production design, theatrical gothic aesthetic, darkly whimsical.",

  "blade-runner-2049": "Blade Runner 2049 neo-noir cyberpunk cinematography, Roger Deakins masterwork. LIGHTING: dramatic volumetric fog with laser light beams, monumental scale lighting, orange sodium vapor dystopian exteriors, cool blue-grey rain-soaked scenes, warm amber interior glow, god rays through industrial haze, practical neon signs and holographic advertisements. COLOR GRADING: bold saturated orange and teal separation, monochromatic sequences (orange desert, purple Vegas), deep blacks with vibrant color accents, cyberpunk neon palette, desaturated with selective color pops, cinematic color contrast pushed to maximum. TECHNICAL: ultra-wide establishing shots of landscapes and isolation, symmetrical centered compositions, extreme shallow depth of field (f/1.4), anamorphic lens flares, slow deliberate camera movements, IMAX quality, pristine sharp image. ATMOSPHERE: dystopian future noir, existential loneliness, monumental architecture, technological decay, philosophical sci-fi, visual poetry. QUALITY: photorealistic, 8K IMAX resolution, Academy Award-winning cinematography, Roger Deakins visual mastery.",
  "dune": "Dune epic sci-fi cinematography aesthetic, Denis Villeneuve and Greig Fraser visual language. LIGHTING: monumental hard desert sunlight with long sculpted shadows, diffuse sand-haze atmosphere, low-key interior practicals with selective highlights, eclipse-like high-contrast silhouettes, warm dusk gradients over vast dunes. COLOR GRADING: restrained monochromatic sand-beige and muted ochre palette, desaturated skin tones, deep matte blacks, subtle gold highlights, austere high-end cinematic tonality. TECHNICAL: massive wide-format compositions emphasizing scale and isolation, precise minimal framing, slow deliberate camera movement, long-lens compression across dunes, controlled depth of field, IMAX-grade detail retention. ATMOSPHERE: mythic futurism, sacred austerity, political gravity, desert mysticism, monumental silence. QUALITY: photorealistic, 8K IMAX resolution, premium theatrical blockbuster finish, award-level cinematography.",
  "the-matrix": "The Matrix techno-noir cinematography aesthetic, Wachowski-era cyberpunk classic. LIGHTING: hard directional practicals in dim urban interiors, fluorescent spill, underlit corridors, moody backlight silhouettes, reflective wet asphalt highlights, selective strobe-like contrast. COLOR GRADING: iconic green code tint for digital world, cooler neutral steel palette for real world, high contrast blacks, restrained saturation with toxic green accents, glossy noir finish. TECHNICAL: symmetrical urban compositions, dynamic low angles, bullet-time freeze aesthetic cues, medium-wide lenses for kinetic action, crisp edge contrast, controlled grain. ATMOSPHERE: simulated reality paranoia, cyberpunk rebellion, hacker underground, philosophical sci-fi tension. QUALITY: photorealistic, 8K resolution, iconic late-90s sci-fi style, premium action-noir finish.",

  "grand-budapest-hotel": "The Grand Budapest Hotel Wes Anderson symmetrical whimsical cinematography. LIGHTING: soft even studio lighting, pastel-friendly neutral temperature, theatrical stage lighting aesthetic, natural window light in symmetrical compositions, warm interior hotel lighting, bright clean exterior daylight. COLOR GRADING: vibrant pastel color palette (pink, purple, mint green, coral, baby blue), highly saturated candy colors, meticulously color-coordinated production design, distinct color schemes for different time periods, storybook aesthetic. TECHNICAL: perfectly centered symmetrical compositions, flat frontal camera angles, whip pans and snap zooms, miniature model shots, stop-motion animation sequences, planimetric framing, dollhouse aesthetic. ATMOSPHERE: whimsical European nostalgia, theatrical storybook charm, meticulous detail, quirky sophistication, fairy tale elegance. QUALITY: photorealistic with stylized production design, 8K resolution, Academy Award-winning production design, Wes Anderson signature visual style.",

  "in-the-mood-for-love": "In the Mood for Love Wong Kar-wai romantic melancholy cinematography, Christopher Doyle color mastery. LIGHTING: warm tungsten practical lighting, neon signs through rain-soaked windows, moody low-key lighting, colored gels (red, amber, teal), intimate close-up lighting, shadows and silhouettes, Hong Kong night ambiance. COLOR GRADING: rich saturated reds and warm ambers, teal and orange romantic contrast, lush vibrant colors, nostalgic 1960s Hong Kong palette, deep shadows with glowing highlights, sensual color temperature. TECHNICAL: slow motion romantic sequences, tight intimate framing through doorways and windows, voyeuristic camera placement, shallow depth of field (f/1.4-f/2), handheld intimate camera work, vertical compositions, step-printing slow motion. ATMOSPHERE: forbidden romance, unspoken longing, 1960s Hong Kong nostalgia, sensual restraint, melancholic beauty, time and memory. QUALITY: photorealistic, 8K restoration quality, Cannes Film Festival award-winning cinematography, Wong Kar-wai poetic visual language.",

  "mad-max-fury-road": "Mad Max Fury Road post-apocalyptic action cinematography, John Seale visual intensity. LIGHTING: harsh Australian desert sun, extreme contrast daylight, practical fire and explosion lighting, dust storm diffusion, golden hour chase sequences, moonlight night scenes with cool blue tones, flare gun and flame lighting. COLOR GRADING: teal and orange pushed to extreme, desaturated desert with vibrant sky blues, warm sand tones contrasting cool shadows, day-for-night blue sequences, high contrast high saturation, comic book color intensity. TECHNICAL: high-speed action photography, wide-angle dynamic compositions, practical stunts and effects, minimal CGI aesthetic, fast cutting with clear spatial geography, multiple camera angles for action, IMAX sequences. ATMOSPHERE: post-apocalyptic survival, kinetic energy, practical action spectacle, wasteland beauty, relentless momentum, visual storytelling without dialogue. QUALITY: photorealistic practical effects, 8K resolution, Academy Award-winning cinematography and editing, visceral action cinema.",

  "the-revenant": "The Revenant natural light wilderness cinematography, Emmanuel Lubezki three-time Oscar winner. LIGHTING: exclusively natural available light, golden hour magic hour sequences, overcast diffused daylight, campfire and torch practical lighting, harsh midday sun through forest canopy, blue hour twilight, moonlight night scenes, no artificial lighting. COLOR GRADING: desaturated natural earth tones, cold blue-grey winter palette, warm firelight contrast, muted greens and browns, realistic color reproduction, subtle grading preserving natural light quality. TECHNICAL: long continuous takes with invisible cuts, immersive Steadicam and handheld work, wide-angle lenses capturing environment, shallow depth of field for intimacy (f/2-f/2.8), natural lens flares, IMAX sequences. ATMOSPHERE: brutal survival, man versus nature, 1820s American frontier, visceral realism, spiritual journey, elemental forces. QUALITY: photorealistic, 8K resolution, Academy Award-winning cinematography, natural light mastery, immersive realism.",

  "hero": "Hero Zhang Yimou color-coded wuxia cinematography, Christopher Doyle visual poetry. LIGHTING: soft diffused natural light, dramatic backlight for martial arts silhouettes, colored gel lighting matching story segments, golden hour desert sequences, overcast grey skies, lantern and candle interiors, rain and water reflections. COLOR GRADING: bold monochromatic color schemes per story version (red, blue, green, white, black), highly saturated single-color dominance, color as narrative device, vibrant silk costumes against matching environments, painterly color composition. TECHNICAL: sweeping crane shots over landscapes, slow-motion martial arts choreography, wire-work enhanced movements, symmetrical compositions, wide establishing shots, balletic camera movements. ATMOSPHERE: Chinese wuxia poetry, color as storytelling, martial arts ballet, philosophical conflict, visual opera, ancient China grandeur. QUALITY: photorealistic with stylized color, 8K resolution, visually groundbreaking cinematography, painterly aesthetic.",

  "la-la-land": "La La Land modern Hollywood musical cinematography, Linus Sandgren Technicolor homage. LIGHTING: golden hour Los Angeles magic light, vibrant sunset colors, theatrical stage lighting for musical numbers, romantic twilight blue hour, warm practical streetlights, studio musical lighting aesthetic, colorful gel lighting. COLOR GRADING: vibrant saturated primary colors (red, blue, yellow, purple), Technicolor-inspired bold palette, romantic warm tones, dreamy pastel sequences, high saturation celebrating classic musicals, teal and magenta Los Angeles nights. TECHNICAL: sweeping Steadicam musical choreography, long continuous takes for dance numbers, crane and dolly moves, classical Hollywood camera language, planetarium sequence with starry visuals. ATMOSPHERE: romantic Los Angeles dreams, jazz and ambition, classic Hollywood musical revival, bittersweet romance, city of stars magic, nostalgic optimism. QUALITY: photorealistic, 8K resolution, Academy Award-winning cinematography, modern musical masterpiece.",

  "the-fall": "The Fall Tarsem Singh surreal visual maximalism cinematography, Colin Watkinson painterly compositions. LIGHTING: dramatic natural light in exotic locations, golden hour magic across 28 countries, theatrical color gel lighting, stained glass window light, desert sun and palace interiors, fantasy dreamscape lighting. COLOR GRADING: ultra-saturated jewel tones, vibrant reds blues golds, painterly color composition, surreal color combinations, Baroque painting aesthetic, maximum color intensity, fantasy storybook palette. TECHNICAL: symmetrical centered compositions, wide establishing shots of breathtaking locations, slow deliberate camera movements, shallow depth of field isolating subjects, practical locations worldwide, minimal CGI. ATMOSPHERE: fever dream fantasy, storybook surrealism, visual poetry, imagination versus reality, baroque maximalism, fairy tale darkness. QUALITY: photorealistic with surreal production design, 8K resolution, most visually ambitious independent film, painterly cinematography.",

  "1917": "1917 one-shot WWI cinematography, Roger Deakins immersive realism. LIGHTING: overcast grey WWI daylight, muddy trench natural light, dramatic flare-lit night town sequence (orange fire glow), golden hour no-man's-land, practical explosion and fire lighting, moonlight and starlight night scenes. COLOR GRADING: desaturated war-torn palette, muddy browns and greys, cold blue overcast skies, dramatic orange firelight sequence contrasting cool night, muted greens of French countryside, realistic period color. TECHNICAL: seamless invisible cuts creating one continuous shot illusion, immersive Steadicam and handheld work, choreographed camera movements with actors, real-time storytelling, practical effects emphasis. ATMOSPHERE: WWI trench warfare immediacy, real-time tension, immersive you-are-there realism, relentless forward momentum, visceral war experience. QUALITY: photorealistic, 8K resolution, Academy Award-winning cinematography, technical filmmaking mastery, immersive realism.",

  "life-of-pi": "Life of Pi lyrical ocean survival cinematography, Claudio Miranda Oscar-winning visual poetry. LIGHTING: high-contrast tropical sunlight, golden hour ocean glow, moonlit bioluminescent night sequences, storm lightning flashes, soft dawn haze over endless sea, magical backlight through mist and spray. COLOR GRADING: saturated cyan and deep ultramarine oceans, warm orange lifeboat accents, emerald and turquoise transitions, rich sunset magentas, high dynamic contrast between sky and water, dreamlike yet natural palette. TECHNICAL: wide anamorphic ocean vistas, centered isolation compositions, fluid camera movement synced with waves, VFX-integrated photoreal imagery, shallow depth for emotional close-ups (f/2-f/2.8), immersive scale framing. ATMOSPHERE: spiritual survival odyssey, awe and terror of nature, solitude, wonder, mythic storytelling. QUALITY: photorealistic, 8K resolution, Academy Award-winning cinematography, immersive visual masterpiece.",

  "the-shape-of-water": "The Shape of Water Guillermo del Toro romantic dark fairy-tale cinematography, Dan Laustsen visual elegance. LIGHTING: soft diffused practical lighting, moody tungsten interiors, underwater caustic light patterns, theatrical spot highlights, rain-soaked night reflections, gentle rim light sculpting silhouettes. COLOR GRADING: dominant teal-green aquatic palette, warm amber skin tones against cool cyan environments, vintage 1960s patina, controlled saturation, emerald shadows with golden practical highlights, painterly tonal separation. TECHNICAL: graceful dolly moves, symmetrical period compositions, shallow depth intimacy (f/1.8-f/2.8), practical production-design driven framing, atmospheric haze for depth, classical studio-era camera language. ATMOSPHERE: melancholic romance, outsider tenderness, Cold War mystery, magical realism, poetic intimacy. QUALITY: photorealistic with stylized fairy-tale production design, 8K resolution, Academy Award-winning visual style.",

  "pans-labyrinth": "Pan's Labyrinth dark Spanish fantasy cinematography, Guillermo del Toro baroque visual mythology. LIGHTING: candlelit and lantern practicals, moonlit forest diffusion, golden firelight in stone interiors, low-key chiaroscuro, soft god rays through ancient trees, cold military daylight contrast. COLOR GRADING: earthy ochres and moss greens, desaturated war-era neutrals, deep blue nocturnal fantasy tones, warm amber highlights in mythic spaces, textured filmic contrast, antique storybook palette. TECHNICAL: wide environmental compositions blending realism and fantasy, creature-focused practical effects framing, subtle handheld tension in war scenes, controlled slow pushes for dread, medium depth for production detail (f/4-f/5.6). ATMOSPHERE: fairy tale under fascism, childhood imagination versus brutality, gothic wonder, moral myth. QUALITY: photorealistic with practical fantasy elements, 8K resolution, iconic dark-fantasy cinema aesthetic.",

  "skyfall": "Skyfall James Bond neo-noir action cinematography, Roger Deakins precision and elegance. LIGHTING: neon Shanghai night glow, silhouette-driven backlighting, stark high-contrast interiors, misty dawn landscapes, practical fire in climactic manor sequences, clean directional key light for dramatic profiles. COLOR GRADING: deep blacks with rich cobalt and cyan shadows, selective warm amber highlights, refined modern Bond palette, restrained saturation, luminous neon accents, polished cinematic contrast. TECHNICAL: large-format clarity, geometric framing and negative space, elegant locked-off compositions mixed with controlled action movement, long-lens urban compression, high-detail night cinematography, IMAX-grade sharpness. ATMOSPHERE: sophisticated espionage tension, sleek menace, emotional isolation, modern classic Bond grandeur. QUALITY: photorealistic, 8K resolution, award-winning cinematography craft, premium theatrical finish.",

  "parasite": "Parasite Korean social thriller cinematography, Hong Kyung-pyo architectural visual storytelling. LIGHTING: naturalistic soft daylight in modern interiors, practical household lighting, controlled rain-night atmosphere, low-key basement shadows, neutral overcast exteriors, motivated directional light through windows and stairwells. COLOR GRADING: restrained contemporary palette, clean neutrals with subtle green-grey undertones, warm wood accents in wealthy interiors, cooler damp textures in lower-class spaces, precise tonal separation by class environment. TECHNICAL: architectural compositions emphasizing levels and stairs, static observational framing, smooth lateral tracking, medium depth revealing spatial relationships (f/4-f/8), meticulous blocking for social hierarchy. ATMOSPHERE: simmering tension, class divide satire, domestic realism turning into suspense, elegant unease. QUALITY: photorealistic, 8K resolution, Palme d'Or and Oscar-winning visual storytelling, precision-crafted cinematic realism.",

  "the-lighthouse": "The Lighthouse expressionist maritime psychological horror cinematography, Jarin Blaschke monochrome mastery. LIGHTING: harsh directional beacon light, stormy overcast exteriors, oil-lamp practical interiors, deep shadow pools, high-contrast side lighting, wet reflective textures under hard key. COLOR GRADING: stark black-and-white orthochromatic feel, crushed blacks and bright specular whites, silver-rich film texture, heavy micro-contrast, antique tonal response. TECHNICAL: nearly square aspect visual language, vintage lens aberrations, extreme close-ups with distorted perspective, static tableaux mixed with violent handheld bursts, dense film grain, tactile monochrome texture. ATMOSPHERE: claustrophobia, madness, maritime myth, isolation and obsession, primal dread. QUALITY: photorealistic monochrome, 8K scanned film texture, Academy Award-nominated cinematography aesthetic.",

  "inception": "Inception Christopher Nolan dream-heist cinematography, Wally Pfister large-scale practical surrealism. LIGHTING: clean modern daylight, cool urban interiors, dramatic practical city-night lighting, rotating corridor highlights and shadows, snow fortress high-key overcast light, warm limbo sunsets. COLOR GRADING: cool steel-blue modernist palette, restrained saturation, warm memory accents, crisp contrast with neutral skin tones, dream-level tonal separation by environment. TECHNICAL: IMAX-scale compositions, practical in-camera effects emphasis, wide architectural framing, dynamic tilt and rotation perspectives, controlled handheld urgency in action beats, deep focus for spatial logic. ATMOSPHERE: cerebral tension, layered dream logic, polished corporate modernism, high-concept momentum. QUALITY: photorealistic, 8K IMAX resolution, blockbuster auteur craftsmanship, iconic contemporary sci-fi visual language.",

  "the-lord-of-the-rings": "The Lord of the Rings epic high-fantasy cinematography, Andrew Lesnie mythic landscape grandeur. LIGHTING: golden pastoral daylight in Shire environments, moody overcast mountain exteriors, torchlit fortress interiors, ethereal backlight in elven realms, volcanic fire glow in Mordor sequences, dramatic dawn battle light. COLOR GRADING: rich natural greens and golds for heroic realms, cold steel blues for war zones, deep ashen reds and blacks for evil territories, classic fantasy tonal mapping, filmic contrast with textured highlights. TECHNICAL: sweeping aerial and ultra-wide landscape shots, heroic low-angle compositions, large-scale battle staging, practical miniatures integration, orchestral camera movement, medium-to-deep focus for world detail. ATMOSPHERE: mythic adventure, ancient legend, fellowship heroism, melancholy beauty of fading ages. QUALITY: photorealistic epic fantasy, 8K resolution, Academy Award-winning trilogy visual heritage, monumental cinematic scale.",

  "the-dark-knight": "The Dark Knight grounded crime epic cinematography, Wally Pfister IMAX urban realism. LIGHTING: hard practical city lighting, sodium-vapor night streets, interrogation-room top light contrast, clean daylight for institutional spaces, selective rim light in dark interiors, realistic motivated sources. COLOR GRADING: cool steel-grey Gotham palette, restrained saturation, deep neutral blacks, subtle cyan shadows, minimal stylization favoring realism, crisp high-contrast urban texture. TECHNICAL: IMAX-format action clarity, wide city architecture framing, handheld urgency in tactical scenes, long-lens compression for surveillance feel, practical stunt emphasis, precise editorial geography. ATMOSPHERE: moral tension, urban dread, procedural intensity, grounded superhero noir. QUALITY: photorealistic, 8K IMAX resolution, modern action-cinema benchmark, award-winning technical craft.",

  "the-martian": "The Martian Ridley Scott hard-science survival cinematography, Dariusz Wolski realistic space adventure. LIGHTING: harsh diffused Mars daylight through dust atmosphere, warm habitat practicals, cool spacecraft instrument lighting, orange storm low-visibility conditions, crisp EVA sunlight with deep shadows, clean NASA mission-control fluorescents. COLOR GRADING: dominant rust-orange Martian terrain, muted beige dust and rock textures, cool blue-white technology highlights, clean high-contrast separation between Mars and Earth settings, realistic scientific color treatment. TECHNICAL: wide environmental isolation shots, helmet-reflection close-ups, stabilized rover movement, VFX-practical integration with documentary realism, medium depth retaining technical detail (f/4-f/8), clear spatial continuity. ATMOSPHERE: ingenuity under pressure, solitary resilience, optimistic scientific realism, frontier exploration spirit. QUALITY: photorealistic, 8K resolution, premium studio sci-fi craftsmanship, immersive planetary realism.",

  "the-city-of-lost-children": "The City of Lost Children Jeunet-Caro steampunk nightmare-fantasy cinematography, Darius Khondji surreal texture. LIGHTING: fog-diffused dockside night lighting, sickly practical tungsten and sodium glows, strong backlit silhouettes, theatrical shadow play in industrial sets, low-key interiors with selective highlights. COLOR GRADING: green-amber sepia cast, oxidized brass and rust tones, muted skin with stylized undertones, antique chemical-photography vibe, dense atmospheric contrast, dreamlike decay palette. TECHNICAL: wide-angle distorted perspectives, baroque production-design compositions, crane and glide movements through crowded sets, medium-deep focus for texture-rich environments, practical effects and miniatures integration. ATMOSPHERE: gothic steampunk fable, grotesque whimsy, melancholic wonder, carnival-like menace. QUALITY: photorealistic with highly stylized production design, 8K resolution, cult-classic European fantasy visual identity.",

  "stardust": "Stardust romantic adventure fantasy cinematography, storybook swashbuckling elegance. LIGHTING: warm golden pastoral daylight, moonlit magical forest glow, sparkling practical highlights for enchantment, candlelit interiors in period settings, soft diffusion for fairy-tale romance, storm-lit supernatural beats. COLOR GRADING: luminous golds and deep midnight blues, jewel-toned magic accents, gentle pastel highlights in romantic moments, balanced saturation with storybook polish, classic fantasy warmth. TECHNICAL: sweeping crane reveals, adventure-oriented wide compositions, graceful action framing, practical costume-production design emphasis, shallow depth for character romance (f/2-f/2.8), smooth classical camera movement. ATMOSPHERE: whimsical quest, old-world charm, light-dark fairy tale contrast, playful magic and heroic romance. QUALITY: photorealistic, 8K resolution, premium fantasy-adventure cinematic finish, polished storybook visual style.",

  "once-upon-a-time-in-hollywood": "Once Upon a Time In Hollywood Quentin Tarantino period Los Angeles cinematography, Robert Richardson nostalgic analog glow. LIGHTING: sun-drenched California daylight, warm practical tungsten in vintage interiors, neon boulevard nights with reflective car surfaces, golden-hour smog haze, hard directional light for period authenticity. COLOR GRADING: warm Kodak-like film palette, rich yellows and amber skin tones, faded 1960s signage colors, controlled contrast with gentle highlight roll-off, grain-forward analog texture. TECHNICAL: anamorphic widescreen compositions, period-accurate camera movement restraint, long observational takes, practical locations and signage emphasis, 35mm film grain character, immersive production-design framing. ATMOSPHERE: late-60s Hollywood nostalgia, melancholy glamour, cultural transition, laid-back tension. QUALITY: photorealistic filmic texture, 8K scan quality, Academy Award-winning production design, auteur period-cinema authenticity.",

  "amelie": "AmГ©lie Jean-Pierre Jeunet whimsical Parisian cinematography, Bruno Delbonnel painterly warmth. LIGHTING: warm golden Parisian light, cozy interior cafГ© and apartment lighting, soft diffused natural window light, warm tungsten practical sources, romantic evening streetlights, nostalgic warm glow throughout. COLOR GRADING: vibrant warm palette dominated by reds yellows greens, desaturated blues creating teal-orange separation, painterly color grading, nostalgic postcard Paris aesthetic, high saturation in warm tones, storybook color treatment. TECHNICAL: whimsical camera movements and snap zooms, centered symmetrical compositions, shallow depth of field (f/2), creative transitions and visual effects, playful camera angles, miniature tilt-shift sequences. ATMOSPHERE: whimsical Parisian romance, magical realism, quirky charm, nostalgic warmth, fairy tale Paris, innocent wonder, visual poetry. QUALITY: photorealistic with stylized color, 8K resolution, CГ©sar Award-winning cinematography, iconic French cinema aesthetic.",

  "shinkai-vibes": "Makoto Shinkai anime aesthetic. LIGHTING: brilliant lens flares, god rays piercing through clouds, hyper-realistic lighting, golden hour magic, bioluminescent night scenes, star-filled skies, vibrant city lights. COLOR GRADING: hyper-vibrant saturated colors, azure blue skies, emerald greens, impossible sunsets with purple and pink gradients, high contrast but airy feel. TECHNICAL: wide angle establishing shots of cityscapes and nature, extreme attention to detail in background art, photorealistic clouds and water, crisp sharp lines, digital animation perfection. ATMOSPHERE: emotional longing, separation, bittersweet romance, urban fantasy, everyday magic, breathtaking beauty. QUALITY: 8K anime wallpaper, Comix Wave Films production quality, masterpiece animation.",

  "90s-anime": "Retro 90s cel animation aesthetic. LIGHTING: flat cel shading, hard shadows, dramatic rim lighting, limited lighting complexity typical of hand-drawn era. COLOR GRADING: slightly muted or pastel palette, specific 90s broadcast colors, film grain simulation, VHS noise or slight chromatic aberration, analog warmth. TECHNICAL: hand-drawn line art look, traditional ink and paint style, limited frame rate feel (on threes), static backgrounds with moving characters. ATMOSPHERE: nostalgic, classic anime, cyberpunk or mecha vibes, magical girl transformations, lo-fi aesthetic. QUALITY: high quality scan of vintage cel, DVD box set art, Cowboy Bebop or Evangelion visual style.",

  "dark-fantasy-anime": "Dark Epic Fantasy anime aesthetic (Berserk/Elden Ring style). LIGHTING: dramatic chiaroscuro, heavy shadows, torchlight and firelight, cold moonlight, ominous atmospheric fog, rim lighting on armor. COLOR GRADING: desaturated gritty palette, blacks, greys, blood reds, cold blues, muted earth tones, high contrast. TECHNICAL: detailed line work, cross-hatching textures, heavy ink lines, dynamic action composition, extreme angles. ATMOSPHERE: dread, epic struggle, cosmic horror, medieval grit, violence and beauty, supernatural power. QUALITY: 8K resolution, MAPPA or Ufotable high budget production, theatrical feature quality.",

  "ghibli-style": "Studio Ghibli Hayao Miyazaki hand-painted aesthetic. LIGHTING: soft natural sun-drenched lighting, dappled forest light, puffy cumulus cloud shadows, warm inviting interior lamplight. COLOR GRADING: naturalistic watercolor palette, lush greens, azure skies, earthy browns, vibrant but natural colors, gouache painted backgrounds. TECHNICAL: hand-painted background art style, soft character outlines, fluid motion emphasis (flying sequences), attention to nature details (grass blowing, water flowing). ATMOSPHERE: childhood wonder, nature worship, pacifism, magical realism, nostalgia, cozy comfort, environmental beauty. QUALITY: 8K resolution, theatrical animation masterpiece, hand-drawn production value."
};

const FASHION_FOOD_STYLES = {
  // Fashion
  "gucci-retro": "Gucci campaign aesthetic (Alessandro Michele era), retro maximalism. LIGHTING: direct harsh flash photography, high contrast, mixed color temperatures, vintage ring light effect. COLOR GRADING: warm vintage tones, saturated reds and greens, slightly yellowed whites, 70s film stock emulation. TECHNICAL: 35mm film grain, snapshot aesthetic, wide angle lens (28mm), deep depth of field. QUALITY: high fashion, eccentric, quirky, vibrant, textured fabrics, editorial spread.",
  "balenciaga-dystopian": "Balenciaga campaign aesthetic (Demna Gvasalia era), post-apocalyptic chic. LIGHTING: cold industrial lighting, fluorescent tubes, overcast flat skylight, clinical atmosphere. COLOR GRADING: desaturated, cool blue and grey tones, crushed blacks, high contrast monochrome feel. TECHNICAL: ultra-wide angle lens (16-24mm), slight distortion, sharp focus throughout, digital noise texture. QUALITY: avant-garde, raw, gritty, surveillance camera vibe, ominous, high fidelity.",
  "vogue-polished": "Vogue US cover shoot aesthetic, Annie Leibovitz style. LIGHTING: expensive studio lighting, large softboxes, perfect fill light, \"rembrandt\" lighting on face, catchlights in eyes. COLOR GRADING: true-to-life skin tones, rich blacks, clean whites, vibrant but controlled color palette. TECHNICAL: medium telephoto lens (85-100mm), compression, creamy bokeh background, perfect composition. QUALITY: glossy magazine cover, flawless retouching, celebrity standards, elegant, timeless.",
  "saint-laurent-noir": "Saint Laurent campaign aesthetic (Hedi Slimane style), rock n' roll chic. LIGHTING: hard contrasty black and white lighting, strobe lights, shadows cutting across face, night club atmosphere. COLOR GRADING: high contrast black and white (or very desaturated cool tones), inky blacks, blown out highlights. TECHNICAL: 50mm strict standard lens, distinctive grain structure, vertical composition. QUALITY: edgy, rebellious, luxury noir, iconic, sharp details on leather and metal textures.",
  "dior-romance": "Christian Dior haute couture campaign, romantic dreamscape. LIGHTING: golden hour backlight, sun flares, soft diffusion filters, ethereal glow, angelic rim light. COLOR GRADING: pastel palette, soft pinks, champagnes and powdery blues, low contrast, airy brightness. TECHNICAL: shallow depth of field (f/1.2), soft focus edges, 135mm lens for compression and isolation. QUALITY: painterly photography, feminine, delicate, masterpiece, luxury perfume advertisement.",
  "chanel-parisian-minimal": "Chanel Parisian quiet-luxury editorial aesthetic. LIGHTING: soft diffused studio daylight, elegant window-light falloff, clean highlights on tweed and pearls, controlled shadow density. COLOR GRADING: restrained monochrome-neutral palette (ivory, black, beige), subtle filmic contrast, refined skin tones. TECHNICAL: precise symmetrical composition, medium-tele portrait lens feel (85mm), crisp texture detail on tailoring, minimal retouching. QUALITY: timeless couture restraint, sophisticated, polished, luxury magazine campaign finish.",
  "prada-intellectual-cool": "Prada intellectual minimal editorial aesthetic. LIGHTING: cool directional key light, architectural shadow lines, gallery-like controlled studio lighting, low clutter visual field. COLOR GRADING: cool greys, muted navy, desaturated neutrals, sharp tonal separation with modern contrast. TECHNICAL: geometric framing, negative space emphasis, 50mm-75mm clean perspective, razor-sharp garment edges, design-forward composition. QUALITY: cerebral luxury, modernist elegance, high-fashion conceptual ad look.",
  "versace-baroque-flash": "Versace maximal glam baroque campaign aesthetic. LIGHTING: direct hard flash with specular highlights on metallic surfaces, dramatic rim lights, high-impact studio contrast. COLOR GRADING: saturated golds, deep blacks, jewel accents, glossy high-luxury polish, bold chroma response. TECHNICAL: dynamic poses, wide-to-standard lens editorial distortion (28-50mm), high-detail skin and fabric texture, statement accessory focus. QUALITY: opulent, provocative, high-energy runway-campaign visual impact.",
  "calvin-klein-clean-90s": "Calvin Klein 90s clean minimal fashion photography aesthetic. LIGHTING: soft broad frontal light, gentle shadow transitions, natural skin exposure, understated studio setup. COLOR GRADING: neutral whites, soft greys, warm skin realism, low saturation with subtle grain texture. TECHNICAL: simple straight-on framing, uncluttered background, 35mm-50mm honest perspective, effortless candid pose language. QUALITY: iconic minimal sensuality, timeless commercial fashion campaign look.",
  "ysl-smoke-neon-night": "YSL smoky neon nightlife fashion editorial aesthetic. LIGHTING: mixed neon practicals with deep shadow pockets, magenta and cyan edge lighting, haze-enhanced volumetric beams. COLOR GRADING: noir blacks with selective neon saturation, cool-vs-warm chromatic split, glossy night contrast. TECHNICAL: low-light cinematic portrait framing, shallow depth (f/1.4-f/2), motion-blur accents, reflective materials emphasized. QUALITY: seductive urban luxury, edgy nightlife campaign aesthetic.",
  "valentino-red-opera": "Valentino red opera couture aesthetic. LIGHTING: theatrical spotlight key, velvet shadow rolloff, dramatic stage-like backlight, controlled specular detail on silk. COLOR GRADING: dominant couture reds from crimson to carmine, warm skin highlights, deep neutral blacks for isolation. TECHNICAL: statuesque posing, portrait-to-full-body editorial composition, elegant lens compression (85-135mm), fabric movement frozen in crisp detail. QUALITY: romantic dramatic luxury, haute couture campaign grandeur.",
  "loewe-art-house": "Loewe art-house conceptual editorial aesthetic. LIGHTING: museum-style soft directional lighting, sculptural shadow modeling, tactile object emphasis. COLOR GRADING: earthy muted palette with strategic color accents, subtle matte finish, contemporary art-book tonality. TECHNICAL: asymmetrical compositions, object-fashion interplay, medium-format clarity feel, unusual cropping and negative space experimentation. QUALITY: intelligent avant-garde luxury, gallery-grade editorial storytelling.",
  "miu-miu-youth-film": "Miu Miu youthful cinematic fashion aesthetic. LIGHTING: warm nostalgic daylight with practical interior glows, soft flash accents, dreamy low-contrast diffusion. COLOR GRADING: pastel candy tones with analog film warmth, lifted blacks, gentle halation highlights. TECHNICAL: candid movement framing, 35mm film-grain emulation, playful angles, natural expression-first portraiture. QUALITY: youthful romantic editorial, nostalgic luxury campaign mood.",
  "alexander-mcqueen-gothic-romance": "Alexander McQueen gothic romantic couture aesthetic. LIGHTING: dramatic chiaroscuro with sculpted side light, candlelike warm accents, heavy shadow architecture. COLOR GRADING: deep blacks, charcoal and oxblood tones, desaturated skin with selective rich highlights, high contrast mood. TECHNICAL: theatrical composition, textured fabrics rendered in crisp detail, dramatic silhouettes, controlled vignette framing. QUALITY: dark poetic luxury, avant-garde gothic runway editorial power.",
  "jacquemus-sun-bleached": "Jacquemus Mediterranean sun-bleached fashion aesthetic. LIGHTING: harsh noon sun with clean hard shadows, bright bounce fill, open-sky high-key exteriors. COLOR GRADING: sun-faded creams, terracotta, pale yellow and sky blue accents, airy high-luminance palette. TECHNICAL: wide minimalist location framing, strong geometry and negative space, relaxed lifestyle posing, tactile linen texture clarity. QUALITY: effortless summer luxury, vacation editorial freshness.",
  "bottega-veneta-tactile-luxury": "Bottega Veneta tactile quiet-luxury fashion aesthetic. LIGHTING: controlled soft directional studio light revealing weave and leather texture, subtle rim lighting for depth. COLOR GRADING: muted earthy greens, chocolate browns, clay neutrals, premium low-saturation richness. TECHNICAL: macro-to-medium product-fashion hybrid framing, material-focused detail fidelity, restrained composition, slow deliberate visual rhythm. QUALITY: artisanal craftsmanship emphasis, understated luxury campaign sophistication.",

  // Food
  "fast-food-pop": "High-end fast food commercial photography (McDonald's / Burger King style). LIGHTING: bright high-key studio lighting, multiple rim lights to define textures, hard main light for \"pop\". COLOR GRADING: hyper-saturated, warm appetizing tones (reds, yellows, browns), zero shadows on product. TECHNICAL: macro lens (100mm), focus stacking for front-to-back sharpness, \"hero\" angle (low and wide). QUALITY: mouth-watering, perfect food styling, glistening textures, condensation droplets, 8K advertising.",
  "fine-dining": "Michelin star restaurant photography, Chef's Table aesthetic. LIGHTING: single dramatic spotlight (snoot), deep shadows, moody chiaroscuro, highlighting specific textures. COLOR GRADING: dark slate background, rich jewel tones for food, cool shadows, high contrast. TECHNICAL: top-down (flat lay) or 45-degree angle, macro details, shallow depth of field isolating the garnish. QUALITY: culinary art, sophisticated, molecular gastronomy details, elegant, luxurious texture.",
  "rustic-lifestyle": "Bon AppГ©tit / Kinfolk magazine lifestyle food photography. LIGHTING: natural window light (side or back), soft shadows, white bounce card fill, \"morning light\" feel. COLOR GRADING: natural earthy tones, matte finish, slightly lifted blacks, filmic aesthetic. TECHNICAL: 50mm lens, natural composition (crumbs, napkins visible), \"human element\" (hands or depth), overhead shot. QUALITY: authentic, organic, appetizing, homemade feel, editorial food blog.",
  "cafe-moody": "Artisan coffee shop / bakery dark moody aesthetic. LIGHTING: dim ambient light, warm tungsten bulbs, visible steam backlight, cozy shadows. COLOR GRADING: warm wood tones, deep browns and creams, cozy and inviting temperature. TECHNICAL: shallow depth of field (f/1.8), focus on steam or foam texture, bokeh background of cafe. QUALITY: hygge, comforting, texture-heavy (wood, ceramic, foam), atmospheric.",
  "beverage-splash": "High-speed beverage advertising photography. LIGHTING: high-speed sync flash, strong backlighting to make liquid glow, hard contoured reflections. COLOR GRADING: cool refreshing tones, vibrant fruit colors, absolute black background or gradient. TECHNICAL: frozen motion (1/8000s shutter), macro details of droplets and condensation, razor sharp. QUALITY: refreshing, commercial perfection, crystal clear liquid, dynamic splash, production value.",

  "food-dark-moody-luxury": "Cinematic professional food photography of [FOOD_reference_ITEM], dark luxury direction. LIGHTING: low-key chiaroscuro setup with deep velvet shadows and one dramatic shaft of light sculpting silhouette and texture. COLOR GRADING: neutral premium grading with rich blacks, subtle warm highlights, restrained saturation. TECHNICAL: medium-format capture feel (Phase One IQ4 aesthetic), razor-sharp subject focus, controlled falloff, clean studio precision, 8K resolution. ATMOSPHERE: expensive, moody, sensory fine-dining campaign tone. BACKGROUND: dark textured slate or matte black velvet, no distracting props.",
  "food-high-key-airy": "Bright and airy high-key commercial food photography of [FOOD_reference_ITEM]. LIGHTING: soft diffused daylight from a large window, no harsh shadows, luminous clean whites. COLOR GRADING: pastel and soft neutral palette with gentle contrast and fresh tonal lift. TECHNICAL: shallow depth background separation with creamy bokeh, polished product styling, editorial ad clarity. ATMOSPHERE: fresh organic morning mood, light and heavenly visual language. BACKGROUND: blurred white marble or white linen surface.",
  "food-golden-hour-rustic": "Rustic lifestyle food photography of [FOOD_reference_ITEM] on a vintage wooden surface. LIGHTING: natural golden hour sunlight through leaves with dappled gobo shadows, warm orange and honey highlights, visible volumetric dust motes. COLOR GRADING: warm amber and earthy brown spectrum, soft filmic rolloff, inviting contrast. TECHNICAL: shallow depth of field for cozy subject isolation, tactile texture rendering, artisanal editorial framing. ATMOSPHERE: cozy, handmade, welcoming farm-table storytelling.",
  "food-modern-geometric": "Minimalist geometric commercial food photography of [FOOD_reference_ITEM] on a clean pedestal. LIGHTING: large softbox studio setup producing smooth gradients and crisp controlled highlights. COLOR GRADING: neutral editorial palette (beige, soft grey, muted stone) with clean modern contrast. TECHNICAL: architectural symmetry, precise balance, ample negative space, ultra-clean surfaces, catalog-ready sharpness. ATMOSPHERE: contemporary premium design language, strict and elegant visual order. BACKGROUND: solid matte color field.",
  "food-neon-gloss": "Creative neon-gloss studio shot of [FOOD_reference_ITEM] for modern nightlife campaign. LIGHTING: dual-color gel setup with cool teal rim light and warm magenta key light, high-contrast edge separation. COLOR GRADING: cyberpunk-inspired teal-magenta contrast, glossy blacks, saturated highlights. TECHNICAL: product placed on black reflective glass for mirror reflection, crisp commercial detail, polished ad finish. ATMOSPHERE: energetic, bold, urban night aesthetic.",
  "food-ethereal-dreamy": "Ethereal dreamlike food photography of [FOOD_reference_ITEM] with fairy-tale mood. LIGHTING: strong contre-jour backlight creating glowing halo edges, soft haze diffusion, delicate bloom. COLOR GRADING: pastel romantic palette with lifted highlights and soft tonal transitions. TECHNICAL: macro-detail accents with gentle soft-focus layers, selective foreground blur from botanical elements, cinematic depth. ATMOSPHERE: magical, floating, romantic visual poetry with subtle mist.",
  "food-macro-texture": "Extreme close-up macro food photography of [FOOD_reference_ITEM], texture-first approach. LIGHTING: raking side light to reveal micro-topography, pores, gloss and material relief. COLOR GRADING: natural tactile color with controlled contrast and high local detail. TECHNICAL: razor-sharp macro focal plane, ultra-shallow depth blurring edges completely, frame filled by subject only, no props. QUALITY: hyper-real rendering, 8K, premium advertising micro-detail.",
  "food-floating-hero": "Dynamic advertising hero shot of [FOOD_reference_ITEM] floating in mid-air. LIGHTING: dramatic studio key with strong rim lights for perfect separation and dimensionality. COLOR GRADING: clean commercial contrast with vibrant appetizing highlights and controlled shadows. TECHNICAL: zero-gravity suspension illusion, high-shutter frozen-time aesthetic, crisp edge detail, premium campaign finish, 8K resolution. ATMOSPHERE: bold motion energy with product-first impact.",
  "food-botanical-garden": "Organic natural food photography of [FOOD_reference_ITEM] in a botanical garden setting. LIGHTING: dappled sunlight filtering through foliage with soft natural transitions. COLOR GRADING: vibrant natural greens, fresh organic tones, balanced realistic saturation. TECHNICAL: outdoor shallow-depth composition, soft background blur with lush greenery, authentic editorial realism. ATMOSPHERE: farm-to-table freshness, healthy natural authenticity, bright seasonal mood.",
  "food-romantic-candlelit": "Atmospheric evening food photography of [FOOD_reference_ITEM] in an upscale restaurant scene. LIGHTING: warm candlelight as primary source, intimate glow, soft shadow falloff, gentle practical highlights. COLOR GRADING: deep warm ambers with elegant dark backgrounds and refined contrast. TECHNICAL: shallow depth with creamy bokeh from distant city or fairy lights, premium restaurant-commercial composition. ATMOSPHERE: sophisticated romantic luxury dining mood, cozy and cinematic."
};

// =============================================
// STATE & STATE MANAGER (REDAX-LIKE)
// =============================================
const initialState = {
  aiProvider: "groq", apiKey: "",
  aiModel: "", cameraBody: "", aspectRatio: "", resolution: "", purpose: "", format: "", medium: "", photoStyle: "", cinemaStyle: "", directorStyle: "", artStyle: "", filmStock: "",
  lens: "", focalLength: "", aperture: "", angle: "", shotSize: "", composition: "", quality: "",
  mood: "",
  lighting: [], lightType: "", lightFX: [], colorPalette: "", skinDetail: [], hairDetail: [], material: [], typography: [],
  referenceType: "", referenceWeight: 50,
  mainSubject: "", textContent: "", negativePrompt: "",
  quickStyle: "", fashionFoodStyle: "",
  emotion: "",
  generateFourMode: false, grid3x3Mode: false, maxConsistency: false, beforeAfter: false, seamlessPattern: false, seed: "",
  mjVersion: "7", mjStyle: "", mjStylize: 250, mjChaos: 0, mjWeird: 0, mjSref: "",
  sdCfg: 7, sdSteps: 25,
  fluxModel: "dev", fluxGuidance: 3.5, fluxSteps: 28,
  dalleStyle: "vivid", dalleQuality: "hd",
  skinRenderBoost: false, hairRenderBoost: false,
  motionBlurMode: false,
  motionBlurBackgroundEnabled: false,
  motionBlurForegroundEnabled: false,
  motionBlurCharacter: "", motionBlurLocation: "", motionBlurBackground: "", motionBlurForeground: "",
  referenceImages: [],
  promptFormat: "flat",
  isStandardPresetActive: false
};

class StateManager {
  constructor(initial) {
    this.initialState = deepClone(initial);
    this.state = deepClone(initial);
    this.listeners = [];
    this.isGitHubPages = window.location.hostname.includes("github.io");
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l(this.state));
  }

  dispatch(action, payload) {
    const prevState = deepClone(this.state);

    switch (action) {
      case "SET_OPTION":
        this._handleSetOption(payload);
        break;
      case "TOGGLE_MODE":
        this._handleToggleMode(payload);
        break;
      case "RESET_ALL":
        this.state = deepClone(this.initialState);
        break;
      case "APPLY_PRESET":
        this.state = { ...this.state, ...payload };
        break;
      case "SYNC_INPUTS":
        this.state = { ...this.state, ...payload };
        break;
      case "SET_FORMAT":
        this.state.promptFormat = payload;
        break;
    }

    this._pruneConflicts(prevState);

    // Sync to global state for backward compatibility
    window.state = this.state;
    // NOTE: global 'state' variable is updated dynamically via getter/setter below

    this.notify();
  }

  _handleSetOption({ group, value }) {
    const mode = (groupConfig[group] && groupConfig[group].mode) || "single";

    if (this.state.isStandardPresetActive && group !== "resolution") {
      this.state.isStandardPresetActive = false;
    }

    if (mode === "single") {
      if (this.state[group] === value) this.state[group] = "";
      else this.state[group] = value;

      if (group === "aspectRatio") {
        this.state.resolution = "";
      }
      if (group === "aiModel") {
        // model hints are updated in UI
      }
      if (group === "quickStyle" && this.state[group]) {
        this.state.photoStyle = ""; this.state.cinemaStyle = ""; this.state.directorStyle = "";
        this.state.fashionFoodStyle = "";
      }
      if (group === "fashionFoodStyle" && this.state[group]) {
        this.state.quickStyle = "";
        this.state.photoStyle = ""; this.state.cinemaStyle = ""; this.state.directorStyle = "";
        this.state.artStyle = ""; this.state.filmStock = ""; this.state.referenceType = "";
      }
    } else if (mode === "multi") {
      if (!Array.isArray(this.state[group])) this.state[group] = [];
      const arr = this.state[group];
      const idx = arr.indexOf(value);
      if (idx >= 0) arr.splice(idx, 1); else arr.push(value);
    } else if (mode === "primaryAccent") {
      const cur = this.state[group] || { primary: "", accent: "" };
      if (cur.primary === value) { cur.primary = ""; }
      else if (cur.accent === value) { cur.accent = ""; }
      else if (!cur.primary) { cur.primary = value; }
      else if (!cur.accent) { cur.accent = value; }
      else { cur.accent = value; }
      this.state[group] = Object.assign({}, cur);
    }
  }

  _handleToggleMode({ mode, isChecked }) {
    this.state[mode] = isChecked;
    // P6: Toggling any mode breaks preset state
    if (isChecked && this.state.isStandardPresetActive) {
      this.state.isStandardPresetActive = false;
    }
  }


  _applyTaxonomyRules(prevState) {
    if (!window.taxonomyRules || !window.taxonomyRules.length) return;

    const hasSubstring = (val, terms) => {
      if (!val) return false;
      const normalizedTerms = (terms || []).map(normalizeRuleToken).filter(Boolean);
      if (!normalizedTerms.length) return false;
      if (Array.isArray(val)) {
        return val.some(v => {
          const normalizedValue = normalizeRuleToken(v);
          return normalizedTerms.some(t => normalizedValue.includes(t));
        });
      }
      const normalizedValue = normalizeRuleToken(val);
      return normalizedTerms.some(t => normalizedValue.includes(t));
    };

    window.taxonomyRules.forEach(rule => {
      let isTriggered = false;
      const tField = rule.trigger.field;
      let tVal = this.state[tField];

      if (rule.trigger.notEmpty) {
        if (Array.isArray(tVal)) isTriggered = tVal.length > 0;
        else if (typeof tVal === 'object') isTriggered = Object.values(tVal).some(v => v);
        else isTriggered = !!tVal;
      } else if (rule.trigger.in) {
        const normalizedRuleValues = rule.trigger.in.map(normalizeRuleToken);
        if (Array.isArray(tVal)) {
          isTriggered = tVal.some(v => normalizedRuleValues.includes(normalizeRuleToken(v)));
        } else {
          isTriggered = normalizedRuleValues.includes(normalizeRuleToken(tVal));
        }
      } else if (rule.trigger.contains) {
        isTriggered = hasSubstring(tVal, rule.trigger.contains);
      }

      if (isTriggered) {
        if (rule.action === "disable" || rule.action === "override_and_lock") {
          rule.targets.forEach(target => {
            if (this.state[target]) {
              if (Array.isArray(this.state[target])) this.state[target] = [];
              else if (typeof this.state[target] === "boolean") this.state[target] = false;
              else if (typeof this.state[target] === "object") this.state[target] = { primary: "", accent: "" };
              else this.state[target] = "";
            }
          });
        } else if (rule.action === "exclude") {
          // P8: Simplified exclude — always clear the conflicting target value
          const tTarget = rule.target;
          if (this.state[tTarget]) {
            if (Array.isArray(this.state[tTarget])) {
              this.state[tTarget] = this.state[tTarget].filter(v => !rule.values.includes(v) && !hasSubstring(v, rule.values));
            } else if (rule.values.includes(this.state[tTarget]) || hasSubstring(this.state[tTarget], rule.values)) {
              this.state[tTarget] = "";
            }
          }
        }
      }
    });
  }

  _pruneConflicts(prevState) {
    // Keep prompt format and model capabilities in sync.
    if (this.state.aiModel === "midjourney") {
      this.state.promptFormat = "midjourney";
    } else if (this.state.promptFormat === "midjourney") {
      this.state.promptFormat = "flat";
    }

    // 1. Format constraints: motion blur ? flat only
    if (this.state.promptFormat !== "flat") {
      this.state.motionBlurMode = false;
      this.state.motionBlurBackgroundEnabled = false;
      this.state.motionBlurForegroundEnabled = false;
    }

    // 2. Mode mutual exclusions
    // Generate 4 в†” 3x3
    if (this.state.generateFourMode && this.state.grid3x3Mode) {
      if (prevState.generateFourMode && !prevState.grid3x3Mode) this.state.generateFourMode = false;
      else this.state.grid3x3Mode = false;
    }
    // Motion blur в†” Generate 4
    if (this.state.motionBlurMode && this.state.generateFourMode) {
      if (prevState.motionBlurMode && !prevState.generateFourMode) this.state.motionBlurMode = false;
      else this.state.generateFourMode = false;
    }
    // Motion blur в†” 3x3
    if (this.state.motionBlurMode && this.state.grid3x3Mode) {
      if (prevState.motionBlurMode && !prevState.grid3x3Mode) this.state.motionBlurMode = false;
      else this.state.grid3x3Mode = false;
    }

    // 3. Mode cascades в†’ beforeAfter, seamlessPattern
    if (this.state.generateFourMode || this.state.grid3x3Mode || this.state.motionBlurMode) {
      this.state.beforeAfter = false;
      this.state.seamlessPattern = false;
    }

    // 4. Mode field clears (synced with enforceOutputStateRules & applyConflictRules)
    if (this.state.grid3x3Mode) {
      ["lens", "focalLength", "shotSize", "aperture", "angle", "composition"].forEach(k => clearStateField(this.state, k));
    }
    if (this.state.generateFourMode) {
      ["shotSize", "angle", "composition"].forEach(k => clearStateField(this.state, k));
    }
    if (this.state.motionBlurMode) {
      // Motion blur uses fixed Leica template
      ["cameraBody", "lens", "focalLength", "aperture"].forEach(k => clearStateField(this.state, k));
    }
    if (!this.state.motionBlurMode) {
      this.state.motionBlurBackgroundEnabled = false;
      this.state.motionBlurForegroundEnabled = false;
    }

    // 15: Character Sheet
    if (this.state.purpose === "Character Sheet") {
      this.state.seamlessPattern = false;
    }
    // 11: BeforeAfter в†” Seamless
    if (this.state.beforeAfter && this.state.seamlessPattern) {
      if (prevState.beforeAfter && !prevState.seamlessPattern) this.state.beforeAfter = false;
      else this.state.seamlessPattern = false;
    }

    this._applyTaxonomyRules(prevState);
    enforceOutputStateRules(this.state, prevState);

    if (this.isGitHubPages && !this.state.ghPagesWarningShown) {
      console.warn("Running on GitHub Pages: Backend features (API/Server) are disabled.");
      this.state.ghPagesWarningShown = true;
    }
  }
}

const appState = new StateManager(initialState);
let state = appState.state;

// Proxy to keep global 'state' accesses synchronized with appState.state
state = new Proxy(appState.state, {
  get: function (target, prop) { return appState.state[prop]; },
  set: function (target, prop, value) { appState.state[prop] = value; return true; }
});
window.state = state;
window.appState = appState;

const GENERATE_FOUR_PREFIX = `Generate 4 distinct variations of the subject instructions below. Do not create a grid. Create 4 separate images.`;

const GRID_3X3_PREFIX = `3x3 Cinematic Contact Sheet, 3:4 AR. Full-bleed, no margins, thin dark dividers. Frozen scene logic: static subject/env consistency with dynamic cinematic lighting/DOF. Arri Alexa 35, 35mm, f/2.8, 8k, color-graded. 9 Panels: 1.ELS, 2.LS, 3.MLS, 4.MS, 5.MCU, 6.CU, 7.ECU (detail), 8.Low Angle, 9.High Angle.
`;



const SKIN_RENDER_CONFIG = `"skin_render_config": {
  "texture_quality": "8K_micro_detail",
  "epidermal_physics": {
    "surface": "natural skin grain with distinct visible pores (t-zone emphasis)",
    "hair": "visible vellus hair (peach fuzz) on cheeks and jawline",
    "light_interaction": "subsurface scattering (SSS) for translucent flesh tone",
    "reflectivity": "natural sebum sheen on high points (nose, cheekbones), no plastic gloss"
  },
  "imperfections": {
    "type": "dermatological irregularities",
    "details": ["fine lines", "tiny moles", "hyper-pigmentation", "micro-capillaries"],
    "distribution": "randomized, non-symmetrical"
  },
  "eyes": {
    "texture": "crystalline iris structure with wet-surface reflections",
    "details": "distinct lacrimal caruncle, individual eyelash strands"
  },
  "negative_constraints": ["airbrushed", "wax figure", "smooth filter", "doll-like", "flat lighting"]
}`;

const HAIR_RENDER_CONFIG = `"hair_render_config": {
  "rendering_mode": "strand_based_simulation",
  "texture_details": {
    "structure": "individual strands visible, not mesh-like",
    "density": "natural follicle density with scalp visibility at parting",
    "micro_imperfections": ["flyaways", "frizz", "uneven breaks", "baby hairs at hairline"],
    "finish": "organic keratin sheen, anisotropic reflection"
  },
  "physics_and_movement": {
    "weight": "gravity-induced drape",
    "interaction": "blowing gently in wind, strands covering part of face",
    "chaos_factor": "high (avoiding plastic helmet look)"
  },
  "facial_integration": {
    "transition": "gradual hairline blending, not a hard line",
	  "vellus": "visible peach fuzz on temples and neck"
	  }
	}`;

const SKIN_RENDER_CONFIG_FLAT = `The skin must feature distinct, visible pores, particularly across the T-zone. Utilize subsurface scattering (SSS) to render a translucent, lifelike flesh tone. The surface should have a natural sebum sheen on high points like the nose and cheekbones, strictly avoiding any plastic, waxy, or airbrushed gloss. Incorporate natural, randomized dermatological imperfections including fine lines, tiny non-symmetrical moles, subtle hyper-pigmentation, and micro-capillaries. The eyes must feature a crystalline iris structure with high-fidelity wet-surface reflections, a distinct lacrimal caruncle, and individually defined eyelash strands. The lighting must be dimensional, avoiding any flat or doll-like appearance.`;

const HAIR_RENDER_CONFIG_FLAT = `Render the subject's hair organically, ensuring individual strands are distinctly visible, completely avoiding a solid mesh or plastic helmet appearance. The hair must exhibit natural follicle density, with the scalp subtly visible at the parting. Apply an organic keratin sheen with anisotropic light reflections. The hair physics should demonstrate a natural gravity-induced drape. Introduce a high chaos factor for an authentic, unstyled look by including micro-imperfections such as flyaways, frizz, uneven breaks, and baby hairs around the edges. The hairline must blend gradually and naturally into the skin, featuring visible peach fuzz on the temples and neck without any hard, artificial transition lines.`;

const MOTION_BLUR_FLAT_PREFIX = "4k, high quality, detailed, Photography, shot on Leica M11, Leica Summilux-M 50mm f/1.4 ASPH, f/2.8, balanced depth of field, professional portrait look, photorealistic.";

function buildMotionBlurFlatBlock() {
  const character = (state.motionBlurCharacter || "").trim() || "[character from references]";
  const location = (state.motionBlurLocation || "").trim() || "[Location]";
  const backgroundEnabled = !!state.motionBlurBackgroundEnabled;
  const background = (state.motionBlurBackground || "").trim() || "[Background]";
  const foregroundEnabled = !!state.motionBlurForegroundEnabled;
  const foreground = (state.motionBlurForeground || "").trim() || "[Foreground]";
  let blurScope = "selected planes only";
  if (backgroundEnabled && foregroundEnabled) blurScope = "background and foreground only";
  else if (backgroundEnabled) blurScope = "background only";
  else if (foregroundEnabled) blurScope = "foreground only";
  const backgroundLine = backgroundEnabled ? ` Background: ${background}.` : "";
  const foregroundLine = foregroundEnabled ? ` Foreground: ${foreground}.` : "";
  return `${MOTION_BLUR_FLAT_PREFIX}
A portrait of a ${character}, standing perfectly still in the ${location}. Camera technique: Shot with a slow shutter speed (long exposure) to freeze the main subject in razor-sharp focus while creating a heavy motion blur on the ${blurScope}.${backgroundLine}${foregroundLine}`;
}

function parseRenderConfig(rawConfig, key) {
  try {
    const wrapped = "{" + String(rawConfig || "") + "}";
    const parsed = JSON.parse(wrapped);
    return parsed && parsed[key] ? parsed[key] : undefined;
  } catch (_e) {
    return undefined;
  }
}

const SKIN_RENDER_CONFIG_OBJECT = parseRenderConfig(SKIN_RENDER_CONFIG, "skin_render_config");
const HAIR_RENDER_CONFIG_OBJECT = parseRenderConfig(HAIR_RENDER_CONFIG, "hair_render_config");

function buildRenderBoostPayload() {
  const out = {};
  if (state.skinRenderBoost) {
    out.skin = true;
    if (SKIN_RENDER_CONFIG_OBJECT) out.skin_render_config = SKIN_RENDER_CONFIG_OBJECT;
  }
  if (state.hairRenderBoost) {
    out.hair = true;
    if (HAIR_RENDER_CONFIG_OBJECT) out.hair_render_config = HAIR_RENDER_CONFIG_OBJECT;
  }
  return Object.keys(out).length ? out : undefined;
}

const MAX_CONSISTENCY_PREFIX = `FACE ID LOCKED from reference. Exact facial match required - all features preserved.
"CONSISTENCY PROTOCOL": "100% facial feature".
"preservation from reference image".
"FACE LOCKED": "NON-NEGOTIABLE"
"FACE CONSISTENCY": "100% - All facial features must remain IDENTICAL to locked reference CHARACTER INTEGRITY: Maintain key features across all variations ZERO DEVIATION from specified eye color, hair color, face structure, unique identifiers
"Keep the facial features of the person in the uploaded image exactly consistent. Do not modify their identity. Maintain 70% identical bone structure, skin tone, and facial imperfections (moles, scars)."
`;

const MAX_CONSISTENCY_PREFIX_FLAT = "Face ID locked from reference. Exact facial match required - all features preserved. Consistency protocol: 100% facial feature preservation from reference image. Face locked: non-negotiable. Face consistency: 100%. All facial features must remain identical to the locked reference. Character integrity: maintain key features across all variations. Zero deviation from specified eye color, hair color, face structure, and unique identifiers. Keep the facial features of the person in the uploaded image exactly consistent. Do not modify their identity. Use the uploaded reference photo as the only identity source. Identity lock: keep face geometry, bone structure, eye color, hairline, skin tone, and all unique marks (moles/scars) 100% identical. Zero identity drift. Allow changes only in pose, camera angle, lighting, background, and clothing. Do not alter identity, age, ethnicity, or facial proportions.";

const MAX_CONSISTENCY_FACE_CONSTRAINTS = [
  "Keep the facial features of the person exactly consistent with the reference image",
  "Do not modify their identity",
  "Preserve all unique identifiers including exact eye color and hair color",
  "Maintain identical bone structure, skin tone, and facial imperfections like moles and scars across all variations"
];

const NBP_MODELS = ["nano-banana-pro", "nano-banana", "gemini-imagen"];
const NBP_ALLOWED_ASPECT_RATIOS = new Set(["1:1", "4:3", "3:4", "16:9", "9:16"]);

function isNBPModel(model) {
  return NBP_MODELS.includes(model);
}

function getEffectiveAspectRatio() {
  return state.grid3x3Mode ? "3:4" : (state.aspectRatio || "");
}



const FILM_STOCKS = {
  "Kodak Vision3 500T": "shot on Kodak Vision3 500T 5219 film stock, visible film grain, red halation around highlights, tungsten color balance, cinematic texture, deep shadows",
  "Kodak Vision3 250D": "shot on Kodak Vision3 250D 5207 film stock, fine grain structure, true-to-life colors, rich daylight saturation, organic skin tones",
  "Kodak Vision3 50D": "shot on Kodak Vision3 50D film stock, virtually grain-free, hyper-vivid colors, extreme detail retention, pristine film quality",
  "Fujifilm Eterna 500T": "shot on Fujifilm Eterna 500T, low contrast, soft pastel color palette, cinematic greenish shadows, smooth tonal transitions",
  "Kodak Tri-X 400": "shot on Kodak Tri-X 400 Black and White film, heavy contrast, gritty film grain, noir aesthetic, monochromatic",
  "Kodachrome 64": "shot on vintage Kodachrome 64, nostalgic warm colors, deeply saturated reds and yellows, 1970s magazine look",
  "ARRI Alexa 35 Sensor": "shot on ARRI Alexa 35, REVEAL Color Science, extreme dynamic range, creamy highlight roll-off, noise-free shadows",
  "RED V-Raptor / Monstro": "shot on RED V-Raptor 8K VV, hyper-realistic detail, razor sharp, deep crushed blacks, digital precision",
  "Sony Venice 2": "shot on Sony Venice 2, exceptional low light performance, clean vibrant colors, modern full-frame aesthetic",
  "VHS / MiniDV": "shot on VHS camcorder, 1990s home video style, tracking errors, chromatic aberration, low resolution, scanlines"
};

// =============================================
// UTILS
// =============================================
const $ = id => document.getElementById(id);
const esc = s => (s ?? "").toString().replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);

function notify(msg, type = "success") {
  const n = $("notification");
  n.textContent = msg;
  n.className = "notification " + type;
  n.classList.add("show");
  clearTimeout(n._t);
  n._t = setTimeout(() => n.classList.remove("show"), 2500);
}

function wordCount(t) { const s = (t || "").trim(); return s ? s.split(/\s+/).length : 0; }
function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

function normalizeText(value) {
  return (value || "").toString().normalize("NFKC").toLowerCase();
}

function normalizeRuleToken(value) {
  return normalizeText(value)
    .replace(/\u0432\u0452[\u201c\u201d\u201e\u2022\u2013\u2014-]/g, "-")
    .replace(/[\u2012\u2013\u2014\u2212]/g, "-")
    .replace(/\s*-\s*/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function isArtisticFormat(formatValue) {
  return ["oil painting", "pencil sketch", "pixel art", "watercolor", "anime style", "vector illustration"].includes(formatValue);
}

function isPhotorealArtStyle(styleValue) {
  const raw = normalizeText(styleValue);
  if (!raw) return false;
  if (/(photoreal|cinematic|\u0444\u043e\u0442\u043e\u0440\u0435\u0430\u043b|\u043a\u0438\u043d\u0435\u043c\u0430\u0442\u043e\u0433\u0440\u0430\u0444)/.test(raw)) return true;
  const mapped = normalizeText((window.ART_STYLES_MAP && window.ART_STYLES_MAP[styleValue]) || "");
  return /(photorealistic|cinematic film still)/.test(mapped);
}

function isArtisticArtStyle(styleValue) {
  const raw = normalizeText(styleValue);
  if (!raw) return false;
  if (isPhotorealArtStyle(styleValue)) return false;
  if (window.ART_STYLES_MAP && window.ART_STYLES_MAP[styleValue]) return true;
  return /(anime|illustration|concept|vector|pixel|manga|chibi|surreal|impression|expression|abstract|graffiti|steampunk|cyberpunk|gothic|fantasy|baroque|renaissance|bauhaus|ukiyo|blueprint|claymation|paper cut|stained glass|glitch|pop art|cubis|pointill|art nouveau|\u0430\u043d\u0438\u043c\u0435|\u0438\u043b\u043b\u044e\u0441\u0442\u0440|\u043a\u043e\u043d\u0446\u0435\u043f\u0442|\u0432\u0435\u043a\u0442\u043e\u0440|\u043f\u0438\u043a\u0441\u0435\u043b|\u043c\u0430\u043d\u0433\u0430|\u0447\u0438\u0431\u0438|\u0441\u044e\u0440\u0440\u0435|\u0438\u043c\u043f\u0440\u0435\u0441|\u044d\u043a\u0441\u043f\u0440\u0435\u0441|\u0430\u0431\u0441\u0442\u0440\u0430\u043a|\u0433\u0440\u0430\u0444\u0444\u0438\u0442|\u0441\u0442\u0438\u043c\u043f\u0430\u043d\u043a|\u043a\u0438\u0431\u0435\u0440\u043f\u0430\u043d\u043a|\u0433\u043e\u0442\u0438\u043a|\u0444\u044d\u043d\u0442\u0435\u0437\u0438|\u0431\u0430\u0440\u043e\u043a|\u0440\u0435\u043d\u0435\u0441\u0441\u0430\u043d\u0441|\u0431\u0430\u0443\u0445\u0430\u0443\u0441|\u0443\u043a\u0438\u0451|\u0447\u0435\u0440\u0442\u0435\u0436|\u043f\u043b\u0430\u0441\u0442\u0438\u043b\u0438\u043d|\u0431\u0443\u043c\u0430\u0436|\u0432\u0438\u0442\u0440\u0430\u0436|\u0433\u043b\u0438\u0442\u0447|\u043f\u043e\u043f-\u0430\u0440\u0442|\u043a\u0443\u0431\u0438\u0437|\u043f\u0443\u0430\u043d\u0442\u0438\u043b|\u0430\u0440-\u043d\u0443\u0432\u043e|\u0430\u0440\u0442-\u0434\u0435\u043a\u043e)/.test(raw);
}

function isAbstractPurpose(purposeValue) {
  return ["Logo Design", "UI Design", "Infographic"].includes(purposeValue);
}

function isMacroLens(value) {
  const v = normalizeText(value);
  return /(macro|100mm|105mm)/.test(v);
}

function isUltraWideLens(value) {
  const v = normalizeText(value);
  return /(14mm|14-24mm|15-35mm|ultra[-\s]?wide)/.test(v);
}

function isAnamorphicLens(value) {
  return /anamorphic/i.test(value || "");
}

function isFlatLayComposition(value) {
  return /flat lay/i.test(value || "");
}

function isExtremeWideComposition(value) {
  return /(extreme wide shot|extreme wide|extreme long shot|wide shot)/i.test(value || "");
}

function isExtremeCloseComposition(value) {
  return /extreme close-up/i.test(value || "");
}

function isUltraWideOpenAperture(value) {
  const v = normalizeText(value);
  return /f\/(0\.95|1\.2)\b/.test(v);
}

function getShotDescriptor(st) {
  return [st && st.shotSize, st && st.composition].filter(Boolean).join(" ");
}

function isDroneAngle(value) {
  return /drone/i.test(value || "");
}

function isTopDownAngle(value) {
  return /(drone|high angle|slightly high|top[-\s]?down|bird'?s[-\s]?eye)/i.test(value || "");
}

function isStudioLightToken(value) {
  const v = normalizeText(value);
  return /(studio|softbox|clamshell|butterfly|rembrandt|split lighting|broad lighting|ring light)/.test(v);
}

function isNeonLightToken(value) {
  const v = normalizeText(value);
  return /(neon|blacklight|uv|fluorescent)/.test(v);
}

function isNightLightToken(value) {
  const v = normalizeText(value);
  return /(night|blue hour|moonlight|candlelight|artificial lighting)/.test(v);
}

function isDayLightToken(value) {
  const v = normalizeText(value);
  return /(midday|golden hour|overcast|daylight|hard sunlight|natural light)/.test(v);
}

function getAllLightingSelections(st) {
  const out = [];
  if (Array.isArray(st && st.lighting)) out.push(...st.lighting);
  if (st && st.lightType) out.push(st.lightType);
  return out.filter(Boolean);
}

const DIRECTOR_CINEMA_COLLABS = {
  // Director в†’ compatible cinematographer substrings
  "Denis Villeneuve": ["Roger Deakins", "Greig Fraser"],
  "Christopher Nolan": ["Hoyte van Hoytema"],
  "Quentin Tarantino": ["Robert Richardson"],
  "Ridley Scott": ["Vittorio Storaro"],
  "David Fincher": ["Roger Deakins"],
  "Greta Gerwig": ["Linus Sandgren"],
  "Jordan Peele": ["Hoyte van Hoytema"],
  "Chloe Zhao": ["Bradford Young"]
};

function isKnownDirectorCinemaCollab(directorStyle, cinemaStyle) {
  if (!directorStyle || !cinemaStyle) return false;
  for (const [dir, cins] of Object.entries(DIRECTOR_CINEMA_COLLABS)) {
    if (directorStyle.includes(dir) && cins.some(c => cinemaStyle.includes(c))) {
      return true;
    }
  }
  return false;
}

function computeSemanticFlags(st) {
  const allLights = getAllLightingSelections(st);
  const shotDescriptor = getShotDescriptor(st);
  return {
    allLights,
    isArtisticFormat: isArtisticFormat(st.format),
    isArtisticArtStyle: isArtisticArtStyle(st.artStyle),
    isAbstractPurpose: isAbstractPurpose(st.purpose),
    hasMacroLens: isMacroLens(st.lens),
    hasUltraWideLens: isUltraWideLens(st.lens),
    hasAnamorphicLens: isAnamorphicLens(st.lens),
    compositionIsFlatLay: isFlatLayComposition(shotDescriptor),
    compositionIsExtremeWide: isExtremeWideComposition(shotDescriptor),
    compositionIsExtremeClose: isExtremeCloseComposition(shotDescriptor),
    angleIsDrone: isDroneAngle(st.angle),
    hasStudioLight: allLights.some(isStudioLightToken),
    hasNeonLight: allLights.some(isNeonLightToken),
    hasNightLight: allLights.some(isNightLightToken),
    hasDayLight: allLights.some(isDayLightToken),
    photoStyleBlackAndWhite: /black and white/i.test(st.photoStyle || "")
  };
}

function clearStateField(st, key) {
  if (!st || !(key in st)) return;
  if (Array.isArray(st[key])) {
    st[key] = [];
  } else if (typeof st[key] === "boolean") {
    st[key] = false;
  } else if (typeof st[key] === "object" && st[key] !== null) {
    st[key] = {};
  } else {
    st[key] = "";
  }
}

function clearShotSelectionsByPredicate(st, predicate) {
  if (!st || typeof predicate !== "function") return;
  if (predicate(st.shotSize || "")) clearStateField(st, "shotSize");
  if (predicate(st.composition || "")) clearStateField(st, "composition");
}

function enforceOutputStateRules(st, prevState) {
  if (!st || typeof st !== "object") return st;
  const prev = prevState || {};

  // Keep model and prompt format consistent for API/server callers too.
  if (st.aiModel === "midjourney") {
    st.promptFormat = "midjourney";
  } else if (st.promptFormat === "midjourney") {
    st.promptFormat = "flat";
  }

  // Motion blur is available only in flat prompt mode.
  if (st.promptFormat !== "flat") {
    st.motionBlurMode = false;
    st.motionBlurBackgroundEnabled = false;
    st.motionBlurForegroundEnabled = false;
  }

  // Generate mode mutual exclusions
  if (st.generateFourMode && st.grid3x3Mode) {
    if (prev.generateFourMode && !prev.grid3x3Mode) st.generateFourMode = false;
    else st.grid3x3Mode = false;
  }
  if (st.motionBlurMode && st.generateFourMode) {
    if (prev.motionBlurMode && !prev.generateFourMode) st.motionBlurMode = false;
    else st.generateFourMode = false;
  }
  if (st.motionBlurMode && st.grid3x3Mode) {
    if (prev.motionBlurMode && !prev.grid3x3Mode) st.motionBlurMode = false;
    else st.grid3x3Mode = false;
  }
  if (st.generateFourMode || st.grid3x3Mode) {
    st.beforeAfter = false;
    st.seamlessPattern = false;
  }
  if (st.motionBlurMode) {
    st.beforeAfter = false;
    st.seamlessPattern = false;
  }
  if (st.beforeAfter && st.seamlessPattern) {
    if (prev.beforeAfter && !prev.seamlessPattern) st.beforeAfter = false;
    else st.seamlessPattern = false;
  }
  if (!st.motionBlurMode) {
    st.motionBlurBackgroundEnabled = false;
    st.motionBlurForegroundEnabled = false;
  }
  if (st.purpose === "Character Sheet") st.seamlessPattern = false;

  // Preset mode mutual exclusion
  if (st.quickStyle && st.fashionFoodStyle) {
    if (prev.quickStyle && !prev.fashionFoodStyle) st.quickStyle = "";
    else st.fashionFoodStyle = "";
  }

  if (st.grid3x3Mode) {
    ["lens", "focalLength", "shotSize", "aperture", "angle", "composition"].forEach(k => clearStateField(st, k));
  }
  if (st.generateFourMode) {
    ["shotSize", "angle", "composition"].forEach(k => clearStateField(st, k));
  }
  // P3: Motion blur uses fixed Leica template — clear user camera/optics
  if (st.motionBlurMode) {
    ["cameraBody", "lens", "focalLength", "aperture"].forEach(k => clearStateField(st, k));
  }

  const flags = computeSemanticFlags(st);
  const isArtisticVisualMode = flags.isArtisticFormat || flags.isArtisticArtStyle;

  if (isArtisticVisualMode) {
    ["cameraBody", "lens", "focalLength", "aperture", "filmStock", "skinDetail", "hairDetail"].forEach(k => clearStateField(st, k));
    st.skinRenderBoost = false;
    st.hairRenderBoost = false;
  }

  if (st.format === "pixel art" || st.format === "anime style") {
    clearStateField(st, "skinDetail");
    clearStateField(st, "hairDetail");
    st.skinRenderBoost = false;
    st.hairRenderBoost = false;
  }

  if (flags.isAbstractPurpose) {
    ["cameraBody", "lens", "focalLength", "aperture", "filmStock", "skinDetail", "hairDetail", "photoStyle", "cinemaStyle", "directorStyle"].forEach(k => clearStateField(st, k));
    st.skinRenderBoost = false;
    st.hairRenderBoost = false;
  }

  if (flags.hasMacroLens && flags.compositionIsExtremeWide) {
    clearShotSelectionsByPredicate(st, isExtremeWideComposition);
  }
  if (flags.hasUltraWideLens && flags.compositionIsExtremeClose) {
    clearShotSelectionsByPredicate(st, isExtremeCloseComposition);
  }
  if (isUltraWideOpenAperture(st.aperture) && flags.compositionIsExtremeWide) {
    clearShotSelectionsByPredicate(st, isExtremeWideComposition);
  }
  if (st.seamlessPattern) {
    if (st.shotSize && !isFlatLayComposition(st.shotSize)) {
      clearStateField(st, "shotSize");
    }
    // Legacy compatibility: old exports stored shot framing in composition.
    if (!st.shotSize && st.composition && !isFlatLayComposition(st.composition)) {
      clearStateField(st, "composition");
    }
  }
  if (flags.compositionIsFlatLay && st.angle && !isTopDownAngle(st.angle)) {
    clearStateField(st, "angle");
  }

  // P9: Anamorphic lens в†” purpose — last-write-wins
  if (flags.hasAnamorphicLens && st.purpose && !["Cinematic Still", "Advertising campaign"].includes(st.purpose)) {
    if (prev.purpose === st.purpose) {
      // Purpose was already set, lens is new в†’ clear lens
      clearStateField(st, "lens");
    } else {
      // Purpose is new, lens was already set в†’ clear purpose
      clearStateField(st, "purpose");
    }
  }

  // P11: Drone в†” Studio light — filter studio lights first, then recheck
  if (flags.angleIsDrone) {
    st.lighting = (st.lighting || []).filter(v => !isStudioLightToken(v));
    if (isStudioLightToken(st.lightType)) clearStateField(st, "lightType");
  }
  // Recompute after filtering to avoid clearing both angle AND lighting
  const postFilterLights = getAllLightingSelections(st);
  if (postFilterLights.some(isStudioLightToken) && isDroneAngle(st.angle)) {
    clearStateField(st, "angle");
  }

  if (flags.photoStyleBlackAndWhite) {
    st.lighting = (st.lighting || []).filter(v => !isNeonLightToken(v));
    if (isNeonLightToken(st.lightType)) clearStateField(st, "lightType");
  }

  // P4: Night в†” Day light mutual exclusion (server-side enforcement)
  const allLights = getAllLightingSelections(st);
  if (allLights.some(isNightLightToken) && allLights.some(isDayLightToken)) {
    st.lighting = (st.lighting || []).filter(v => !isDayLightToken(v));
    if (isDayLightToken(st.lightType)) clearStateField(st, "lightType");
  }

  // P5: Neon в†’ B&W bidirectional conflict (reverse direction)
  if (getAllLightingSelections(st).some(isNeonLightToken) && /black and white/i.test(st.photoStyle || "")) {
    clearStateField(st, "photoStyle");
  }

  if (st.quickStyle) {
    [
      "purpose", "format", "medium", "quality", "cameraBody", "lens", "focalLength", "shotSize", "aperture",
      "angle", "composition", "lighting", "lightType", "lightFX", "colorPalette", "mood",
      "skinDetail", "hairDetail", "material", "photoStyle", "cinemaStyle", "directorStyle", "artStyle",
      "filmStock", "typography", "referenceType", "emotion", "fashionFoodStyle"
    ].forEach(k => clearStateField(st, k));
    st.skinRenderBoost = false;
    st.hairRenderBoost = false;
    st.motionBlurMode = false;
    st.motionBlurBackgroundEnabled = false;
    st.motionBlurForegroundEnabled = false;
  }

  if (st.fashionFoodStyle) {
    [
      "purpose", "format", "medium", "quality", "cameraBody", "lens", "focalLength", "shotSize", "aperture",
      "angle", "composition", "lighting", "lightType", "lightFX", "colorPalette", "mood",
      "skinDetail", "hairDetail", "material", "photoStyle", "cinemaStyle", "directorStyle", "artStyle",
      "filmStock", "typography", "referenceType", "emotion", "quickStyle"
    ].forEach(k => clearStateField(st, k));
    st.skinRenderBoost = false;
    st.hairRenderBoost = false;
    st.motionBlurMode = false;
    st.motionBlurBackgroundEnabled = false;
    st.motionBlurForegroundEnabled = false;
  }

  return st;
}
window.enforceOutputStateRules = enforceOutputStateRules;

// =============================================
// INIT
// =============================================

document.addEventListener("DOMContentLoaded", function () {
  // Local fallback for css2 when opened directly from disk.
  var css2 = document.getElementById("css2LocalLink");
  if (css2 && window.location.protocol === "file:") {
    css2.href = "file:///C:/Users/TOT/Documents/Grav4/VideoPrompt/css2";
  }

  window.taxonomyRules = [];
  fetch('./config/taxonomy-rules.json')
    .then(r => r.json())
    .then(data => { window.taxonomyRules = data.rules || []; })
    .catch(err => console.error("Filter logic err:", err));

  initPresets();

  bindEvents();
  setPromptFormat(state.promptFormat);
  updateAll();
});

function initPresets() {
  const g = $("presetGrid");
  g.innerHTML = "";
  presets.forEach((p, i) => {
    const b = document.createElement("button");
    b.className = "option-btn";
    b.style.borderColor = "var(--green)";
    b.style.borderWidth = "2px";
    b.dataset.presetIndex = String(i);
    b.textContent = p.name;
    b.addEventListener("click", () => applyPreset(i));
    g.appendChild(b);
  });
}

function bindEvents() {
  // Delegated clicks on option buttons
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".option-btn");
    if (!btn) return;

    if (btn.dataset.action === "addNegative") {
      addNegative(btn.dataset.value || "");
      return;
    }

    const group = btn.dataset.group;
    if (!group) return;
    handleSelect(group, btn.dataset.value || "");
  });

  $("referenceImages").addEventListener("change", handleImageUpload);
  $("refWeightSlider").addEventListener("input", (e) => {
    state.referenceWeight = parseInt(e.target.value, 10);
    $("weightValue").textContent = String(state.referenceWeight);
    updateAll();
  });

  // Gen params sliders
  $("mjStylizeSlider").addEventListener("input", (e) => { state.mjStylize = +e.target.value; $("mjStylizeVal").textContent = state.mjStylize; updateAll(); });
  $("mjChaosSlider").addEventListener("input", (e) => { state.mjChaos = +e.target.value; $("mjChaosVal").textContent = state.mjChaos; updateAll(); });
  $("mjWeirdSlider").addEventListener("input", (e) => { state.mjWeird = +e.target.value; $("mjWeirdVal").textContent = state.mjWeird; updateAll(); });
  $("mjSrefInput").addEventListener("input", (e) => { state.mjSref = e.target.value || ""; updateAll(); });
  $("sdCfgSlider").addEventListener("input", (e) => { state.sdCfg = +e.target.value; $("sdCfgVal").textContent = state.sdCfg; updateAll(); });
  $("sdStepsSlider").addEventListener("input", (e) => { state.sdSteps = +e.target.value; $("sdStepsVal").textContent = state.sdSteps; updateAll(); });
  $("fluxGuidanceSlider").addEventListener("input", (e) => { state.fluxGuidance = +e.target.value; $("fluxGuidanceVal").textContent = state.fluxGuidance; updateAll(); });
  $("fluxStepsSlider").addEventListener("input", (e) => { state.fluxSteps = +e.target.value; $("fluxStepsVal").textContent = state.fluxSteps; updateAll(); });

  // Compact button
  $("compactBtn").addEventListener("click", compactPrompt);

  $("copyPromptBtn").addEventListener("click", copyPrompt);
  $("copyJsonBtn").addEventListener("click", copyJson);
  $("saveJsonBtn").addEventListener("click", saveJson);
  $("resetBtn").addEventListener("click", resetAll);
  $("saveBtn").addEventListener("click", savePrompt);

  // Special modes checkboxes — bind via JS, not inline
  ["generateFourMode", "grid3x3Mode", "maxConsistency", "beforeAfter", "seamlessPattern", "skinRenderBoost", "hairRenderBoost", "motionBlurMode", "motionBlurBackgroundEnabled", "motionBlurForegroundEnabled"].forEach(id => {
    const cb = $(id);
    if (cb) {
      const handleToggle = (e) => {
        if (cb.disabled) {
          if (e && typeof e.preventDefault === "function") e.preventDefault();
          return;
        }

        // Only preventDefault if clicking the wrapper label, not the checkbox itself
        if (e && e.type === "click" && e.target !== cb) {
          e.preventDefault();
          cb.checked = !cb.checked;
        }

        appState.dispatch("TOGGLE_MODE", { mode: id, isChecked: cb.checked });

        // Force UI sync in case StateManager pruned conflicting modes
        ["generateFourMode", "grid3x3Mode", "beforeAfter", "seamlessPattern", "motionBlurMode", "motionBlurBackgroundEnabled", "motionBlurForegroundEnabled"].forEach(syncId => {
          const el = $(syncId);
          if (el) {
            el.checked = state[syncId];
            el.closest(".toggle-label").classList.toggle("checked", el.checked);
          }
        });

        cb.closest(".toggle-label").classList.toggle("checked", state[id]);
        updateAll();
      };

      cb.addEventListener("change", handleToggle);
      cb.closest("label").addEventListener("click", handleToggle);
    }
  });

  // Seed buttons
  $("randomSeedBtn").addEventListener("click", () => {
    const seed = Math.floor(Math.random() * 4294967295);
    $("seedInput").value = seed; state.seed = String(seed); updateAll();
    notify("Seed: " + seed);
  });
  $("clearSeedBtn").addEventListener("click", () => {
    $("seedInput").value = "";
    state.seed = "";
    updateAll();
  });
  // FIX: Seed Validation — allow empty to clear seed
  $("seedInput").addEventListener("input", function () {
    if (this.value === "") {
      state.seed = "";
      buildPrompt();
      return;
    }
    let val = parseInt(this.value, 10);
    if (isNaN(val) || val < 0) val = 0;
    if (val > 4294967295) val = 4294967295;
    this.value = val;
    state.seed = String(val);
    buildPrompt(); // strictly update text, not full updateAll to avoid focus loss
  });
}

function handleInput() { updateAll(); }

// =============================================
// TRANSLATE SCENE - via backend /api/translate
// =============================================
async function translateScene() {
  var textarea = $("mainSubject");
  var text = textarea.value.trim();
  var status = $("translateStatus");
  var btn = $("translateBtn");

  if (!text) { notify("Поле пустое", "warn"); return; }

  // Detect if already English
  var nonAscii = text.replace(/[a-zA-Z0-9\s.,!?;:\'"()\-\/\\@#$%^&*=+\[\]{}|<>~`]/g, "");
  if (nonAscii.length < text.length * 0.15) {
    notify("Текст уже на английском", "warn");
    return;
  }

  btn.disabled = true;
  status.textContent = "Переводим...";
  status.style.color = "var(--accent-light)";

  try {
    var response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text, to: "en" })
    });
    var data = await response.json();
    if (!response.ok) {
      throw new Error(data && data.error ? data.error : "HTTP " + response.status);
    }

    var translated = data && data.text ? String(data.text) : "";
    if (!translated) throw new Error("Пустой ответ перевода");

    if (translated === translated.toUpperCase() && translated.length > 20) {
      translated = translated.charAt(0).toUpperCase() + translated.slice(1).toLowerCase();
    }
    textarea.value = translated;
    state.mainSubject = translated;
    status.textContent = "✅ Переведено";
    status.style.color = "var(--green)";
    updateAll();
    notify("Текст переведён на английский");
  } catch (e) {
    status.textContent = "❌ Ошибка";
    status.style.color = "var(--red, #ff7675)";
    notify("Ошибка перевода: " + e.message, "err");
  } finally {
    btn.disabled = false;
    setTimeout(function () { status.textContent = ""; }, 4000);
  }
}

// =============================================
// SELECTION LOGIC
// =============================================
function handleSelect(group, value) {
  appState.dispatch("SET_OPTION", { group, value });

  if (group === "aspectRatio") {
    rebuildResolution();
  }
  if (group === "aiModel") {
    updateModelHint();
  }
  // FIX: Quick Style visual reset
  if (group === "quickStyle" && state.quickStyle) {
    syncGroup("photoStyle"); syncGroup("cinemaStyle"); syncGroup("directorStyle");
    syncGroup("fashionFoodStyle");
    if (window.expandSectionsForQuickStyle) window.expandSectionsForQuickStyle(true);
  }

  // FIX: Fashion Food Style visual reset
  if (group === "fashionFoodStyle" && state.fashionFoodStyle) {
    syncGroup("quickStyle");
    ["photoStyle", "cinemaStyle", "directorStyle", "artStyle", "filmStock", "referenceType"].forEach(k => {
      syncGroup(k);
    });
  }

  // Update UI for the changed group
  syncGroup(group);

  // Enforce structural pruning updates (if StateManager auto-reset disabled sections)
  // For safety, sync known conflict groups here to ensure their buttons don't stay active visually
  const isIllustration = ["vector illustration", "oil painting", "digital art", "cartoon", "anime"].includes(state.format) ||
    ["anime", "cartoon", "ghibli-style", "90s-anime", "dark-fantasy-anime", "shinkai-vibes"].includes(state.artStyle);
  if (isIllustration) {
    syncGroup("cameraBody");
    syncGroup("lens");
    syncGroup("aperture");
    syncGroup("filmStock");
  }

  updateAll();
}

function syncPAUI(group) {
  const cur = state[group] || { primary: "", accent: "" };
  document.querySelectorAll(`[data-group="${group}"]`).forEach(b => {
    const v = b.dataset.value;
    b.classList.toggle("active", v === cur.primary || v === cur.accent);
    b.querySelectorAll(".slot-tag").forEach(t => t.remove());

    if (v === cur.primary) {
      const t = document.createElement("span");
      t.className = "slot-tag primary"; t.textContent = "P";
      b.appendChild(t);
    }
    if (v === cur.accent) {
      const t = document.createElement("span");
      t.className = "slot-tag accent"; t.textContent = "A";
      b.appendChild(t);
    }
  });
}

function syncGroup(group) {
  const mode = groupConfig[group] && groupConfig[group].mode;
  if (mode === "single") {
    document.querySelectorAll(`[data-group="${group}"]`).forEach(b => {
      b.classList.toggle("active", b.dataset.value === state[group]);
      b.querySelectorAll(".slot-tag").forEach(t => t.remove());
    });
  }
  if (mode === "multi") {
    const arr = state[group] || [];
    document.querySelectorAll(`[data-group="${group}"]`).forEach(b => {
      b.classList.toggle("active", arr.includes(b.dataset.value));
    });
  }
  if (mode === "primaryAccent") syncPAUI(group);
}

// =============================================
// RESOLUTION
// =============================================
function rebuildResolution() {
  const ar = state.aspectRatio;
  const info = $("resolutionInfo");
  const opts = $("resolutionOptions");
  opts.innerHTML = "";

  if (!ar || !resolutionMap[ar]) {
    info.style.display = "block";
    opts.style.display = "none";
    return;
  }
  info.style.display = "none";
  opts.style.display = "grid";

  resolutionMap[ar].forEach(r => {
    const b = document.createElement("button");
    b.className = "option-btn";
    b.dataset.group = "resolution";
    b.dataset.value = r.value;
    b.textContent = r.label;
    if (state.resolution === r.value) b.classList.add("active");
    opts.appendChild(b);
  });
}

// =============================================
// MODEL HINTS
// =============================================
function updateModelHint() {
  const h = $("modelHint");
  if (state.aiModel && modelTips[state.aiModel]) {
    h.textContent = modelTips[state.aiModel];
    h.style.display = "block";
  } else {
    h.style.display = "none";
  }
}

function updateRefUI() {
  const isMJ = state.aiModel === "midjourney";
  const sec = $("referencesSection");
  const input = $("referenceImages");

  // Midjourney mode: disable reference upload entirely
  if (isMJ) {
    if (sec) sec.classList.add("disabled-section");
    if (input) {
      input.value = "";
      input.disabled = true;
    }
    state.referenceImages = [];
    $("imagePreviewContainer").style.display = "none";
    $("referenceOptions").style.display = "none";
    $("referenceWeight").style.display = "none";
    $("refUploadHint").innerHTML = "Загрузка референсных изображений отключена для <b>Midjourney</b> в этой версии билдера.";
    return;
  }

  // Non-MJ engines: enable references
  if (sec) sec.classList.remove("disabled-section");
  if (input) input.disabled = false;

  $("refUploadHint").textContent = "До 13 изображений. Опишите, что взять из каждого.";
  $("referenceImages").setAttribute("multiple", "");

  const hasRefs = state.referenceImages.length > 0;
  if (!hasRefs) {
    $("imagePreviewContainer").style.display = "none";
    $("referenceOptions").style.display = "none";
    $("referenceWeight").style.display = "none";
    return;
  }

  $("imagePreviewContainer").style.display = "block";
  $("referenceOptions").style.display = "block";
  // Weight slider: useful for SD and Flux (IP-Adapter). Not useful for chatgpt/nano/dall-e/ideogram/etc.
  const needsWeight = ["stable-diffusion", "flux"].includes(state.aiModel);
  $("referenceWeight").style.display = needsWeight ? "block" : "none";
}

function updateGenParamsUI() {
  const m = state.aiModel;
  $("mjGenParams").style.display = m === "midjourney" ? "block" : "none";
  $("sdGenParams").style.display = m === "stable-diffusion" ? "block" : "none";
  $("fluxGenParams").style.display = m === "flux" ? "block" : "none";
  $("dalleGenParams").style.display = m === "dall-e-3" ? "block" : "none";
  $("noGenParams").style.display = ["midjourney", "stable-diffusion", "flux", "dall-e-3", ""].includes(m) ? "none" : "block";
}

// =============================================
// COMPACT PROMPT — strip to essential core
// =============================================
function compactPrompt() {
  const outBox = $("promptOutput");
  let text = outBox.textContent || "";
  if (!text.trim() || text.includes("Select parameters") || text.includes("Выберите") || text.includes("Выберите")) {
    notify("Промпт пуст", "warn"); return;
  }

  // Remove quality spam keywords
  const qualitySpam = [
    "8k", "4k", "2k", "masterpiece", "best quality", "ultra detailed",
    "high quality", "detailed", "highly detailed", "professional",
    "award-winning", "amazing", "beautiful", "stunning"
  ];
  let parts = text.split(", ");
  parts = parts.filter(p => {
    const low = p.trim().toLowerCase();
    return !qualitySpam.some(q => low === q || low === q + ",");
  });

  // Remove duplicate semantic concepts
  const seen = new Set();
  parts = parts.filter(p => {
    const key = p.trim().toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Strip appended reference/negative sections
  let cleaned = parts.join(", ");
  cleaned = cleaned.replace(/\n\n--- Reference images ---[\s\S]*$/, "");
  cleaned = cleaned.replace(/\nNegative prompt:[\s\S]*$/, "");
  cleaned = cleaned.replace(/,\s*,/g, ",").replace(/,\s*$/, "").trim();

  outBox.textContent = cleaned;
  $("charCount").textContent = String(cleaned.length);
  $("wordCount").textContent = String(cleaned.split(/\s+/).filter(Boolean).length);
  notify("⚡ Промпт оптимизирован - убраны избыточные слова");
}

// =============================================
// REFERENCES
// =============================================
function handleImageUpload(event) {
  const MAX_REFERENCE_IMAGES = 13;
  const allFiles = Array.from(event.target.files || []);
  const files = allFiles.slice(0, MAX_REFERENCE_IMAGES);
  if (!files.length) return;
  if (allFiles.length > MAX_REFERENCE_IMAGES) {
    notify(`Можно загрузить максимум ${MAX_REFERENCE_IMAGES} изображений. Лишние файлы проигнорированы.`, "warn");
  }

  // Disabled for Midjourney in this build
  if (state.aiModel === "midjourney") {
    event.target.value = "";
    notify("Референсные изображения отключены для Midjourney", "warn");
    return;
  }

  state.referenceImages = [];
  const previews = $("imagePreviews");
  previews.innerHTML = "";

  files.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgData = { name: file.name, data: e.target.result, size: (file.size / 1024).toFixed(1) + " KB", description: "", width: 0, height: 0 };

      // Capture actual image dimensions
      const tempImg = new Image();
      tempImg.onload = () => {
        imgData.width = tempImg.naturalWidth;
        imgData.height = tempImg.naturalHeight;
      };
      tempImg.onerror = () => {
        console.warn(`Failed to load image dimensions for ${file.name}`);
      };
      tempImg.src = e.target.result;

      state.referenceImages.push(imgData);

      const card = document.createElement("div");
      card.className = "image-preview-card";
      imgData.extract = [];
      card.innerHTML = `
            <button class="image-remove-btn" data-remove-index="${index}">×</button>
            <div><img src="${e.target.result}" alt="${esc(file.name)}"></div>
            <div class="image-preview-details">
              <div class="image-preview-info">
                <div style="font-weight:800;color:var(--accent-light);margin-bottom:3px;">Изображение ${index + 1}</div>
                <div>${esc(file.name)} · ${esc(imgData.size)}</div>
              </div>
              <div class="ref-extract-row">
                ${REF_EXTRACT_OPTIONS.map((opt, oi) => `<label class="ref-extract-label"><input type="checkbox" data-ext-img="${index}" data-ext-opt="${oi}"> ${opt}</label>`).join("")}
              </div>
              <textarea class="image-description-input" data-desc-index="${index}" placeholder="Доп. описание: что именно взять..."></textarea>
            </div>`;
      // Wire extract checkboxes
      card.querySelectorAll('[data-ext-img]').forEach(cb => {
        cb.addEventListener('change', function () {
          const ii = parseInt(this.dataset.extImg, 10), oo = parseInt(this.dataset.extOpt, 10), opt = REF_EXTRACT_OPTIONS[oo];
          if (!state.referenceImages[ii]) return;
          if (!state.referenceImages[ii].extract) state.referenceImages[ii].extract = [];
          const ex = state.referenceImages[ii].extract;
          this.closest(".ref-extract-label").classList.toggle("ext-checked", this.checked);
          if (this.checked) { if (!ex.includes(opt)) ex.push(opt) } else { const i = ex.indexOf(opt); if (i >= 0) ex.splice(i, 1) }
          updateAll();
        });
      });
      previews.appendChild(card);

      card.querySelector(`[data-remove-index="${index}"]`).addEventListener("click", () => removeImage(index));
      card.querySelector(`[data-desc-index="${index}"]`).addEventListener("input", (ev) => {
        const i = parseInt(ev.target.dataset.descIndex, 10);
        if (state.referenceImages[i]) state.referenceImages[i].description = ev.target.value;
        updateAll();
      });

      $("imagePreviewContainer").style.display = "block";
      // Show reference controls for supported engines
      $("referenceOptions").style.display = "block";
      $("referenceWeight").style.display = ["stable-diffusion", "flux"].includes(state.aiModel) ? "block" : "none";
      updateAll();
    };
    reader.onerror = () => {
      notify(`Ошибка чтения файла ${file.name}`, "err");
    };
    reader.readAsDataURL(file);
  });
  notify(`Загружено ${files.length} файл(ов)`);
}

function removeImage(index) {
  state.referenceImages.splice(index, 1);
  if (!state.referenceImages.length) {
    $("imagePreviewContainer").style.display = "none";
    $("referenceOptions").style.display = "none";
    $("referenceWeight").style.display = "none";
    $("referenceImages").value = "";
    updateAll();
    return;
  }
  rebuildImageCards();
  updateAll();
}

function rebuildImageCards() {
  const previews = $("imagePreviews");
  previews.innerHTML = "";
  state.referenceImages.forEach((img, idx) => {
    const card = document.createElement("div");
    card.className = "image-preview-card";
    const extractChecks = REF_EXTRACT_OPTIONS.map((opt, oi) => {
      const checked = (img.extract || []).includes(opt) ? "checked" : "";
      return `<label class="ref-extract-label"><input type="checkbox" data-ext-img="${idx}" data-ext-opt="${oi}" ${checked}> ${opt}</label>`;
    }).join("");
    card.innerHTML = `
          <button class="image-remove-btn" data-remove-index="${idx}">×</button>
          <div><img src="${img.data}" alt="${esc(img.name)}"></div>
          <div class="image-preview-details">
            <div class="image-preview-info">
              <div style="font-weight:800;color:var(--accent-light);margin-bottom:3px;">Изображение ${idx + 1}</div>
              <div>${esc(img.name)} · ${esc(img.size)}</div>
            </div>
            <div class="ref-extract-row">${extractChecks}</div>
            <textarea class="image-description-input" data-desc-index="${idx}" placeholder="Что взять: палитру, позу, стиль, текстуру...">${esc(img.description || "")}</textarea>
          </div>`;
    previews.appendChild(card);
    // Wire extract checkboxes
    card.querySelectorAll('[data-ext-img]').forEach(cb => {
      cb.addEventListener('change', function () {
        const ii = parseInt(this.dataset.extImg, 10), oo = parseInt(this.dataset.extOpt, 10), opt = REF_EXTRACT_OPTIONS[oo];
        if (!state.referenceImages[ii]) return;
        if (!state.referenceImages[ii].extract) state.referenceImages[ii].extract = [];
        const ex = state.referenceImages[ii].extract;
        if (this.checked) { if (!ex.includes(opt)) ex.push(opt) } else { const i = ex.indexOf(opt); if (i >= 0) ex.splice(i, 1) }
        updateAll();
      });
    });
    card.querySelector(`[data-remove-index="${idx}"]`).addEventListener("click", () => removeImage(idx));
    card.querySelector(`[data-desc-index="${idx}"]`).addEventListener("input", (ev) => {
      const i = parseInt(ev.target.dataset.descIndex, 10);
      if (state.referenceImages[i]) state.referenceImages[i].description = ev.target.value;
      updateAll();
    });
  });
}

// =============================================
// NEGATIVES
// =============================================
function addNegative(text) {
  const f = $("negativePrompt");
  const cur = (f.value || "").trim();
  // Avoid duplicates
  const existing = cur.split(",").map(s => s.trim().toLowerCase());
  const newParts = text.split(",").map(s => s.trim()).filter(s => !existing.includes(s.toLowerCase()));
  if (!newParts.length) { notify("Уже добавлено", "warn"); return; }
  f.value = cur ? (cur + ", " + newParts.join(", ")) : newParts.join(", ");
  state.negativePrompt = f.value;
  updateAll();
}

// =============================================
// PROMPT FORMAT
// =============================================
function setPromptFormat(fmt) {
  state.promptFormat = fmt;
  document.querySelectorAll(".format-tab").forEach(t => {
    t.classList.toggle("active", t.dataset.format === fmt);
  });
  const labels = { flat: "Flat (Плоский)", structured: "Structured (Структурный)", midjourney: "Midjourney синтаксис" };
  $("promptFormatLabel").textContent = labels[fmt] || fmt;
  updateAll();
}


// ChatGPT Image: style descriptions without author names (content policy)
var CHATGPT_STYLE_MAP = {
  "in the style of Annie Leibovitz, dramatic portrait lighting, rich colors": "dramatic editorial portrait, rich warm saturated colors, deep shadows with golden highlights, intimate cinematic composition",
  "in the style of Peter Lindbergh, black and white, raw beauty, minimal retouching": "raw black-and-white portrait, unretouched natural beauty, high contrast silver gelatin aesthetic, emotional authenticity",
  "in the style of Steve McCurry, vivid saturated colors, documentary": "vivid hypersaturated documentary photograph, intense eye contact, Kodachrome warmth, National Geographic composition",
  "in the style of Helmut Newton, high contrast, provocative glamour, black and white": "high contrast glamour noir, provocative fashion pose, hard directional light, bold black-and-white with deep blacks",
  "in the style of Mario Testino, warm golden tones, glossy fashion": "warm golden fashion tones, sun-kisses glossy skin, aspirational luxury aesthetic, bright editorial warmth",
  "in the style of Tim Walker, surreal, fantastical, pastel dreamlike": "surreal fantastical set design, pastel dreamlike palette, whimsical oversized props, fairy-tale fashion fantasy",
  "in the style of Ansel Adams, high dynamic range landscape, deep blacks, zone system": "extreme tonal range landscape, pure black to bright white, zone-system exposure, majestic wilderness clarity",
  "in the style of Richard Avedon, stark white background, high contrast portrait": "stark pure white background, high contrast minimalist portrait, sharp focus on facial character, fashion-documentary hybrid",
  "in the style of Guy Bourdin, bold saturated colors, surreal fashion, strong shadows": "bold saturated pop colors, surreal fashion narrative, hard geometric shadows, provocative avant-garde composition",
  "in the style of Gregory Crewdson, cinematic suburban, eerie twilight, elaborate staged": "cinematic suburban tableau, eerie twilight atmosphere, elaborate staged scene, uncanny everyday mystery",
  "cinematography by Roger Deakins, naturalistic light, precise framing, atmospheric": "naturalistic motivated lighting, precise geometric framing, atmospheric haze, restrained palette with emotional depth",
  "cinematography by Emmanuel Lubezki, long takes, natural light, immersive": "pure natural light, immersive wide-angle perspective, ethereal luminosity, spiritual fluid movement feel",
  "cinematography by Hoyte van Hoytema, IMAX, desaturated palette, epic scale": "IMAX large-format clarity, desaturated cool palette, epic monumental scale, tactile film grain texture",
  "cinematography by Robert Richardson, high contrast, bold color, dynamic lighting": "aggressive high-contrast lighting, bold expressive color, dramatic rim lights, kinetic visual energy",
  "cinematography by Bradford Young, low-key lighting, rich shadows, warm undertones": "low-key intimate lighting, rich layered shadows, warm amber undertones, textured underexposed beauty",
  "cinematography by Janusz Kaminski, overexposed highlights, bleach bypass": "overexposed blown highlights, bleach bypass silver tones, diffused backlight halos, raw documentary feel",
  "cinematography by Vittorio Storaro, painterly light, rich color symbolism": "painterly Renaissance lighting, rich symbolic color storytelling, warm-to-cool emotional transitions, operatic grandeur",
  "cinematography by Greig Fraser, anamorphic, moody atmosphere, teal and orange": "anamorphic lens distortion, moody atmospheric haze, teal-and-orange grade, modern epic texture",
  "cinematography by Linus Sandgren, warm nostalgic tones, golden light, film grain": "warm nostalgic golden tones, classic Hollywood glamour, visible film grain, romantic soft focus",
  "cinematography by Ari Wegner, textured natural light, intimate framing, muted palette": "textured available-light naturalism, intimate observational framing, muted period-authentic palette",
  "directed by Denis Villeneuve, vast scale, muted desaturated palette, atmospheric silence, epic compositions": "vast monumental scale, muted desaturated palette, atmospheric silence and negative space, geometric epic compositions",
  "directed by Wes Anderson, symmetrical framing, pastel color palette, whimsical miniature aesthetic": "obsessively symmetrical framing, curated pastel palette, whimsical dollhouse aesthetic, centered compositions",
  "directed by Christopher Nolan, IMAX large format, desaturated blue tones, practical effects, epic scope": "IMAX large-format grandeur, desaturated cool blue tones, grounded practical realism, epic cerebral scope",
  "directed by David Fincher, dark muted palette, precise framing, cold blue-green tones, clinical aesthetic": "dark muted palette, mathematically precise framing, cold blue-green undertones, clinical sterile aesthetic",
  "directed by Ridley Scott, atmospheric haze, painterly compositions, epic historical grandeur": "atmospheric haze and smoke, painterly Renaissance compositions, epic historical grandeur, chiaroscuro depth",
  "directed by Quentin Tarantino, bold saturated colors, dynamic angles, retro grindhouse aesthetic": "bold oversaturated retro colors, dynamic low-angle shots, vintage grindhouse grain, pop-culture pastiche",
  "directed by Greta Gerwig, warm natural light, soft pastels, intimate handheld framing, nostalgic warmth": "warm natural window light, soft nostalgic pastels, intimate handheld framing, gentle feminine warmth",
  "directed by Jordan Peele, unsettling suburban beauty, vivid colors, horror tension, surreal undertones": "unsettling suburban uncanny beauty, vivid hyper-real colors, creeping horror tension, surreal social undertones",
  "directed by Bong Joon-ho, social contrast, sharp compositions, dark humor, class division visual metaphor": "sharp architectural compositions, visual class-division metaphors, dark satirical tone, spatial contrast storytelling",
  "directed by Chloe Zhao, golden hour landscapes, natural light, documentary intimacy, vast American West": "golden hour vast landscape, purely natural light, documentary intimate realism, poetic frontier beauty"
};
// =============================================
// BUILD PROMPT — FLAT (universal, recommended)
// =============================================
function buildFlatPrompt() {
  const headers = [];
  const parts = [];
  const effectiveAspectRatio = getEffectiveAspectRatio();
  const manualMode = !state.quickStyle && !state.fashionFoodStyle;
  const motionBlurTemplateMode = !!state.motionBlurMode;

  // 1. Headers (Metadata)
  // Aspect ratio & resolution — prepend as metadata tags
  if (effectiveAspectRatio) headers.push(`[Aspect: ${effectiveAspectRatio}]`);
  if (state.resolution) headers.push(`[Resolution: ${state.resolution}]`);

  // 2. Styles & Parameters
  // Skip quality keywords for MJ (uses --q parameter instead)
  if (state.quality && state.aiModel !== "midjourney") parts.push(state.quality);
  if (state.purpose) parts.push(state.purpose);

  // Format
  if (state.format) {
    // Skip "photorealistic" if purpose already implies it (Photography, Cinematic Still)
    const skipPhotoreal = state.format === "photorealistic" && ["Photography", "Cinematic Still", "Product Photography"].includes(state.purpose);
    if (!skipPhotoreal) parts.push(state.format);
  }

  // Medium (NEW)
  if (state.medium) parts.push(state.medium);

  // NOTE: Main Subject is handled separately below

  // FIX: Quick Style Overlay Logic
  // If Quick Style is active, ignore Camera, Lighting, and Materials
  if (manualMode) {
    // Camera
    if (!motionBlurTemplateMode) {
      if (state.cameraBody) parts.push(state.cameraBody);
      if (state.lens) parts.push(state.lens);
      if (state.focalLength) parts.push(state.focalLength);
      if (state.aperture) parts.push(state.aperture);
    }
    if (state.filmStock && FILM_STOCKS[state.filmStock]) parts.push(FILM_STOCKS[state.filmStock]);

    // Explicitly ignore Angle and Composition in G4 mode (variations handle this)
    if (!state.generateFourMode) {
      if (state.shotSize) parts.push(state.shotSize); // NEW
      if (state.angle) parts.push(state.angle);
      if (state.composition) parts.push(state.composition);
    }
    // Lighting
    getAllLightingSelections(state).forEach(l => parts.push(l));
    if (state.colorPalette) parts.push(state.colorPalette);
    if (state.mood) parts.push(state.mood + " atmosphere"); // NEW

    // Skin
    state.skinDetail.forEach(s => parts.push(s));
    state.hairDetail.forEach(h => parts.push(h));

    // Materials
    state.material.forEach(m => parts.push(m));
  } else {
    // Quick Style active: Allow only limited modifiers or let the style dominate
    // We might want to allow Composition/Angle if strictly needed, but per rule 18 they should be disabled.
    // We'll trust the conflict rule 18 disabling logic, but this double-check ensures clean prompts.
  }

  // Text
  if (state.textContent) parts.push(`text "${state.textContent}"`);
  state.typography.forEach(t => parts.push(t));

  // Modes
  // Styles — ChatGPT: swap author names for descriptions
  var _cg = state.aiModel === "chatgpt-image";
  if (manualMode) {
    if (state.photoStyle) parts.push(_cg ? (CHATGPT_STYLE_MAP[state.photoStyle] || state.photoStyle) : state.photoStyle);
    if (state.cinemaStyle) parts.push(_cg ? (CHATGPT_STYLE_MAP[state.cinemaStyle] || state.cinemaStyle) : state.cinemaStyle);
    if (state.directorStyle) parts.push(_cg ? (CHATGPT_STYLE_MAP[state.directorStyle] || state.directorStyle) : state.directorStyle);
    if (state.artStyle && window.ART_STYLES_MAP && window.ART_STYLES_MAP[state.artStyle]) parts.push(window.ART_STYLES_MAP[state.artStyle]);
  }

  // Quick Style Preset
  if (state.quickStyle && QUICK_STYLES[state.quickStyle]) parts.push(QUICK_STYLES[state.quickStyle]);
  // Fashion & Food Style
  if (state.fashionFoodStyle && FASHION_FOOD_STYLES[state.fashionFoodStyle]) parts.push(FASHION_FOOD_STYLES[state.fashionFoodStyle]);

  // FIX: Cinematic Presets
  if (state.cinematicPreset && window.CINEMATIC_PRESETS_MAP && window.CINEMATIC_PRESETS_MAP[state.cinematicPreset]) parts.push(window.CINEMATIC_PRESETS_MAP[state.cinematicPreset]);

  // FIX: Audio — Ambience, Foley, Cinematic FX
  if (state.ambience && typeof AMBIENCE !== 'undefined' && AMBIENCE[state.ambience]) parts.push(AMBIENCE[state.ambience]);
  if (state.foley && typeof FOLEY !== 'undefined' && FOLEY[state.foley]) parts.push(FOLEY[state.foley]);
  if (state.cinematicFx && typeof CINE_FX !== 'undefined' && CINE_FX[state.cinematicFx]) parts.push(CINE_FX[state.cinematicFx]);

  // Special modes
  if (state.beforeAfter) parts.push("before and after side-by-side comparison");
  if (state.seamlessPattern) parts.push("seamless tileable pattern");
  // Seed is passed as parameter, not in prompt text

  // 3. Construct Final String
  // For Generate 4 and Motion Blur modes we avoid injecting the generic default line.
  let finalPrompt = (state.generateFourMode || state.motionBlurMode) ? "" : "Generate an image.\n";

  // Add Headers
  if (headers.length > 0) finalPrompt += headers.join(", ") + "\n";

  // Add Subject (on new line with prefix)
  if (state.mainSubject && state.mainSubject.trim()) {
    finalPrompt += `subject: ${state.mainSubject.trim()}\n`;
  }

  // EMOTION
  if (state.emotion && EMOTIONS[state.emotion]) {
    finalPrompt += `${state.emotion.toLowerCase()} expression: ${EMOTIONS[state.emotion]}\n`;
  }

  const modifiers = parts.filter(Boolean).join(", ");
  if (modifiers) finalPrompt += modifiers;

  if (state.motionBlurMode) {
    const motionBlurBlock = buildMotionBlurFlatBlock();
    if (motionBlurBlock) {
      finalPrompt = finalPrompt.trim();
      finalPrompt += (finalPrompt ? "\n\n" : "") + motionBlurBlock;
    }
  }

  // References note (not part of actual prompt, but informational)
  let refs = "";
  if (state.referenceImages.length) {
    refs += "\n\n--- Reference images ---\n";
    refs += `${state.referenceImages.length} image(s), weight: ${state.referenceWeight}%`;
    if (state.referenceType) refs += `, type: ${state.referenceType}`;
    state.referenceImages.forEach((img, i) => {
      if ((img.description || "").trim()) refs += `\nImage ${i + 1}: ${img.description.trim()}`;
    });
  }

  const flatText = (finalPrompt + refs).trim();
  if (flatText) return flatText;
  return (state.generateFourMode || state.motionBlurMode) ? "" : "Select parameters on the left...";
}

// =============================================
// BUILD PROMPT — STRUCTURED
// =============================================
function buildStructuredPrompt() {
  let out = "";
  const effectiveAspectRatio = getEffectiveAspectRatio();
  const manualMode = !state.quickStyle && !state.fashionFoodStyle;

  if (state.aiModel) out += `[Model: ${state.aiModel}]\n`;
  if (effectiveAspectRatio) out += `[Aspect: ${effectiveAspectRatio}]`;
  if (state.resolution) out += ` [Resolution: ${state.resolution}]`;
  if (effectiveAspectRatio || state.resolution) out += "\n";
  out += "\n";

  // Main prompt
  const parts = [];
  if (state.quality && state.aiModel !== "midjourney") parts.push(state.quality);
  if (state.purpose) parts.push(state.purpose);

  if (state.format && !(state.format === "photorealistic" && ["Photography", "Cinematic Still", "Product Photography"].includes(state.purpose))) parts.push(state.format);

  if (state.medium) parts.push(state.medium); // NEW

  if (state.mainSubject) parts.push(state.mainSubject.trim());
  if (state.emotion) parts.push(`EMOTION: ${EMOTIONS[state.emotion]}`);
  out += parts.filter(Boolean).join(", ") + "\n\n";

  // Camera
  if (manualMode) { // Ignore manual camera/light/style inputs when preset mode is active
    if (state.cameraBody || state.lens || state.aperture || state.angle || state.composition || state.shotSize) {
      out += "CAMERA: ";
      const cam = [];
      if (state.cameraBody) cam.push(state.cameraBody);
      if (state.lens) cam.push(state.lens);
      if (state.shotSize) cam.push(state.shotSize); // NEW
      if (state.focalLength) cam.push(state.focalLength);
      if (state.aperture) cam.push(state.aperture);
      if (state.angle) cam.push(state.angle);
      if (state.composition) cam.push(state.composition);
      out += cam.join(", ") + "\n";
    }

    // Lighting
    const lightParts = getAllLightingSelections(state);
    if (lightParts.length) out += "LIGHTING: " + lightParts.join(", ") + "\n";

    if (state.lightFX.length) out += "EFFECTS: " + state.lightFX.join(", ") + "\n";
    if (state.colorPalette) out += "PALETTE: " + state.colorPalette + "\n";
    if (state.mood) out += "MOOD: " + state.mood + "\n"; // NEW

    if (state.skinDetail.length) out += "SKIN: " + state.skinDetail.join(", ") + "\n";
    if (state.hairDetail.length) out += "HAIR: " + state.hairDetail.join(", ") + "\n";
    if (state.material.length) out += "MATERIALS: " + state.material.join(", ") + "\n";
  }

  if (state.textContent) {
    out += `TEXT: "${state.textContent}"`;
    if (state.typography.length) out += ` [${state.typography.join(", ")}]`;
    out += "\n";
  }

  // Modes
  var _cgs = state.aiModel === "chatgpt-image";
  if (manualMode) {
    if (state.photoStyle) out += "STYLE: " + (_cgs ? (CHATGPT_STYLE_MAP[state.photoStyle] || state.photoStyle) : state.photoStyle) + "\n";
    if (state.cinemaStyle) out += "CINEMATOGRAPHY: " + (_cgs ? (CHATGPT_STYLE_MAP[state.cinemaStyle] || state.cinemaStyle) : state.cinemaStyle) + "\n";
    if (state.directorStyle) out += "DIRECTOR: " + (_cgs ? (CHATGPT_STYLE_MAP[state.directorStyle] || state.directorStyle) : state.directorStyle) + "\n";
    if (state.artStyle && window.ART_STYLES_MAP && window.ART_STYLES_MAP[state.artStyle]) out += "ART STYLE: " + window.ART_STYLES_MAP[state.artStyle] + "\n";
  }
  if (state.quickStyle && QUICK_STYLES[state.quickStyle]) out += "STYLE PRESET: " + QUICK_STYLES[state.quickStyle] + "\n";
  if (state.fashionFoodStyle && FASHION_FOOD_STYLES[state.fashionFoodStyle]) out += "FASHION/FOOD STYLE: " + FASHION_FOOD_STYLES[state.fashionFoodStyle] + "\n";
  // FIX: Cinematic Preset
  if (state.cinematicPreset && window.CINEMATIC_PRESETS_MAP && window.CINEMATIC_PRESETS_MAP[state.cinematicPreset]) out += "CINEMATIC STYLE: " + window.CINEMATIC_PRESETS_MAP[state.cinematicPreset] + "\n";
  // FIX: Film Stock (was missing from structured format)
  if (manualMode && state.filmStock && FILM_STOCKS[state.filmStock]) out += "FILM STOCK: " + FILM_STOCKS[state.filmStock] + "\n";
  // FIX: Audio layers
  if (state.ambience && typeof AMBIENCE !== 'undefined' && AMBIENCE[state.ambience]) out += "AMBIENCE: " + AMBIENCE[state.ambience] + "\n";
  if (state.foley && typeof FOLEY !== 'undefined' && FOLEY[state.foley]) out += "FOLEY: " + FOLEY[state.foley] + "\n";
  if (state.cinematicFx && typeof CINE_FX !== 'undefined' && CINE_FX[state.cinematicFx]) out += "CINEMATIC FX: " + CINE_FX[state.cinematicFx] + "\n";
  const modes = [];
  if (state.generateFourMode) modes.push("Generate 4 Variations");
  if (state.beforeAfter) modes.push("before/after");
  if (state.seamlessPattern) modes.push("seamless pattern");
  if (modes.length) out += "MODES: " + modes.join(", ") + "\n";
  if (state.seed) out += "SEED: " + state.seed + "\n";
  // Engine-specific params
  if (state.aiModel === "stable-diffusion") {
    out += `CFG: ${state.sdCfg} | Steps: ${state.sdSteps}\n`;
  }
  if (state.aiModel === "flux") {
    out += `Model: flux-${state.fluxModel} | Guidance: ${state.fluxGuidance} | Steps: ${state.fluxSteps}\n`;
  }
  if (state.aiModel === "dall-e-3") {
    out += `Style: ${state.dalleStyle} | Quality: ${state.dalleQuality}\n`;
  }

  // References
  if (state.referenceImages.length) {
    out += "\n--- REFERENCES ---\n";
    out += `Images: ${state.referenceImages.length}, Weight: ${state.referenceWeight}%`;
    if (state.referenceType) out += `, Type: ${state.referenceType}`;
    out += "\n";
    state.referenceImages.forEach((img, i) => {
      if ((img.description || "").trim()) out += `  #${i + 1}: ${img.description.trim()}\n`;
    });
  }

  return out.trim() || "Select parameters on the left...";
}

// =============================================
// BUILD PROMPT — MIDJOURNEY V7
// =============================================
function buildMidjourneyPrompt() {
  // MJ V7 best practice: natural language scene description, no quality spam
  // Structure: [scene/subject], [style cues], [technical], --params
  const desc = [];
  const manualMode = !state.quickStyle && !state.fashionFoodStyle;

  // Core scene
  if (state.mainSubject) desc.push(state.mainSubject.trim());
  if (state.emotion && EMOTIONS[state.emotion]) desc.push(EMOTIONS[state.emotion]);

  // Format/style (only if NOT photorealistic — MJ defaults to photo)
  if (state.format && state.format !== "photorealistic") desc.push(state.format);

  if (state.medium) desc.push(state.medium); // NEW

  if (manualMode) {
    // Camera cues (MJ understands camera language well)
    if (state.cameraBody) {
      // Strip "shot on " prefix for cleaner MJ syntax
      desc.push(state.cameraBody.replace(/^shot on\s*/i, ""));
    }
    if (state.lens) desc.push(state.lens);
    if (state.shotSize) desc.push(state.shotSize);
    if (state.focalLength) desc.push(state.focalLength);
    if (state.aperture) {
      // Extract just f-number for MJ
      const fMatch = state.aperture.match(/f\/[\d.]+/);
      if (fMatch) desc.push(fMatch[0]);
    }
    if (state.filmStock && FILM_STOCKS[state.filmStock]) desc.push(FILM_STOCKS[state.filmStock]);
    if (state.angle) desc.push(state.angle);
    if (state.composition) desc.push(state.composition);

    // Lighting
    getAllLightingSelections(state).forEach(l => desc.push(l));

    // Light FX (MJ handles these well)
    state.lightFX.forEach(fx => desc.push(fx));
    if (state.colorPalette) desc.push(state.colorPalette);
    if (state.mood) desc.push("Mood: " + state.mood);

    // Materials & textures (compact)
    state.skinDetail.forEach(s => desc.push(s));
    state.hairDetail.forEach(h => desc.push(h));
    state.material.forEach(m => desc.push(m));
  }

  // Text in image
  if (state.textContent) desc.push(`"${state.textContent}"`);
  state.typography.forEach(t => desc.push(t));

  // Artistic styles
  if (manualMode) {
    if (state.photoStyle) desc.push(state.photoStyle);
    if (state.cinemaStyle) desc.push(state.cinemaStyle);
    if (state.directorStyle) desc.push(state.directorStyle);
    if (state.artStyle && window.ART_STYLES_MAP && window.ART_STYLES_MAP[state.artStyle]) desc.push(window.ART_STYLES_MAP[state.artStyle]);
  }
  if (state.quickStyle && QUICK_STYLES[state.quickStyle]) desc.push(QUICK_STYLES[state.quickStyle]);
  if (state.fashionFoodStyle && FASHION_FOOD_STYLES[state.fashionFoodStyle]) desc.push(FASHION_FOOD_STYLES[state.fashionFoodStyle]);

  // FIX: Cinematic Preset
  if (state.cinematicPreset && window.CINEMATIC_PRESETS_MAP && window.CINEMATIC_PRESETS_MAP[state.cinematicPreset]) desc.push(window.CINEMATIC_PRESETS_MAP[state.cinematicPreset]);

  // FIX: Audio (for video-gen models)
  if (state.ambience && typeof AMBIENCE !== 'undefined' && AMBIENCE[state.ambience]) desc.push(AMBIENCE[state.ambience]);
  if (state.foley && typeof FOLEY !== 'undefined' && FOLEY[state.foley]) desc.push(FOLEY[state.foley]);
  if (state.cinematicFx && typeof CINE_FX !== 'undefined' && CINE_FX[state.cinematicFx]) desc.push(CINE_FX[state.cinematicFx]);

  // Purpose as style hint
  if (state.purpose && state.purpose !== "Photography") desc.push(state.purpose);

  // Special modes
  if (state.beforeAfter) desc.push("before and after comparison");
  if (state.seamlessPattern) desc.push("seamless pattern");

  // Build prompt — comma separated, clean
  let prompt = desc.filter(Boolean).join(", ");
  // Clean: remove double commas, trim
  prompt = prompt.replace(/,\s*,/g, ",").replace(/,\s*$/, "").trim();

  // === MJ PARAMETERS ===
  const params = [];
  const effectiveAspectRatio = getEffectiveAspectRatio();

  // AR
  if (effectiveAspectRatio) params.push(`--ar ${effectiveAspectRatio}`);

  // Quality
  if (state.quality && state.quality.includes("8k")) params.push("--q 1");

  // Stylize
  params.push(`--s ${state.mjStylize}`);

  // Chaos
  if (state.mjChaos > 0) params.push(`--chaos ${state.mjChaos}`);

  // Weird
  if (state.mjWeird > 0) params.push(`--weird ${state.mjWeird}`);

  // Style reference
  const mjSref = (state.mjSref || "").trim();
  if (mjSref) params.push(`--sref ${mjSref}`);

  // Style raw
  if (state.mjStyle === "raw") params.push("--style raw");

  // Version
  params.push(`--v ${state.mjVersion}`);

  // Tile for seamless
  if (state.seamlessPattern) params.push("--tile");

  // Seed
  if (state.seed) params.push("--seed " + state.seed);

  if (params.length) prompt += " " + params.join(" ");

  // FIX: Removed image URL appending as per user request (Manual Upload workflow)

  return prompt.trim() || "Select parameters on the left...";
}

// =============================================
// BUILD JSON
// =============================================
function buildPromptTextForOutput(options) {
  const opts = options || {};
  const includeRenderBoostInPrompt = opts.includeRenderBoostInPrompt !== false;
  let promptText;
  if (state.promptFormat === "midjourney") promptText = buildMidjourneyPrompt();
  else if (state.promptFormat === "structured") promptText = buildStructuredPrompt();
  else promptText = buildFlatPrompt();
  const isNBP = isNBPModel(state.aiModel);

  // === RENDER BOOST CONFIGS — append after main prompt ===
  if (includeRenderBoostInPrompt && state.skinRenderBoost) {
    const skinRenderBlock = state.promptFormat === "flat" ? SKIN_RENDER_CONFIG_FLAT : SKIN_RENDER_CONFIG;
    promptText += "\n\n" + skinRenderBlock;
  }
  if (includeRenderBoostInPrompt && state.hairRenderBoost) {
    const hairRenderBlock = state.promptFormat === "flat" ? HAIR_RENDER_CONFIG_FLAT : HAIR_RENDER_CONFIG;
    promptText += "\n\n" + hairRenderBlock;
  }

  // Max Consistency — prepend identity lock protocol
  if (state.maxConsistency) {
    const consistencyPrefix = state.promptFormat === "flat" ? MAX_CONSISTENCY_PREFIX_FLAT : MAX_CONSISTENCY_PREFIX;
    promptText = consistencyPrefix + "\n" + promptText;
    if (state.aiModel === "midjourney") {
      promptText = promptText.trimEnd() + " --cw 100";
    }
  }

  // 3x3 Contact Sheet
  if (state.grid3x3Mode) {
    if (state.promptFormat === "structured") {
      promptText = build3x3ForNBP(promptText);
    } else {
      promptText = build3x3FlatForNBP(promptText);
    }
  }

  // Generate 4 — dynamic block based on selected model
  if (state.generateFourMode) {
    if (isNBP) {
      // NBP: JSON when structured, flat block otherwise
      if (state.promptFormat === "structured") {
        promptText = buildG4ForNBP(promptText);
      } else {
        promptText = buildG4FlatForNBP(promptText);
      }
    } else {
      // Standard legacy block for other models
      let g4block = GENERATE_FOUR_PREFIX;
      if (state.mainSubject && state.mainSubject.trim()) {
        g4block = g4block.replace(/of a subject/g, "of " + state.mainSubject.trim());
        g4block = g4block.replace(/the Subject/g, state.mainSubject.trim());
      }

      // Reference AR logic
      if (state.referenceImages.length && state.referenceImages[0].width && state.referenceImages[0].height) {
        const w = state.referenceImages[0].width;
        const h = state.referenceImages[0].height;
        const ratio = w / h;
        const standardARs = [
          { label: "1:1", val: 1 }, { label: "16:9", val: 16 / 9 }, { label: "21:9", val: 21 / 9 }, { label: "2:3", val: 2 / 3 }, { label: "9:16", val: 9 / 16 }
        ];
        let closest = standardARs[0];
        let minDiff = Math.abs(ratio - closest.val);
        for (const ar of standardARs) {
          const diff = Math.abs(ratio - ar.val);
          if (diff < minDiff) { minDiff = diff; closest = ar; }
        }
        const refAR = closest.label;
        if (refAR !== "21:9") {
          g4block = g4block.replace(/"aspect_ratio": "21:9"/g, '"aspect_ratio": "' + refAR + '"');
          g4block = g4block.replace(/in a 21:9 format/g, "in a " + refAR + " format");
        }
      }
      promptText = g4block + "\n\n" + promptText;
    }
  }

  // Keep NEGATIVE as the last block (skip for NBP JSON-like wrappers)
  const isNBPWrapperMode = isNBP && (state.generateFourMode || state.grid3x3Mode);
  if (!isNBPWrapperMode) {
    promptText = appendNegativeLast(promptText);
  }

  return promptText;
}

function normalizeNBPResolution(rawResolution, qualityHint) {
  const raw = String(rawResolution || "").trim().toLowerCase();
  if (raw === "1k" || raw === "2k" || raw === "4k") return raw.toUpperCase();
  if (!raw && state.quickStyle) return "4K";

  const dims = raw.match(/(\d+)\s*[x×]\s*(\d+)/);
  if (dims) {
    const width = Number(dims[1]);
    const height = Number(dims[2]);
    const maxSide = Math.max(width, height);
    if (maxSide >= 3800) return "4K";
    if (maxSide >= 1900) return "2K";
    return "1K";
  }

  const q = String(qualityHint || "").toLowerCase();
  if (q.includes("8k") || q.includes("ultra")) return "4K";
  if (q.includes("4k") || q.includes("uhd")) return "4K";
  if (q.includes("2k")) return "2K";
  if (state.quickStyle) return "4K";
  return "1K";
}

function normalizeNBPAspectRatio(rawAspectRatio) {
  const ar = String(rawAspectRatio || "").trim();
  return NBP_ALLOWED_ASPECT_RATIOS.has(ar) ? ar : "1:1";
}

function pruneEmptyFields(value) {
  if (value === null || value === undefined) return undefined;
  if (value === false) return undefined;

  if (typeof value === "string") {
    return value.trim() === "" ? undefined : value;
  }

  if (Array.isArray(value)) {
    const arr = value.map(pruneEmptyFields).filter(v => v !== undefined);
    return arr.length ? arr : undefined;
  }

  if (typeof value === "object") {
    const out = {};
    Object.keys(value).forEach((k) => {
      const pruned = pruneEmptyFields(value[k]);
      if (pruned !== undefined) out[k] = pruned;
    });
    return Object.keys(out).length ? out : undefined;
  }

  return value;
}

function collectNBPImageUrls() {
  const urls = [];
  (state.referenceImages || []).forEach((img) => {
    const candidate = (img && (img.url || img.src || img.uri || img.link || img.data)) || "";
    if (typeof candidate === "string" && (/^https?:\/\//i.test(candidate) || /^data:image\//i.test(candidate))) {
      urls.push(candidate);
    }
  });
  return urls;
}

function resolveUserNumImages() {
  const candidates = [state.numImages, state.num_images, state.nbpNumImages];
  for (const value of candidates) {
    if (value === null || value === undefined) continue;
    const raw = String(value).trim();
    if (!raw) continue;
    if (!/^\d+$/.test(raw)) continue;
    const parsed = Number(raw);
    if (Number.isInteger(parsed) && parsed > 0) return parsed;
  }
  return undefined;
}

function buildNBPRequestPayload() {
  const outputPrompt = (buildPromptTextForOutput({ includeRenderBoostInPrompt: false }) || "").trim();
  const fallbackPrompt = (state.mainSubject || "").trim() || (state.generateFourMode ? "" : "Generate an image.");
  const promptRaw = outputPrompt && !outputPrompt.includes("Select parameters on the left") ? outputPrompt : fallbackPrompt;
  const prompt = promptRaw.replace(/\r?\n+/g, " ").replace(/\s{2,}/g, " ").trim();

  const imageUrls = collectNBPImageUrls();
  const nbpAspectRatio = state.grid3x3Mode ? undefined : normalizeNBPAspectRatio(getEffectiveAspectRatio());
  const payload = {
    model: "nano-banana-pro",
    type: imageUrls.length ? "image-to-image" : "text-to-image",
    prompt: prompt,
    resolution: normalizeNBPResolution(state.resolution, state.quality)
  };

  if (nbpAspectRatio) {
    payload.aspect_ratio = nbpAspectRatio;
  }

  if (imageUrls.length) {
    payload.image_urls = imageUrls;
  }

  const userNumImages = resolveUserNumImages();
  if (userNumImages !== undefined) {
    payload.num_images = userNumImages;
  }

  if (state.maxConsistency) {
    payload.face_constraints = MAX_CONSISTENCY_FACE_CONSTRAINTS.slice();
  }

  const renderBoost = buildRenderBoostPayload();
  if (renderBoost) {
    payload.renderBoost = renderBoost;
  }

  return payload;
}

function collectAdditional3x3Selections() {
  const handledKeys = new Set([
    "aiModel", "mainSubject", "aspectRatio", "resolution",
    "purpose", "format", "medium", "mood",
    "cameraBody", "lens", "shotSize", "focalLength", "aperture", "angle", "composition",
    "lighting", "lightType", "lightFX", "colorPalette",
    "skinDetail", "hairDetail", "material", "typography",
    "textContent", "quality",
    "photoStyle", "cinemaStyle", "directorStyle", "artStyle", "filmStock",
    "quickStyle", "fashionFoodStyle", "emotion",
    "cinematicPreset", "ambience", "foley", "cinematicFx",
    "generateFourMode", "grid3x3Mode", "maxConsistency", "beforeAfter", "seamlessPattern",
    "skinRenderBoost", "hairRenderBoost",
    "motionBlurMode", "motionBlurBackgroundEnabled", "motionBlurForegroundEnabled", "motionBlurCharacter", "motionBlurLocation", "motionBlurBackground", "motionBlurForeground",
    "seed", "negativePrompt",
    "referenceType", "referenceWeight", "referenceImages",
    "mjVersion", "mjStyle", "mjStylize", "mjChaos", "mjWeird", "mjSref",
    "sdCfg", "sdSteps",
    "fluxModel", "fluxGuidance", "fluxSteps",
    "dalleStyle", "dalleQuality",
    "numImages", "num_images", "nbpNumImages"
  ]);

  const internalKeys = new Set(["aiProvider", "apiKey", "promptFormat", "isStandardPresetActive"]);
  const extras = {};

  Object.keys(state).forEach((key) => {
    if (handledKeys.has(key) || internalKeys.has(key)) return;
    const pruned = pruneEmptyFields(state[key]);
    if (pruned !== undefined) extras[key] = pruned;
  });

  return Object.keys(extras).length ? extras : undefined;
}

function buildJson() {
  const engineParams = (function () {
    const m = state.aiModel;
    if (m === "midjourney") return { version: state.mjVersion, style: state.mjStyle || "default", stylize: state.mjStylize, chaos: state.mjChaos, weird: state.mjWeird, sref: (state.mjSref || "").trim() || undefined };
    if (m === "stable-diffusion") return { cfg_scale: state.sdCfg, steps: state.sdSteps };
    if (m === "flux") return { model: "flux-" + state.fluxModel, guidance: state.fluxGuidance, steps: state.fluxSteps };
    if (m === "dall-e-3") return { style: state.dalleStyle, quality: state.dalleQuality };
    return undefined;
  })();

  const referencesPayload = {
    type: state.referenceType || undefined,
    weight: ["stable-diffusion", "flux"].includes(state.aiModel) ? state.referenceWeight : undefined,
    images: (state.referenceImages || []).map((img, i) => ({
      name: img.name,
      size: img.size,
      description: img.description || "",
      extract: img.extract || [],
      role: state.aiModel === "midjourney" ? (i === 0 ? "omni-reference" : "style-reference") : undefined
    }))
  };

  if (state.grid3x3Mode) {
    let base3x3;
    try {
      base3x3 = JSON.parse(build3x3ForNBP(""));
    } catch (_e) {
      base3x3 = {};
    }
    const additionalSelections = collectAdditional3x3Selections();

    const selectedOptions = {
      model: state.aiModel || undefined,
      subject: state.mainSubject || undefined,
      technical: {
        aspect_ratio: getEffectiveAspectRatio() || undefined,
        resolution: state.resolution || undefined
      },
      parameters: {
        purpose: state.purpose || undefined,
        format: state.format || undefined,
        medium: state.medium || undefined,
        mood: state.mood || undefined,
        camera: {
          body: state.cameraBody || undefined,
          lens: state.lens || undefined,
          shot_size: state.shotSize || undefined,
          focal_length: state.focalLength || undefined,
          aperture: state.aperture || undefined,
          angle: state.angle || undefined,
          composition: state.composition || undefined
        },
        lighting: {
          options: (state.lighting && state.lighting.length) ? state.lighting : undefined,
          effects: (state.lightFX && state.lightFX.length) ? state.lightFX : undefined,
          palette: state.colorPalette || undefined
        },
        light_type: state.lightType || undefined,
        materials: {
          skin: state.skinDetail || undefined,
          hair: state.hairDetail || undefined,
          objects: state.material || undefined
        },
        typography: (state.typography && state.typography.length) ? state.typography : undefined,
        text: state.textContent ? { content: state.textContent, style: state.typography || undefined } : undefined,
        quality: state.quality || undefined,
        photo_style: state.photoStyle || undefined,
        cinema_style: state.cinemaStyle || undefined,
        director_style: state.directorStyle || undefined,
        art_style: state.artStyle || undefined,
        film_stock: state.filmStock || undefined,
        quick_style: state.quickStyle || undefined,
        fashion_food_style: state.fashionFoodStyle || undefined,
        emotion: state.emotion || undefined,
        cinematic_preset: state.cinematicPreset || undefined,
        audio: {
          ambience: state.ambience || undefined,
          foley: state.foley || undefined,
          cinematic_fx: state.cinematicFx || undefined
        },
        motion_blur: state.motionBlurMode
          ? {
            enabled: true,
            background_enabled: state.motionBlurBackgroundEnabled ? true : undefined,
            foreground_enabled: state.motionBlurForegroundEnabled ? true : undefined,
            character: (state.motionBlurCharacter || "").trim() || undefined,
            location: (state.motionBlurLocation || "").trim() || undefined,
            blur: state.motionBlurBackgroundEnabled ? ((state.motionBlurBackground || "").trim() || undefined) : undefined,
            foreground: state.motionBlurForegroundEnabled ? ((state.motionBlurForeground || "").trim() || undefined) : undefined
          }
          : undefined,
        additional_selected_options: additionalSelections
      },
      modes: {
        grid3x3: true,
        generateFour: state.generateFourMode ? true : undefined,
        maxConsistency: state.maxConsistency ? true : undefined,
        before_after: state.beforeAfter ? true : undefined,
        seamless_pattern: state.seamlessPattern ? true : undefined,
        motion_blur: state.motionBlurMode ? true : undefined
      },
      renderBoost: buildRenderBoostPayload(),
      face_constraints: state.maxConsistency ? MAX_CONSISTENCY_FACE_CONSTRAINTS.slice() : undefined,
      seed: state.seed || undefined,
      engine_params: engineParams,
      references: referencesPayload,
      negative: (state.negativePrompt || "").trim() || undefined
    };

    return Object.assign({}, base3x3, pruneEmptyFields(selectedOptions) || {});
  }

  // Quick style mode defaults to NBP payload even when model is not selected explicitly.
  if (state.quickStyle && !state.aiModel) {
    return buildNBPRequestPayload();
  }

  if (state.aiModel === "nano-banana-pro") {
    return buildNBPRequestPayload();
  }

  const effectiveAspectRatio = getEffectiveAspectRatio();
  const payload = {
    schema: "vpe-prompt-builder-v2",
    model: state.aiModel || null,
    subject: state.mainSubject || "",
    prompt_flat: buildFlatPrompt(),
    prompt_midjourney: state.aiModel === "midjourney" ? buildMidjourneyPrompt() : undefined,
    technical: {
      aspect_ratio: effectiveAspectRatio || null,
      resolution: state.resolution || null
    },
    parameters: {
      purpose: state.purpose || null,
      format: state.format || null,
      medium: state.medium || null,
      mood: state.mood || null,
      camera: {
        body: state.motionBlurMode ? null : (state.cameraBody || null),
        lens: state.motionBlurMode ? null : (state.lens || null),
        shot_size: state.shotSize || null,
        focal_length: state.motionBlurMode ? null : (state.focalLength || null),
        aperture: state.motionBlurMode ? null : (state.aperture || null),
        angle: state.angle || null,
        composition: state.composition || null
      },
      lighting: {
        options: state.lighting,
        effects: state.lightFX || [],
        palette: state.colorPalette || null
      },
      light_type: state.lightType || null,
      materials: { skin: state.skinDetail, hair: state.hairDetail, objects: state.material },
      text: state.textContent ? { content: state.textContent, style: state.typography } : null,
      quality: state.quality || null,
      photo_style: state.photoStyle || null,
      cinema_style: state.cinemaStyle || null,
      director_style: state.directorStyle || null,
      art_style: state.artStyle || null,
      film_stock: state.filmStock || null,
      quick_style: state.quickStyle || null,
      fashion_food_style: state.fashionFoodStyle || null,
      emotion: state.emotion || null,
      cinematic_preset: state.cinematicPreset || null,
      audio: {
        ambience: state.ambience || null,
        foley: state.foley || null,
        cinematic_fx: state.cinematicFx || null
      },
      motion_blur: state.motionBlurMode
        ? {
          enabled: true,
          background_enabled: state.motionBlurBackgroundEnabled ? true : undefined,
          foreground_enabled: state.motionBlurForegroundEnabled ? true : undefined,
          character: (state.motionBlurCharacter || "").trim() || undefined,
          location: (state.motionBlurLocation || "").trim() || undefined,
          blur: state.motionBlurBackgroundEnabled ? ((state.motionBlurBackground || "").trim() || undefined) : undefined,
          foreground: state.motionBlurForegroundEnabled ? ((state.motionBlurForeground || "").trim() || undefined) : undefined
        }
        : undefined
    },
    modes: { generateFour: state.generateFourMode, grid3x3: state.grid3x3Mode, maxConsistency: state.maxConsistency, before_after: state.beforeAfter, seamless_pattern: state.seamlessPattern, motion_blur: state.motionBlurMode },
    renderBoost: buildRenderBoostPayload() || null,
    face_constraints: state.maxConsistency ? MAX_CONSISTENCY_FACE_CONSTRAINTS.slice() : undefined,
    seed: state.seed || null,
    engine_params: engineParams || null,
    references: {
      type: state.referenceType || null,
      weight: ["stable-diffusion", "flux"].includes(state.aiModel) ? state.referenceWeight : undefined,
      images: (state.referenceImages || []).map((img, i) => ({
        name: img.name, size: img.size, description: img.description || "", extract: img.extract || [],
        role: state.aiModel === "midjourney" ? (i === 0 ? "omni-reference" : "style-reference") : undefined
      }))
    },
    negative: (state.negativePrompt || "").trim() || ""
  };

  return pruneEmptyFields(payload) || {};
}

// =============================================
// ACTIVE TAGS
// =============================================
function updateActiveTags() {
  const area = $("activeTags");
  area.innerHTML = "";

  const addTag = (label, value, type, onRemove) => {
    const tag = document.createElement("span");
    tag.className = `tag-item ${type || ""}`.trim();
    tag.innerHTML = `<span>${esc(label)}: <b>${esc(value)}</b></span><span class="remove">×</span>`;
    tag.querySelector(".remove").addEventListener("click", onRemove);
    area.appendChild(tag);
  };

  // Singles
  // Singles
  ["aiModel", "cameraBody", "aspectRatio", "resolution", "purpose", "format", "medium", "lens", "shotSize", "focalLength", "aperture", "angle", "composition", "quality", "colorPalette", "mood", "referenceType", "photoStyle", "cinemaStyle", "directorStyle", "artStyle", "filmStock", "quickStyle", "fashionFoodStyle", "emotion", "cinematicPreset", "ambience", "foley", "cinematicFx", "lightType"].forEach(k => {
    if (state[k]) {
      addTag(k, state[k], "", () => {
        state[k] = "";
        syncGroup(k);
        if (k === "aspectRatio") { state.resolution = ""; rebuildResolution(); syncGroup("resolution"); }
        if (k === "aiModel") updateModelHint();
        updateAll();
      });
    }
  });

  // PA
  // removed empty loop 

  // Multi
  ["lighting", "lightFX", "skinDetail", "hairDetail", "material", "typography"].forEach(k => {
    (state[k] || []).forEach(val => {
      addTag(k, val, "", () => { state[k] = state[k].filter(x => x !== val); syncGroup(k); updateAll(); });
    });
  });

  // Modes
  if (state.generateFourMode) addTag("mode", "Generate 4", "", () => { $("generateFourMode").checked = false; state.generateFourMode = false; updateAll(); });
  if (state.grid3x3Mode) addTag("mode", "3×3 Contact Sheet", "", () => { $("grid3x3Mode").checked = false; state.grid3x3Mode = false; updateAll(); });
  if (state.maxConsistency) addTag("mode", "🔒 Consistency", "", () => { $("maxConsistency").checked = false; state.maxConsistency = false; updateAll(); });
  if (state.motionBlurMode) addTag("mode", "Motion blur", "", () => { $("motionBlurMode").checked = false; state.motionBlurMode = false; updateAll(); });
  if (state.motionBlurMode && (state.motionBlurCharacter || "").trim()) addTag("motion", "Персонаж: " + state.motionBlurCharacter.trim(), "", () => { state.motionBlurCharacter = ""; if ($("motionBlurCharacter")) $("motionBlurCharacter").value = ""; updateAll(); });
  if (state.motionBlurMode && (state.motionBlurLocation || "").trim()) addTag("motion", "Локация: " + state.motionBlurLocation.trim(), "", () => { state.motionBlurLocation = ""; if ($("motionBlurLocation")) $("motionBlurLocation").value = ""; updateAll(); });
  if (state.motionBlurMode && state.motionBlurBackgroundEnabled) addTag("motion", "Задний план", "", () => { state.motionBlurBackgroundEnabled = false; if ($("motionBlurBackgroundEnabled")) $("motionBlurBackgroundEnabled").checked = false; updateAll(); });
  if (state.motionBlurMode && state.motionBlurBackgroundEnabled && (state.motionBlurBackground || "").trim()) addTag("motion", "Background: " + state.motionBlurBackground.trim(), "", () => { state.motionBlurBackground = ""; if ($("motionBlurBackground")) $("motionBlurBackground").value = ""; updateAll(); });
  if (state.motionBlurMode && state.motionBlurForegroundEnabled) addTag("motion", "Передний план", "", () => { state.motionBlurForegroundEnabled = false; if ($("motionBlurForegroundEnabled")) $("motionBlurForegroundEnabled").checked = false; updateAll(); });
  if (state.motionBlurMode && state.motionBlurForegroundEnabled && (state.motionBlurForeground || "").trim()) addTag("motion", "Foreground: " + state.motionBlurForeground.trim(), "", () => { state.motionBlurForeground = ""; if ($("motionBlurForeground")) $("motionBlurForeground").value = ""; updateAll(); });
  // Engine params tags
  if (state.aiModel === "midjourney") {
    if (state.mjStyle === "raw") addTag("engine", "--style raw", "", () => { state.mjStyle = ""; syncGroup("mjStyle"); updateAll(); });
    if (state.mjChaos > 0) addTag("engine", "--chaos " + state.mjChaos, "");
    if (state.mjWeird > 0) addTag("engine", "--weird " + state.mjWeird, "");
    if ((state.mjSref || "").trim()) addTag("engine", "--sref " + state.mjSref.trim(), "", () => { state.mjSref = ""; $("mjSrefInput").value = ""; updateAll(); });
  }
  if (state.aiModel === "dall-e-3") {
    addTag("engine", state.dalleStyle, "");
    addTag("engine", state.dalleQuality, "");
  }
  if (state.skinRenderBoost) addTag("render", "Skin Boost", "", () => { $("skinRenderBoost").checked = false; state.skinRenderBoost = false; updateAll(); });
  if (state.hairRenderBoost) addTag("render", "Hair Boost", "", () => { $("hairRenderBoost").checked = false; state.hairRenderBoost = false; updateAll(); });
  if (state.beforeAfter) addTag("mode", "before/after", "", () => { $("beforeAfter").checked = false; state.beforeAfter = false; updateAll(); });
  if (state.seamlessPattern) addTag("mode", "seamless", "", () => { $("seamlessPattern").checked = false; state.seamlessPattern = false; updateAll(); });
  if (state.seed) addTag("seed", "seed: " + state.seed, "", () => { $("seedInput").value = ""; state.seed = ""; updateAll(); });

  if (state.referenceImages.length) {
    addTag("refs", `${state.referenceImages.length} image(s)`, "", () => {
      state.referenceImages = []; $("referenceImages").value = "";
      $("imagePreviewContainer").style.display = "none";
      $("referenceOptions").style.display = "none";
      $("referenceWeight").style.display = "none";
      updateAll();
    });
  }

  // FIX: Hide Active Tags section if empty
  const tagSection = area.closest(".section");
  if (tagSection) {
    tagSection.style.display = area.children.length === 0 ? "none" : "block";
  }
}

// =============================================
// COUNT PARAMS
// =============================================
function countParams() {
  let c = 0;
  ["aiModel", "cameraBody", "aspectRatio", "resolution", "purpose", "format", "medium", "lens", "shotSize", "focalLength", "aperture", "angle", "composition", "quality", "referenceType", "photoStyle", "cinemaStyle", "directorStyle", "artStyle", "filmStock", "quickStyle", "fashionFoodStyle", "emotion", "mood", "cinematicPreset", "ambience", "foley", "cinematicFx", "lightType"].forEach(k => { if (state[k]) c++; });
  ["lighting", "lightFX", "skinDetail", "hairDetail", "material", "typography"].forEach(k => { if ((state[k] || []).length) c++; });
  if (state.colorPalette) c++;
  if ((state.mainSubject || "").trim()) c++;
  if ((state.textContent || "").trim()) c++;
  if ((state.negativePrompt || "").trim()) c++;
  if (state.generateFourMode) c++;
  if (state.grid3x3Mode) c++;
  if (state.maxConsistency) c++;
  if (state.motionBlurMode) c++;
  if (state.motionBlurMode && (state.motionBlurCharacter || "").trim()) c++;
  if (state.motionBlurMode && (state.motionBlurLocation || "").trim()) c++;
  if (state.motionBlurMode && state.motionBlurBackgroundEnabled) c++;
  if (state.motionBlurMode && state.motionBlurBackgroundEnabled && (state.motionBlurBackground || "").trim()) c++;
  if (state.motionBlurMode && state.motionBlurForegroundEnabled) c++;
  if (state.motionBlurMode && state.motionBlurForegroundEnabled && (state.motionBlurForeground || "").trim()) c++;
  if (state.skinRenderBoost) c++;
  if (state.hairRenderBoost) c++;
  if (state.mjStyle) c++;
  if ((state.mjSref || "").trim()) c++;
  if (state.dalleStyle) c++;
  if (state.dalleQuality) c++;
  if (state.fluxModel) c++;
  if (state.beforeAfter) c++;
  if (state.seamlessPattern) c++;
  if (state.seed) c++;
  if (state.referenceImages.length) c++;
  return c;
}

// =============================================
// UPDATE ALL
// =============================================

// =============================================
// NEGATIVE — always appended at the very end
// =============================================
function appendNegativeLast(text) {
  const negRaw = (state.negativePrompt || "").trim();
  if (!negRaw) return text;

  // Midjourney syntax: always last
  if (state.promptFormat === "midjourney" || state.aiModel === "midjourney") {
    const noWords = negRaw.replace(/,\s*/g, ", ");
    return (text.trim() + " --no " + noWords).trim();
  }

  if (state.promptFormat === "structured") {
    return (text.trim() + "\n\nNEGATIVE: " + negRaw).trim();
  }

  return (text.trim() + "\n\nNegative prompt: " + negRaw).trim();
}

// =============================================
// BUILD G4 PROMPT — NANO BANANA PRO
// =============================================
function buildG4ForNBP(basePromptText) {
  // ---- Собираем base_scene из текущего state ----
  const cam = [state.cameraBody, state.lens, state.aperture].filter(Boolean).join(", ");

  const lightParts = getAllLightingSelections(state);
  (state.lightFX || []).forEach(fx => lightParts.push(fx));
  const lighting = lightParts.join(", ") || "natural lighting";

  const colorParts = [];
  if (state.colorPalette) colorParts.push(state.colorPalette);
  if (state.filmStock && FILM_STOCKS[state.filmStock]) colorParts.push(FILM_STOCKS[state.filmStock]);
  const color = colorParts.join(". ") || "";

  const skinParts = state.skinDetail.length ? state.skinDetail.join(", ") : "";
  const styleParts = [state.photoStyle, state.cinemaStyle, state.directorStyle, (state.artStyle && window.ART_STYLES_MAP ? window.ART_STYLES_MAP[state.artStyle] : "")].filter(Boolean).join(", ");

  let stylePreset = "";
  if (state.quickStyle && QUICK_STYLES[state.quickStyle]) stylePreset = QUICK_STYLES[state.quickStyle];
  if (state.fashionFoodStyle && FASHION_FOOD_STYLES[state.fashionFoodStyle]) stylePreset = FASHION_FOOD_STYLES[state.fashionFoodStyle];

  const ar = state.aspectRatio || "16:9";
  const res = state.resolution || "4K";
  const subject = state.mainSubject || "the subject";
  const emotion = state.emotion && EMOTIONS[state.emotion] ? EMOTIONS[state.emotion] : "";

  // ---- Negative: встроен в base_scene, не отдельным блоком ----
  const neg = state.negativePrompt
    ? state.negativePrompt
    : "No blurred faces, no plastic skin, no extra fingers";

  // ---- Формируем JSON-объект ----
  const g4 = {
    task: "GENERATE_SCENE_VARIATIONS",
    instruction: "STRICT REQUIREMENT: Generate 4 SEPARATE, INDIVIDUAL images. Do NOT create a grid or collage. Execute the image generation tool 4 separate times.",
    identity_lock: state.maxConsistency
      ? "The subject's face, bone structure, skin tone, and all physical features MUST remain 100% identical across all 4 images. The uploaded reference photo is the absolute source of facial identity. Zero deviation."
      : "Maintain consistent character appearance across all variations.",
    base_scene: {
      subject: subject,
      emotion: emotion || null,
      camera: cam || null,
      lighting: lighting,
      color: color || null,
      skin: skinParts || null,
      style: styleParts || null,
      style_preset: stylePreset || null,
      negative: neg
    },
    global_settings: {
      aspect_ratio: ar,
      resolution: res,
      consistency: "Maintain identical character, wardrobe, accessories. Only camera angle, framing, and environment change."
    },
    variations: [
      {
        id: 1,
        shot_type: "Low angle",
        angle: "Camera low, looking up at subject from the right",
        framing: "Medium-full body, subject powerful against sky",
        direction: "Emphasize industrial architecture above." + (cam ? " " + cam + "." : ""),
        environment_note: "Add new environmental details not in base scene."
      },
      {
        id: 2,
        shot_type: "Cowboy shot",
        angle: "Eye level, facing subject",
        framing: "Mid-thigh up",
        direction: "Subject walks toward camera. Shallow depth of field. Compression feel.",
        environment_note: "Add new environmental details not in base scene."
      },
      {
        id: 3,
        shot_type: "Dutch angle",
        angle: "Tilted 15В°, eye level",
        framing: "Medium shot, waist up",
        direction: "Subject mid-action — show the next story beat. Diagonal tension.",
        environment_note: "Add new environmental details not in base scene."
      },
      {
        id: 4,
        shot_type: "Three-quarter from left",
        angle: "Behind-left of subject, looking over shoulder",
        framing: "Three-quarter body with environment",
        direction: "Wide angle 24mm feel. Environmental storytelling.",
        environment_note: "Add new environmental details not in base scene."
      }
    ]
  };

  // Убираем null-поля для чистоты
  Object.keys(g4.base_scene).forEach(k => {
    if (!g4.base_scene[k]) delete g4.base_scene[k];
  });

  return JSON.stringify(g4, null, 2);
}

function buildG4FlatForNBP(basePromptText) {
  const subject = state.mainSubject || "the subject";
  const cam = [state.cameraBody, state.lens, state.focalLength, state.aperture].filter(Boolean).join(", ");
  const ar = state.aspectRatio || "16:9";
  const res = state.resolution || "4K";

  const lightParts = getAllLightingSelections(state);
  (state.lightFX || []).forEach(fx => lightParts.push(fx));
  const lighting = lightParts.join(", ") || "natural lighting";

  const colorParts = [];
  if (state.colorPalette) colorParts.push(state.colorPalette);
  if (state.filmStock && FILM_STOCKS[state.filmStock]) colorParts.push(FILM_STOCKS[state.filmStock]);
  const color = colorParts.join(". ");

  const skin = state.skinDetail.length ? state.skinDetail.join(", ") : "";
  const style = [state.photoStyle, state.cinemaStyle, state.directorStyle, (state.artStyle && window.ART_STYLES_MAP ? window.ART_STYLES_MAP[state.artStyle] : "")].filter(Boolean).join(". ");
  const neg = state.negativePrompt || "No blurred faces, no plastic skin, no extra fingers";
  const emotion = state.emotion && EMOTIONS[state.emotion] ? EMOTIONS[state.emotion] : "";

  const identity = state.maxConsistency
    ? "IDENTITY LOCK: The subject's face, bone structure, skin tone, and all physical features must remain 100% identical across all 4 images. Reference photo is the absolute source of identity.\n\n"
    : "";

  let flat = `GENERATE 4 SCENE VARIATIONS

You must generate 4 separate, individual images. Do NOT create a grid or collage. Execute the image generation tool 4 separate times.

${identity}BASE SCENE: ${subject}.`;

  if (emotion) flat += ` Emotion: ${emotion}.`;
  if (cam) flat += ` Photographed on ${cam}.`;
  flat += ` ${lighting}.`;
  if (color) flat += ` ${color}.`;
  if (skin) flat += ` ${skin}.`;
  if (style) flat += ` ${style}.`;
  flat += ` ${ar} aspect ratio, ${res}. ${neg}.`;

  flat += `\nMaintain character and wardrobe across all shots.

--- VARIATION 1: LOW ANGLE ---
Low angle shot, camera looking up at the subject from the right side. Subject appears powerful against the sky.${cam ? " " + cam + "." : ""} Reframe with new environmental details.

--- VARIATION 2: COWBOY SHOT ---
Cowboy shot framing (mid-thigh up). Subject walks toward camera. Shallow depth of field. Compression feel. Reframe with new environmental details.

--- VARIATION 3: DUTCH ANGLE ---
Dutch angle, tilted 15В°. Subject mid-action — show the next story beat. Dynamic diagonal tension. Reframe with new environmental details.

--- VARIATION 4: THREE-QUARTER FROM LEFT ---
Three-quarter body from the left. Subject turns, looking over shoulder. Wide angle 24mm feel, environmental storytelling. Reframe with new environmental details.`;

  return flat;
}

function build3x3ForNBP(_basePromptText) {
  const subject = (state.mainSubject || "").trim() || "[SUBJECT: reference image]";
  const allLights = getAllLightingSelections(state);
  const cameraBody = (state.cameraBody || "").replace(/^shot on\s*/i, "").trim();
  const lens = (state.lens || "").trim();
  const aperture = (state.aperture || "").trim();
  const colorParts = [state.colorPalette, state.filmStock && FILM_STOCKS[state.filmStock] ? FILM_STOCKS[state.filmStock] : ""].filter(Boolean);
  const styleParts = [
    state.quickStyle && QUICK_STYLES[state.quickStyle] ? QUICK_STYLES[state.quickStyle] : "",
    state.fashionFoodStyle && FASHION_FOOD_STYLES[state.fashionFoodStyle] ? FASHION_FOOD_STYLES[state.fashionFoodStyle] : "",
    state.photoStyle,
    state.cinemaStyle,
    state.directorStyle,
    (state.artStyle && window.ART_STYLES_MAP ? window.ART_STYLES_MAP[state.artStyle] : "")
  ].filter(Boolean);

  const g3 = {
    output_requirements: {
      deliverable: "ONE single master image",
      format: "3x3 Cinematic Contact Sheet",
      aspect_ratio: "3:4",
      layout_rules: "Full-bleed grid, no outer margins, panels separated by perfectly straight, thin dark dividers"
    },
    consistency_protocol: {
      frozen_scene_logic: true,
      rule: "Strict continuity across ALL 9 panels. The subject, environment, weather, and wardrobe MUST remain 100% static and identical.",
      allowed_changes: "Only camera proximity, angle, and depth of field may change per panel"
    },
    scene_content: {
      subject: subject,
      environment: state.referenceImages && state.referenceImages.length ? "[ENVIRONMENT: reference image]" : "[ENVIRONMENT: from subject description]"
    },
    cinematography: {
      camera: cameraBody || "Arri Alexa 35",
      lens: lens || "35mm prime lens logic",
      aperture: aperture || "f/2.8 with realistic optical depth of field falloff",
      lighting: allLights.length ? allLights.join(", ") : "Dynamic cinematic lighting, motivated practical lights, dramatic shadows",
      color_grading: colorParts.length ? colorParts.join(", ") : "Professional cinematic color grade, filmic contrast",
      quality: state.quality || "8K resolution, hyper-realistic, highly detailed textures",
      style: styleParts.length ? styleParts.join(", ") : undefined
    },
    selected_controls: {
      purpose: state.purpose || undefined,
      format: state.format || undefined,
      medium: state.medium || undefined,
      mood: state.mood || undefined,
      text: (state.textContent || "").trim() || undefined,
      light_fx: (state.lightFX || []).length ? state.lightFX : undefined,
      emotion: state.emotion && EMOTIONS[state.emotion] ? EMOTIONS[state.emotion] : undefined
    },
    grid_panels: [
      { panel_1: "Extreme Long Shot (ELS), wide establishing view" },
      { panel_2: "Long Shot (LS), full subject framing" },
      { panel_3: "Medium Long Shot (MLS), knee-level crop" },
      { panel_4: "Medium Shot (MS), waist-level crop" },
      { panel_5: "Medium Close-Up (MCU), chest-level crop" },
      { panel_6: "Close-Up (CU), tight focus on main feature/face" },
      { panel_7: "Extreme Close-Up (ECU), macro photography of a specific texture" },
      { panel_8: "Low Angle, dramatic upward perspective" },
      { panel_9: "High Angle, downward perspective" }
    ]
  };

  return JSON.stringify(pruneEmptyFields(g3) || {}, null, 2);
}

function build3x3FlatForNBP(_basePromptText) {
  const subject = (state.mainSubject || "").trim() || "[SUBJECT: reference image]";
  const allLights = getAllLightingSelections(state);
  const cameraBody = (state.cameraBody || "Arri Alexa 35").replace(/^shot on\s*/i, "").trim();
  const lens = state.lens || "35mm lens equivalent";
  const aperture = state.aperture || "f/2.8";
  const colorParts = [state.colorPalette, state.filmStock && FILM_STOCKS[state.filmStock] ? FILM_STOCKS[state.filmStock] : ""].filter(Boolean);
  const styleParts = [
    state.quickStyle && QUICK_STYLES[state.quickStyle] ? QUICK_STYLES[state.quickStyle] : "",
    state.fashionFoodStyle && FASHION_FOOD_STYLES[state.fashionFoodStyle] ? FASHION_FOOD_STYLES[state.fashionFoodStyle] : "",
    state.photoStyle,
    state.cinemaStyle,
    state.directorStyle,
    (state.artStyle && window.ART_STYLES_MAP ? window.ART_STYLES_MAP[state.artStyle] : "")
  ].filter(Boolean);
  const extras = [state.purpose, state.format, state.medium, state.mood, (state.textContent || "").trim() ? `text "${state.textContent.trim()}"` : ""].filter(Boolean).join(", ");
  const lightingLine = allLights.length ? allLights.join(", ") : "Dynamic cinematic lighting";
  const colorLine = colorParts.length ? colorParts.join(", ") : "professional filmic color grading";
  const styleLine = styleParts.length ? styleParts.join(", ") : "";

  return `Generate ONE single master image containing a 3x3 Cinematic Contact Sheet. Aspect Ratio: 3:4. The layout must be full-bleed with no outer margins, separated only by thin dark dividers.
Frozen Scene Logic & Consistency: Strict continuity across ALL 9 panels. The subject and environment MUST remain 100% static and identical in every panel. Do not change wardrobe, weather, or location continuity. Only camera proximity, framing, and angle change.
Subject: ${subject}.
Cinematography: shot on ${cameraBody}, ${lens}, ${aperture}. Lighting: ${lightingLine}. Color: ${colorLine}. Quality: ${state.quality || "8K resolution, photorealistic detail"}.
${styleLine ? "Style context: " + styleLine + "." : ""}
${extras ? "Additional selected options: " + extras + "." : ""}
9 Panels Layout (from top-left to bottom-right):
ELS (Extreme Long Shot): Establishing the environment and the subject's scale.
LS (Long Shot): Full body/object visible within the context of the scene.
MLS (Medium Long Shot): Framed from the knees/base up.
MS (Medium Shot): Framed from the waist/middle up.
MCU (Medium Close-Up): Chest/center up, showing posture.
CU (Close-Up): Tight focus on the face or primary feature.
ECU (Extreme Close-Up): Macro detail shot of a specific texture or surface.
Low Angle: Dramatic shot looking up from the ground.
High Angle: Bird's-eye view looking down on the subject.`;
}

function syncMotionBlurUI() {
  const fieldsWrap = $("motionBlurFields");
  const modeEnabled = !!state.motionBlurMode;
  if (fieldsWrap) {
    fieldsWrap.style.opacity = modeEnabled ? "" : "0.45";
    fieldsWrap.style.pointerEvents = modeEnabled ? "" : "none";
  }
  ["motionBlurCharacter", "motionBlurLocation", "motionBlurBackground", "motionBlurBackgroundEnabled", "motionBlurForegroundEnabled"].forEach((id) => {
    const el = $(id);
    if (el) el.disabled = !modeEnabled;
  });
  const backgroundInput = $("motionBlurBackground");
  if (backgroundInput) backgroundInput.disabled = !modeEnabled || !state.motionBlurBackgroundEnabled;
  const foregroundInput = $("motionBlurForeground");
  if (foregroundInput) foregroundInput.disabled = !modeEnabled || !state.motionBlurForegroundEnabled;
}

function updateAll() {
  // 1. Sync raw text inputs to state
  const prevStateSnapshot = deepClone(state);
  state.mainSubject = $("mainSubject").value || "";
  state.textContent = $("textContent").value || "";
  state.negativePrompt = $("negativePrompt").value || "";
  state.seed = $("seedInput").value || "";
  state.motionBlurCharacter = $("motionBlurCharacter") ? ($("motionBlurCharacter").value || "") : (state.motionBlurCharacter || "");
  state.motionBlurLocation = $("motionBlurLocation") ? ($("motionBlurLocation").value || "") : (state.motionBlurLocation || "");
  state.motionBlurBackground = $("motionBlurBackground") ? ($("motionBlurBackground").value || "") : (state.motionBlurBackground || "");
  state.motionBlurForeground = $("motionBlurForeground") ? ($("motionBlurForeground").value || "") : (state.motionBlurForeground || "");
  enforceOutputStateRules(state, prevStateSnapshot);

  // 2. Visual Sync: Match UI to logical state
  Object.keys(groupConfig).forEach(syncGroup);

  // Sync checkboxes visually
  ["generateFourMode", "grid3x3Mode", "maxConsistency", "beforeAfter", "seamlessPattern", "skinRenderBoost", "hairRenderBoost", "motionBlurMode", "motionBlurBackgroundEnabled", "motionBlurForegroundEnabled"].forEach(id => {
    const el = $(id);
    if (el) {
      el.checked = state[id] || false;
      const lbl = el.closest(".toggle-label");
      if (lbl) lbl.classList.toggle("checked", state[id]);
    }
  });
  syncMotionBlurUI();

  // === Update engine-specific panels ===
  updateRefUI();
  updateGenParamsUI();

  // Auto-switch prompt format when Midjourney selected
  if (state.aiModel === "midjourney" && state.promptFormat !== "midjourney") {
    setPromptFormat("midjourney");
  }
  // Return to flat format when Midjourney is deselected
  if (state.aiModel !== "midjourney" && state.promptFormat === "midjourney") {
    setPromptFormat("flat");
  }

  // === Generate 4 Mode: disable lens section ===
  // === Generate 4 Mode: lens stays enabled (G4 variations use camera params) ===
  // FIX: Only remove disabled-section if 3x3 is not also active
  if (state.generateFourMode && !state.grid3x3Mode) {
    $("lensSectionV2").classList.remove("disabled-section");
  } else if (!state.grid3x3Mode) {
    $("lensSectionV2").classList.remove("disabled-section");
  }

  // === 3x3 Mode: disable lens, aperture, angle, composition (overridden by contact sheet) ===
  if (state.grid3x3Mode) {
    $("lensSectionV2").classList.add("disabled-section");
  }

  // === CONFLICT DISABLING SYSTEM ===
  applyConflictRules();

  // Resolution
  rebuildResolution();

  // Tags
  updateActiveTags();

  // Build final prompt with all wrappers/modes
  const promptText = buildPromptTextForOutput();

  const outBox = $("promptOutput");
  outBox.textContent = promptText;
  outBox.classList.toggle("empty", promptText.includes("Select parameters"));

  // Stats
  $("charCount").textContent = String(promptText.length);
  $("wordCount").textContent = String(wordCount(promptText));
  $("paramCount").textContent = String(countParams());

  // JSON
  $("jsonOutput").textContent = JSON.stringify(buildJson(), null, 2);

  // Check conflicts
  checkConflicts();
}

// =============================================
// CONFLICT RULES — disables incompatible buttons
// =============================================
function applyConflictRules() {
  // Reset all conflict-disabled buttons first
  document.querySelectorAll(".option-btn.conflict-disabled").forEach(b => {
    b.disabled = false;
    b.classList.remove("conflict-disabled");
    b.title = "";
  });

  // Reset disabled-section overlay from previous Quick Style evaluation
  document.querySelectorAll(".left-panel > .section.disabled-section").forEach(sec => {
    sec.classList.remove("disabled-section");
  });

  // Lock Quick Style if Standard Preset is active
  if (state.isStandardPresetActive) {
    const qs = $("quickStyleSection");
    if (qs) qs.classList.add("disabled-section");
  }

  // Helper: disable all buttons in a group
  function disableGroup(group, reason) {
    document.querySelectorAll(`[data-group="${group}"]`).forEach(b => {
      if (!b.classList.contains("active")) {
        b.disabled = true;
        b.classList.add("conflict-disabled");
        b.title = reason;
      }
    });
  }

  // Helper: disable specific buttons by value substring match
  function disableByValue(group, valuePart, reason) {
    document.querySelectorAll(`[data-group="${group}"]`).forEach(b => {
      const v = b.dataset.value || "";
      if (v.toLowerCase().includes(valuePart.toLowerCase()) && !b.classList.contains("active")) {
        b.disabled = true;
        b.classList.add("conflict-disabled");
        b.title = reason;
      }
    });
  }

  // Helper: disable specific buttons by exact value
  function disableExact(group, value, reason) {
    document.querySelectorAll(`[data-group="${group}"]`).forEach(b => {
      if (b.dataset.value === value && !b.classList.contains("active")) {
        b.disabled = true;
        b.classList.add("conflict-disabled");
        b.title = reason;
      }
    });
  }

  // Helper: disable/enable a toggle checkbox
  function disableToggle(id, reason) {
    const cb = $(id);
    if (cb && !cb.checked) {
      cb.disabled = true;
      const lbl = cb.closest(".toggle-label");
      if (lbl) { lbl.title = reason; lbl.style.opacity = "0.4"; }
    }
  }
  function enableToggle(id) {
    const cb = $(id);
    if (cb) {
      cb.disabled = false;
      const lbl = cb.closest(".toggle-label");
      if (lbl) { lbl.title = ""; lbl.style.opacity = ""; }
    }
  }

  function disableByPredicate(group, predicate, reason) {
    document.querySelectorAll(`[data-group="${group}"]`).forEach(b => {
      const v = b.dataset.value || "";
      if (predicate(v) && !b.classList.contains("active")) {
        b.disabled = true;
        b.classList.add("conflict-disabled");
        b.title = reason;
      }
    });
  }

  // P10: Auto-collapse locked sections AND auto-expand when conflict is resolved
  function collapseConflictLockedSections() {
    document.querySelectorAll(".left-panel > .section").forEach(sec => {
      if (sec.classList.contains("no-collapse")) return;

      // Whole section visually locked (Quick/Fashion/Food blanket rules)
      if (sec.classList.contains("disabled-section")) {
        sec.classList.add("collapsed");
        return;
      }

      const optionButtons = Array.from(sec.querySelectorAll(".option-btn[data-group]"));
      if (optionButtons.length > 0) {
        const allOptionsLocked = optionButtons.every(btn => btn.disabled);
        if (allOptionsLocked) {
          sec.classList.add("collapsed");
          return;
        }
        // Auto-expand if section has active selections and was collapsed by conflict
        const hasActiveSelection = optionButtons.some(btn => btn.classList.contains("active"));
        if (hasActiveSelection && sec.classList.contains("collapsed")) {
          sec.classList.remove("collapsed");
          return;
        }
      }

      const toggles = Array.from(sec.querySelectorAll('.toggle-label input[type="checkbox"]'));
      if (toggles.length > 0) {
        const allTogglesLocked = toggles.every(cb => cb.disabled);
        if (allTogglesLocked) {
          sec.classList.add("collapsed");
        }
      }
    });
  }

  const fmt = state.format;
  const purpose = state.purpose;
  const flags = computeSemanticFlags(state);
  const isArtistic = flags.isArtisticFormat || flags.isArtisticArtStyle;
  const isAbstract = flags.isAbstractPurpose;

  // =========================================
  // RULE 0a: Generate 4 в†” 3x3 and Motion blur в†” generation wrappers
  // =========================================
  if (state.generateFourMode) {
    disableToggle("grid3x3Mode", "Несовместимо с Generate 4");
  } else if (state.motionBlurMode) {
    disableToggle("grid3x3Mode", "Несовместимо с Motion blur");
  } else {
    enableToggle("grid3x3Mode");
  }
  if (state.grid3x3Mode) {
    disableToggle("generateFourMode", "Несовместимо с 3×3 Contact Sheet");
  } else if (state.motionBlurMode) {
    disableToggle("generateFourMode", "Несовместимо с Motion blur");
  } else {
    if (!state.grid3x3Mode) enableToggle("generateFourMode");
  }

  // =========================================
  // RULE 0b: 3x3 Contact Sheet в†’ disable lens, aperture, angle, composition
  // (the contact sheet defines its own 9 shot types, camera, and aperture)
  // =========================================
  if (state.grid3x3Mode) {
    const reason3x3 = "Переопределено 3×3 Contact Sheet";
    disableGroup("lens", reason3x3);
    disableGroup("focalLength", reason3x3);
    disableGroup("shotSize", reason3x3);
    disableGroup("aperture", reason3x3);
    disableGroup("angle", reason3x3);
    disableGroup("composition", reason3x3);
  }

  // =========================================
  // RULE 0c: Generate 4 в†’ disable lens (already handled by disabled-section on lensSectionV2)
  // Also disable angle and composition since variations define their own shots
  // =========================================
  if (state.generateFourMode) {
    const reasonG4 = "Переопределено Generate 4 Variations";
    disableGroup("shotSize", reasonG4);
    disableGroup("angle", reasonG4);
    disableGroup("composition", reasonG4);
  }

  // =========================================
  // RULE 0d: Generate 4 / 3x3 / Motion blur в†” beforeAfter, seamlessPattern
  // =========================================
  if (state.generateFourMode || state.grid3x3Mode || state.motionBlurMode) {
    disableToggle("beforeAfter", "Несовместимо с режимом генерации");
    disableToggle("seamlessPattern", "Несовместимо с режимом генерации");
  }

  // Motion blur toggle is mutually exclusive with generation wrappers and special layout modes.
  if (state.generateFourMode || state.grid3x3Mode) {
    disableToggle("motionBlurMode", "Motion blur несовместим с режимом генерации");
  } else if (state.beforeAfter) {
    disableToggle("motionBlurMode", "Motion blur несовместим с Before/After");
  } else if (state.seamlessPattern) {
    disableToggle("motionBlurMode", "Motion blur несовместим с Seamless Pattern");
  } else if (state.promptFormat !== "flat") {
    disableToggle("motionBlurMode", "Motion blur доступен только в формате Flat");
  } else {
    enableToggle("motionBlurMode");
  }

  // Motion blur foreground checkbox depends on Motion blur itself.
  if (!state.motionBlurMode) {
    disableToggle("motionBlurBackgroundEnabled", "Включите Motion blur");
    disableToggle("motionBlurForegroundEnabled", "Включите Motion blur");
  } else {
    enableToggle("motionBlurBackgroundEnabled");
    enableToggle("motionBlurForegroundEnabled");
  }

  // Motion blur template defines its own Leica camera/optics stack.
  if (state.motionBlurMode) {
    const reason = "Motion blur использует фиксированный Leica-шаблон (камера/оптика/фокусное/диафрагма)";
    ["cameraBody", "lens", "focalLength", "aperture"].forEach(group => {
      document.querySelectorAll(`[data-group="${group}"]`).forEach(b => {
        b.disabled = true;
        b.classList.add("conflict-disabled");
        b.title = reason;
      });
    });
  }

  // RULE 1: Artistic format в†’ camera body, lens, aperture non-selectable
  if (isArtistic) {
    const reason = `Формат «${fmt}» не использует камеру/оптику`;
    disableGroup("cameraBody", reason);
    disableGroup("lens", reason);
    disableGroup("focalLength", reason);
    disableGroup("aperture", reason);
    disableGroup("filmStock", reason);
    disableGroup("skinDetail", reason);
    disableGroup("hairDetail", reason);
    disableToggle("skinRenderBoost", reason);
    disableToggle("hairRenderBoost", reason);
  }

  // RULE 1b: TimeOfDay — conflicting combinations
  // Night cannot be combined with midday/golden hour/daylight.
  if (flags.hasNightLight) {
    disableByPredicate("lighting", isDayLightToken, "Ночь несовместима с дневным светом");
    disableByPredicate("lightType", isDayLightToken, "Ночь несовместима с дневным светом");
  }
  if (flags.hasDayLight) {
    disableByPredicate("lighting", isNightLightToken, "Дневной свет несовместим с ночью");
    disableByPredicate("lightType", isNightLightToken, "Дневной свет несовместим с ночью");
  }

  // RULE 2: Pixel art / anime в†’ skin detail & hair detail non-selectable
  if (fmt === "pixel art" || fmt === "anime style") {
    const reason = `Формат «${fmt}» не поддерживает фото-детализацию`;
    disableGroup("skinDetail", reason);
    disableGroup("hairDetail", reason);
    // Also disable render boost checkboxes
    disableToggle("skinRenderBoost", reason);
    disableToggle("hairRenderBoost", reason);
  } else {
    if (!isAbstract) { enableToggle("skinRenderBoost"); enableToggle("hairRenderBoost"); }
  }

  // RULE 3: Logo / UI / Infographic в†’ skin, hair, aperture, styles non-selectable
  if (isAbstract) {
    const reason = `Назначение «${purpose}» не использует портретные настройки`;
    disableGroup("cameraBody", reason);
    disableGroup("lens", reason);
    disableGroup("focalLength", reason);
    disableGroup("skinDetail", reason);
    disableGroup("hairDetail", reason);
    disableToggle("skinRenderBoost", reason);
    disableToggle("hairRenderBoost", reason);
    disableGroup("photoStyle", reason);
    disableGroup("cinemaStyle", reason);
    disableGroup("directorStyle", reason);
    disableGroup("aperture", reason);
    disableGroup("filmStock", reason);
  }

  // RULE 4: Macro lens + wide shot sizes
  if (flags.hasMacroLens) {
    const reasonMacroWide = "Macro lens is incompatible with wide framing";
    disableByValue("shotSize", "wide shot", reasonMacroWide);
    disableByValue("shotSize", "extreme long shot", reasonMacroWide);
    // Legacy compatibility (older wording from presets/exports).
    disableByValue("shotSize", "extreme wide", reasonMacroWide);
    // Legacy compatibility (older exports may still store framing in composition).
    disableByValue("composition", "extreme wide", reasonMacroWide);
  }

  // RULE 5: Ultra-wide lens + extreme close-up shot size
  if (flags.hasUltraWideLens) {
    disableByValue("shotSize", "extreme close-up", "Ultra-wide lens is incompatible with extreme close-up");
    // Legacy compatibility (older exports may still store framing in composition).
    disableByValue("composition", "extreme close-up", "Ultra-wide lens is incompatible with extreme close-up");
  }

  // RULE 6: Flat lay в†’ only top-down angles
  if (flags.compositionIsFlatLay) {
    const reason = "Flat Lay — только вид сверху";
    ["extreme low angle", "low angle shot", "slightly low angle", "eye level", "dutch angle", "over-the-shoulder", "POV first person"].forEach(v => {
      disableByValue("angle", v, reason);
    });
  }

  // RULE 7: Drone в†’ disable studio lighting
  if (flags.angleIsDrone) {
    disableByPredicate("lighting", isStudioLightToken, "Студийный свет несовместим с дрон-съёмкой");
    disableByPredicate("lightType", isStudioLightToken, "Студийный свет несовместим с дрон-съёмкой");
  }

  // RULE 8: Studio lighting в†’ disable drone
  if (flags.hasStudioLight) {
    disableByValue("angle", "drone", "Дрон несовместим со студийным светом");
  }

  // RULE 9: B&W style в†’ disable neon
  if (flags.photoStyleBlackAndWhite) {
    disableByPredicate("lighting", isNeonLightToken, "Неон не виден в С‡/Р± стиле");
    disableByPredicate("lightType", isNeonLightToken, "Неон не виден в С‡/Р± стиле");
  }

  // RULE 10: Neon в†’ disable B&W styles
  if (flags.hasNeonLight) {
    document.querySelectorAll(`[data-group="photoStyle"]`).forEach(b => {
      if ((b.dataset.value || "").includes("black and white") && !b.classList.contains("active")) {
        b.disabled = true;
        b.classList.add("conflict-disabled");
        b.title = "Ч/б стиль несовместим с неоновым освещением";
      }
    });
  }

  // RULE 11: beforeAfter в†” seamlessPattern — mutual exclusion
  if (state.beforeAfter) {
    disableToggle("seamlessPattern", "Несовместимо с Before/After");
  } else if (!state.generateFourMode && !state.grid3x3Mode && !state.motionBlurMode) {
    enableToggle("seamlessPattern");
  }
  if (state.seamlessPattern) {
    disableToggle("beforeAfter", "Несовместимо с Seamless Pattern");
  } else if (!state.generateFourMode && !state.grid3x3Mode && !state.motionBlurMode) {
    enableToggle("beforeAfter");
  }

  // RULE 12: f/1.2 -> disable extreme wide shot sizes
  if (isUltraWideOpenAperture(state.aperture)) {
    const reasonWideAperture = "Ultra-open aperture (f/0.95/f1.2) is atypical for very wide framing (prefer f/5.6+)";
    disableByValue("shotSize", "extreme long shot", reasonWideAperture);
    // Legacy compatibility (older wording from presets/exports).
    disableByValue("shotSize", "extreme wide shot", reasonWideAperture);
    disableByValue("composition", "extreme wide", reasonWideAperture);
  }

  // RULE 13: Extreme wide shot size -> disable f/1.2
  if (flags.compositionIsExtremeWide) {
    disableByPredicate("aperture", isUltraWideOpenAperture, "Extreme wide framing is atypical with ultra-open apertures (prefer f/5.6+)");
  }

  // RULE 14: Anamorphic в†’ only cinema/advertising
  if (flags.hasAnamorphicLens) {
    document.querySelectorAll(`[data-group="purpose"]`).forEach(b => {
      const v = b.dataset.value || "";
      if (!["Cinematic Still", "Advertising campaign"].includes(v) && !b.classList.contains("active")) {
        b.disabled = true;
        b.classList.add("conflict-disabled");
        b.title = "Анаморфот используется только в кино/рекламе";
      }
    });
  }

  // RULE 15: Character Sheet + seamless pattern
  if (state.purpose === "Character Sheet") {
    disableToggle("seamlessPattern", "Seamless несовместим с Character Sheet");
  }

  // RULE 16: One author style per category, BUT allow known collaborations
  // Photo style always conflicts with cinema/director (different domains)
  if (state.photoStyle) {
    disableGroup("cinemaStyle", "Стиль фотографа уже выбран — конфликт стилей");
    disableGroup("directorStyle", "Стиль фотографа уже выбран — конфликт стилей");
  }

  // Cinema + Director: allow if they are a known collaboration pair
  if (state.cinemaStyle && state.directorStyle) {
    // Both selected — check if compatible
    const isCollab = isKnownDirectorCinemaCollab(state.directorStyle, state.cinemaStyle);
    if (!isCollab) {
      // Not a known pair — just show warning but don't disable (they're already selected)
    }
  } else if (state.cinemaStyle) {
    // Cinema selected, allow only compatible directors
    disableGroup("photoStyle", "Стиль кинооператора уже выбран — конфликт стилей");
    document.querySelectorAll('[data-group="directorStyle"]').forEach(b => {
      if (b.classList.contains("active")) return;
      const val = b.dataset.value || "";
      const compatible = isKnownDirectorCinemaCollab(val, state.cinemaStyle);
      if (!compatible) {
        b.disabled = true;
        b.classList.add("conflict-disabled");
        b.title = "Нет известных совместных работ с этим кинооператором";
      }
    });
  } else if (state.directorStyle) {
    // Director selected, allow only compatible cinematographers
    disableGroup("photoStyle", "Стиль режиссёра уже выбран — конфликт стилей");
    document.querySelectorAll('[data-group="cinemaStyle"]').forEach(b => {
      if (b.classList.contains("active")) return;
      const val = b.dataset.value || "";
      const compatible = isKnownDirectorCinemaCollab(state.directorStyle, val);
      if (!compatible) {
        b.disabled = true;
        b.classList.add("conflict-disabled");
        b.title = "Нет известных совместных работ с этим режиссёром";
      }
    });
  }

  // RULE 18: Quick Style — BLANKET DISABLE
  // Quick Style presets define complete visual language (camera, lens, lighting, color, texture).
  // When ANY preset is selected, ALL menus are disabled except: Aspect Ratio, Resolution, AI Model, and Quick Style itself.
  if (state.quickStyle) {
    const reason = "Стилевой пресет определяет все параметры. Снимите пресет для ручной настройки.";

    // Disable ALL parameter groups except aspectRatio, resolution, aiModel, quickStyle
    const blanketDisableGroups = [
      "purpose", "format", "medium", "quality", "cameraBody", "lens", "focalLength", "shotSize", "aperture",
      "angle", "composition", "lighting", "lightType", "lightFX",
      "colorPalette", "mood", "skinDetail", "hairDetail", "material",
      "photoStyle", "cinemaStyle", "directorStyle", "artStyle", "filmStock", "typography",
      "referenceType", "emotion"
    ];
    blanketDisableGroups.forEach(g => disableGroup(g, reason));

    // Disable all toggle checkboxes
    disableToggle("skinRenderBoost", reason);
    disableToggle("hairRenderBoost", reason);
    disableToggle("motionBlurMode", reason);
    disableToggle("motionBlurBackgroundEnabled", reason);
    disableToggle("motionBlurForegroundEnabled", reason);
    // disableToggle("generateFourMode", reason);
    // disableToggle("grid3x3Mode", reason);
    // disableToggle("maxConsistency", reason);
    // disableToggle("beforeAfter", reason);
    // disableToggle("seamlessPattern", reason);

    // Allow Fashion/Food style to coexist? No, Quick Style overrides everything.
    disableGroup("fashionFoodStyle", reason);

    // Visually disable all sections except quickStyle and aspectRatio
    document.querySelectorAll(".left-panel > .section").forEach(sec => {
      const id = sec.id || "";
      // Keep quickStyleSection and aspectRatioSection enabled
      if (id === "quickStyleSection" || id === "aspectRatioSection" || id === "generationModeSection") return;
      // Keep AI Model section enabled (needed to switch output format)
      if (sec.querySelector('[data-group="aiModel"]')) return;
      // Keep Scene Description enabled (user still needs to describe the subject)
      if (sec.querySelector('#mainSubject')) return;
      sec.classList.add("disabled-section");
    });
  }
  if (state.photoStyle || state.cinemaStyle || state.directorStyle || state.artStyle) {
    disableGroup("quickStyle", "Авторский стиль уже выбран — конфликт со стилевым пресетом");
  }

  if (state.fashionFoodStyle) {
    const reason = "Fashion/Food стиль определяет все параметры.";
    const blanketDisableGroups = [
      "purpose", "format", "medium", "quality", "cameraBody", "lens", "focalLength", "shotSize", "aperture",
      "angle", "composition", "lighting", "lightType", "lightFX",
      "colorPalette", "mood", "skinDetail", "hairDetail", "material",
      "photoStyle", "cinemaStyle", "directorStyle", "artStyle", "filmStock", "typography",
      "referenceType", "emotion", "quickStyle" // Disable Quick Style too
    ];
    blanketDisableGroups.forEach(g => disableGroup(g, reason));
    disableToggle("skinRenderBoost", reason);
    disableToggle("hairRenderBoost", reason);
    disableToggle("motionBlurMode", reason);
    disableToggle("motionBlurBackgroundEnabled", reason);
    disableToggle("motionBlurForegroundEnabled", reason);

    // Visually disable all sections except fashion/food presets and aspectRatio
    document.querySelectorAll(".left-panel > .section").forEach(sec => {
      const id = sec.id || "";
      if (id === "fashionFoodSection" || id === "foodCommercialSection" || id === "aspectRatioSection" || id === "generationModeSection") return;
      if (sec.querySelector('[data-group="aiModel"]')) return;
      if (sec.querySelector('#mainSubject')) return;
      sec.classList.add("disabled-section");
    });
  }

  // RULE 17: Seamless pattern -> only flat lay shot size
  if (state.seamlessPattern) {
    const reasonSeamless = "Seamless pattern is recommended with Flat Lay shot size";
    document.querySelectorAll('[data-group="shotSize"], [data-group="composition"]').forEach(b => {
      const v = b.dataset.value || "";
      if (!v.toLowerCase().includes("flat lay") && !b.classList.contains("active")) {
        b.disabled = true;
        b.classList.add("conflict-disabled");
        b.title = reasonSeamless;
      }
    });
  }

  collapseConflictLockedSections();
  if (typeof window.syncCollapseAllButtonLabel === "function") {
    window.syncCollapseAllButtonLabel();
  }
}

// =============================================
// PRESETS
// =============================================
function applyPreset(index) {
  state.isStandardPresetActive = true;
  const p = presets[index];
  if (!p) return;
  const v = deepClone(p.values);
  if (window.expandRelatedSections) window.expandRelatedSections(v);

  // Reset all selectable state
  ["aiModel", "cameraBody", "aspectRatio", "resolution", "purpose", "format", "medium", "lens", "focalLength", "shotSize", "aperture", "angle", "composition", "quality", "colorPalette", "mood", "referenceType", "photoStyle", "cinemaStyle", "directorStyle", "artStyle", "filmStock", "quickStyle", "fashionFoodStyle", "emotion", "cinematicPreset", "ambience", "foley", "cinematicFx", "lightType", "motionBlurCharacter", "motionBlurLocation", "motionBlurBackground", "motionBlurForeground"].forEach(k => state[k] = "");
  state.lighting = []; state.lightFX = []; state.colorPalette = ""; state.skinDetail = []; state.hairDetail = []; state.material = []; state.typography = [];
  state.motionBlurMode = false;
  state.motionBlurBackgroundEnabled = false;
  state.motionBlurForegroundEnabled = false;

  // Apply from preset
  Object.entries(v).forEach(([k, val]) => {
    if (!groupConfig[k]) return;
    const mode = groupConfig[k].mode;
    if (mode === "single") state[k] = val || "";
    if (mode === "multi") state[k] = Array.isArray(val) ? val : [];
  });

  // Backward compatibility: legacy presets stored shot-size in `composition`.
  if (!state.shotSize && state.composition) {
    const c = state.composition.toLowerCase();
    if (
      c.includes("close-up") ||
      c.includes("head and shoulders") ||
      c.includes("waist up") ||
      c.includes("full body") ||
      c.includes("extreme wide") ||
      c.includes("wide shot") ||
      c.includes("flat lay") ||
      c.includes("silhouette")
    ) {
      state.shotSize = state.composition;
    }
  }

  // Validate AR exists in buttons
  if (state.aspectRatio && !resolutionMap[state.aspectRatio]) {
    state.aspectRatio = ""; state.resolution = "";
    notify("AR из пресета не найден, сброшен", "warn");
  } else {
    state.resolution = "";
  }

  // P7: Run pruning after preset application to resolve conflicts in state
  const prevSnap = deepClone(state);
  appState._pruneConflicts(prevSnap);

  // Sync all UI buttons
  Object.keys(groupConfig).forEach(syncGroup);
  updateModelHint();
  rebuildResolution();
  updateAll();
  notify("Пресет «" + p.name.replace(/[^\w\s-]/g, "").trim() + "» применён");
}

// =============================================
// ACTIONS
// =============================================
// Reference extract handling
const REF_EXTRACT_OPTIONS = ["Лицо", "Палитру", "Позу", "Стиль", "Текстуру"];

// Conflict checking
function checkConflicts() {
  const warnings = [];
  const flags = computeSemanticFlags(state);
  const isArtistic = flags.isArtisticFormat || flags.isArtisticArtStyle;
  // photoStyle + cinemaStyle + directorStyle + artStyle simultaneously
  const styleCount = [state.photoStyle, state.cinemaStyle, state.directorStyle, state.artStyle].filter(Boolean).length;
  if (state.quickStyle && styleCount > 0) warnings.push("Быстрый стилевой пресет + авторский стиль — конфликт. Рекомендуется оставить что-то одно.");
  if (state.quickStyle && state.fashionFoodStyle) warnings.push("Одновременно выбраны «Быстрые пресеты» и «Fashion/Food» — оставьте только один режим.");
  if (state.quickStyle && (state.cameraBody || state.lens)) warnings.push("Стилевой пресет уже задаёт камеру/оптику — ваш выбор может конфликтовать.");
  if (styleCount > 1) {
    const onlyCinemaDirectorPair =
      !state.photoStyle &&
      !state.artStyle &&
      !!state.cinemaStyle &&
      !!state.directorStyle &&
      styleCount === 2 &&
      isKnownDirectorCinemaCollab(state.directorStyle, state.cinemaStyle);
    if (!onlyCinemaDirectorPair) {
      warnings.push("Выбрано несколько авторских стилей одновременно — может быть конфликт. Рекомендуется оставить один.");
    }
  }
  // Negative prompt with DALL-E/Flux
  if ((state.negativePrompt || "").trim() && (state.aiModel === "dall-e-3" || state.aiModel === "flux")) warnings.push("DALL·E 3 и Flux не поддерживают негативные промпты — они будут проигнорированы.");
  // Macro lens + wide composition
  if (flags.hasMacroLens && flags.compositionIsExtremeWide) warnings.push("Макро-объектив + широкий/дальний план — нетипичная комбинация.");
  // Ultra-wide + close-up
  if (flags.hasUltraWideLens && flags.compositionIsExtremeClose) warnings.push("Ультра-широкий объектив + экстр. крупный план — возможны сильные искажения.");
  // Anamorphic without cinema purpose
  if (flags.hasAnamorphicLens && state.purpose && !["Cinematic Still", "Advertising campaign"].includes(state.purpose)) warnings.push("Анаморфотная оптика нетипична для «" + state.purpose + "».");
  // B&W photographer style + neon lighting
  if (flags.photoStyleBlackAndWhite && flags.hasNeonLight) warnings.push("Ч/б стиль + неоновое освещение — неон не виден в С‡/Р±.");
  // Text in MJ/SD
  if ((state.textContent || "").trim() && (state.aiModel === "midjourney" || state.aiModel === "stable-diffusion")) warnings.push("Midjourney и Stable Diffusion плохо рендерят текст. Для текста лучше Ideogram или DALL·E 3.");
  // Artistic format + camera/lens
  if (isArtistic && (state.cameraBody || state.lens)) warnings.push(`Формат «${state.format}» + камера/объектив — нетипичная комбинация.`);
  // Pixel art + skin/hair detail
  if ((state.format === "pixel art" || state.format === "anime style") && (state.skinDetail.length || state.hairDetail.length)) warnings.push(`Формат «${state.format}» + фото-детализация кожи/волос — не применимо.`);
  // Abstract purpose + portrait settings
  if (flags.isAbstractPurpose && (state.skinDetail.length || state.hairDetail.length || state.photoStyle)) warnings.push(`Назначение «${state.purpose}» + портретные настройки — нетипично.`);
  // Flat lay + wrong angle
  if (flags.compositionIsFlatLay && state.angle && !isTopDownAngle(state.angle)) warnings.push("Flat Lay обычно снимается сверху — текущий угол несовместим.");
  // Drone + studio light
  if (flags.angleIsDrone && flags.hasStudioLight) warnings.push("Дрон + студийное освещение — нетипичная комбинация.");
  // Night + day conflict
  if (flags.hasNightLight && flags.hasDayLight) warnings.push("Ночь + дневной свет — конфликтующая комбинация.");
  // Ultra-open aperture + extreme wide
  if (isUltraWideOpenAperture(state.aperture) && flags.compositionIsExtremeWide) warnings.push("Ultra-open aperture (f/0.95/f1.2) + extreme wide framing is atypical (usually f/5.6-f/16).");
  // beforeAfter + seamlessPattern
  if (state.beforeAfter && state.seamlessPattern) warnings.push("Before/After + Seamless Pattern — взаимоисключающие режимы.");
  // Generate4 + 3x3
  if (state.generateFourMode && state.grid3x3Mode) warnings.push("Generate 4 + 3×3 Contact Sheet — взаимоисключающие режимы.");
  // Skin/Hair boost with non-portrait formats
  if (state.skinRenderBoost && isArtistic) warnings.push("Усиленная прорисовка кожи не совместима с форматом «" + state.format + "».");
  if (state.hairRenderBoost && isArtistic) warnings.push("Усиленная прорисовка волос не совместима с форматом «" + state.format + "».");
  // Consistency without reference images
  if (state.maxConsistency && !state.referenceImages.length) warnings.push("🔒 Макс. консистентность работает лучше всего с загруженными референсными изображениями.");
  // 3x3 + custom lens/angle/composition (if somehow still set)
  if (state.grid3x3Mode && (state.lens || state.focalLength || state.shotSize || state.angle || state.composition || state.aperture)) warnings.push("3×3 Contact Sheet переопределяет объектив, фокусное, план, угол и диафрагму — ваш выбор будет проигнорирован.");
  // Generate4/3x3 + beforeAfter/seamless
  if ((state.generateFourMode || state.grid3x3Mode) && (state.beforeAfter || state.seamlessPattern)) warnings.push("Режим генерации несовместим с Before/After и Seamless Pattern.");
  if (state.motionBlurMode && (state.generateFourMode || state.grid3x3Mode || state.beforeAfter || state.seamlessPattern)) warnings.push("Motion blur взаимоисключается с Generate 4 / 3×3 / Before-After / Seamless.");
  if (state.motionBlurMode && state.promptFormat !== "flat") warnings.push("Motion blur поддерживается только в формате Flat.");
  if (state.motionBlurBackgroundEnabled && !state.motionBlurMode) warnings.push("Чекбокс «Задний план» работает только при включенном Motion blur.");
  if (state.motionBlurForegroundEnabled && !state.motionBlurMode) warnings.push("Чекбокс «Передний план» работает только при включенном Motion blur.");

  const box = $("conflictWarnings");
  if (warnings.length) { box.style.display = "block"; box.innerHTML = "⚠️ <b>Возможные конфликты:</b><br>" + warnings.map(w => "• " + w).join("<br>") }
  else box.style.display = "none";
}

// FIX: safeCopy with visual feedback and fallback
function safeCopy(text, label, btn) {
  const originalText = btn ? btn.innerHTML : "";
  const success = () => {
    notify(label + " скопирован");
    if (btn) {
      btn.innerHTML = "✅ Скопировано!";
      setTimeout(() => btn.innerHTML = originalText, 2000);
    }
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(success).catch(function () {
      fallbackCopy(text, label, btn, success);
    });
  } else {
    fallbackCopy(text, label, btn, success);
  }
}

// FIX: Robust fallback copy
function fallbackCopy(text, label, btn, onSuccess) {
  var ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  ta.style.top = "0"; // avoid scrolling to bottom
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand("copy");
    if (onSuccess) onSuccess();
    else notify(label + " скопирован");
  } catch (e) {
    notify("Ошибка копирования", "err");
  }
  document.body.removeChild(ta);
}

function copyPrompt() {
  var text = $("promptOutput").textContent || "";
  if (!text.trim() || text.indexOf("Select parameters") >= 0 || text.indexOf("Выберите") >= 0 || text.indexOf("Выберите") >= 0) {
    notify("Сначала соберите промпт", "warn"); return;
  }
  safeCopy(text, "Промпт", this);
}

function copyJson() {
  try {
    var jsonData = buildJson();
    var text = JSON.stringify(jsonData, null, 2);
    if (!text || text === "{}" || text === "null") { notify("JSON пуст", "warn"); return; }
    safeCopy(text, "JSON", this);
  } catch (e) {
    notify("Ошибка JSON: " + e.message, "err");
  }
}

window.updatePrompt = updatePrompt; // Expose for verification
function updatePrompt() {
  const flat = buildFlatPrompt();
  $("promptOutput").textContent = flat;
  $("jsonOutput").textContent = JSON.stringify(buildJson(), null, 2);
  checkConflicts();
}

function savePrompt() {
  const text = $("promptOutput").textContent || "";
  if (!text.trim() || text.includes("Select parameters") || text.includes("Выберите") || text.includes("Выберите")) { notify("Нечего сохранять", "warn"); return; }
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "vpe-prompt-" + Date.now() + ".txt"; a.click();
  URL.revokeObjectURL(url);
  notify("Файл сохранён");
}

function saveJson() {
  try {
    const jsonData = buildJson();
    const text = JSON.stringify(jsonData, null, 2);
    if (!text || text === "{}" || text === "null") { notify("JSON пуст", "warn"); return; }
    const blob = new Blob([text], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "vpe-json-" + Date.now() + ".json"; a.click();
    URL.revokeObjectURL(url);
    notify("JSON сохранён");
  } catch (e) {
    notify("Ошибка JSON: " + e.message, "err");
  }
}

function resetAll() {
  ["aiModel", "cameraBody", "aspectRatio", "resolution", "purpose", "format", "medium", "lens", "focalLength", "shotSize", "aperture", "angle", "composition", "quality", "colorPalette", "mood", "referenceType", "photoStyle", "cinemaStyle", "directorStyle", "artStyle", "filmStock", "quickStyle", "fashionFoodStyle", "mainSubject", "textContent", "negativePrompt", "emotion", "cinematicPreset", "ambience", "foley", "cinematicFx", "lightType", "motionBlurCharacter", "motionBlurLocation", "motionBlurBackground", "motionBlurForeground"].forEach(k => state[k] = "");
  state.lighting = []; state.lightFX = []; state.colorPalette = ""; state.skinDetail = []; state.hairDetail = []; state.material = []; state.typography = [];
  state.generateFourMode = false; state.grid3x3Mode = false; state.maxConsistency = false; state.beforeAfter = false; state.seamlessPattern = false; state.motionBlurMode = false; state.motionBlurBackgroundEnabled = false; state.motionBlurForegroundEnabled = false; state.seed = "";
  state.mjVersion = "7"; state.mjStyle = ""; state.mjStylize = 250; state.mjChaos = 0; state.mjWeird = 0; state.mjSref = "";
  state.sdCfg = 7; state.sdSteps = 25;
  state.fluxModel = "dev"; state.fluxGuidance = 3.5; state.fluxSteps = 28;
  state.dalleStyle = "vivid"; state.dalleQuality = "hd";
  state.skinRenderBoost = false; state.hairRenderBoost = false;
  state.referenceImages = []; state.referenceWeight = 50;
  state.promptFormat = "flat";
  state.isStandardPresetActive = false;

  // Reset inputs
  $("mainSubject").value = "";
  $("textContent").value = "";
  $("negativePrompt").value = "";
  $("generateFourMode").checked = false;
  $("grid3x3Mode").checked = false;
  $("maxConsistency").checked = false;
  $("motionBlurMode").checked = false;
  if ($("motionBlurBackgroundEnabled")) $("motionBlurBackgroundEnabled").checked = false;
  if ($("motionBlurForegroundEnabled")) $("motionBlurForegroundEnabled").checked = false;
  $("skinRenderBoost").checked = false;
  $("hairRenderBoost").checked = false;
  $("lensSectionV2").classList.remove("disabled-section");
  $("beforeAfter").checked = false;
  $("beforeAfter").disabled = false;
  $("seamlessPattern").checked = false;
  $("seamlessPattern").disabled = false;
  $("generateFourMode").disabled = false;
  $("grid3x3Mode").disabled = false;
  $("maxConsistency").disabled = false;
  $("motionBlurMode").disabled = false;
  if ($("motionBlurBackgroundEnabled")) $("motionBlurBackgroundEnabled").disabled = false;
  if ($("motionBlurForegroundEnabled")) $("motionBlurForegroundEnabled").disabled = false;
  $("skinRenderBoost").disabled = false;
  $("hairRenderBoost").disabled = false;
  if ($("motionBlurCharacter")) $("motionBlurCharacter").value = "";
  if ($("motionBlurLocation")) $("motionBlurLocation").value = "";
  if ($("motionBlurBackground")) $("motionBlurBackground").value = "";
  if ($("motionBlurForeground")) $("motionBlurForeground").value = "";
  $("seedInput").value = "";
  // Reset engine param sliders
  $("mjStylizeSlider").value = 250; $("mjStylizeVal").textContent = "250";
  $("mjChaosSlider").value = 0; $("mjChaosVal").textContent = "0";
  $("mjWeirdSlider").value = 0; $("mjWeirdVal").textContent = "0";
  $("mjSrefInput").value = "";
  $("sdCfgSlider").value = 7; $("sdCfgVal").textContent = "7";
  $("sdStepsSlider").value = 25; $("sdStepsVal").textContent = "25";
  $("fluxGuidanceSlider").value = 3.5; $("fluxGuidanceVal").textContent = "3.5";
  $("fluxStepsSlider").value = 28; $("fluxStepsVal").textContent = "28";
  $("referenceImages").value = "";
  $("refWeightSlider").value = 50;
  $("weightValue").textContent = "50";

  // FIX: Reset all range sliders explicitly
  document.querySelectorAll('input[type="range"]').forEach(slider => {
    const def = slider.getAttribute('value') || slider.getAttribute('data-default') || slider.min || 0;
    slider.value = def;
    // Try to update sibling display if exists (usually id + "Val")
    const disp = document.getElementById(slider.id.replace("Slider", "Val"));
    if (disp) disp.textContent = def;
  });

  $("imagePreviewContainer").style.display = "none";
  $("referenceOptions").style.display = "none";
  $("referenceWeight").style.display = "none";
  $("imagePreviews").innerHTML = "";
  $("modelHint").style.display = "none";

  // Clear UI — buttons, conflict states, toggle labels
  document.querySelectorAll(".option-btn[data-group]").forEach(b => {
    b.classList.remove("active", "conflict-disabled");
    b.disabled = false;
    b.title = "";
    b.querySelectorAll(".slot-tag").forEach(t => t.remove());
  });
  document.querySelectorAll(".toggle-label").forEach(l => {
    l.classList.remove("checked");
    l.style.opacity = "";
    l.title = "";
  });
  // FIX: Also reset disabled-section on all left-panel sections
  document.querySelectorAll(".left-panel > .section.disabled-section").forEach(sec => {
    sec.classList.remove("disabled-section");
  });

  $("resolutionInfo").style.display = "block";
  $("resolutionOptions").style.display = "none";
  $("resolutionOptions").innerHTML = "";

  updateAll();
  notify("Всё сброшено");
}

// =============================================
// AI ENHANCE LOGIC
// =============================================

async function enhancePrompt() {
  const ta = document.getElementById('mainSubject');
  const text = ta.value.trim();
  if (!text) { ta.placeholder = 'Сначала введите идею...'; return; }

  const btn = document.getElementById('enhanceBtn');
  const originalContent = btn.innerHTML;
  btn.classList.add('loading');
  btn.innerHTML = '<span>⏳</span> Улучшаю...';
  btn.disabled = true;

  try {
    let improvedText = "";
    // System prompt construction
    const currentModel = state.aiModel || "General";
    const systemPrompt = `You are a professional video prompt engineer.
Expand this scene description into a detailed visual prompt.
Structure: [Subject/Character details] + [Environment/Location] + [Lighting/Atmosphere] + [Action/Pose].
Keep it concise but vivid (under 150 words). Write ONLY the improved prompt.
Target Model: ${currentModel}
Original idea: "${text}"`;

    // Call server-side enhance endpoint (keeps API key secure)
    const res = await fetch('/api/enhance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, systemPrompt })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    improvedText = data.text || "";

    if (improvedText && improvedText !== text) {
      ta.value = improvedText.trim();
      // trigger simple input event to update counts if existing
      if (window.handleInput) window.handleInput();
      notify("Промпт улучшен");
    } else {
      notify("AI enhance пока не настроен - задайте GROQ_API_KEY в .env", "warn");
    }
  } catch (e) {
    console.error(e);
    notify("AI Error: " + e.message, "err");
  }

  btn.classList.remove('loading');
  btn.innerHTML = originalContent;
  btn.disabled = false;
}

async function callGemini(prompt) {
  if (!state.apiKey) throw new Error("Google API key not configured");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${state.apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });
  if (!response.ok) throw new Error(`Gemini HTTP ${response.status}`);
  const data = await response.json();
  if (data.error) throw new Error(data.error?.message || "Gemini API error");
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function callGroq(prompt, key) {
  if (!key) throw new Error("Groq API key not provided");
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    })
  });
  if (!response.ok) throw new Error(`Groq HTTP ${response.status}`);
  const data = await response.json();
  if (data.error) throw new Error(data.error?.message || "Groq API error");
  return data.choices?.[0]?.message?.content || "";
}


/* ===== SCRIPT TAG SPLIT ===== */


// === COLLAPSIBLE LOGIC v3 (Strict + Quick Style Support) ===
(function () {
  const SECTION_MAP = {
    "aiModel": "aiModelSection",
    "cameraBody": ["cameraSectionV2", "photoCameraSectionV2"],
    "lens": "lensSectionV2",
    "focalLength": "apertureSection",
    "shotSize": "apertureSection",
    "medium": "artStyleSectionV2",
    "aperture": "apertureSection",
    "angle": "apertureSection",
    "composition": "apertureSection",
    "filmStock": "filmStockSection",
    "lighting": "lightingSectionV2",
    "lightType": "lightingSectionV2",
    "lightFX": "lightingSectionV2",
    "colorPalette": "paletteSectionV2",
    "mood": "moodSectionV2",
    "skinDetail": "skinDetailSection",
    "hairDetail": "hairDetailSection",
    "material": "materialSection",
    "typography": "typographySection",
    "photoStyle": "photoStyleSection",
    "cinemaStyle": "cinemaStyleSection",
    "directorStyle": "directorStyleSection",
    "format": "formatSection",
    "purpose": "purposeSection",
    "referenceImages": "referencesSection",
    "negativePrompt": "negativeSection",
    "emotion": "emotionSection",
    "ambience": "audioSectionV2",
    "foley": "audioSectionV2",
    "cinematicFx": "audioSectionV2",
    "artStyle": "artStyleSectionV2"
  };

  function getCollapsibleSections() {
    return Array.from(document.querySelectorAll('.section')).filter(sec =>
      !sec.classList.contains('no-collapse') && !!sec.querySelector('.section-header')
    );
  }

  function areAllCollapsibleSectionsCollapsed() {
    const sections = getCollapsibleSections();
    if (!sections.length) return false;
    return sections.every(sec => sec.classList.contains('collapsed'));
  }

  function setAllCollapsibleSectionsCollapsed(shouldCollapse) {
    getCollapsibleSections().forEach(sec => {
      if (shouldCollapse) sec.classList.add('collapsed');
      else sec.classList.remove('collapsed');
    });
  }

  function syncCollapseAllButtonLabel() {
    const btn = document.getElementById('headerCollapseBtn');
    if (!btn) return;
    const allCollapsed = areAllCollapsibleSectionsCollapsed();
    btn.textContent = allCollapsed ? 'Развернуть' : 'Свернуть';
    btn.title = allCollapsed ? 'Развернуть все окна' : 'Свернуть все окна';
  }

  window.toggleAllSections = function () {
    const allCollapsed = areAllCollapsibleSectionsCollapsed();
    setAllCollapsibleSectionsCollapsed(!allCollapsed);
    syncCollapseAllButtonLabel();
  };
  window.syncCollapseAllButtonLabel = syncCollapseAllButtonLabel;

  function toggleSection(header, forceState = null) {
    const section = header.parentElement;
    if (!section) return;

    if (forceState !== null) {
      if (forceState === true) section.classList.remove('collapsed'); // Open
      else section.classList.add('collapsed'); // Close
    } else {
      section.classList.toggle('collapsed');
    }
    syncCollapseAllButtonLabel();
  }

  function initCollapsible() {
    const sections = document.querySelectorAll('.section');

    // STRICT INITIAL STATE: 
    // Open: Quick Presets, Presets. 
    // Closed: Everything else.

    sections.forEach(sec => {
      const header = sec.querySelector('.section-header');
      if (!header) return;
      const isStaticSection = sec.classList.contains('no-collapse');

      if (isStaticSection) {
        if (header.__vpeCollapseHandler) {
          header.removeEventListener('click', header.__vpeCollapseHandler);
          header.__vpeCollapseHandler = null;
        }
        header.dataset.bound = "true";
        sec.classList.remove('collapsed');
        return;
      }

      // Bind click robustly even if HTML already contains data-bound="true".
      // Some saved HTML snapshots persist this attribute and otherwise block binding.
      if (header.__vpeCollapseHandler) {
        header.removeEventListener('click', header.__vpeCollapseHandler);
      }
      header.__vpeCollapseHandler = (e) => {
        if (e.target.closest('.help-tip') || e.target.closest('.mode-badge') || e.target.closest('input') || e.target.closest('button')) return;
        toggleSection(header);
      };
      header.addEventListener('click', header.__vpeCollapseHandler);
      header.dataset.bound = "true";

      // Initial State
      // FIX: Removed jsonSection from default open list
      if (sec.id === 'quickStyleSection' || sec.id === 'presetsSection' || sec.id === 'generationModeSection' || sec.id === 'promptSection') {
        sec.classList.remove('collapsed');
      } else {
        sec.classList.add('collapsed');
      }
    });
    syncCollapseAllButtonLabel();
    console.log('VPE: Strict collapsible state applied.');
  }

  // Expose: Expand related sections for PRESETS
  window.expandRelatedSections = function (presetValues) {
    // 1. Collapse all param sections (keep nav sections open)
    document.querySelectorAll('.section').forEach(sec => {
      if (sec.classList.contains('no-collapse')) return;
      if (sec.id === 'quickStyleSection' || sec.id === 'presetsSection' || sec.id === 'generationModeSection') return;
      sec.classList.add('collapsed');
    });

    // 2. Open Related
    const keys = Object.keys(presetValues);

    // Always open Core
    document.getElementById('aiModelSection')?.classList.remove('collapsed');
    document.getElementById('descriptionSection')?.classList.remove('collapsed');

    keys.forEach(k => {
      if (SECTION_MAP[k]) {
        const ids = Array.isArray(SECTION_MAP[k]) ? SECTION_MAP[k] : [SECTION_MAP[k]];
        ids.forEach(id => {
          const el = document.getElementById(id);
          if (el && presetValues[k]) el.classList.remove('collapsed');
        });
      }
      // LightType special
      if ((k === 'lighting' || k === 'lightType') && presetValues[k]) {
        document.getElementById('lightingSectionV2')?.classList.remove('collapsed');
      }
    });
    syncCollapseAllButtonLabel();
  };

  // Expose: Expand for QUICK STYLE
  window.expandSectionsForQuickStyle = function (isActive) {
    if (!isActive) return; // If unselected, do nothing or user preference? Let's leave as is.

    // When Quick Style is Active:
    // Open: Quick Style, AI Model, Aspect Ratio, Resolution, Generation Mode.
    // Close: All artistic controls (Camera, Lighting, Styles, etc) as they are disabled/locked.

    const keepOpen = [
      'quickStyleSection',
      'aiModelSection',
      'aspectRatioSection',
      'descriptionSection',
      'generationModeSection',
      'promptSection',
      'jsonSection'
    ];

    document.querySelectorAll('.section').forEach(sec => {
      if (sec.classList.contains('no-collapse')) {
        sec.classList.remove('collapsed');
        return;
      }
      if (keepOpen.includes(sec.id)) {
        sec.classList.remove('collapsed');
      } else {
        sec.classList.add('collapsed');
      }
    });
    syncCollapseAllButtonLabel();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCollapsible);
  } else {
    initCollapsible();
  }
  window.resetAll = resetAll; // Expose for verification
  window.buildStructuredPrompt = buildStructuredPrompt; // Expose for verification

})();


/* ===== SCRIPT TAG SPLIT ===== */


(() => {
  if (window.__docSyncV1) return;
  window.__docSyncV1 = true;

  const CINEMATIC_PRESETS = {
    "Холодный шпионский нуар": "Cold desaturated palette, green-cyan color bias, slate grey shadows, muted olive tones, soft side lighting, moody atmosphere",
    "Неоновый кибер-город": "Cyberpunk aesthetic, neon pink and cyan lighting, deep crushed blacks, wet street reflections, volumetric fog, teal and orange grading",
    "Пустыня эпик (Дюна)": "Monochromatic spice sand palette, beige and muted gold, hazy atmosphere, bleached sky, overexposed highlights, epic scale",
    "Пастельная симметрия": "Pastel color palette, soft pink and baby blue hues, high key lighting, flat symmetrical composition, whimsical atmosphere",
    "Грязная военная драма": "Bleach bypass effect, desaturated colors, high contrast, metallic grain, mud and steel tones, handheld camera vibe",
    "Золотой нуар": "Warm tungsten lighting, deep mahogany shadows, rich gold and black tones, Rembrandt lighting, classic film aesthetic",
    "Матрица (Зеленый тинт)": "Sickly green tint, digital rain atmosphere, high contrast black leather tones, fluorescent green highlights, unnatural lighting",
    "Безумный Макс (Teal & Orange)": "Hyper-saturated Teal and Orange, scorched earth, vibrant blue sky contrast, rusty metal textures, high octane action"
  };

  const ART_STYLES = {
    "Фотореализм": "photorealistic, ultra-detailed, sharp focus, natural skin texture, 8K resolution",
    "Кинематографичный": "cinematic film still, anamorphic lens flare, shallow DOF, color graded",
    "Иллюстрация": "digital illustration, clean vector-like linework, cel-shaded, vibrant flat colors",
    "Масло (Картина)": "oil painting on linen canvas, visible impasto brushstrokes, layered glazing, rich pigment",
    "Акварель": "watercolor on cold-pressed paper, wet-on-wet blending, granulating pigment, white paper showing through",
    "Аниме": "anime cel animation style, bold outlines, flat color fills, dramatic speed lines, large expressive eyes",
    "Концепт-арт": "concept art, painterly digital rendering, environment design, matte painting technique, atmospheric perspective",
    "Флэт / Вектор": "flat vector design, solid color fills, no gradients, geometric shapes, scalable clean edges",
    "Карандашный скетч": "graphite pencil sketch on textured paper, cross-hatching shading, visible paper grain, HB to 6B range",
    "Пиксель-арт": "pixel art, 16-bit retro palette, dithering, anti-aliased edges, limited color count",
    "Комикс": "comic book style, bold ink outlines, Ben-Day dot halftone shading, dynamic panel layout",
    "3D Рендер (Октан)": "3D render, Octane render engine, subsurface scattering, PBR materials, global illumination",
    "Винтаж / Ретро": "vintage retro style, Kodak Portra 400 film emulation, grain, faded warm tones, light leaks",
    "Минимализм": "minimalist style, ample negative space, single focal point, muted two-tone palette, clean geometry",
    "Импрессионизм": "Impressionist painting, short visible brushstrokes, en plein air, shifting natural light, Monet-inspired palette",
    "Экспрессионизм": "Expressionist style, distorted angular forms, intense saturated colors, emotional raw brushwork, Kirchner-inspired",
    "Сюрреализм": "surrealist painting, impossible architecture, melting forms, Dali-inspired dreamscape, juxtaposed scale",
    "Модерн (Ар-нуво)": "Art Nouveau style, sinuous organic whiplash curves, floral motifs, Mucha-inspired decorative border",
    "Ар-деко": "Art Deco style, geometric chevron patterns, gold and black palette, chrome accents, 1920s glamour",
    "Барокко": "Baroque painting, Caravaggio-style tenebrism, rich velvet textures, dramatic chiaroscuro, gilded details",
    "Ренессанс": "Renaissance painting, sfumato technique, classical proportion, linear perspective, tempera-like matte finish",
    "Поп-арт": "Pop Art style, Warhol-inspired screen print, bold primary colors, repeated motifs, halftone overlay",
    "Киберпанк": "cyberpunk style, neon-drenched rain-slicked streets, holographic HUD overlays, teal-magenta palette",
    "Стимпанк": "steampunk style, brass clockwork mechanisms, Victorian riveted iron, steam vents, sepia-copper palette",
    "Фэнтези": "epic fantasy art, magical particle effects, enchanted glow, mythical creatures, rich saturated palette",
    "Готика": "Gothic art style, pointed arch architecture, stained glass light, dark stone textures, blood-red accents",
    "Вейпорвейв": "vaporwave aesthetic, pastel neon pink-cyan gradient, Roman bust, VHS scanlines, retro grid floor",
    "Изометрия": "isometric 3D illustration, 30-degree projection, no perspective distortion, clean edges, dimetric view",
    "Лоу-поли": "low poly 3D art, flat-shaded triangular facets, limited polygon count, geometric minimalism",
    "Укиё-э": "ukiyo-e woodblock print, flat perspective, bold black outlines, limited earth-tone palette, Hokusai-inspired",
    "Баухаус": "Bauhaus design, primary color triad, geometric sans-serif typography, functional grid layout",
    "Абстракция": "abstract non-representational art, bold gestural marks, color field composition, Rothko-inspired luminous layers",
    "Гуашь": "gouache painting, opaque matte pigment, flat even coverage, posterized tonal range",
    "Пуантилизм": "pointillism style, composed entirely of small distinct dots, Seurat-inspired optical mixing",
    "Кубизм": "Cubist style, simultaneous multiple viewpoints, fragmented geometric planes, muted browns and grays",
    "Нео-Нуар": "neo-noir style, high-contrast side lighting, wet reflective streets, venetian blind shadows, desaturated teal",
    "Граффити": "graffiti street art, spray paint texture, drip marks, wildstyle lettering, concrete wall background",
    "Манга": "manga style, screentone shading, dynamic panel composition, speed lines, detailed ink linework",
    "Чиби": "chibi style, 2:1 head-to-body ratio, round simplified features, cute exaggerated expressions",
    "Двойная экспозиция": "double exposure effect, two overlapping silhouette layers, forest-inside-portrait, blended transparency",
    "Глитч-арт": "glitch art, RGB channel shift, pixel sorting artifacts, data moshing, corrupted scanlines",
    "Витраж": "stained glass art, lead came divisions, backlit translucent jewel-tone panels, Gothic rose window",
    "Бумажный арт": "paper cut-out art, layered paper depth, cast shadows between layers, torn textured edges",
    "Пластилин (Claymation)": "claymation style, visible fingerprint clay texture, stop-motion frame, handcrafted imperfections",
    "Чертеж (Blueprint)": "technical blueprint schematic, white lines on navy background, annotation labels, cross-section view"
  };
  window.ART_STYLES_MAP = ART_STYLES;

  const MEDIUM_OPTIONS = [
    ["Фотография", "photograph, DSLR capture, natural grain, accurate color reproduction"],
    ["Цифровой арт", "digital art, Wacom tablet rendering, smooth blending, crisp edges"],
    ["Масло на холсте", "oil on canvas, thick impasto texture, layered glazing, visible weave"],
    ["Акварель", "watercolor on Arches cold-pressed paper, wet-on-wet bleeds, pigment granulation"],
    ["Чернильный рисунок", "ink drawing on vellum, Micron pen linework, high-contrast stippling"],
    ["Уголь", "compressed charcoal on toned paper, smudged soft gradients, gritty texture"],
    ["Акрил", "acrylic painting, quick-dry matte finish, bold opaque coverage, palette knife marks"],
    ["Микс-медиа", "mixed media collage, layered paper textures, paint splatter, found objects"],
    ["Скульптура", "marble sculpture, carved chisel marks, smooth polished surface, directional studio light"],
    ["Коллаж", "collage artwork, torn magazine cutouts, visible glue edges, overlapping layers"],
    ["Гуашь", "gouache on illustration board, opaque matte finish, flat even coats"],
    ["Пастель", "soft pastel on Mi-Teintes paper, powdery blended strokes, visible tooth texture"],
    ["Графит (Карандаш)", "graphite pencil 2B–6B range, fine cross-hatching, subtle tonal gradation"],
    ["Цветные карандаши", "Prismacolor colored pencil, burnished layered strokes, waxy smooth blending"],
    ["Восковые мелки", "wax crayon on construction paper, childlike strokes, heavy texture lines"],
    ["Спрей-арт", "Montana spray paint on concrete, aerosol overspray halo, drip textures"],
    ["Фреска", "buon fresco on wet lime plaster, muted mineral pigments, craquelure aging"],
    ["Мозаика", "Byzantine mosaic, gold smalti tesserae, visible grout lines, fixed frontal pose"],
    ["Гравюра (Дерево)", "woodcut relief print, carved parallel lines, visible wood grain, bold black ink"],
    ["Линогравюра", "linocut print, crisp carved edges, flat ink coverage, two-color registration"],
    ["Офорт", "copper plate etching, fine aquatint tones, cross-hatched shadows, acid-bitten lines"],
    ["Шелкография", "Warhol-style screen print, layered flat CMYK inks, slight registration offset"],
    ["Энкаустика", "encaustic painting, melted beeswax pigment, translucent layered depth, textured surface"],
    ["Темпера", "egg tempera on wood panel, fine hatched brushwork, luminous matte glow"],
    ["Батик", "batik wax-resist dyed fabric, crackle vein pattern, indigo and earth tones"],
    ["Вышивка", "embroidered textile art, visible thread stitching, satin and chain stitch detail"],
    ["Стеклодувное искусство", "blown glass art, translucent organic forms, internal bubble inclusions, Murano-style"],
    ["Бронзовое литье", "lost-wax bronze cast, green verdigris patina, polished highlight ridges"]
  ];

  const MOOD_OPTIONS = [
    ["Безмятежность", "serene peaceful atmosphere, still water reflection, soft pastel dawn sky, gentle breeze implied"],
    ["Драма", "dramatic intense atmosphere, storm clouds, high-contrast lighting, emotional peak moment"],
    ["Таинственность", "mysterious enigmatic mood, obscured details, fog-shrouded, half-hidden subject, cool muted tones"],
    ["Радость", "cheerful bright mood, sunlit warm palette, open airy space, golden light, joyful energy"],
    ["Меланхолия", "melancholic contemplative mood, overcast gray sky, muted desaturated tones, solitary figure"],
    ["Эпичность", "epic grand scale, awe-inspiring vista, massive clouds, tiny figure for scale, orchestral energy"],
    ["Эфирность", "ethereal dreamy atmosphere, soft glow, light mist, delicate transparency, otherworldly luminance"],
    ["Гритти (Жесткость)", "gritty raw urban atmosphere, concrete textures, grain, desaturated, unflinching realism"],
    ["Романтика", "romantic soft intimate mood, warm candlelight glow, shallow DOF, blush and peach tones"],
    ["Футуризм", "futuristic sci-fi atmosphere, holographic displays, sleek reflective surfaces, cool blue accent lighting"],
    ["Ностальгия", "nostalgic vintage warmth, film grain, faded color edges, memory-like soft vignette"],
    ["Угроза", "ominous foreboding, dark gathering clouds, deep shadows, desaturated greens, impending dread"],
    ["Причудливость", "whimsical playful fantasy, floating elements, impossible physics, candy-colored, childlike wonder"],
    ["Мрачность", "somber subdued atmosphere, heavy silence, muted monochrome, still motionless air, grief"],
    ["Эйфория", "euphoric ecstatic energy, lens flare burst, vibrant saturated colors, dynamic motion blur"],
    ["Напряжение", "tense suspenseful thriller mood, tight framing, shallow DOF, desaturated with single color accent"],
    ["Спокойствие", "tranquil undisturbed stillness, mirror-flat water, pastel predawn sky, absolute calm"],
    ["Хаос", "chaotic frenzied energy, overlapping elements, motion blur, fragmented composition, overwhelm"],
    ["Антиутопия", "dystopian post-apocalyptic, rusted metal, crumbling concrete, toxic smog, oppressive gray-green"],
    ["Утопия", "utopian idyllic harmony, pristine nature, crystal-clear water, golden sunlight, perfect balance"],
    ["Призрак", "haunting ghostly unease, translucent figure, pale desaturated, lingering mist, cold light"],
    ["Уют (Хюгге)", "cozy hygge atmosphere, warm fireplace glow, knit textures, steaming mug, soft amber 2500K"],
    ["Величие", "majestic regal grandeur, gilded architecture, volumetric light shafts, awe-inspiring scale"],
    ["Жуть", "eerie unsettling mood, slightly wrong proportions, uncanny valley, dim flickering light"],
    ["Живость", "vibrant lively energy, bustling crowd, saturated warm colors, motion implied, street life"],
    ["Одиночество", "lonely isolated solitude, vast empty landscape, single tiny figure, overwhelming negative space"],
    ["Святость", "sacred spiritual ambiance, divine crepuscular light rays, cathedral scale, reverent hush"],
    ["Индастриал", "industrial atmosphere, steel beams, welding sparks, steam vents, concrete and rust textures"],
    ["Под водой", "underwater atmosphere, deep blue-green gradient, dancing caustic light patterns, floating particles"],
    ["Космос", "celestial cosmic atmosphere, star field nebula, infinite depth, aurora borealis glow, vast silence"]
  ];

  const LIGHTING_OPTIONS = [
    ["Золотой час", "golden hour lighting, warm soft sun low in the sky, long shadows, rim lighting, 2500K temperature"],
    ["Естественный свет", "soft natural overcast light, diffused shadows, even illumination, window light quality"],
    ["Студийный свет", "studio lighting, 3-point setup, key light, fill light, hair light, controlled contrast, professional look"],
    ["Кинематографичный", "cinematic lighting, motivated light sources, atmospheric haze, volumetric shafts, teal and orange contrast"],
    ["Рембрандт", "Rembrandt lighting, chiaroscuro, single light source, signature triangle on cheek, dramatic mood"],
    ["Неоновый (Киберпанк)", "neon lighting, pink and cyan gel lights, dark background, wet reflections, futuristic club atmosphere"],
    ["Жесткий свет", "hard sunlight, high noon, sharp distinct shadows, high contrast, crisp details"],
    ["Низкий ключ (Low Key)", "low key lighting, predominantly dark tones, silhouette, rim light only, mysterious mood"],
    ["Высокий ключ (High Key)", "high key lighting, predominantly white tones, overexposed background, optimistic ethereal mood"],
    ["Свет от свечи", "candlelight, flickering warm orange glow, deep shadows, intimate atmosphere, low lux"],
    ["Биолюминесценция", "bioluminescent lighting, glowing organic blue-green light, underwater or alien forest vibe, mysterious glow"],
    ["Боке", "bokeh background lighting, city lights blur, depth of field bubbles, festive atmosphere"],
    ["Гобо (Тень)", "gobo lighting pattern, window blind shadows, tree leaf shadows, dappled light effect"],
    ["Вспышка (90-е)", "direct camera flash, harsh shadows, red-eye aesthetic, vintage polaroid feel, disposable camera"],
    ["Синий час", "blue hour lighting, pre-dawn/post-sunset, deep blue sky, cool ambient light, melancholic feel"],
    ["Объемный свет", "volumetric lighting, god rays, light shafts through dust/smoke, breathable atmosphere"],
    ["Кольцевая лампа", "ring light, distinct circular catchlight in eyes, even flat facial lighting, beauty vlog aesthetic"],
    ["Инфракрасный", "infrared photography, surreal false color foliage, white grass, dark black sky, dreamlike"],
    ["Ультрафиолет", "blacklight UV, fluorescent paint glowing, purple haze, club atmosphere"],
    ["Свет от экрана", "screen glow, cool blue light from below face, dark room, digital obsession mood"]
  ];

  const COMPOSITION_OPTIONS = [
    ["Правило третей", "rule of thirds composition, subject on grid intersection, balanced negative space"],
    ["Центрирование", "centered composition, Wes Anderson symmetry, direct confrontation, stable frame"],
    ["Золотое сечение", "golden ratio spiral composition, natural organic flow, divine proportion aesthetic"],
    ["Ведущие линии", "leading lines, perspective depth, converging geometry drawing eye to subject"],
    ["Фрейминг", "frame within a frame, looking through window/arch, depth layering, voyeuristic feel"],
    ["Негативное пространство", "massive negative space, minimalism, isolation, subject in corner, vast emptiness"],
    ["Диагонали", "diagonal composition, dynamic tension, movement direction, energetic imbalance"],
    ["Симметрия", "perfect horizontal symmetry, reflection, mirror image, balanced stability"],
    ["Заполнение кадра", "fill the frame, no background, pattern texture focus, claustrophobic intensity"]
  ];

  const COLOR_PALETTE_OPTIONS = [
    ["Teal & Orange", "teal and orange cinematic color grade, Hollywood blockbuster LUT, skin warm + shadow cool"],
    ["Jewel Tones", "jewel tones, emerald #046307, ruby #9B111E, sapphire #0F52BA, amethyst #9966CC, rich deep saturation"],
    ["Candy", "candy bubblegum colors, hot pink, electric mint, lemon yellow, playful high-key palette"],
    ["Autumn", "autumn palette, burnt orange, crimson red, goldenrod yellow, chestnut brown, dry leaf texture"],
    ["Ocean", "ocean aquatic palette, deep navy, turquoise, seafoam green, pearl white, underwater caustic tint"],
    ["Sunset Gradient", "sunset gradient, horizon band orange->coral->magenta->violet->indigo, warm-to-cool transition"],
    ["Nordic", "Nordic Scandinavian palette, muted dove white, steel blue-gray, pale birch, minimal warm accent"],
    ["Film Negative", "inverted film negative colors, complementary reversal, eerie unnatural chromatic shift"],
    ["Cross-Processed", "cross-processed film, E-6 in C-41 chemistry, unexpected green-magenta shift, heavy contrast"]
  ];

  const CAMERA_OPTIONS = [
    ["ARRI Alexa 35", "shot on ARRI Alexa 35, digital cinema, organic textures, high dynamic range", "Cinema / Индустриальный стандарт цифрового кино, 17 стопов динамического диапазона"],
    ["Panavision Panaflex Gold II", "shot on Panavision Panaflex Gold II, 35mm film, classic film look, organic grain", "Cinema / Легендарная 35мм камера Голливуда"],
    ["IMAX MKIV", "shot on IMAX MKIV, imax 70mm, 15/70mm film, massive resolution, expansive scale", "Cinema / Максимальное разрешение 15/70мм для иммерсивного кино"],
    ["Sony Venice 2", "shot on Sony Venice 2, full frame, dual base iso, rich colors", "Cinema / Полнокадровая, отличная цветопередача (Top Gun: Maverick)"],
    ["RED V-RAPTOR", "shot on RED V-RAPTOR, 8k resolution, high frame rate, sharp detail", "Cinema / 8K VV сенсор, высокая частота кадров"],
    ["BMD URSA Mini Pro 12K", "shot on Blackmagic URSA Mini Pro 12K, 12k raw, film-like color science", "Cinema / 12K RAW, кинематографичная цветопередача"],
    ["Panavision System 65", "shot on Panavision System 65, 65mm film, epic vistas, extreme detail", "Cinema / 65мм плёнка, эпические панорамы"],
    ["ARRIFLEX 765", "shot on ARRIFLEX 765, 65mm film, visual clarity, shallow depth of field", "Cinema / Скоростная 65мм, невероятная чёткость"],
    ["Mitchell BNC", "shot on Mitchell BNC, golden age hollywood, classic cinema", "Cinema / Рабочая лошадка Золотого века Голливуда"],
    ["Aaton XTR Prod", "shot on Aaton XTR Prod, super 16mm, organic film grain, vintage aesthetic", "Vintage / Классика Super 16мм, винтажная эстетика"],
    ["Technicolor 3-Strip", "shot on Technicolor 3-Strip, 1930s cinema, saturated colors, vibrant palette", "Vintage / Винтаж 1930-х, насыщенные основные цвета"],
    ["Bolex H16", "shot on Bolex H16, 16mm film, mechanical feel, vintage home movie", "Vintage / Культовая 16мм, авангардный кинематограф"],
    ["Super 8", "shot on Super 8 film, nostalgic, heavy grain, warm tones", "Vintage / Ностальгия, крупное зерно, тёплые тона"],
    ["GoPro HERO 12", "shot on GoPro HERO 12, action camera, ultra wide, pov, fisheye distortion", "Modern & Special / Экшн-камера, ультра-широкий угол, POV"],
    ["iPhone 15 Pro Log", "shot on iPhone 15 Pro Log, mobile cinematography, sharp digital look", "Modern & Special / Мобильная кинематография, Log-профиль"],
    ["Panasonic Lumix GH6", "shot on Panasonic Lumix GH6, mft sensor, cinematic micro four thirds", "Modern & Special / Micro Four Thirds, отличная стабилизация"],
    ["Canon K35 Look", "shot through Canon K35 look, vintage glass, soft highlights, warm flares", "Optic Look / Винтажный стиль 70-х, мягкие блики"],
    ["Cooke S4 Look", "shot through Cooke S4 look, the cooke look, dimensional images, smooth falloff", "Optic Look / Знаменитый 'Cooke Look', объём и мягкость"]
  ];
  const CAMERA_CLASSIFICATIONS = [
    ["Cinema", "1. Цифровое и Плёночное Кино (Cinema)"],
    ["Vintage", "2. Ретро и Винтаж (Vintage)"],
    ["Modern & Special", "3. Современные и Специальные (Modern & Special)"],
    ["Optic Look", "4. Оптические «Луки» (Optic Looks)"]
  ];
  const PHOTO_CAMERA_OPTIONS = [
    ["Arri Alexa 35", "shot on Arri Alexa 35, REVEAL color science, cinematic dynamic range, organic highlights", "Cinema Flagships / Золотой стандарт Голливуда. Славится натуральными оттенками кожи и невероятным динамическим диапазоном."],
    ["RED V-Raptor XL", "shot on RED V-Raptor XL, 8K resolution, sharp details, high contrast cinema, raw texture", "Cinema Flagships / Мощная 8K камера для блокбастеров. Даёт очень чёткую, детализированную и контрастную «цифровую» картинку."],
    ["Blackmagic URSA Mini Pro 12K", "shot on Blackmagic URSA Mini Pro 12K, filmic color science, 12K detail, soft digital look", "Cinema Flagships / Известна своей «плёночной» цветопередачей при огромном разрешении. Даёт мягкие, приятные цвета."],
    ["Sony Alpha 7R V", "shot on Sony A7R V, 61MP, ultra-detailed, sharp focus, hyper-realistic, commercial photography", "Mirrorless Pros / Король детализации (61 Мп). Идеальна для ландшафтов, коммерческой и студийной съёмки."],
    ["Nikon Z9", "shot on Nikon Z9, fast action, sports photography aesthetic, high speed burst, sharp clarity", "Mirrorless Pros / Флагман для репортажей и спорта. Эстетика скорости и безупречной чёткости в любых условиях."],
    ["Canon EOS R3", "shot on Canon EOS R3, Canon color science, beautiful skin tones, high-performance mirrorless", "Mirrorless Pros / Классическая цветопередача Canon (теплые тона), очень популярна для портретов и свадеб."],
    ["Sony Alpha 7S III", "shot on Sony A7S III, low light, high ISO, clean shadows, atmospheric night photography", "Mirrorless Pros / Мастер низкой освещённости. Глубокие тени без шума, идеальна для «сумеречных» промптов."],
    ["Fujifilm X-T5", "shot on Fujifilm X-T5, Classic Chrome film simulation, vintage analog look, Fuji color science", "Mirrorless Pros / Культовая серия с эмуляцией плёнки. Ценится за «аналоговую» эстетику и уникальные цвета."],
    ["Hasselblad X2D 100C", "shot on Hasselblad X2D 100C, medium format look, HNCS color, extreme texture detail", "Medium Format / Легендарный цвет и глубина. Даёт «воздушную» картинку с невероятной проработкой текстур."],
    ["Fujifilm GFX 100 II", "shot on Fujifilm GFX 100 II, 102MP, medium format depth, film simulation aesthetic", "Medium Format / Современный средний формат. Сочетает огромное разрешение с фирменными режимами эмуляции плёнки."],
    ["Phase One XF IQ4", "shot on Phase One XF IQ4, 150MP, ultimate resolution, studio photography, tectonic detail", "Medium Format / Ультимативное студийное решение (150 Мп). Для промптов, где нужна запредельная детализация."],
    ["Leica M11", "shot on Leica M11, rangefinder aesthetic, street photography, micro-contrast, timeless look", "Retro & Specialty / Культовая дальномерка. Даёт уникальный «микроконтраст», идеальна для уличной (street) фотографии."],
    ["Leica Q3", "shot on Leica Q3, Summilux 28mm lens, premium aesthetic, sophisticated color", "Retro & Specialty / Компактная камера с фиксированным объективом 28мм. Даёт очень стильный, современный «люксовый» вид."],
    ["Polaroid SX-70", "shot on Polaroid SX-70, instant film aesthetic, vintage colors, vignetting, soft grain", "Retro & Specialty / Аутентичный винтаж. Виньетирование, мягкие цвета и характерная зернистость моментального фото."],
    ["DJI Mavic 3 Pro", "aerial photography, shot on DJI Mavic 3 Pro, drone perspective, vast landscape view", "Retro & Specialty / Стандарт для аэросъёмки. Промпты с высоты птичьего полёта, дроны, панорамы."],
    ["Bolex H16 (16mm)", "16mm film aesthetic, shot on Bolex H16, vintage movie look, heavy film grain, 1960s style", "Retro & Specialty / Эстетика старого кино и документалок. Зернистая, тёплая и немного «дрожащая» картинка."]
  ];
  const PHOTO_CAMERA_CLASSIFICATIONS = [
    ["Cinema Flagships", "1. Кинофотография (Cinema Flagships)"],
    ["Mirrorless Pros", "2. Профессиональные Беззеркалки (Mirrorless Pros)"],
    ["Medium Format", "3. Средний Формат (Medium Format)"],
    ["Retro & Specialty", "4. Ретро и Специфическая Эстетика (Retro & Specialty)"]
  ];

  const LENS_SYSTEMS = [
    ["Panavision Primo Primes", "shot on Panavision Primo Primes, rich color saturation, smooth focus roll-off, hollywood blockbuster look, high fidelity texture", "Сферические / Стандарт индустрии, кремовое боке"],
    ["Arri Signature Primes", "shot on Arri Signature Primes, velvety bokeh, magnetic skin tones, ultra-smooth background separation, warm and natural atmosphere", "Сферические / Тёплые тона, бархатное боке"],
    ["Cooke S4/i", "Shot on Cooke S4/i prime lens, The Cooke Look, warm cinematic color tone, extremely pleasing skin tones, smooth focus falloff, spherical lens, gentle contrast", "Сферические / Знаменитый 'Cooke Look'"],
    ["Panavision Primo Anamorphic", "Shot on Panavision Primo Anamorphic lenses, 2x squeeze, horizontal blue lens flares, high contrast, sharp resolution, negligible distortion, oval bokeh", "Анаморфотные / Синие блики, овальное боке"],
    ["Panavision C-Series", "shot on Panavision C-Series Anamorphic, vintage sci-fi aesthetic, distinct blue streak flares, oval bokeh shapes, soft edges, organic imperfections", "Анаморфотные / Винтаж, синие полосы"],
    ["Atlas Orion Anamorphic", "Shot on Atlas Orion Anamorphic lenses, distinctive blue streak lens flares, organic barrel distortion, painterly watercolor bokeh, 2x anamorphic squeeze", "Анаморфотные / Живописное боке, бочкообразная дисторсия"],
    ["Panavision E-Series", "shot on Panavision E-Series Anamorphic, classic 80s action movie look, sharp but organic, controlled horizontal flares, elegant depth of field", "Анаморфотные / Классика 80-х"],
    ["Zeiss Master Anamorphics", "shot on Zeiss Master Anamorphics, distortion-free wide screen, futuristic clean look, precise blue lens flares, sharp corner-to-corner", "Анаморфотные / Без дисторсии, футуристический"],
    ["Hawk Class-X", "shot on Hawk Class-X Anamorphic, retro crystal clear look, punchy contrast, distinctive anamorphic character", "Анаморфотные / Ретро, насыщенный контраст"],
    ["Canon K-35", "shot on Canon K-35 vintage lenses, dreamy golden halation, soft glowing highlights, low contrast vintage vibe, warm retro color palette", "Винтажные / Золотая галация, мягкие блики 70-х"],
    ["Laowa Macro Probe", "shot on Laowa Probe lens, bug-eye perspective, extreme close-up macro, unusual wide angle depth, immersive texture details", "Специальные / Макро-зонд, экстремальный макро"],
    ["Lensbaby", "shot on Lensbaby, selective focus sweet spot, heavy radial blur, dreamlike distorted atmosphere, miniature effect tilt-shift", "Специальные / Тилт-шифт, избирательный фокус"],
    ["Arri ALFA", "shot on Arri ALFA lenses, textured cinematic image, dreamy atmosphere, soft edges, unique large format character", "Специальные / Текстурное изображение для крупного формата"],
    ["Panavision H-Series", "shot on Panavision H-Series Anamorphic, glamorous soft focus, warm cinematic tones, organic film-like texture, restrained flares", "Анаморфотные / Гламурная мягкость, винтажная текстура"],
    ["Panavision Ultra Vista", "shot on Panavision Ultra Vista, ultra-wide anamorphic format, expansive cinematic scope, soft lighting gradients, high resolution details", "Анаморфотные / Ультра-широкий формат"],
    ["Panavision T-Series", "shot on Panavision T-Series Anamorphic, huge oval lens flares, high speed cinematic look, rich color saturation, modern anamorphic clarity", "Анаморфотные / Огромные овальные блики"],
    ["Hawk Vantage One", "shot on Hawk Vantage One, ultra-shallow depth of field, T1.0 aperture look, soft vintage coating, creamy background separation", "Сферические / T1.0, ультра-малая ГРИП"],
    ["Zeiss Super Speed", "shot on Zeiss Super Speed, 70s grit aesthetic, glowing light sources, soft but detailed sharpness, iconic fast lens character", "Винтажные / Стиль 'Таксиста', треугольное боке"],
    ["Panavision Primo Zooms", "shot on Panavision Primo Zooms, high-end blockbuster look, punchy contrast, crisp details, 90s/00s feature film texture", "Зум / Голливудский блокбастер"],
    ["Sigma Cine Lenses", "shot on Sigma Cine Lenses, clinical sharpness, modern digital clarity, neutral color palette, technical precision", "Сферические / Клиническая резкость, нейтральные цвета"],
    ["Panavision Primo 70", "shot on Panavision Primo 70, ultra-clean digital rendering, edge-to-edge sharpness, high contrast, perfect for 8K sensors", "Сферические / Для 8K сенсоров, абсолютная резкость"],
    ["Zeiss Ultra Prime", "shot on Zeiss Ultra Prime, distortion-free wide angle, perfect geometric lines, high micro-contrast, clinical yet cinematic precision", "Сферические / Брутальная честность, стандарт VFX"],
    ["Hawk V-Lite", "shot on Hawk V-Lite Anamorphic, intimate bokeh character, natural and realistic colors, classic 2x squeeze, compact cinematic feel", "Анаморфотные / Интимное боке, натуральные цвета"],
    ["JDC Xtal Xpress", "shot on JDC Xtal Xpress Anamorphic, heavy barrel distortion, intense golden flares, thick cinematic texture, gritty 80s character", "Анаморфотные / Золотые блики, характер 80-х"]
  ];
  const LENS_CLASSIFICATIONS = [
    ["Spherical", "1. Сферические Объективы (Spherical Lenses)"],
    ["Anamorphic", "2. Анаморфотные Объективы (Anamorphic Lenses)"],
    ["VintageSpecial", "3. Винтажные и Специальные (Vintage & Special)"]
  ];
  const PHOTO_LENS_OPTIONS = [
    ["Canon RF 85mm f/1.2L", "shot on Canon RF 85mm f/1.2L USM, creamy bokeh, ultra-shallow depth of field, razor sharp focus", "PortraitFast / Современный эталон портретной съёмки. Запредельная резкость и кремовое боке."],
    ["Leica Noctilux 50mm f/0.95", "shot on Leica Noctilux-M 50mm f/0.95 ASPH, dreamy bokeh, extreme low light aesthetic, unique rendering", "PortraitFast / Легендарный король темноты. Сюрреалистичная глубина резкости."],
    ["Nikon 135mm f/2 DC", "shot on Nikon 135mm f/2 DC-Nikkor, King of Bokeh, smooth background blur, flattering portraits", "PortraitFast / Король боке с Defocus Control, мягкое художественное размытие."],
    ["Sony FE 55mm f/1.8 Zeiss", "shot on Sony FE 55mm f/1.8 ZA, Zeiss micro-contrast, vibrant colors, clinical sharpness", "PortraitFast / Цейсовский микроконтраст, насыщенные цвета, высокая резкость."],
    ["Zeiss Otus 55mm f/1.4", "shot on ZEISS Otus 55mm f/1.4, medium format quality, zero aberrations, pristine optical clarity", "PortraitFast / Бескомпромиссная оптика уровня среднего формата."],

    ["Nikon 14-24mm f/2.8G", "shot on Nikon 14-24mm f/2.8G ED, ultra-wide perspective, dramatic landscape, architectural precision", "WideLandscape / Революционный сверхширик для пейзажей и архитектуры."],
    ["Leica Summicron-M 35mm f/2", "shot on Leica Summicron-M 35mm f/2 ASPH, street photography, natural perspective, documentary aesthetic", "WideLandscape / Классическая стрит-эстетика и естественная перспектива."],
    ["Canon EF 16-35mm f/2.8L", "shot on Canon EF 16-35mm f/2.8L III, wide angle dynamic, interior photography, sharp corners", "WideLandscape / Универсальный широкий зум для динамики и интерьеров."],

    ["Canon 100mm f/2.8L Macro", "shot on Canon EF 100mm f/2.8L Macro IS USM, macro photography, extreme close-up, intricate textures", "MacroTele / Икона макросъёмки, экстремальная детализация текстур."],
    ["Nikon 70-200mm f/2.8E", "shot on Nikon 70-200mm f/2.8E FL ED VR, telephoto compression, sports photography, sharp action", "MacroTele / Телефото-компрессия, репортаж и спорт."],
    ["Sigma 105mm f/2.8 Art Macro", "shot on Sigma 105mm f/2.8 DG DN Macro Art, product photography, razor sharp macro details", "MacroTele / Макро-резкость для предметной съёмки."],

    ["Canon 50mm f/1.8 (Nifty Fifty)", "shot on Canon EF 50mm f/1.8 STM, classic nifty fifty look, natural rendering, clean bokeh", "IconicAllAround / Самый популярный фикс, естественный классический рендер."],
    ["Hasselblad HC 100mm f/2.2", "shot on Hasselblad HC 100mm f/2.2, medium format depth, high-end portrait, exquisite rendering", "IconicAllAround / Средний формат с объёмной пластикой и премиум-рендером."],
    ["Sigma 35mm f/1.4 Art", "shot on Sigma 35mm f/1.4 DG HSM Art, wide-angle portrait, artistic rendering, punchy colors", "IconicAllAround / Художественный универсал с выразительными цветами."],
    ["Leica Summilux-M 50mm f/1.4", "shot on Leica Summilux-M 50mm f/1.4 ASPH, balanced sharpness, iconic rendering, lifelike colors", "IconicAllAround / Лейковский баланс резкости и характера изображения."]
  ];
  const PHOTO_LENS_CLASSIFICATIONS = [
    ["PortraitFast", "1. Портретные и светосильные (Portrait & Fast Glass)"],
    ["WideLandscape", "2. Широкоугольные и Пейзажные (Wide-angle & Landscape)"],
    ["MacroTele", "3. Макро и Телефото (Macro & Telephoto)"],
    ["IconicAllAround", "4. Универсальные и Культовые (Iconic & All-around)"]
  ];

  function lensClassificationKey(rawDesc) {
    const key = (String(rawDesc || "").split(" / ")[0] || "").trim();
    if (key === "Сферические") return "Spherical";
    if (key === "Анаморфотные") return "Anamorphic";
    if (key === "Винтажные" || key === "Специальные" || key === "Зум") return "VintageSpecial";
    return "VintageSpecial";
  }
  function photoLensClassificationKey(rawDesc) {
    const key = (String(rawDesc || "").split(" / ")[0] || "").trim();
    if (key === "PortraitFast") return "PortraitFast";
    if (key === "WideLandscape") return "WideLandscape";
    if (key === "MacroTele") return "MacroTele";
    if (key === "IconicAllAround") return "IconicAllAround";
    return "IconicAllAround";
  }

  const FILM_STOCK_PATCH = {
    "Kodak Vision3 500T": "shot on Kodak Vision3 500T 5219 film stock, visible film grain, red halation around highlights, tungsten color balance, cinematic texture, deep shadows",
    "Kodak Vision3 250D": "shot on Kodak Vision3 250D 5207 film stock, fine grain structure, true-to-life colors, rich daylight saturation, organic skin tones",
    "Kodak Vision3 50D": "shot on Kodak Vision3 50D film stock, virtually grain-free, hyper-vivid colors, extreme detail retention, pristine film quality",
    "Fujifilm Eterna 500T": "shot on Fujifilm Eterna 500T, low contrast, soft pastel color palette, cinematic greenish shadows, smooth tonal transitions",
    "Kodak Tri-X 400": "shot on Kodak Tri-X 400 Black and White film, heavy contrast, gritty film grain, noir aesthetic, monochromatic",
    "Kodachrome 64": "shot on vintage Kodachrome 64, nostalgic warm colors, deeply saturated reds and yellows, 1970s magazine look",
    "ARRI Alexa 35 Sensor": "shot on ARRI Alexa 35, REVEAL Color Science, extreme dynamic range, creamy highlight roll-off, noise-free shadows",
    "RED V-Raptor / Monstro": "shot on RED V-Raptor 8K VV, hyper-realistic detail, razor sharp, deep crushed blacks, digital precision",
    "Sony Venice 2": "shot on Sony Venice 2, exceptional low light performance, clean vibrant colors, modern full-frame aesthetic",
    "VHS / MiniDV": "shot on VHS camcorder, 1990s home video style, tracking errors, chromatic aberration, low resolution, scanlines"
  };
  const FILM_STOCK_DESCRIPTIONS = {
    "Kodak Vision3 500T": "Стандарт ночной съёмки, зернистость, вольфрамовый баланс",
    "Kodak Vision3 250D": "Дневная плёнка, натуральные цвета, идеальный баланс",
    "Kodak Vision3 50D": "Чистейшая плёнка, почти без зерна, очень яркие цвета",
    "Fujifilm Eterna 500T": "Мягкий контраст, пастельные тона, тени в зелёный",
    "Kodak Tri-X 400": "Ч/б классика, высокий контраст, зернистая драма",
    "Kodachrome 64": "Ретро 60-70-е, насыщенные reds/yellows, National Geographic",
    "ARRI Alexa 35 Sensor": "Цифровой король, невероятный ДД, мягкие хайлайты",
    "RED V-Raptor / Monstro": "Максимальная резкость, гиперреализм, глубокие тени",
    "Sony Venice 2": "Отличная в слабом свете (Dual ISO), чистые тона",
    "VHS / MiniDV": "Эстетика 90-х: глитчи, скан-линии, хроматические аберрации"
  };

  const AMBIENCE = { dead_silence: "Audio: dead silence, eerie room tone, subtle high-frequency ringing, absolute quiet, claustrophobic atmosphere", heavy_rain: "Audio: immersive spatial audio, heavy rain pouring on concrete, distant rolling thunder, low-frequency rumble, water splashing", cyberpunk_city: "Audio: futuristic city soundscape, heavy neon buzzing, distant flying vehicle hum, digital billboards, wet street ambience", nature_forest: "Audio: rich forest ambience, crisp bird calls, wind rustling through dense leaves, distant stream flowing, organic natural soundscape" };
  const AMBIENCE_LABELS = { dead_silence: "Мёртвая тишина", heavy_rain: "Проливной дождь", cyberpunk_city: "Киберпанк Город", nature_forest: "Живой лес" };
  const FOLEY = { footsteps_gravel: "Audio: crisp close-miked foley, heavy boots crunching on gravel, clear transient detail, isolated sync sound", cloth_leather: "Audio: detailed cloth foley, heavy leather creaking, fabric rustling, close-mic intimacy", metal_clank: "Audio: sharp metallic clank, heavy steel impact, mechanical clicking, resonant metallic tail, high-fidelity transient", glass_shatter: "Audio: sudden glass shattering, crystalline high-frequency debris scattering, sharp impact, wide stereo spread" };
  const FOLEY_LABELS = { footsteps_gravel: "Шаги (Гравий)", cloth_leather: "Шуршание кожи", metal_clank: "Лязг металла", glass_shatter: "Разбитое стекло" };
  const CINE_FX = { tension_drone: "Audio: tense cinematic soundscape, deep ominous low-frequency drone, unsettling sub-bass rumble, psychological tension", braam_hit: "Audio: massive cinematic braam hit, Hans Zimmer style brass blast, sudden high-impact sub-drop, epic trailer sound design", slo_mo: "Audio: time-stretched sound design, extreme slow-motion audio, pitched down low-frequency sweep, muffled underwater effect", heartbeat: "Audio: isolated human heartbeat, deep thumping chest resonance, rising tempo, claustrophobic psychoacoustic effect" };
  const CINE_FX_LABELS = { tension_drone: "Тревожный гул", braam_hit: "Эпичный удар (Braam)", slo_mo: "Слоу-мо эффект", heartbeat: "Стук сердца" };

  function addSectionAfter(afterId, html) { const a = document.getElementById(afterId); if (!a) return; const t = document.createElement('template'); t.innerHTML = html.trim(); a.insertAdjacentElement('afterend', t.content.firstElementChild); }
  function fillOptionGroup(groupId, dataGroup, options) {
    const group = document.getElementById(groupId);
    if (!group) return;
    options.forEach(([label, fragment]) => {
      const b = document.createElement('button');
      b.className = 'option-btn';
      b.dataset.group = dataGroup;
      b.dataset.value = fragment;
      b.textContent = label;
      b.title = fragment;
      group.appendChild(b);
    });
  }

  function ensureConfig() {
    if (typeof state !== 'object' || typeof groupConfig !== 'object') return;
    ['cinematicPreset', 'artStyle', 'ambience', 'foley', 'cinematicFx'].forEach(g => { if (!groupConfig[g]) groupConfig[g] = { mode: 'single' }; });
    if (!('cinematicPreset' in state)) state.cinematicPreset = '';
    if (!('artStyle' in state)) state.artStyle = '';
    if (!('ambience' in state)) state.ambience = '';
    if (!('foley' in state)) state.foley = '';
    if (!('cinematicFx' in state)) state.cinematicFx = '';

    // FIX: Build ART_STYLES_MAP so buildFlatPrompt/buildStructuredPrompt/buildMidjourneyPrompt can use it
    if (typeof ART_STYLES !== 'undefined' && !window.ART_STYLES_MAP) {
      window.ART_STYLES_MAP = {};
      Object.keys(ART_STYLES).forEach(name => {
        window.ART_STYLES_MAP[name] = ART_STYLES[name];
      });
    }

    // FIX: Build CINEMATIC_PRESETS_MAP for prompt output
    if (typeof CINEMATIC_PRESETS !== 'undefined' && !window.CINEMATIC_PRESETS_MAP) {
      window.CINEMATIC_PRESETS_MAP = {};
      Object.keys(CINEMATIC_PRESETS).forEach(name => {
        window.CINEMATIC_PRESETS_MAP[name] = CINEMATIC_PRESETS[name];
      });
    }
  }

  function injectNewSections() {
    // === CAMERA BODIES ===
    if (!document.getElementById('cameraSectionV2')) {
      addSectionAfter('qualitySection', `<div class="section collapsed" id="cameraSectionV2"><div class="section-header"><h2><span class="icon icon-blue">📷</span> Кинокамера <span class="help-tip">?<span class="tip-text">Выбор камеры задаёт теги цифрового/плёночного кинободи, влияющие на текстуру, зерно и цвет.</span></span></h2><span class="mode-badge">single</span></div><div class="section-content"><div class="option-group" id="cameraBodyGroup"></div></div></div>`);
    }
    const g = document.getElementById('cameraBodyGroup');
    if (g) {
      g.innerHTML = '';
      g.classList.remove('option-group');

      const grouped = new Map();
      CAMERA_CLASSIFICATIONS.forEach(([key, label]) => grouped.set(key, { label, items: [] }));

      CAMERA_OPTIONS.forEach(([name, value, desc]) => {
        const raw = String(desc || "");
        const parts = raw.split(" / ");
        const cls = parts.length > 1 ? parts[0].trim() : "Other";
        const text = parts.length > 1 ? parts.slice(1).join(" / ").trim() : raw;
        if (!grouped.has(cls)) grouped.set(cls, { label: `Прочее (${cls})`, items: [] });
        grouped.get(cls).items.push([name, value, text, raw]);
      });

      Array.from(grouped.values()).forEach((bucket) => {
        if (!bucket.items.length) return;

        const sub = document.createElement('span');
        sub.className = 'sub-label';
        sub.textContent = bucket.label;
        g.appendChild(sub);

        const list = document.createElement('div');
        list.className = 'option-group';

        bucket.items.forEach(([name, value, text, raw]) => {
          const b = document.createElement('button');
          b.className = 'option-btn';
          b.dataset.group = 'cameraBody';
          b.dataset.value = value;
          b.textContent = name;
          b.title = text || raw || '';
          list.appendChild(b);
        });

        g.appendChild(list);
      });
    }

    // === PHOTO CAMERA BODIES ===
    if (!document.getElementById('photoCameraSectionV2')) {
      addSectionAfter('cameraSectionV2', `<div class="section collapsed" id="photoCameraSectionV2"><div class="section-header"><h2><span class="icon icon-blue">📸</span> Фотокамера <span class="help-tip">?<span class="tip-text">Список популярных фотокамер для фотореалистичных и коммерческих промптов.</span></span></h2><span class="mode-badge">single</span></div><div class="section-content"><div class="option-group" id="photoCameraBodyGroup"></div></div></div>`);
    }
    const pg = document.getElementById('photoCameraBodyGroup');
    if (pg) {
      pg.innerHTML = '';
      pg.classList.remove('option-group');

      const groupedPhoto = new Map();
      PHOTO_CAMERA_CLASSIFICATIONS.forEach(([key, label]) => groupedPhoto.set(key, { label, items: [] }));

      PHOTO_CAMERA_OPTIONS.forEach(([name, value, desc]) => {
        const raw = String(desc || "");
        const parts = raw.split(" / ");
        const cls = parts.length > 1 ? parts[0].trim() : "Other";
        const text = parts.length > 1 ? parts.slice(1).join(" / ").trim() : raw;
        if (!groupedPhoto.has(cls)) groupedPhoto.set(cls, { label: `Прочее (${cls})`, items: [] });
        groupedPhoto.get(cls).items.push([name, value, text, raw]);
      });

      Array.from(groupedPhoto.values()).forEach((bucket) => {
        if (!bucket.items.length) return;

        const sub = document.createElement('span');
        sub.className = 'sub-label';
        sub.textContent = bucket.label;
        pg.appendChild(sub);

        const list = document.createElement('div');
        list.className = 'option-group';

        bucket.items.forEach(([name, value, text, raw]) => {
          const b = document.createElement('button');
          b.className = 'option-btn';
          b.dataset.group = 'cameraBody';
          b.dataset.value = value;
          b.textContent = name;
          b.title = text || raw || '';
          list.appendChild(b);
        });

        pg.appendChild(list);
      });
    }

    // === LENS SYSTEMS ===
    if (!document.getElementById('lensSectionV2')) {
      addSectionAfter(document.getElementById('photoCameraSectionV2') ? 'photoCameraSectionV2' : 'cameraSectionV2', `<div class="section collapsed" id="lensSectionV2"><div class="section-header"><h2><span class="icon icon-blue">🔭</span> Объектив / Оптика <span class="help-tip">?<span class="tip-text">Линза определяет характер изображения: боке, блики, дисторсию, цветопередачу.</span></span></h2><span class="mode-badge">single</span></div><div class="section-content"><div class="option-group" id="lensSystemGroup"></div></div></div>`);
    }
    const lg = document.getElementById('lensSystemGroup');
    if (lg) {
      lg.innerHTML = '';
      lg.classList.remove('option-group');

      function renderLensSubsection(container, title, options, classifications, keyResolver) {
        const sectionLabel = document.createElement('span');
        sectionLabel.className = 'sub-label';
        sectionLabel.textContent = title;
        container.appendChild(sectionLabel);

        const grouped = new Map();
        classifications.forEach(([key, label]) => grouped.set(key, { label, items: [] }));

        options.forEach(([name, value, desc]) => {
          const raw = String(desc || "");
          const parts = raw.split(" / ");
          const text = parts.length > 1 ? parts.slice(1).join(" / ").trim() : raw;
          const cls = keyResolver(raw);
          if (!grouped.has(cls)) grouped.set(cls, { label: `Прочее (${cls})`, items: [] });
          grouped.get(cls).items.push([name, value, text, raw]);
        });

        Array.from(grouped.values()).forEach((bucket) => {
          if (!bucket.items.length) return;

          const sub = document.createElement('span');
          sub.className = 'sub-label';
          sub.textContent = bucket.label;
          container.appendChild(sub);

          const list = document.createElement('div');
          list.className = 'option-group';

          bucket.items.forEach(([name, value, text, raw]) => {
            const b = document.createElement('button');
            b.className = 'option-btn';
            b.dataset.group = 'lens';
            b.dataset.value = value;
            b.textContent = name;
            b.title = text || raw || '';
            list.appendChild(b);
          });

          container.appendChild(list);
        });
      }

      renderLensSubsection(lg, 'Кинооптика', LENS_SYSTEMS, LENS_CLASSIFICATIONS, lensClassificationKey);
      renderLensSubsection(lg, 'Фотооптика', PHOTO_LENS_OPTIONS, PHOTO_LENS_CLASSIFICATIONS, photoLensClassificationKey);
    }

    // === ART STYLES ===
    if (!document.getElementById('artStyleSectionV2')) {
      addSectionAfter('resolutionSection', `<div class="section collapsed" id="artStyleSectionV2"><div class="section-header"><h2><span class="icon icon-purple">🖼️</span> Художественные стили и медиум</h2><span class="mode-badge">single</span></div><div class="section-content"><div class="option-group" id="artStyleGroup"></div></div></div>`);
      const g = document.getElementById('artStyleGroup');
      if (g) Object.keys(ART_STYLES).forEach(name => { const b = document.createElement('button'); b.className = 'option-btn'; b.dataset.group = 'artStyle'; b.dataset.value = name; b.textContent = name; b.title = ART_STYLES[name]; g.appendChild(b); });
    }

    // === MEDIUM ===
    if (!document.getElementById('mediumSectionV2')) {
      addSectionAfter('artStyleSectionV2', `<div class="section collapsed" id="mediumSectionV2"><div class="section-header"><h2><span class="icon icon-green">🧪</span> Художественный медиум</h2><span class="mode-badge">single</span></div><div class="section-content"><div class="option-group" id="mediumGroupV2"></div></div></div>`);
      fillOptionGroup('mediumGroupV2', 'medium', MEDIUM_OPTIONS);
    }

    // === COMPOSITION ===
    if (!document.getElementById('compositionSectionV2')) {
      addSectionAfter('apertureSection', `<div class="section collapsed" id="compositionSectionV2"><div class="section-header"><h2><span class="icon icon-blue">📐</span> Композиция</h2><span class="mode-badge">single</span></div><div class="section-content"><div class="option-group" id="compositionGroupV2"></div></div></div>`);
      fillOptionGroup('compositionGroupV2', 'composition', COMPOSITION_OPTIONS);
    }

    // === LIGHTING ===
    if (!document.getElementById('lightingSectionV2')) {
      addSectionAfter('compositionSectionV2', `<div class="section collapsed" id="lightingSectionV2"><div class="section-header"><h2><span class="icon icon-orange">💡</span> Освещение</h2><span class="mode-badge">single</span></div><div class="section-content"><div class="option-group" id="lightingGroupV2"></div></div></div>`);
      fillOptionGroup('lightingGroupV2', 'lighting', LIGHTING_OPTIONS);
    }

    // === COLOR PALETTE ===
    if (!document.getElementById('paletteSectionV2')) {
      addSectionAfter('lightingSectionV2', `<div class="section collapsed" id="paletteSectionV2"><div class="section-header"><h2><span class="icon icon-pink">🎨</span> Цветовая палитра</h2><span class="mode-badge">single</span></div><div class="section-content"><div class="option-group" id="paletteGroupV2"></div></div></div>`);
      fillOptionGroup('paletteGroupV2', 'colorPalette', COLOR_PALETTE_OPTIONS);
    }

    // === MOOD ===
    if (!document.getElementById('moodSectionV2')) {
      addSectionAfter('paletteSectionV2', `<div class="section collapsed" id="moodSectionV2"><div class="section-header"><h2><span class="icon icon-blue">🌫️</span> Mood / Atmosphere</h2><span class="mode-badge">single</span></div><div class="section-content"><div class="option-group" id="moodGroupV2"></div></div></div>`);
      fillOptionGroup('moodGroupV2', 'mood', MOOD_OPTIONS);
    }

    // === MOTION BLUR ===
    if (!document.getElementById('motionBlurSectionV2')) {
      addSectionAfter('moodSectionV2', `<div class="section collapsed" id="motionBlurSectionV2"><div class="section-header"><h2><span class="icon icon-blue">🌪️</span> Motion blur <span class="help-tip">?<span class="tip-text">Включите режим и задайте персонажа, локацию и описание фона для размытия движения.</span></span></h2></div><div class="section-content"><div class="toggle-row" style="margin-bottom:10px;"><label class="toggle-label" id="motionBlurModeLabel"><input type="checkbox" id="motionBlurMode"> Motion blur</label></div><div id="motionBlurFields" style="opacity:.45;pointer-events:none;"><span class="sub-label">Персонаж</span><input type="text" class="input-field" id="motionBlurCharacter" placeholder="Например: woman from references" autocomplete="off" disabled oninput="handleInput()"><span class="sub-label" style="margin-top:10px;">Локация</span><input type="text" class="input-field" id="motionBlurLocation" placeholder="Например: rainy neon street" autocomplete="off" disabled oninput="handleInput()"><div style="margin-top:10px;"><label class="toggle-label" id="motionBlurBackgroundEnabledLabel" style="display:inline-flex;"><input type="checkbox" id="motionBlurBackgroundEnabled" disabled> Задний план?</label></div><input type="text" class="input-field" id="motionBlurBackground" placeholder="Например: fast traffic streaks and passing crowd" autocomplete="off" disabled oninput="handleInput()"><div style="margin-top:10px;"><label class="toggle-label" id="motionBlurForegroundEnabledLabel" style="display:inline-flex;"><input type="checkbox" id="motionBlurForegroundEnabled" disabled> Передний план</label></div><input type="text" class="input-field" id="motionBlurForeground" placeholder="Например: moving leaves and passing silhouettes" autocomplete="off" disabled oninput="handleInput()"></div></div></div>`);
    }

  }

  ensureConfig();
  injectNewSections();
  (function mergeArtAndMediumSections() {
    const artSection = document.getElementById('artStyleSectionV2');
    const mediumSection = document.getElementById('mediumSectionV2');
    if (!artSection || !mediumSection) return;

    const artContent = artSection.querySelector('.section-content');
    const artGroup = artContent ? artContent.querySelector('#artStyleGroup') : null;
    const mediumSource = mediumSection.querySelector('#mediumGroupV2');
    if (!artContent || !artGroup || !mediumSource) return;

    let mediumLabel = artContent.querySelector('#mergedMediumLabel');
    if (!mediumLabel) {
      mediumLabel = document.createElement('span');
      mediumLabel.id = 'mergedMediumLabel';
      mediumLabel.className = 'sub-label';
      mediumLabel.textContent = 'Медиум';
      artContent.appendChild(mediumLabel);
    }

    let mediumGroup = artContent.querySelector('#mergedMediumGroup');
    if (!mediumGroup) {
      mediumGroup = document.createElement('div');
      mediumGroup.id = 'mergedMediumGroup';
      mediumGroup.className = 'option-group';
      artContent.appendChild(mediumGroup);
    }

    const normalize = (s) => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
    const mediumByLabel = new Map();
    mediumSource.querySelectorAll('.option-btn').forEach(btn => {
      const label = normalize(btn.textContent);
      const valLen = (btn.dataset.value || '').length;
      if (!mediumByLabel.has(label) || mediumByLabel.get(label) < valLen) mediumByLabel.set(label, valLen);
    });

    artGroup.querySelectorAll('.option-btn').forEach(btn => {
      const label = normalize(btn.textContent);
      const mediumLen = mediumByLabel.get(label);
      if (!mediumLen) return;
      const artLen = (btn.dataset.value || '').length;
      if (mediumLen > artLen) btn.remove();
    });

    const seenMedium = new Set();
    const seenMediumValues = new Set();
    mediumGroup.querySelectorAll('.option-btn').forEach(btn => {
      const lblKey = normalize(btn.textContent);
      const valKey = normalize(btn.dataset.value || '');
      if (lblKey) seenMedium.add(lblKey);
      if (valKey) seenMediumValues.add(valKey);
    });
    const appendMedium = (srcBtn) => {
      const key = normalize(srcBtn.textContent);
      const valueKey = normalize(srcBtn.dataset.value || '');
      if (seenMedium.has(key) || (valueKey && seenMediumValues.has(valueKey))) return;
      seenMedium.add(key);
      if (valueKey) seenMediumValues.add(valueKey);
      const b = srcBtn.cloneNode(true);
      b.dataset.group = 'medium';
      mediumGroup.appendChild(b);
    };
    mediumSource.querySelectorAll('.option-btn').forEach(appendMedium);

    const extras = [
      { label: '3D Рендер', value: '3D render, physically based rendering (PBR), ray-traced global illumination, realistic materials, studio-grade reflections' },
      { label: 'Векторная графика', value: 'vector illustration, clean bezier curves, infinite scalability, flat color blocks, print-ready crisp edges' }
    ];
    extras.forEach(item => {
      const key = normalize(item.label);
      if (seenMedium.has(key)) return;
      const b = document.createElement('button');
      b.className = 'option-btn';
      b.dataset.group = 'medium';
      b.dataset.value = item.value;
      b.textContent = item.label;
      b.title = item.value;
      mediumGroup.appendChild(b);
      seenMedium.add(key);
    });

    mediumSection.remove();
  })();
  (function mergeCompositionIntoShootingSection() {
    const apertureSection = document.getElementById('apertureSection');
    const apertureContent = apertureSection ? apertureSection.querySelector('.section-content') : null;
    const compositionSection = document.getElementById('compositionSectionV2');
    const compositionGroup = document.getElementById('compositionGroupV2');
    if (!apertureContent || !compositionGroup) return;

    let compositionLabel = apertureContent.querySelector('#mergedCompositionLabel');
    if (!compositionLabel) {
      compositionLabel = document.createElement('span');
      compositionLabel.id = 'mergedCompositionLabel';
      compositionLabel.className = 'sub-label';
      compositionLabel.innerHTML = 'Композиция <span class="mode-badge" style="margin-left:6px">single</span>';
      apertureContent.appendChild(compositionLabel);
    }

    if (compositionGroup.parentElement !== apertureContent) {
      apertureContent.appendChild(compositionGroup);
    }

    if (compositionSection) compositionSection.remove();
  })();
  (function moveCameraBlocksAfterResolution() {
    const resolution = document.getElementById('resolutionSection');
    const camera = document.getElementById('cameraSectionV2');
    const photoCamera = document.getElementById('photoCameraSectionV2');
    const lens = document.getElementById('lensSectionV2');
    if (!resolution || !camera || !lens) return;
    resolution.insertAdjacentElement('afterend', camera);
    if (photoCamera) {
      camera.insertAdjacentElement('afterend', photoCamera);
      photoCamera.insertAdjacentElement('afterend', lens);
    } else {
      camera.insertAdjacentElement('afterend', lens);
    }
  })();
  (function moveStyleBlocksAfterFoodCommercial() {
    const food = document.getElementById('foodCommercialSection');
    const photo = document.getElementById('photoStyleSection');
    const cinema = document.getElementById('cinemaStyleSection');
    const director = document.getElementById('directorStyleSection');
    if (!food || !photo || !cinema || !director) return;
    food.insertAdjacentElement('afterend', photo);
    photo.insertAdjacentElement('afterend', cinema);
    cinema.insertAdjacentElement('afterend', director);
  })();
  (function movePresetsAfterDirectorStyle() {
    const director = document.getElementById('directorStyleSection');
    const presets = document.getElementById('presetsSection');
    if (!director || !presets) return;
    director.insertAdjacentElement('afterend', presets);
  })();
  (function moveGenerationModeToTop() {
    const generation = document.getElementById('generationModeSection');
    const quickStyle = document.getElementById('quickStyleSection');
    if (!generation || !quickStyle) return;
    quickStyle.insertAdjacentElement('beforebegin', generation);
  })();
})();


/* ===== SCRIPT TAG SPLIT ===== */


// Export to window for prompt_engine.js
window.buildFlatPrompt = typeof buildFlatPrompt !== "undefined" ? buildFlatPrompt : null;
window.buildStructuredPrompt = typeof buildStructuredPrompt !== "undefined" ? buildStructuredPrompt : null;
window.buildMidjourneyPrompt = typeof buildMidjourneyPrompt !== "undefined" ? buildMidjourneyPrompt : null;
window.buildJson = typeof buildJson !== "undefined" ? buildJson : null;
window.buildG4FlatForNBP = typeof buildG4FlatForNBP !== "undefined" ? buildG4FlatForNBP : null;
window.buildG4ForNBP = typeof buildG4ForNBP !== "undefined" ? buildG4ForNBP : null;
window.build3x3FlatForNBP = typeof build3x3FlatForNBP !== "undefined" ? build3x3FlatForNBP : null;
window.build3x3ForNBP = typeof build3x3ForNBP !== "undefined" ? build3x3ForNBP : null;
window.MAX_CONSISTENCY_PREFIX = typeof MAX_CONSISTENCY_PREFIX !== "undefined" ? MAX_CONSISTENCY_PREFIX : null;
window.MAX_CONSISTENCY_PREFIX_FLAT = typeof MAX_CONSISTENCY_PREFIX_FLAT !== "undefined" ? MAX_CONSISTENCY_PREFIX_FLAT : null;
