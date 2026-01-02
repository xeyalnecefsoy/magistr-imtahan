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
  
  // Read Bilet file
  const biletPath = path.join(publicDir, 'Bilet-Dizaynın fəaliyyət sahələri.docx');
  const biletContent = await readDocx(biletPath);
  
  // Read Muhazire file
  const muhazirePath = path.join(publicDir, 'Dizaynın fəaliyyət sah.MÜHAZİRƏ.docx');
  const muhazireContent = await readDocx(muhazirePath);
  
  // Save to text files for analysis
  const outputDir = path.join(__dirname, '..', 'src', 'data');
  
  fs.writeFileSync(
    path.join(outputDir, 'bilet-suallari.txt'), 
    biletContent, 
    'utf8'
  );
  
  fs.writeFileSync(
    path.join(outputDir, 'muhazire.txt'), 
    muhazireContent, 
    'utf8'
  );
  
  console.log('Files saved successfully!');
  console.log('Bilet length:', biletContent.length);
  console.log('Muhazire length:', muhazireContent.length);
}

main();
