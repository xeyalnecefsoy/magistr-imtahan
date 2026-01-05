
const fs = require('fs');

const filePath = 'Mühazirə_ERQONOMİKA.md';

function cleanGarbage() {
    let content = fs.readFileSync(filePath, 'utf8');

    // List of regex replacements to clean garbage text
    
    const cleaningRules = [
        // Remove ' R' at the end of a line
        { pattern: /\s+R$/gm, replacement: "" },
        
        // Remove ', . )' at the end of a line
        { pattern: /,\s*\.\s*\)$/gm, replacement: "" },
        
        // Remove ', ”?' at the end of a line
        { pattern: /,\s*”\?$/gm, replacement: "" },
        
        // Remove ' ..' at the end of a line
        { pattern: /\s+\.\.$/gm, replacement: "." },
        
        // Remove ' .' at the end of a line if it comes after a punctuation (like '..')
        // { pattern: /([^.])\.\s\.$/gm, replacement: "$1." },
        
        // Remove lines that are just single characters often mistakes like 'e', '?', 'i', 'F'
        // Be careful not to remove lists like '1.', 'a)'
        { pattern: /^\s*[e\?iF]\s*$/gm, replacement: "" },
        
         // Specific patterns from user request on page 4
        { pattern: /təsəvvür R/g, replacement: "təsəvvür" },
        { pattern: /tövsiyələr, \. \)/g, replacement: "tövsiyələr." },
        { pattern: /formalaşdırılması, ”\?/g, replacement: "formalaşdırılması." },
        { pattern: /reallaşdırılmasının \.\. qiymətləndirilməsi/g, replacement: "reallaşdırılmasının qiymətləndirilməsi" },
        { pattern: /\.\. qiymətləndirilməsi/g, replacement: "qiymətləndirilməsi" }, // fallback
        
        // Remove trailing ' :' or ' : :'
         { pattern: /\s+:\s*:\s*$/gm, replacement: "" },

         // Remove ' . : :'
         { pattern: /\s+\.\s*:\s*:\s*$/gm, replacement: "" },
         
         // Remove ' .' at start of line
         { pattern: /^\s*\.\s+/gm, replacement: "" },
         
         // Fix 'Hygieinos-sağlamlıq' -> 'Hygieinos - sağlamlıq' etc if needed, but let's stick to the user request.
         
         // Cleaning single char lines that look like garbage from OCR
         { pattern: /^[\s\W]*[İiFzZ]\s*$/gm, replacement: "" }

    ];

    let originalContent = content;
    
    cleaningRules.forEach(rule => {
        content = content.replace(rule.pattern, rule.replacement);
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Cleaned specified garbage text.");
    } else {
        console.log("No matching garbage text found to clean.");
    }
}

cleanGarbage();
