const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

async function readDocx(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

async function main() {
  const publicDir = path.join(__dirname, '..', 'public');
  
  // Read Erqonomika Bilet file
  const biletPath = path.join(publicDir, 'Bilet-Erqonomika və texniki dizayn.docx');
  const biletContent = await readDocx(biletPath);
  
  // Read Erqonomika Muhazire file  
  const muhazirePath = path.join(publicDir, 'Gülnarə m.Mühazirə ERQONOMİKA..docx');
  const muhazireContent = await readDocx(muhazirePath);
  
  // Save to text files for analysis
  const outputDir = path.join(__dirname, '..', 'src', 'data');
  
  if (biletContent) {
    fs.writeFileSync(
      path.join(outputDir, 'erqonomika-bilet.txt'), 
      biletContent, 
      'utf8'
    );
    console.log('Bilet saved. Length:', biletContent.length);
  }
  
  if (muhazireContent) {
    fs.writeFileSync(
      path.join(outputDir, 'erqonomika-muhazire.txt'), 
      muhazireContent, 
      'utf8'
    );
    console.log('Muhazire saved. Length:', muhazireContent.length);
  }
  
  console.log('Files saved successfully!');
}

main();
