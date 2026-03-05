const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, 'public', 'js', 'client_logic_full.js');
let js = fs.readFileSync(jsPath, 'utf8');

// Strip out DOM manipulation to just test state building
js = js.replace(/function updateAll.*?\n}/s, 'function updateAll() { console.log("updateAll stub"); }');
js = js.replace(/function updateTags.*?\n}/s, 'function updateTags() { console.log("updateTags stub"); }');
js = js.replace(/function applyConflictRules.*?\n}/s, 'function applyConflictRules() { console.log("applyConflictRules stub"); }');
js = js.replace(/function syncGroup.*?\n}/s, 'function syncGroup() { console.log("syncGroup stub"); }');
js = js.replace(/function updateModelHint.*?\n}/s, 'function updateModelHint() { console.log("updateModelHint stub"); }');
js = js.replace(/document\.getElementById/g, '(() => ({ value: "", checked: false }))');
js = js.replace(/document\.querySelector/g, '(() => ({ classList: { add:()=>{}, remove:()=>{} }, getAttribute: ()=>null }))');
js = js.replace(/document\.querySelectorAll/g, '(() => [])');

global.window = {
    ART_STYLES_MAP: {},
    state: null
};

global.$ = () => ({ value: "", checked: false, classList: { add: () => { }, remove: () => { } } });

try {
    eval(js);

    // Set up mock presets 
    global.presets = [
        {
            name: "TestPreset", values: {
                quickStyle: "Cinematic Scene",
                lighting: ["neon", "studio"],
                cameraBody: "ARRI Alexa 65"
            }
        }
    ];
    global.QUICK_STYLES = { "Cinematic Scene": "Cinematic lighting, 4k" };
    global.FASHION_FOOD_STYLES = {};
    global.EMOTIONS = {};
    global.FILM_STOCKS = {};

    console.log("Applying preset 0...");
    applyPreset(0);

    console.log("Preset Applied. State:", JSON.stringify(window.state, null, 2));

    console.log("\n--- Testing buildJson ---");
    const jsonStr = buildJson("test subject");
    console.log(jsonStr);

    console.log("\n--- Testing buildStructuredPrompt ---");
    const structStr = buildStructuredPrompt("test subject");
    console.log(structStr);

    console.log("\nSUCCESS!");

} catch (err) {
    console.error("ERROR:");
    console.error(err);
}
