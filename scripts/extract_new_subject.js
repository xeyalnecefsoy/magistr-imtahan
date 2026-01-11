const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const WordExtractor = require('word-extractor'); 

const ticketsPath = path.join(process.cwd(), 'public', 'Bilet - 25 Mühəndis yarad.prin..docx');
const lecturePath = path.join(process.cwd(), 'public', 'Mühən.layihələn.əsasları.Mühazirə mətni..doc');

async function extractText() {
    console.log('--- START TICKETS ---');
    try {
        const result = await mammoth.extractRawText({ path: ticketsPath });
        console.log(result.value);
    } catch (e) {
        console.error('Error reading tickets:', e);
    }
    console.log('--- END TICKETS ---');

    console.log('\n\n--- START LECTURE ---');
    try {
        const extractor = new WordExtractor();
        const extracted = await extractor.extract(lecturePath);
        console.log(extracted.getBody());
    } catch (e) {
        console.error('Error reading lecture:', e);
    }
    console.log('--- END LECTURE ---');
}

extractText();
