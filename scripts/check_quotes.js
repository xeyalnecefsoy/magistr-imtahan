const fs = require('fs');
const content = fs.readFileSync('scripts/teskilati_b11.json', 'utf8');
console.log('Contains escaped quotes:', content.includes('\\"'));
console.log('Contains unescaped quotes:', (content.match(/"a":\s*"/) || []).length);
