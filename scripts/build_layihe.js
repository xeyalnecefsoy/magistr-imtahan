// Bu skript src/data/layihe-idare-suallari.json faylını yaradır.
// Mövzu: Layihələrin idarə olunması (Qarayev Maarif) - 60 sual, 12 bilet (5 sual/bilet)
const fs = require('fs');
const path = require('path');

const SUBJECT = "Layihələrin idarə olunması";
const TOTAL_QUESTIONS = 60;
const QUESTIONS_PER_TICKET = 5;

function buildQuestion(id, q, a, k) {
  const ticket = Math.ceil(id / QUESTIONS_PER_TICKET);
  return {
    id,
    category: `Bilet ${ticket}`,
    question: q,
    answer: a,
    keywords: k
  };
}

const allQuestions = [
  // Bilet 1
  buildQuestion(1, "Layihə menecmentində liderlik", "Liderlik layihə menecmentinin ən vacib komponentlərindən biridir. Layihə meneceri komandanı istiqamətləndirmək, motivasiya etmək və ümumi məqsədə çatmaq üçün onlara ilham vermək bacarığına malik olmalıdır. Yaxşı lider aşağıdakı keyfiyyətlərə malikdir: strateji düşünmə, qərar qəbuletmə, ünsiyyət bacarığı, problemləri həll etmə, komanda üzvlərinə inam və hörmət. Lider formal (rəsmi səlahiyyət) və qeyri-formal (şəxsi nüfuz) ola bilər. Transformativ liderlik layihələrdə daha effektivdir - belə lider komandanı dəyişikliklərə hazırlayır, onların potensialını artırır və ümumi uğur üçün birgə işləməyə sövq edir. Lider həmçinin riskləri qiymətləndirməli, prioritetləri müəyyən etməli və resursları düzgün bölüşdürməlidir.", ["liderlik", "menecer", "motivasiya", "komanda", "transformativ lider", "qərar qəbulu"]),
  buildQuestion(2, "Layihə menecerinin vəzifələri", "Layihə meneceri layihənin uğurla başa çatdırılması üçün bütün əsas funksiyaları yerinə yetirir:\n\n1) **Planlaşdırma** — iş bölgüsü, resursların ayrılması, vaxt cədvəlinin tərtibi\n2) **Təşkilati** — komandanın formalaşdırılması, rolların bölüşdürülməsi, kommunikasiya kanallarının qurulması\n3) **Rəhbərlik** — komandanın motivasiyası, problemlərin həlli, münaqişələrin idarə olunması\n4) **Nəzarət** — işin gedişatının izlənməsi, keyfiyyətin yoxlanılması, dəyişikliklərin idarə olunması\n5) **Hesabatlılıq** — maraqlı tərəflərə (steykholder) mütəmadi məlumat verilməsi\n6) **Risklərin idarə olunması** — mümkün risklərin aşkar edilməsi və onlara qarşı tədbirlərin görülməsi\n\nMenecer həmçinin layihənin əhatə dairəsi, büdcə və vaxt çərçivəsində qalmasını təmin etməlidir.", ["planlaşdırma", "təşkilati", "nəzarət", "hesabatlılıq", "risk", "layihə meneceri"]),
  buildQuestion(3, "Layihə komandasında kadrların planlaşdırılması", "Kadrların planlaşdırılması layihənin uğuru üçün həyati əhəmiyyətə malikdir. Bu proses aşağıdakı mərhələləri əhatə edir:\n\n1) **Tələblərin müəyyən edilməsi** — layihə üçün hansı ixtisas və bacarıqlara ehtiyac olduğunun təhlili\n2) **Rolların müəyyənləşdirilməsi** — hər bir üzvün vəzifə və məsuliyyətlərinin dəqiq təsviri (məs: analitik, dizayner, proqramçı, testçi)\n3) **Komandanın formalaşdırılması** — uyğun namizədlərin seçilməsi və işə götürülməsi\n4) **BACİ matrisi** — Bacarıqlar (Skills), Bacarıq səviyyəsi (Ability), Təcrübə (Competency), İstifadə (Utilization) — komanda üzvlərinin ixtisas xəritəsi\n5) **Təlim və inkişaf** — komandanın bilik və bacarıqlarının artırılması\n6) **Motivasiya və saxlanılması** — yaxşı işçilərin layihədə qalmasının təmin edilməsi\n\nDüzgün planlaşdırma olmadan layihədə əsas ixtisas çatışmazlığı yarana bilər ki, bu da vaxt və büdcəyə mənfi təsir göstərir.", ["kadr planlaması", "rollar", "BACİ", "komanda formalaşdırma", "təlim", "motivasiya"]),
  buildQuestion(4, "Layihə menecmentinin tarixi", "Layihə menecmenti qədim tarixə malikdir:\n\n- **Qədim dövr** — Misir piramidalarının, Böyük Çin Səddinin tikintisi böyük layihələrin idarə olunmasını tələb edirdi\n- **XX əsrin əvvəlləri** — Henri Qantt (Gantt diaqramı), Frederik Teylor (elmi idarəetmə), Henri Ford (kütləvi istehsal) prinsipləri\n- **1950-60-cı illər** — PERT (Program Evaluation and Review Technique) və CPM (Critical Path Method) metodları yaradıldı (ABŞ kosmik proqramları üçün)\n- **1969** — PMI (Project Management Institute) təsis edildi\n- **1980-90-cı illər** — kompüter texnologiyalarının inkişafı layihə idarəetmə proqramlarının yaranmasına səbəb oldu (MS Project, Primavera)\n- **1987** — ilk PMBOK (Project Management Body of Knowledge) nəşr olundu\n- **2000-ci illərdən** — Agile, Scrum, PRINCE2 kimi çevik metodologiyalar geniş yayıldı\n- **Müasir dövr** — rəqəmsallaşma, süni intellekt və uzaqdan idarəetmə layihə menecmentini yeni səviyyəyə qaldırdı", ["tarix", "PMI", "PMBOK", "PERT", "CPM", "Gantt", "Agile", "Scrum"]),
  buildQuestion(5, "Layihələrin təsnifatı", "Layihələr müxtəlif meyarlara görə təsnif edilir:\n\n**1) Miqyasına görə:**\n- Kiçik layihələr (bir neçə həftə, 2-5 nəfər)\n- Orta layihələr (bir neçə ay, 10-30 nəfər)\n- Böyük layihələr (illər, 100+ nəfər)\n- Mega-layihələr (dövlət səviyyəli, milyardlıq büdcə)\n\n**2) Sahəsinə görə:**\n- Tikinti, İT, istehsal, səhiyyə, təhsil, sosial, ekoloji\n\n**3) Mürəkkəblik dərəcəsinə görə:**\n- Sadə (standart, təkrarlanan)\n- Mürəkkəb (yeni texnologiyalar, çoxsaylı maraqlı tərəflər)\n- Çox mürəkkəb (transformativ, yüksək riskli)\n\n**4) Müddətinə görə:**\n- Qısamüddətli (< 1 il)\n- Ortamüddətli (1-3 il)\n- Uzunmüddətli (3+ il)\n\n**5) İdarəetmə strukturuna görə:**\n- Fərdi, komanda, proqram, portfel layihələri\n\n**6) Məqsədinə görə:**\n- Kommersiya, sosial, elmi-tədqiqat, dövlət layihələri", ["miqyas", "sahə", "mürəkkəblik", "müddət", "təsnifat", "kommersiya", "sosial"])
];

