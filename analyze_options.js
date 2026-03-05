import fs from 'fs';

const options = JSON.parse(fs.readFileSync('extracted_options.json', 'utf8'));

// 1. Group by category
const byGroup = {};
const allValues = new Map(); // value -> [groups]
const allLabels = new Map(); // label -> [groups]

options.forEach(opt => {
    if (!byGroup[opt.group]) byGroup[opt.group] = [];
    byGroup[opt.group].push(opt);

    if (opt.value) {
        if (!allValues.has(opt.value)) allValues.set(opt.value, []);
        allValues.get(opt.value).push(opt.group);
    }

    const normLabel = opt.label.toLowerCase().trim();
    if (normLabel) {
        if (!allLabels.has(normLabel)) allLabels.set(normLabel, []);
        allLabels.get(normLabel).push(opt.group);
    }
});

let report = "=== AUDIT REPORT ===\n\n";

report += "1. CATEGORIES SUMMARY\n";
for (const g in byGroup) {
    report += `- ${g}: ${byGroup[g].length} options\n`;
}

report += "\n2. EXACT DUPLICATE VALUES ACROSS CATEGORIES\n";
for (const [val, groups] of allValues.entries()) {
    const uniqueGroups = [...new Set(groups)];
    if (uniqueGroups.length > 1) {
        report += `Value "${val}" appears in: ${uniqueGroups.join(', ')}\n`;
    }
}

report += "\n3. EXACT DUPLICATE LABELS ACROSS CATEGORIES\n";
for (const [lbl, groups] of allLabels.entries()) {
    const uniqueGroups = [...new Set(groups)];
    if (uniqueGroups.length > 1) {
        report += `Label "${lbl}" appears in: ${uniqueGroups.join(', ')}\n`;
    }
}

report += "\n4. WITHIN-CATEGORY DUPLICATES\n";
for (const g in byGroup) {
    const vals = byGroup[g].map(o => o.value);
    const duplicates = vals.filter((item, index) => vals.indexOf(item) !== index);
    if (duplicates.length > 0) {
        report += `- In ${g}: ${[...new Set(duplicates)].join(', ')}\n`;
    }
}

fs.writeFileSync('audit_report_raw.txt', report);
console.log("Audit report generated in audit_report_raw.txt");
