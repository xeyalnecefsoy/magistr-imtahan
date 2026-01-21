const fs = require('fs');
const path = require('path');

try {
  const p1 = JSON.parse(fs.readFileSync('temp_part1.json', 'utf8'));
  console.log('Part 1 loaded');
  const p2 = JSON.parse(fs.readFileSync('temp_part2.json', 'utf8'));
  console.log('Part 2 loaded');
  const p3 = JSON.parse(fs.readFileSync('temp_part3.json', 'utf8'));
  console.log('Part 3 loaded');
  
  const questions = [...p1, ...p2, ...p3];
  console.log(`Total questions: ${questions.length}`);
  
  const categories = [];
  for (let i = 1; i <= 12; i++) categories.push(`Bilet ${i}`);
  
  const finalData = {
    subject: "Erqonomika və texniki dizayn",
    totalQuestions: questions.length,
    questions: questions,
    categories: categories
  };
  
  const outputPath = path.join('src', 'data', 'erqonomika-suallari.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2), 'utf8');
  console.log(`File created at ${outputPath}`);
  
  // Cleanup
  if (fs.existsSync('temp_part1.json')) fs.unlinkSync('temp_part1.json');
  if (fs.existsSync('temp_part2.json')) fs.unlinkSync('temp_part2.json');
  if (fs.existsSync('temp_part3.json')) fs.unlinkSync('temp_part3.json');
  console.log('Cleanup done');

} catch (e) {
  console.error('Error:', e);
}
