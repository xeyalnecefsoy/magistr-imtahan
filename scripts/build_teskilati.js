const fs = require('fs');
const path = require('path');

const SUBJECT = "Təşkilati dizayn";
const TEACHER = "Kərimov Hüsnü";
const TOTAL_QUESTIONS = 75;
const QUESTIONS_PER_TICKET = 5;
const TOTAL_TICKETS = 15;

function buildQuestion(id, q, a, k) {
  const ticket = Math.ceil(id / QUESTIONS_PER_TICKET);
  return { id, category: `Bilet ${ticket}`, question: q, answer: a, keywords: k };
}

const allQuestions = [];
let nextId = 1;
for (let i = 1; i <= TOTAL_TICKETS; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, `teskilati_b${num}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`Xəbərdarlıq: ${filePath} tapılmadı`);
    continue;
  }
  const arr = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  arr.forEach(item => {
    allQuestions.push(buildQuestion(nextId++, item.q, item.a, item.k));
  });
}

const finalData = {
  subject: SUBJECT,
  teacher: TEACHER,
  examDate: "2026-06-12",
  examType: "Yazılı",
  totalQuestions: allQuestions.length,
  questionsPerTicket: QUESTIONS_PER_TICKET,
  totalTickets: TOTAL_TICKETS,
  questions: allQuestions
};

const outputPath = path.join(__dirname, '..', 'src', 'data', 'teskilati-dizayn-suallari.json');
fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2), 'utf-8');
console.log(`Yaradıldı: ${outputPath} (${allQuestions.length} sual, ${TOTAL_TICKETS} bilet)`);
