const fs = require('fs');
const files = ['b11','b12','b13','b14','b15'].map(n => 'scripts/teskilati_' + n + '.json');

function fixFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  
  // Extract each object using regex
  const objects = [];
  const regex = /\{[^{}]*\}/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    objects.push(match[0]);
  }
  
  const fixedObjects = [];
  
  for (const obj of objects) {
    const qMatch = obj.match(/"q":\s*"([^"]*)"/);
    const aMatch = obj.match(/"a":\s*"(.*?)"\s*,\s*"k":/s);
    const kMatch = obj.match(/"k":\s*(\[[^\]]*\])/);
    
    if (!qMatch || !aMatch || !kMatch) {
      console.error('Failed to parse object in', file);
      console.error('obj:', obj.substring(0, 100));
      continue;
    }
    
    const q = qMatch[1];
    const a = aMatch[1].replace(/"/g, '\\"');
    const k = kMatch[1];
    
    const fixedObj = '{"q": "' + q + '", "a": "' + a + '", "k": ' + k + '}';
    fixedObjects.push(fixedObj);
  }
  
  const fixedContent = '[\n' + fixedObjects.map(o => '  ' + o).join(',\n') + '\n]';
  fs.writeFileSync(file, fixedContent);
  
  // Validate
  const data = JSON.parse(fixedContent);
  console.log(file + ' FIXED (' + data.length + ' items)');
}

for (const file of files) {
  try {
    fixFile(file);
  } catch(e) {
    console.error(file + ' FAIL: ' + e.message.substring(0,100));
  }
}
