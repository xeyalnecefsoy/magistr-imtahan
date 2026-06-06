const fs = require('fs');
const files = ['b12','b13','b14','b15'].map(n => 'scripts/teskilati_' + n + '.json');

function escapeUnescapedQuotes(str) {
  let result = '';
  let i = 0;
  while (i < str.length) {
    if (str[i] === '"') {
      // Count backslashes before this quote
      let backslashCount = 0;
      let j = i - 1;
      while (j >= 0 && str[j] === '\\') {
        backslashCount++;
        j--;
      }
      // If even number of backslashes, the quote is unescaped
      if (backslashCount % 2 === 0) {
        result += '\\"';
      } else {
        result += '"';
      }
      i++;
    } else {
      result += str[i];
      i++;
    }
  }
  return result;
}

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
    const a = escapeUnescapedQuotes(aMatch[1]);
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
