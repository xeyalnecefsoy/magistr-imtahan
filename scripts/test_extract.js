const fs = require('fs');
const content = fs.readFileSync('scripts/teskilati_b11.json', 'utf8');

// Extract each object as text
const objects = [];
const regex = /\{[^{}]*\}/g;
let match;
while ((match = regex.exec(content)) !== null) {
  objects.push(match[0]);
}

console.log('Found', objects.length, 'objects');

for (let i = 0; i < objects.length; i++) {
  const obj = objects[i];
  const qMatch = obj.match(/"q":\s*"([^"]*)"/);
  const aMatch = obj.match(/"a":\s*"(.*?)"\s*,\s*"k":/s);
  const kMatch = obj.match(/"k":\s*(\[[^\]]*\])/);
  
  if (qMatch && aMatch && kMatch) {
    console.log('Object', i+1, 'q:', qMatch[1].substring(0, 30));
    console.log('  a length:', aMatch[1].length);
    console.log('  k:', kMatch[1].substring(0, 30));
  } else {
    console.log('Object', i+1, 'PARSE FAILED');
    console.log('  q:', !!qMatch, 'a:', !!aMatch, 'k:', !!kMatch);
    console.log('  obj snippet:', obj.substring(0, 100));
    console.log('  obj end:', obj.substring(obj.length - 100));
  }
}
