
const fs = require('fs');

const filePath = 'Mühazirə_ERQONOMİKA.md';

function cleanGarbage() {
    let content = fs.readFileSync(filePath, 'utf8');

    // Rules based on user feedback and identified patterns
    const replacements = [
        // Page 6 garbage
        { pattern: /isi L1 IB\s*\n/g, replacement: "" },
        { pattern: /Frannnmilamin “ez x\. x qağa\s*\n/g, replacement: "" },
        { pattern: /ı m m\. B \. \. \.\s*\n/g, replacement: "" },
        { pattern: /"R arı q ci\s*\n/g, replacement: "" },
        
        // Page 7 garbage
        { pattern: /"ə bük za a\s*\n/g, replacement: "" },
        { pattern: /Mövzu 2\. i/g, replacement: "Mövzu 2." },
        
        // Trailing garbage chars at end of paragraphs/lines
        { pattern: / istifadə edilir ş\s*\n/g, replacement: " istifadə edilir.\n" },
        { pattern: / kompleks z\s*\n/g, replacement: " kompleks\n" },
        
        // Single char junk lines (e, ?, F)
        { pattern: /^\s*e\s*$/gm, replacement: "" },
        { pattern: /^\s*\?\s*$/gm, replacement: "" },
        { pattern: /^\s*F\s*$/gm, replacement: "" },
        
        // Specific one from image 1 around "Erqonomik təminat" section if any remaining
        // ... looks like "Şəkil 3..." is followed by garbage.
        
        // General cleanup for similar patterns (single letter ' z' or ' ş' at end of line)
        { pattern: /\s+z\s*$/gm, replacement: "" },
        { pattern: /\s+ş\s*$/gm, replacement: "" }, 
    ];

    replacements.forEach(rule => {
        content = content.replace(rule.pattern, rule.replacement);
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Cleanup round 3 complete.");
}

cleanGarbage();
