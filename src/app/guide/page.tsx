"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  ArrowLeft, Lightbulb, FileText, ChevronRight, 
  Layout, Star, BookOpen, Layers, PenTool, Database, Cpu, Brush, Network
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Markdown from "react-markdown"

import layiheIdareData from "@/data/layihe-idare-suallari.json"
import teskilatiDizaynData from "@/data/teskilati-dizayn-suallari.json"
import komputerDizayn2Data from "@/data/komputer-dizayn-2-suallari.json"
import bediiResmData from "@/data/bedii-resm-suallari.json"
import istehsalProsesiData from "@/data/istehsal-prosesi-suallari.json"

// Type definitions
type GuideQuestion = {
  id: number | string
  question: string
  answer: string
  category: string
  keywords?: string[]
}

type Subject = {
  id: string
  title: string
  icon: any
  data: any
  color: string
}

const SUBJECTS: Subject[] = [
  {
    id: "layihe",
    title: "Layihələrin idarə olunması",
    icon: Lightbulb,
    data: layiheIdareData,
    color: "from-amber-500 to-orange-500"
  },
  {
    id: "teskilati",
    title: "Təşkilati dizayn",
    icon: Network,
    data: teskilatiDizaynData,
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "komputer2",
    title: "Sənaye dizaynında kompüter layihələndirilməsi-2",
    icon: Cpu,
    data: komputerDizayn2Data,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "bedii",
    title: "Bədii layihələndirmədə texniki rəsm",
    icon: Brush,
    data: bediiResmData,
    color: "from-purple-500 to-violet-500"
  },
  {
    id: "istehsal",
    title: "İstehsal prosesinin texnoloji əsasları",
    icon: Database,
    data: istehsalProsesiData,
    color: "from-emerald-500 to-green-500"
  }
]

