
const fs = require('fs');

const filePath = 'Mühazirə_ERQONOMİKA.md';

function cleanGarbage() {
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove the specific line on Page 12 and Page 13 garbage
    const replacements = [
        { pattern: /P\. ——n \.\. ala Müq\s*\n/g, replacement: "" },
        
        // Page 13 cleanup - looks like bad OCR start
        // "B7 it işləri ins ..n .. olan qarşılıqlı əlaqələrin" -> "Erqonomikit işləri insan ilə olan qarşılıqlı əlaqələrin" - guessing or just removing header?
        // Looking at the context "müharibəsindən sonra insan faktorları...", it seems to be introductory text.
        // Let's just strip the clearly garbage characters "B7 it" "ins ..n .."
        // Actually, looking at the image/context, it might be "Bəzi tədqiqat işləri..."?
        // Without image, it's risky to guess words. But " ins ..n .. " is definitely "insan".
        
        // Let's just remove the obviously broken header-like line if the user didn't ask for Page 13 specifically?
        // The user said "Burada da var" (Here too), implying the specific one shown.
        // I will fix the Page 12 one requested.
        
        // Also fixing "olmur. ." -> "olmur."
        { pattern: /olmur\. \.\s*\n/g, replacement: "olmur.\n" }
    ];

    replacements.forEach(rule => {
        content = content.replace(rule.pattern, rule.replacement);
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Cleanup round 4 complete.");
}

cleanGarbage();
