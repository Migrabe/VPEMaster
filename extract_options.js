import fs from 'fs';

const html = fs.readFileSync('public/index.html', 'utf8');

const regex = /<button[^>]*class="[^"]*option-btn[^"]*"[^>]*data-group="([^"]+)"(?:[^>]*data-value="([^"]*)")?[^>]*>([\s\S]*?)<\/button>/gi;

let match;
const options = [];

while ((match = regex.exec(html)) !== null) {
    const group = match[1];
    const value = match[2] || "";
    let label = match[3].replace(/<[^>]*>/g, '').trim();

    options.push({
        group,
        value,
        label
    });
}

fs.writeFileSync('extracted_options.json', JSON.stringify(options, null, 2));
console.log(`Extracted ${options.length} options.`);