export default function GuidePage() {
  const router = useRouter()
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null)
  
  const selectedSubject = useMemo(() => 
    SUBJECTS.find(s => s.id === selectedSubjectId), 
  [selectedSubjectId])

  const questions = useMemo(() => {
    if (!selectedSubject) return []
    // Normalize data structure
    const rawQuestions = selectedSubject.data.questions || []
    return rawQuestions.sort((a: any, b: any) => {
        const idA = parseInt(String(a.id).replace(/\D/g, '')) || 0
        const idB = parseInt(String(b.id).replace(/\D/g, '')) || 0
        return idA - idB
    })
  }, [selectedSubject])

  const QUESTIONS_PER_TICKET = 5
  const totalTickets = Math.ceil(questions.length / QUESTIONS_PER_TICKET)

  const ticketQuestions = useMemo(() => {
    if (!selectedTicket || !selectedSubject) return []
    const startIndex = (selectedTicket - 1) * QUESTIONS_PER_TICKET
    const sliced = questions.slice(startIndex, startIndex + QUESTIONS_PER_TICKET)
    
    // Ensure we map to the expected type
    return sliced.map((q: any) => ({
      id: q.id,
      question: q.question,
      answer: q.answer,
      category: q.category || selectedSubject.title, // Fallback category
      keywords: q.keywords || []
    })) as GuideQuestion[]
  }, [selectedTicket, questions, selectedSubject])

  const ticketAdvice = useMemo(() => {
    if (!ticketQuestions.length) return null
    
    // 1. Extract Terms & Categories FIRST
    const categories = Array.from(new Set(ticketQuestions.map(q => q.category))).filter(Boolean)
    const STOP_WORDS = ["xülasə", "qısaca", "məqsəd", "il", "tarix", "sual", "cavab", "hissə", "bölmə", "nədir", "haqqında", "əsas", "vacib", "olan", "üçün", "kimi"]
    
    const allTerms = ticketQuestions.flatMap(q => {
        const explicit = q.keywords || []
        const extracted = (q.answer.match(/\*\*(.*?)\*\*/g) || [])
            .map(s => s.replace(/\*\*/g, '').replace(/:$/, '').trim())
            .filter(s => {
                const lower = s.toLowerCase()
                return (
                    s.length > 3 && 
                    s.length < 35 && 
                    !s.includes('?') && 
                    !/^\d/.test(s) && 
                    !STOP_WORDS.some(bad => lower.includes(bad))
                )
            })
        return [...explicit, ...extracted]
    })
    
    // Get unique terms
    const uniqueTerms = Array.from(new Set(allTerms)).slice(0, 10)
    
    // 2. Construct Narrative
    let narrative = ""
    const catText = categories.length > 3 
        ? `${categories.slice(0, 3).join(", ")} və digər` 
        : categories.join(", ")
        
    const termText = uniqueTerms.length >= 2 
        ? `**${uniqueTerms[0]}** və **${uniqueTerms[1]}**`
        : "**əsas anlayışlar**"

    narrative = `Bu bilet, ümumilikdə **${catText}** mövzularını əhatə edərək tələbənin geniş biliklərini yoxlayır. \n\nSizdən xüsusilə ${termText} kimi vacib məqamları dəqiq izah etmək, mövzunun mahiyyətini açmaq tələb olunur. \n\nCavablarınızı sadə cümlələr və real nümunələrlə zənginləşdirməyiniz tövsiyə olunur.`

    return {
        narrative,
        terms: uniqueTerms
    }
  }, [ticketQuestions])

  // Helper component for the advice content to avoid duplication
  const AdviceContent = () => {
    if (!ticketAdvice) return null
    return (
        <div className="space-y-3">
             <p className="text-xs text-slate-300 leading-relaxed">
                <Markdown components={{ strong: ({node, ...props}) => <span className="text-emerald-400 font-bold" {...props} /> }}>
                    {ticketAdvice.narrative}
                </Markdown>
             </p>
             {ticketAdvice.terms.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {ticketAdvice.terms.map((t, i) => (
                        <span key={i} className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/20 px-2 py-1 rounded-md">
                            {t}
                        </span>
                    ))}
                </div>
             )}
        </div>
    )
  }

  // Navigation handlers
  const handleBack = () => {
    if (selectedTicket) {
      setSelectedTicket(null)
    } else if (selectedSubjectId) {
      setSelectedSubjectId(null)
    } else {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
                variant="ghost" 
                onClick={handleBack}
                className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {selectedTicket ? "Biletlərə Qayıt" : selectedSubjectId ? "Fənlərə Qayıt" : "Ana Səhifə"}
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-teal-400" />
                İmtahan Bələdçisi
              </h1>
              <p className="text-sm text-slate-500">
                {selectedTicket 
                  ? `Bilet №${selectedTicket} üzrə ipucular və struktur`
                  : selectedSubjectId 
                  ? `${selectedSubject?.title} — Bilet Seçimi`
                  : "İmtahan mövzusunu seçin"}
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="grid gap-6 animate-in fade-in duration-500">
          {!selectedSubjectId ? (
             // Subject Selection
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {SUBJECTS.map((subject) => (
                  <motion.div
                    key={subject.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                        className="cursor-pointer bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all group h-full"
                        onClick={() => setSelectedSubjectId(subject.id)}
                    >
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${subject.color} flex items-center justify-center shrink-0 shadow-lg`}>
                                <subject.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-xl group-hover:text-emerald-400 transition-colors">
                                  {subject.title}
                                </CardTitle>
                                <CardDescription>
                                  {(subject.data.questions || []).length} sual • {Math.ceil((subject.data.questions || []).length / 5)} bilet
                                </CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                  </motion.div>
                ))}
            </div>
          ) : !selectedTicket ? (
            // Ticket List View
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: totalTickets }).map((_, idx) => {
                const ticketNum = idx + 1
                return (
                  <motion.div
                    key={ticketNum}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card 
                        className="cursor-pointer bg-slate-900/50 border-slate-800 hover:border-emerald-500/50 transition-all group"
                        onClick={() => setSelectedTicket(ticketNum)}
                    >
                        <CardContent className="p-6 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <FileText className="w-8 h-8 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Bilet</span>
                            <span className="text-3xl font-bold text-white group-hover:text-emerald-300 transition-colors">{ticketNum}</span>
                        </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            // Detail View (Guide)
            <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
              
              {/* Sidebar: Question Navigation - Hidden on mobile, sticky on desktop */}
              <div className="hidden lg:block space-y-4">
                 <Card className="bg-slate-900 border-slate-800 sticky top-4">
                    <CardContent className="p-4 space-y-2">
                         <div className="text-sm font-medium text-slate-400 uppercase mb-4 pl-2 border-l-2 border-emerald-500">
                            Bilet {selectedTicket} Sualları
                         </div>
                         {ticketQuestions.map((q, idx) => (
                             <a 
                                href={`#q-${q.id}`} 
                                key={q.id}
                                className="block p-2 rounded-lg hover:bg-white/5 text-xs font-medium text-slate-300 hover:text-white transition-colors truncate"
                             >
                                <span className="mr-2 text-emerald-500 font-bold">{idx + 1}.</span>
                                {q.question}
                             </a>
                         ))}
                    </CardContent>
                 </Card>

                 <Card className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/20">
                    <CardContent className="p-4">
                        <h3 className="font-bold text-emerald-400 mb-2 flex items-center gap-2 text-sm">
                            <Star className="w-4 h-4" /> Bilet Strategiyası
                        </h3>
                        <AdviceContent />
                    </CardContent>
                 </Card>
              </div>

              {/* Mobile Navigation Dropdown could go here, but for now simple scroll is fine */}

              {/* Main Content Area */}
              <div className="min-w-0 w-full space-y-6 lg:space-y-8">
                
                {/* Mobile Ticket Tip - Visible only on small screens */}
                <div className="block lg:hidden">
                    <Card className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/20">
                        <CardContent className="p-4">
                            <h3 className="font-bold text-emerald-400 mb-2 flex items-center gap-2 text-sm">
                                <Star className="w-4 h-4" /> Bilet Strategiyası
                            </h3>
                            <AdviceContent />
                        </CardContent>
                    </Card>
                </div>

                {ticketQuestions.map((q, idx) => (
                    <div 
                        key={q.id} 
                        id={`q-${q.id}`} 
                        className="scroll-mt-24"
                    >
                        <Card className="bg-slate-900/80 border-slate-800 overflow-hidden w-full">
                            <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                            <CardContent className="p-4 md:p-8 space-y-6">
                                {/* Question Header */}
                                <div>
                                    <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-widest mb-2">
                                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">Sual {idx + 1}</Badge>
                                        <span className="text-slate-500">•</span>
                                        <span className="text-slate-400 truncate max-w-[200px]">{q.category}</span>
                                    </div>
                                    <h2 className="text-lg md:text-2xl font-bold text-white leading-tight">
                                        {q.question}
                                    </h2>
                                </div>

                                {/* Dynamic Guide / Structure */}
                                    {/* Dynamic Guide / Structure */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        {/* Left: What to write (Structure) */}
                                        <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-white/5">
                                            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                                <Layout className="w-4 h-4 text-emerald-400" />
                                                Cavab Planı
                                            </h3>
                                            
                                            {/* Auto-generated structure from headings/bold parts */}
                                            <ul className="space-y-3">
                                                {(q.answer.match(/\*\*(.*?)\*\*/g) || [])
                                                    .map(s => s.replace(/\*\*/g, '').trim())
                                                    .filter(s => 
                                                        s.length > 3 && 
                                                        !s.includes('?') && // Exclude explicit questions headers
                                                        !s.toLowerCase().includes('nədir') // Exclude "What is X" headers
                                                    )
                                                    .map(s => s.replace(/:$/, '')) // Remove trailing colons
                                                    .slice(0, 5) // Take top 5 points
                                                    .map((header, i) => (
                                                    <li key={i} className="flex gap-3 text-sm text-slate-300">
                                                        <span className="flex-none w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                                                        <span className="font-medium text-white">{header}</span>
                                                    </li>
                                                ))}
                                                
                                                {/* Fallback if no specific points found */}
                                                {(!q.answer.match(/\*\*(.*?)\*\*/g) || 
                                                  (q.answer.match(/\*\*(.*?)\*\*/g) || [])
                                                    .map(s => s.replace(/\*\*/g, ''))
                                                    .filter(s => !s.includes('?') && !s.toLowerCase().includes('nədir')).length === 0
                                                ) && (
                                                    <>
                                                        <li className="flex gap-3 text-sm text-slate-300">
                                                            <span className="flex-none w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xs font-bold">1</span>
                                                            <span>Mövzunun əsas mahiyyəti</span>
                                                        </li>
                                                        <li className="flex gap-3 text-sm text-slate-300">
                                                            <span className="flex-none w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xs font-bold">2</span>
                                                            <span>Vurulğalanmalı açar məqamlar</span>
                                                        </li>
                                                        <li className="flex gap-3 text-sm text-slate-300">
                                                            <span className="flex-none w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xs font-bold">3</span>
                                                            <span>Nümunə və ya tətbiq sahəsi</span>
                                                        </li>
                                                    </>
                                                )}
                                            </ul>
                                        </div>

                                        {/* Right: Keywords & Tips */}
                                        <div className="space-y-4 bg-emerald-900/10 p-4 rounded-xl border border-emerald-500/10">
                                            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                                <Lightbulb className="w-4 h-4 text-yellow-400" />
                                                Açar Sözlər
                                            </h3>
                                            
                                            <div className="flex flex-wrap gap-2">
                                                {/* Combine explicit keywords + extracted bold terms */}
                                                {Array.from(new Set([
                                                    ...(q.keywords || []),
                                                    ...(q.answer.match(/\*\*(.*?)\*\*/g) || [])
                                                        .map(s => s.replace(/\*\*/g, '').replace(/:$/, ''))
                                                        .filter(s => s.length < 20) // Only keep short terms as keywords
                                                        .slice(0, 6)
                                                ])).map((kw, i) => (
                                                    <span key={i} className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded">
                                                        {kw}
                                                    </span>
                                                ))}
                                                
                                                {(!q.keywords?.length && !q.answer.match(/\*\*(.*?)\*\*/g)) && (
                                                    <span className="text-xs text-slate-500 italic">Mətndəki əsas terminlərə diqqət yetirin.</span>
                                                )}
                                            </div>
                                            
                                            <div className="pt-2 border-t border-white/5 mt-2">
                                                <p className="text-sm text-slate-300 italic">
                                                    "Cavabı bu açar sözlər ətrafında qurun."
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                
                                {/* Revealable Answer Content */}
                                <div className="pt-4">
                                     <details className="group">
                                        <summary className="flex items-center gap-2 text-sm font-medium text-slate-400 cursor-pointer hover:text-white transition-colors select-none">
                                            <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                                            Tam Cavaba Bax
                                        </summary>
                                        <div className="mt-4 pl-6 border-l-2 border-slate-800">
                                            <div className="text-slate-300 leading-relaxed text-sm">
                                                <Markdown
                                                    components={{
                                                        strong: ({node, ...props}) => <span className="font-bold text-emerald-400" {...props} />,
                                                        ul: ({node, ...props}) => <ul className="space-y-2 mt-2" {...props} />,
                                                        li: ({node, ...props}) => <li className="flex gap-2" {...props} />,
                                                        p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />
                                                    }}
                                                >
                                                    {q.answer}
                                                </Markdown>
                                            </div>
                                        </div>
                                     </details>
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
