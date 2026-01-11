const fs = require('fs');
const path = require('path');

const inputPath = path.join(process.cwd(), 'lecture_text.txt');
const outputPath = path.join(process.cwd(), 'lecture_text_formatted.txt');

try {
    const content = fs.readFileSync(inputPath, 'utf8');
    // Replace multiple spaces with one, add newlines after periods if followed by space or uppercase
    let formatted = content.replace(/\s+/g, ' ');
    formatted = formatted.replace(/\. ([A-ZŞÜÖĞIƏÇ])/g, '.\n\n$1');
    formatted = formatted.replace(/Mühazirə/g, '\n\n## Mühazirə');
    formatted = formatted.replace(/([0-9]+\))/g, '\n$1'); // List items
    
    fs.writeFileSync(outputPath, formatted);
    console.log('Formatted text saved to lecture_text_formatted.txt');
} catch (e) {
    console.error(e);
}