// Bu hissənin davamı layihe_part2.json, layihe_part3.json, layihe_part4.json fayllarındadır
// Hər partial fayl [{"q","a","k"}, ...] formatındadır və qarışıq biletlərdən ibarət ola bilər
let nextId = 6;
function processPart(filePath) {
  if (!fs.existsSync(filePath)) return;
  const arr = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  arr.forEach((item, idx) => {
    // Bilet sərhəddi: id 6-10, 11-15, 16-20, ...
    // Part2 Bilet 2-4 (id 6-20), Part3 Bilet 5-8 (id 21-40), Part4 Bilet 9-12 (id 41-60)
    const id = nextId++;
    allQuestions.push(buildQuestion(id, item.q, item.a, item.k));
  });
}
processPart(path.join(__dirname, 'layihe_part2.json'));
processPart(path.join(__dirname, 'layihe_part3.json'));
processPart(path.join(__dirname, 'layihe_part4.json'));

const finalData = {
  subject: SUBJECT,
  teacher: "Qarayev Maarif",
  examDate: "2026-06-08",
  examType: "Yazılı",
  totalQuestions: TOTAL_QUESTIONS,
  questionsPerTicket: QUESTIONS_PER_TICKET,
  totalTickets: 12,
  questions: allQuestions
};

const outputPath = path.join(__dirname, '..', 'src', 'data', 'layihe-idare-suallari.json');
fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2), 'utf-8');
console.log(`Yaradıldı: ${outputPath} (${allQuestions.length} sual)`);
