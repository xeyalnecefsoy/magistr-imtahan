
const fs = require('fs');

const filePath = "Mühazirə_ERQONOMİKA.md";

const replacements = [
    { pattern: /Frqonomik/g, replacement: "Erqonomik" },
    { pattern: /Frqonomiya/g, replacement: "Erqonomiya" },
    { pattern: /antropoloyi/g, replacement: "antropoloji" },
    { pattern: /psixoloyi/g, replacement: "psixoloji" },
    { pattern: /fizioloyi/g, replacement: "fizioloji" },
    { pattern: /bioloyi/g, replacement: "bioloji" },
    { pattern: /texnoloyi/g, replacement: "texnoloji" },
    { pattern: /metodoloyi/g, replacement: "metodoloji" },
    { pattern: /gigenik/g, replacement: "gigienik" },
    { pattern: /nəzə almaqla/g, replacement: "nəzərə almaqla" },
    { pattern: /sosial-psixoloyi/g, replacement: "sosial-psixoloji" },
    // Regex for 'oloyi' ending word boundaries
    { pattern: /([a-z])oloyi\b/g, replacement: "$1oloji" } 
];

try {
    let content = fs.readFileSync(filePath, 'utf8');
    console.log(`Read ${content.length} characters.`);

    let count = 0;
    replacements.forEach(item => {
        // Count matches
        const matches = content.match(item.pattern);
        if (matches) {
            console.log(`Replaced '${item.pattern}': ${matches.length} times.`);
            content = content.replace(item.pattern, item.replacement);
            count += matches.length;
        }
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Done. Total replacements: ${count}`);

} catch (e) {
    console.error(`Error: ${e}`);
}
