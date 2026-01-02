const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../public/Akademik yazı və etika-Test-Doğru variant А.docx');
const outputPath = path.join(__dirname, '../src/data/akademik-yazi.json');

async function convertDocxToJson() {
  try {
    const result = await mammoth.extractRawText({ path: inputPath });
    const text = result.value;
    
    // Split by question numbers (1., 2., 3., etc.)
    const questionBlocks = text.split(/(?=\d+\.\s)/);
    
    const questions = [];
    let id = 1;
    
    for (const block of questionBlocks) {
      const trimmed = block.trim();
      if (!trimmed || trimmed.length < 10) continue;
      
      // Extract question number and text
      const questionMatch = trimmed.match(/^(\d+)\.\s*([\s\S]*?)(?=\n?[A-DА-Г]\)|$)/);
      if (!questionMatch) continue;
      
      const questionText = questionMatch[2].trim();
      
      // Extract options (A), B), C), D) or А), Б), В), Г)
      const optionMatches = trimmed.match(/[A-DА-Г]\)\s*[^\n]+/g);
      
      if (!optionMatches || optionMatches.length < 2) continue;
      
      const options = optionMatches.map(opt => {
        return opt.replace(/^[A-DА-Г]\)\s*/, '').trim();
      });
      
      // The correct answer is always the first option (A)
      const correctAnswer = options[0];
      
      questions.push({
        id: String(id++),
        type: "mcq",
        question: questionText,
        options: options,
        answer: correctAnswer,
        category: "Akademik yazı və etika"
      });
    }
    
    console.log(`Extracted ${questions.length} questions`);
    
    fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2), 'utf-8');
    console.log(`Saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

convertDocxToJson();
