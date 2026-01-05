
const fs = require('fs');

const filePath = 'Mühazirə_ERQONOMİKA.md';

function fixStructureAndLists() {
    let content = fs.readFileSync(filePath, 'utf8');

    // PAGE 43 Garbage Cleanup
    // There is a massive block of garbage on Page 43 (approx starting line 1443)
    // "sz “\n ai so m ou “..."
    // We can confidently remove lines that look like complete noise
    
    // PAGE 21/22 Garbage
    // ".. usulu mu sMmüuso..." etc.
    
    let lines = content.split('\n');
    let cleanedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let stripped = line.trim();

        // 1. Garbage Block Detection
        // Detect lines with high non-alpha density or non-sense words
        if (/s84604005/.test(stripped) || /əosoəzodoo/.test(stripped) || /sz “/.test(stripped) || /ai so m ou/.test(stripped) || /pulumu\. s EŞ/.test(stripped)) {
            // Likely garbage, skip
            continue;
        }

        // 2. List Correction
        // e, v, ", e, ə at start of lines should be bullets or numbers
        // Heuristic:
        // "e Cihazlar..." -> "- Cihazlar..."
        // "v Quraşdırılmış..." -> "- Quraşdırılmış..."
        // '" Vizual...' -> "- Vizual..."
        // "e Sanitar..." -> "- Sanitar..."
        // "ə Mühitin..." -> "- Mühitin..."
        // "sAyrı-ayrı..." -> "- Ayrı-ayrı..."
        // "xüsusilə senari..." -> "- xüsusilə senari..." if it looks like a list item
        
        // Matches roughly "e Capital" or "ə Capital" or "v Capital"
        // Also fix the weird "sAyrı" type errors where bullet merged with word
        
        if (/^e\s+[A-ZÇƏĞİÖŞÜ]/.test(stripped)) {
            line = line.replace(/^e\s+/, "- ");
        } else if (/^v\s+[A-ZÇƏĞİÖŞÜ]/.test(stripped)) {
            line = line.replace(/^v\s+/, "- ");
        } else if (/^"\s+[A-ZÇƏĞİÖŞÜ]/.test(stripped)) {
            line = line.replace(/^"\s+/, "- ");
        } else if (/^ə\s+[A-ZÇƏĞİÖŞÜ]/.test(stripped)) {
            line = line.replace(/^ə\s+/, "- ");
        } else if (/^s([A-ZÇƏĞİÖŞÜ])/.test(stripped)) {
            // e.g. "sAyrı" -> "- Ayrı"
            line = line.replace(/^s([A-ZÇƏĞİÖŞÜ])/, "- $1");
        } else if (/^a\)([a-z])/.test(stripped)) {
            // "a)memrlıq" -> "a) memarlıq"
            line = line.replace(/^a\)([a-z])/, "a) $1"); 
            line = line.replace("memrlıq", "memarlıq");
        } else if (/^b\)([a-z])/.test(stripped)) {
             line = line.replace(/^b\)([a-z])/, "b) $1");
        }
        
        // Remove trailing numbers that look like page numbers or noise
        // e.g. "Sanitar texniki avadanlıqlar: 2"
        if (/avadanlıqlar:\s*2$/.test(stripped)) {
            line = line.replace(/:\s*2$/, ":");
        }
        if (/avadanlıq:\s*:$/.test(stripped)) {
            line = line.replace(/:\s*:$/, ":");
        }
        
        // Specific user request fixes
        if (stripped.includes('€')) {
             // "baxılacaq: €" -> "baxılacaq:"
             line = line.replace(/€/, "");
        }
        
        // Fix "mühəndis zl"...
        line = line.replace("(mühəndis zl", "(mühəndis");

        cleanedLines.push(line);
    }
    
    content = cleanedLines.join('\n');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Fixed lists and garbage blocks.");
}

fixStructureAndLists();
