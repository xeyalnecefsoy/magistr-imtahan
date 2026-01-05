const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const DOC_PATH = 'public/Gülnarə m.Mühazirə ERQONOMİKA..docx';
const OUTPUT_DIR = 'extracted_images';

async function main() {
    console.log(`Extracting images from ${DOC_PATH}...`);

    if (!fs.existsSync(DOC_PATH)) {
        console.error('File not found!');
        return;
    }

    if (!fs.existsSync(OUTPUT_DIR)){
        fs.mkdirSync(OUTPUT_DIR);
    }

    try {
        const zip = new AdmZip(DOC_PATH);
        const zipEntries = zip.getEntries();
        
        let count = 0;
        zipEntries.forEach((entry) => {
            if (entry.entryName.startsWith('word/media/')) {
                const fileName = path.basename(entry.entryName);
                if (fileName.endsWith('.wdp') || fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
                    zip.extractEntryTo(entry, OUTPUT_DIR, false, true);
                    count++;
                }
            }
        });

        console.log(`Extracted ${count} images to ${OUTPUT_DIR}`);

    } catch (err) {
        console.error("Error:", err);
    }
}

main();
