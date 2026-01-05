const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');

const OUTPUT_DIR = 'extracted_images';
const FINAL_OUTPUT_FILE = 'final_output.txt';

async function main() {
    console.log(`Scanning images in ${OUTPUT_DIR}...`);

    if (!fs.existsSync(OUTPUT_DIR)) {
        console.error('Directory not found!');
        return;
    }

    const files = fs.readdirSync(OUTPUT_DIR);
    // Filter for png, jpg, jpeg
    const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.png', '.jpg', '.jpeg'].includes(ext);
    });

    // Sort by numerical index in filename
    imageFiles.sort((a, b) => {
        const getNumber = (name) => {
            const match = name.match(/image(\d+)/); // Match 'image' followed by digits
            // If not imageXXX, try just digits
            if (!match) {
                 const match2 = name.match(/(\d+)/);
                 return match2 ? parseInt(match2[1]) : 0;
            }
            return parseInt(match[1]);
        };
        return getNumber(a) - getNumber(b);
    });

    console.log(`Found ${imageFiles.length} valid images to process.`);

    console.log("Creating Tesseract worker...");
    const worker = await Tesseract.createWorker('aze');
    console.log("Worker created.");

    let fullText = "";

    // Process all images
    for (let i = 0; i < imageFiles.length; i++) {
        const fileName = imageFiles[i];
        const filePath = path.join(OUTPUT_DIR, fileName);
        
        console.log(`[${i + 1}/${imageFiles.length}] Processing ${fileName}...`);
        
        try {
            const { data: { text } } = await worker.recognize(filePath);
            
            fullText += `\n\n--- Page/Image: ${fileName} ---\n\n`;
            fullText += text;
        } catch (err) {
            console.error(`Failed to process ${fileName}:`, err);
        }
    }

    await worker.terminate();

    fs.writeFileSync(FINAL_OUTPUT_FILE, fullText, 'utf8');
    console.log(`\n\nSuccess! All text saved to ${FINAL_OUTPUT_FILE}`);
}

main();
