
const fs = require('fs');

const markdownText = fs.readFileSync('Mühazirə_ERQONOMİKA.md', 'utf8');
const questionsData = JSON.parse(fs.readFileSync('src/data/erqonomika-suallari.json', 'utf8'));

// Split by double newline to get paragraphs
let chunks = markdownText.split(/\n\s*\n/);
chunks = chunks.filter(c => c.length > 50);

function getBestMatch(question, chunks) {
    const qWords = question.toLowerCase().match(/\w+/g) || [];
    const qWordSet = new Set(qWords);
    
    let bestChunk = "";
    let bestScore = 0;
    
    for (const chunk of chunks) {
        const cWords = chunk.toLowerCase().match(/\w+/g) || [];
        const cWordSet = new Set(cWords);
        
        let score = 0;
        for (const word of qWordSet) {
            if (cWordSet.has(word)) {
                score++;
            }
        }
        
        if (score > bestScore) {
            bestScore = score;
            bestChunk = chunk;
        }
    }
    return bestChunk;
}

const output = questionsData.questions.map(q => {
    let match = getBestMatch(q.question, chunks);
    // Truncate for readability
    if (match.length > 500) match = match.substring(0, 500) + "...";
    
    return {
        id: q.id,
        question: q.question,
        context: match
    };
});

fs.writeFileSync('question_contexts.json', JSON.stringify(output, null, 2), 'utf8');
console.log("Contexts extracted via Node.");
