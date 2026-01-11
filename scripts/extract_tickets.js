const path = require('path');
const mammoth = require('mammoth');

const ticketsPath = path.join(process.cwd(), 'public', 'Bilet - 25 Mühəndis yarad.prin..docx');

async function extractTickets() {
    try {
        const result = await mammoth.extractRawText({ path: ticketsPath });
        console.log(result.value);
    } catch (e) {
        console.error('Error reading tickets:', e);
    }
}

extractTickets();
