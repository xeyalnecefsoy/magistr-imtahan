
const fs = require('fs');

const filePath = 'Mühazirə_ERQONOMİKA.md';

function fixMistakes() {
    let content = fs.readFileSync(filePath, 'utf8');

    const replacements = [
        // Page 13 fixes
        { pattern: /B7 it işləri/g, replacement: "Bəzi tədqiqat işləri" },
        { pattern: /ins \.\.n \.\. olan/g, replacement: "insan ilə olan" },
        { pattern: /məsa" \. 5 müharibəsindən/g, replacement: "məsələn II Dünya müharibəsindən" },
        { pattern: /^\s*iə:\s*$/gm, replacement: "" },
        { pattern: /^\s*:\s*$/gm, replacement: "" },

        // Page 14 fixes (Bad OCR)
        { pattern: /Prqonomika/g, replacement: "Erqonomika" },
        { pattern: /vəmiyyətin/g, replacement: "cəmiyyətin" },
        { pattern: /buğlli/g, replacement: "bağlı" },
        { pattern: /osuslanır/g, replacement: "əsaslanır" },
        { pattern: /Bü sahədə/g, replacement: "Bu sahədə" },
        { pattern: /İyləri/g, replacement: "İşləri" },
        { pattern: /apunılan/g, replacement: "aparılan" },
        { pattern: /çorçiyənində/g, replacement: "çərçivəsində" },
        { pattern: /erqonomikadu/g, replacement: "erqonomikada" },
        { pattern: /Viqonomik/g, replacement: "Erqonomik" },
        { pattern: /hülsoloq/g, replacement: "psixoloq" },
        { pattern: /flaloloq/g, replacement: "fizioloq" },
        { pattern: /memur/g, replacement: "memar" },
        { pattern: /Vrqonomik/g, replacement: "Erqonomik" },
        { pattern: /füktorlarından/g, replacement: "faktorlarından" },
        { pattern: /Aşuğıda/g, replacement: "Aşağıda" },
        { pattern: /Süyfal-psixoloji/g, replacement: "Sosial-psixoloji" },
        { pattern: /qurşılıqlı/g, replacement: "qarşılıqlı" },
        { pattern: /əlntropometrik/g, replacement: "Antropometrik" },
        { pattern: /avidanlığın/g, replacement: "avadanlığın" },
        { pattern: /Psixolo\/t/g, replacement: "Psixoloji" },
        { pattern: /iş zümüni/g, replacement: "iş zamanı" },
        { pattern: /əikkif/g, replacement: "effektiv" }, // Guessing 'effektiv' fit context of comfort
        { pattern: /Fiziolofi/g, replacement: "Fizioloji" },
        { pattern: /quvvəsi/g, replacement: "qüvvəsi" },
        { pattern: /enerği/g, replacement: "enerji" },
        
        // Page 14 trailing garbage
        { pattern: /^\s*13\s*$/gm, replacement: "" },
        { pattern: /^\s*m\s*$/gm, replacement: "" },

        // Page 16 fixes
        { pattern: /^MUNUN”\s*$/gm, replacement: "" },
        { pattern: /^n”\s*$/gm, replacement: "" },
        { pattern: /tast gəlinmir/g, replacement: "rast gəlinmir" },
        { pattern: /tssir/g, replacement: "təsir" },
        { pattern: /İnsnın/g, replacement: "İnsanın" },
        { pattern: /obvektlər/g, replacement: "obyektlər" },
        { pattern: /avdın/g, replacement: "aydın" }
    ];

    replacements.forEach(rule => {
        content = content.replace(rule.pattern, rule.replacement);
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Fixed specific typos and garbage.");
}

fixMistakes();
