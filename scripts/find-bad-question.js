const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/akademik-yazi.json');
const rawData = fs.readFileSync(filePath, 'utf8');
const questions = JSON.parse(rawData);

console.log(`Total questions: ${questions.length}`);

questions.forEach((q, index) => {
  const hasStructure = q.question.toLowerCase().includes('struktur');
  const hasPlagiarismOption = q.options && q.options.some(opt => opt.includes('Dublikat nəşr'));
  
  if (hasStructure && hasPlagiarismOption) {
     console.log(`FOUND PROBLEM AT ID ${q.id} (Index ${index}):`);
     console.log(`Question: ${q.question}`);
     console.log(`Options: ${q.options}`);
     console.log('---');
  } else if (hasPlagiarismOption) {
     // Suspicious if options are plagiarism types but question is not about plagiarism
     console.log(`Plagiarism Options at ID ${q.id}: Question: "${q.question}"`);
  }
});
