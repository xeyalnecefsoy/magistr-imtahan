
const fs = require('fs');
const path = require('path');

const questionsFile = path.join(__dirname, 'src', 'data', 'erqonomika-suallari.json');
const lectureFile = path.join(__dirname, 'Mühazirə_ERQONOMİKA.md');

// Simple stopwords list for Azerbaijani (can be expanded)
const stopwords = new Set([
  'və', 'bir', 'bu', 'da', 'ilə', 'üçün', 'ki', 'olan', 'kimi', 'hər', 'o', 'ən', 'çox', 'haqqında', 'nədir', 'bəhs', 'edir', 'hansı', 'hansılardır', 'nədən', 'ibarətdir', 'sual', 'cavab'
]);

function normalize(text) {
    return text.toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();
}

function getKeywords(text) {
    return normalize(text).split(' ').filter(w => w.length > 2 && !stopwords.has(w));
}

function calculateScore(questionKeywords, textKeywords) {
    let match = 0;
    textKeywords.forEach(w => {
        if (questionKeywords.includes(w)) match++;
    });
    return match;
}

try {
    const questionsData = JSON.parse(fs.readFileSync(questionsFile, 'utf8'));
    const lectureText = fs.readFileSync(lectureFile, 'utf8');

    // Split lecture into chunks (paragraphs)
    // We filter out image links and very short lines
    const paragraphs = lectureText.split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(p => p.length > 50 && !p.startsWith('![') && !p.startsWith('## Səhifə'));

    let filledCount = 0;

    questionsData.questions.forEach(q => {
        const qKeywords = getKeywords(q.question);
        
        let bestParagraph = "";
        let bestScore = 0;

        // Try to find the best matching paragraph
        // We can also look for sliding windows of paragraphs for better context
        for (let i = 0; i < paragraphs.length; i++) {
            const p = paragraphs[i];
            const pKeywords = getKeywords(p);
            
            // Simple overlap score
            const score = calculateScore(qKeywords, pKeywords);

            // Boost score if the paragraph starts with keywords from the question (Subject definition)
            
            if (score > bestScore) {
                bestScore = score;
                bestParagraph = p;
                
                // Append next paragraph if it seems related (short answer)
                if (paragraphs[i+1] && paragraphs[i+1].length > 20 && calculateScore(qKeywords, getKeywords(paragraphs[i+1])) > 0) {
                     bestParagraph += "\n\n" + paragraphs[i+1];
                }
            }
        }

        if (bestScore > 2) { // Threshold
            q.answer = bestParagraph;
            filledCount++;
            
            // Extract keywords from the answer for the question
            const answerKeywords = getKeywords(bestParagraph);
            // Take top 5 unique keywords
            q.keywords = [...new Set(answerKeywords)].slice(0, 5);
        } else {
            console.log(`Low match for question ${q.id}: ${q.question}`);
        }
    });

    fs.writeFileSync(questionsFile, JSON.stringify(questionsData, null, 2), 'utf8');
    console.log(`Updated answers for ${filledCount} out of ${questionsData.questions.length} questions.`);

} catch (err) {
    console.error("Error:", err);
}
