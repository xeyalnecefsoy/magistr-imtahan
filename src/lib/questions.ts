
import layiheIdareData from "@/data/layihe-idare-suallari.json"
import teskilatiDizaynData from "@/data/teskilati-dizayn-suallari.json"
import komputerDizayn2Data from "@/data/komputer-dizayn-2-suallari.json"
import bediiResmData from "@/data/bedii-resm-suallari.json"
import istehsalProsesiData from "@/data/istehsal-prosesi-suallari.json"

export type Question = {
  id: string | number
  type: "mcq" | "flashcard"
  question: string
  answer: string
  category: string
  options?: string[]
  source?: string
}

type SubjectFile = {
  subject: string
  teacher?: string
  examDate?: string
  examType?: string
  totalQuestions?: number
  questionsPerTicket?: number
  totalTickets?: number
  questions: Array<{
    id: number | string
    category: string
    question: string
    answer: string
    keywords?: string[]
  }>
}

function transformSubject(file: SubjectFile, source: string) {
  return file.questions.map(q => ({
    id: `${source}-${q.id}`,
    type: "flashcard" as const,
    question: q.question,
    answer: q.answer || "",
    category: file.subject,
    source
  }))
}

export function getAllQuestions(): Question[] {
  const allQuestions: Question[] = [
    ...transformSubject(layiheIdareData as SubjectFile, "Layihələrin idarə olunması"),
    ...transformSubject(teskilatiDizaynData as SubjectFile, "Təşkilati dizayn"),
    ...transformSubject(komputerDizayn2Data as SubjectFile, "Sənaye dizaynında kompüter layihələndirilməsi-2"),
    ...transformSubject(bediiResmData as SubjectFile, "Bədii layihələndirmədə texniki rəsm"),
    ...transformSubject(istehsalProsesiData as SubjectFile, "İstehsal prosesinin texnoloji əsasları")
  ]

  return allQuestions
}

export const SUBJECT_LIST = [
  "Layihələrin idarə olunması",
  "Təşkilati dizayn",
  "Sənaye dizaynında kompüter layihələndirilməsi-2",
  "Bədii layihələndirmədə texniki rəsm",
  "İstehsal prosesinin texnoloji əsasları"
] as const

export const EXAM_DATES_MAP: Record<string, string> = {
  "Layihələrin idarə olunması": "2026-06-08",
  "Təşkilati dizayn": "2026-06-12",
  "Sənaye dizaynında kompüter layihələndirilməsi-2": "2026-06-17",
  "Bədii layihələndirmədə texniki rəsm": "2026-06-22",
  "İstehsal prosesinin texnoloji əsasları": "2026-06-26"
}
