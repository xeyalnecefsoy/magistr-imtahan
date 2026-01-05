const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');

const OUTPUT_DIR = 'extracted_images';
const FINAL_MD_FILE = 'Mühazirə_ERQONOMİKA.md';

async function main() {
    console.log(`Scanning images in ${OUTPUT_DIR}...`);

    if (!fs.existsSync(OUTPUT_DIR)) {
        console.error('Directory not found!');
        return;
    }

    const files = fs.readdirSync(OUTPUT_DIR);
    // Filter for hdphoto*.png only (avoid duplicates from image*.png)
    let imageFiles = files.filter(file => {
        return file.startsWith('hdphoto') && file.endsWith('.png');
    });
    
    // Fallback: if no hdphoto, use image*.png
    if (imageFiles.length === 0) {
        console.log("No hdphoto files found, using image*.png");
        imageFiles = files.filter(file => file.startsWith('image') && file.endsWith('.png'));
    }

    // Sort by numerical index
    imageFiles.sort((a, b) => {
        const getNumber = (name) => {
            const match = name.match(/(\d+)/);
            return match ? parseInt(match[1]) : 0;
        };
        return getNumber(a) - getNumber(b);
    });

    console.log(`Found ${imageFiles.length} unique images to process.`);

    console.log("Creating Tesseract worker...");
    const worker = await Tesseract.createWorker('aze');
    console.log("Worker created.");

    // Create header
    fs.writeFileSync(FINAL_MD_FILE, `# Erqonomika Mühazirə\n\n`, 'utf8');

    // Process all images
    for (let i = 0; i < imageFiles.length; i++) {
        const fileName = imageFiles[i];
        const filePath = path.join(OUTPUT_DIR, fileName);
        
        console.log(`[${i + 1}/${imageFiles.length}] Processing ${fileName}...`);
        
        try {
            const { data: { text } } = await worker.recognize(filePath);
            
            const mdContent = `\n\n## Səhifə ${i + 1} (${fileName})\n\n![${fileName}](extracted_images/${fileName})\n\n${text}\n\n---\n`;
            
            fs.appendFileSync(FINAL_MD_FILE, mdContent, 'utf8');
        } catch (err) {
            console.error(`Failed to process ${fileName}:`, err);
        }
    }

    await worker.terminate();

    console.log(`\n\nSuccess! Markdown saved to ${FINAL_MD_FILE}`);
}

main();
