
const fs = require('fs');

const filePath = 'Mühazirə_ERQONOMİKA.md';

function cleanContent() {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Line-by-line Cleanup
    let lines = content.split('\n');
    let cleanedLines = [];
    
    lines.forEach(line => {
        let stripped = line.trim();
        
        // Skip obvious garbage lines
        // e.g. "4 7 ) mə “x $" or "r” 0......uuxuuuuun"
        if (stripped.includes('uuxuuuu') || stripped.includes('NNNNNH')) return;
        if (/^[\W\d_]*[a-zA-ZəöğüşıçƏÖĞÜŞIÇ][\W\d_]*$/.test(stripped) && stripped.length < 5) {
             // Single short word/char lines that are typically noise
             // Exception: "1." or "a)" list items
             if (!/^\d+\./.test(stripped) && !/^[a-z]\)/.test(stripped)) return;
        }
        
        // Aggressive symbol check: if line is short and mostly symbols
        if (/^[\s\W\d_]+$/.test(stripped) && stripped.length < 20 && !stripped.startsWith('##') && !stripped.includes('---')) {
            return;
        }
        
        // Specific messy lines
        if (stripped.includes('zmnür (şəki 9z)')) return;
        if (stripped.includes('/” £–/4 GİLAN')) return;
        if (stripped.includes('4 7 ) mə “x $')) return;
        
        // In-line string replacements
        let fixedLine = line;
        fixedLine = fixedLine.replace("B7 it işləri", "Bəzi tədqiqat işləri");
        fixedLine = fixedLine.replace("ins ..n .. olan", "insan ilə olan");
        fixedLine = fixedLine.replace(/^\s*İ\s+/, ""); // Remove leading "İ "
        
        cleanedLines.push(fixedLine);
    });
    
    content = cleanedLines.join('\n');

    // 2. Global Regex Replacements for Typos
    const replacements = [
        { pattern: /\bAntrometrik\b/g, replacement: 'Antropometrik' },
        { pattern: /\bçertyollarda\b/g, replacement: 'çertyojlarda' },
        { pattern: /\bmanikenlərdən\b/g, replacement: 'manekenlərdən' },
        { pattern: /\bmulyailərdə\b/g, replacement: 'mulyajlarda' },
        { pattern: /\btrasformasiyaya\b/g, replacement: 'transformasiyaya' },
        { pattern: /\bkmponentlərinin\b/g, replacement: 'komponentlərinin' },
        { pattern: /\bbi çox\b/g, replacement: 'bir çox' },
        { pattern: /\bfunksonal\b/g, replacement: 'funksional' },
        { pattern: /\noluna bilər\b/g, replacement: 'oluna bilər' },
        { pattern: /Bu 5 halda/g, replacement: 'Bu halda' },
        { pattern: /\bPrqonomika\b/g, replacement: 'Erqonomika' }, 
        { pattern: /\bFrqonomika\b/g, replacement: 'Erqonomika' },
        { pattern: /\bVrqonomik\b/g, replacement: 'Erqonomik' },
        { pattern: /\bvəmiyyətin\b/g, replacement: 'cəmiyyətin' },
        { pattern: /\bhülsoloq\b/g, replacement: 'psixoloq' },
        { pattern: /\bflaloloq\b/g, replacement: 'fizioloq' },
        { pattern: /\bSüyfal\b/g, replacement: 'Sosial' },
        { pattern: /\bəlntropometrik\b/g, replacement: 'Antropometrik' },
        { pattern: /\bavidanlığın\b/g, replacement: 'avadanlığın' },
        { pattern: /\bFiziolofi\b/g, replacement: 'Fizioloji' },
        { pattern: /\bPsixolofi\b/g, replacement: 'Psixoloji' },
        { pattern: /\bgigenik\b/g, replacement: 'gigienik' },
        { pattern: /\benerği\b/g, replacement: 'enerji' },
        { pattern: /\btast gəlinmir\b/g, replacement: 'rast gəlinmir' },
        { pattern: /\bavdın\b/g, replacement: 'aydın' },
        { pattern: /\bobvektlər\b/g, replacement: 'obyektlər' },
        { pattern: /^\s*557 metodiki/gm, replacement: 'Metodiki' },
        { pattern: /Si NE\?/g, replacement: '' },
        { pattern: /i İ İL \./g, replacement: '' },
        { pattern: /7 ke\) kola a/g, replacement: '' },
        { pattern: /LER do lü \$/g, replacement: '' },
        
        // Remove trailing garbage chars
        { pattern: / ğ$/gm, replacement: '' },
        { pattern: / ş$/gm, replacement: '' },
        { pattern: / z$/gm, replacement: '' }
    ];

    replacements.forEach(rule => {
        content = content.replace(rule.pattern, rule.replacement);
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Comprehensive Node cleanup complete.");
}

cleanContent();
