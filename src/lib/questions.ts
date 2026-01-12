
import questionsData from "@/data/questions.json"
import akademikYaziData from "@/data/akademik-yazi.json"
import dizaynSuallariData from "@/data/dizayn-suallari.json"
import muhendisYaradiciliqData from "@/data/muhendis-yaradiciliq-suallari.json"
import erqonomikaSuallariData from "@/data/erqonomika-suallari.json"

export type Question = {
  id: string | number
  type: "mcq" | "flashcard"
  question: string
  answer: string
  category: string
  options?: string[]
  source?: string
}

export function getAllQuestions(): Question[] {
  // Transform dizayn questions
  const dizaynQuestions = dizaynSuallariData.questions.map(q => ({
    id: `dizayn-${q.id}`,
    type: "flashcard" as const,
    question: q.question,
    answer: q.answer,
    category: "Sənaye dizaynında fəaliyyət sahələri",
    source: q.source || "Dizayn Sualları"
  }))

  // Transform erqonomika questions
  const erqonomikaQuestions = erqonomikaSuallariData.questions.map(q => ({
    id: `erqonomika-${q.id}`,
    type: "flashcard" as const,
    question: q.question,
    answer: q.answer || "",
    category: "Erqonomika və texniki dizayn",
    source: "Erqonomika"
  }))

  // Transform muhendis questions
  const muhendisQuestions = muhendisYaradiciliqData.questions.map(q => ({
    id: `muhendis-${q.id}`,
    type: "flashcard" as const,
    question: q.question,
    answer: q.answer,
    category: "Mühəndis yaradıcılıq prinsipləri",
    source: "Mühəndislik"
  }))

  // Merge all question sources
  const allQuestions: Question[] = [
    ...questionsData.map(q => ({ 
      ...q, 
      id: `general-${q.id}`, 
      type: (q.type === "mcq" || q.type === "flashcard" ? q.type : "flashcard") as "mcq" | "flashcard",
      answer: q.answer || "",
      category: q.category || "Ümumi",
      source: "Suallar Bankı"
    })),
    ...akademikYaziData.map(q => ({ 
      ...q, 
      id: `akademik-${q.id}`,
      type: (q.type === "mcq" ? "mcq" : "flashcard") as "mcq" | "flashcard", 
      answer: q.answer || "",
      category: "Akademik yazı və etika", 
      source: "Akademik Yazı"
    })),
    ...dizaynQuestions,
    ...erqonomikaQuestions,
    ...muhendisQuestions
  ]

  return allQuestions
}
