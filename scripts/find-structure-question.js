const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/akademik-yazi.json');
const rawData = fs.readFileSync(filePath, 'utf8');
const questions = JSON.parse(rawData);

questions.forEach((q) => {
  if (q.question.toLowerCase().includes('strukturuna')) {
     console.log(`ID ${q.id}: ${q.question}`);
     console.log(`Options: ${q.options}`);
     console.log('---');
  }
});
