const fs = require('fs');
const files = ['b11','b12','b13','b14','b15'].map(n => 'scripts/teskilati_' + n + '.json');

function fixQuotes(content) {
  let result = '';
  let inString = false;
  let escaped = false;
  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    if (ch === '\\' && !escaped) {
      escaped = true;
      result += ch;
    } else if (ch === '"' && !escaped) {
      if (inString) {
        let j = i + 1;
        while (j < content.length && /[\s\n\r]/.test(content[j])) j++;
        const next = content[j];
        if (next === '}' || next === ']' || next === ',' || next === ':' || next === undefined) {
          result += ch;
          inString = false;
        } else {
          result += '\\' + ch;
        }
      } else {
        result += ch;
        inString = true;
      }
    } else {
      escaped = false;
      result += ch;
    }
  }
  return result;
}

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const fixed = fixQuotes(content);
    const data = JSON.parse(fixed);
    fs.writeFileSync(file, fixed);
    console.log(file + ' FIXED (' + data.length + ' items)');
  } catch(e) {
    console.error(file + ' FAIL: ' + e.message.substring(0,100));
  }
}
