
const fs = require('fs');
const path = require('path');

const filePath = 'Mühazirə_ERQONOMİKA.md';

function cleanGarbage() {
    let content = fs.readFileSync(filePath, 'utf8');

    // Pages to clean completely: 3, 18, 19, 20
    const pagesToClean = [3, 18, 19, 20];
    
    pagesToClean.forEach(pageNum => {
        // Regex to match:
        // ## Səhifə N (hdphotoN.png)
        // [whitespace]
        // ![...](...)
        // [whitespace]
        // (CONTENT TO REMOVE)
        // [whitespace]
        // --- 
        
        // We look for text between the image tag and the '---' separator.
        const regex = new RegExp(`(## Səhifə ${pageNum} \\(hdphoto${pageNum}\\.png\\)\\s+\n!\\[.+?\\]\\(.+?\\)\\s+)([\\s\\S]+?)(\\n---)`, 'g');
        
        content = content.replace(regex, (match, header, body, footer) => {
            console.log(`Cleaning Page ${pageNum}...`);
            return `${header}\n***(Bu səhifədə oxunaqlı mətn yoxdur, yalnız sxem və ya diaqram ola bilər)***\n${footer}`;
        });
    });

    // Page 17 cleanup
    // Looking for "R ununnunuxunu..." before "iri obyekt"
    const page17Regex = /(## Səhifə 17 \(hdphoto17\.png\)\s+\n!\[.+?\]\(.+?\)\s+)([\s\S]+?)(iri obyekt)/;
    const match17 = content.match(page17Regex);
    if (match17) {
        const garbagePart = match17[2];
        if (garbagePart.includes('ununnunuxunu')) {
             console.log("Cleaning Page 17...");
             content = content.replace(page17Regex, "$1$3");
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Cleaning complete.");
}

cleanGarbage();
