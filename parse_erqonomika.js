
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'src', 'data', 'erqonomika-bilet.txt');
const outputFile = path.join(__dirname, 'src', 'data', 'erqonomika-suallari.json');

try {
    const data = fs.readFileSync(inputFile, 'utf8');
    const lines = data.split('\n');
    const questions = [];
    let count = 1;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;

        // Regex to match lines starting with "1.", "2.", etc.
        const match = line.match(/^(\d+)\.\s*(.*)/);
        if (match) {
            let questionText = match[2].trim();
            // If the text is empty, check if it continues on the same line but regex missed it (unlikely with .* but safe to check)
            // Or if it continues closely.
            
            if (questionText) {
                questions.push({
                    id: count++,
                    question: questionText,
                    answer: "", // No answer provided in text
                    category: "Bilet Sualları", // Default category
                    keywords: []
                });
            }
        } else {
             // If line doesn't start with number, append to previous question if it looks like continuation
             if (questions.length > 0 && line.length > 1) {
                 // Check if it's not a page number or garbage
                 if (!line.match(/^\d+$/)) {
                    questions[questions.length - 1].question += " " + line;
                 }
             }
        }
    }

    const outputData = {
        subject: "Erqonomika və texniki dizayn",
        totalQuestions: questions.length,
        questions: questions,
        categories: ["Bilet Sualları"]
    };

    fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2), 'utf8');
    console.log(`Successfully parsed ${questions.length} questions to ${outputFile}`);

} catch (err) {
    console.error("Error processing file:", err);
}
