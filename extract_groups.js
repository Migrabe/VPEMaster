import fs from 'fs';
const html = fs.readFileSync('public/index.html', 'utf8');
const regex = /data-group="([^"]+)"/g;
let match;
const groups = new Set();
while ((match = regex.exec(html)) !== null) {
    groups.add(match[1]);
}
console.log(Array.from(groups).sort());
