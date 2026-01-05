const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const Tesseract = require('tesseract.js');

const DOC_PATH = 'public/Gülnarə m.Mühazirə ERQONOMİKA..docx';
const OUTPUT_FILE = 'extracted_text.txt';

async function main() {
    console.log(`Processing ${DOC_PATH}...`);

    if (!fs.existsSync(DOC_PATH)) {
        console.error('File not found!');
        return;
    }

    try {
        const zip = new AdmZip(DOC_PATH);
        const zipEntries = zip.getEntries();
        
        // Filter for media files
        const mediaFiles = zipEntries.filter(entry => entry.entryName.startsWith('word/media/'));
        
        // Sort specifically by the number in the filename to maintain order (image1.png, image2.png...)
        mediaFiles.sort((a, b) => {
            const getNumber = (name) => {
                const match = name.match(/image(\d+)\./);
                return match ? parseInt(match[1]) : 0;
            };
            return getNumber(a.name) - getNumber(b.name);
        });

        console.log(`Found ${mediaFiles.length} images. Starting OCR...`);
        
        let fullText = "";

        console.log("Creating Tesseract worker...");
        const worker = await Tesseract.createWorker('aze');
        console.log("Worker created.");

        // Limit to 5 for test
        const limit = 5; 
        console.log(`Processing first ${limit} images for test...`);

        for (let i = 0; i < Math.min(mediaFiles.length, limit); i++) {
            const entry = mediaFiles[i];
            console.log(`Processing image ${i + 1}/${Math.min(mediaFiles.length, limit)}: ${entry.name}`);
            
            const buffer = entry.getData();
            
            const { data: { text } } = await worker.recognize(buffer);
            
            fullText += `\n\n--- Image: ${entry.name} ---\n\n`;
            fullText += text;
        }

        await worker.terminate();

        fs.writeFileSync(OUTPUT_FILE, fullText, 'utf8');
        console.log(`Done! Text saved to ${OUTPUT_FILE}`);

    } catch (err) {
        console.error("Error in main execution:", err);
    }
}

main();
