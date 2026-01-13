"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Check, FileText, Shuffle, RefreshCcw, Eye, BookOpen } from "lucide-react"

interface Question {
  id: string | number
  question: string
  answer: string
  category: string
}

interface TicketModeProps {
  questions: Question[]
  selectedCategory: string | null
  onExit: () => void
}

export function TicketMode({ questions, selectedCategory, onExit }: TicketModeProps) {
  // State
  const [mode, setMode] = useState<"selection" | "view_ticket">("selection")
  const [viewMode, setViewMode] = useState<"study" | "exam">("exam")
  const [ticketState, setTicketState] = useState<"active" | "submitted">("active")
  
  const [selectedTicket, setSelectedTicket] = useState<number | null>(1)
  const [isMixedMode, setIsMixedMode] = useState(false)
  const [ticketQuestions, setTicketQuestions] = useState<Question[]>([])
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})

  // Constants
  const QUESTIONS_PER_TICKET = 5

  // Filter questions for the selected category
  const sortedQuestions = useMemo(() => {
    let filtered = questions
    if (selectedCategory) {
      filtered = filtered.filter(q => q.category === selectedCategory || (selectedCategory === "Mühəndis yaradıcılıq prinsipləri" && q.category.includes("Yaradıcılıq")))
    }
    // Sort by ID is CRITICAL here to match the real physical tickets (1-5, 6-10, etc.)
    return filtered.sort((a, b) => {
        const idA = parseInt(String(a.id).replace(/\D/g, '')) || 0
        const idB = parseInt(String(b.id).replace(/\D/g, '')) || 0
        return idA - idB
    })
  }, [questions, selectedCategory])

  const totalTickets = Math.max(1, Math.ceil(sortedQuestions.length / QUESTIONS_PER_TICKET))

  const openTicket = (ticketNumber: number) => {
    const startIndex = (ticketNumber - 1) * QUESTIONS_PER_TICKET
    const selected = sortedQuestions.slice(startIndex, startIndex + QUESTIONS_PER_TICKET)
    setTicketQuestions(selected)
    setSelectedTicket(ticketNumber)
    setIsMixedMode(false)
    setUserAnswers({})
    setTicketState("active")
    setViewMode("exam") 
    setMode("view_ticket")
  }

  const handleRandomOfficialTicket = () => {
    const randomTicket = Math.floor(Math.random() * totalTickets) + 1
    openTicket(randomTicket)
  }

  const handleMixedTicket = () => {
    // Shuffle all available questions and pick 5
    const shuffled = [...sortedQuestions].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, QUESTIONS_PER_TICKET)
    
    setTicketQuestions(selected)
    setSelectedTicket(null) // Null implies mixed/custom ticket
    setIsMixedMode(true)
    setUserAnswers({})
    setTicketState("active")
    setViewMode("exam")
    setMode("view_ticket")
  }

  const handleSubmit = () => {
    setTicketState("submitted")
  }

  const calculateSimilarity = (answer1: string, answer2: string) => {
    const s1 = answer1.toLowerCase().replace(/[^\w\səöğüşıç]/g, '').split(/\s+/)
    const s2 = answer2.toLowerCase().replace(/[^\w\səöğüşıç]/g, '').split(/\s+/)
    const intersection = s1.filter(w => s2.includes(w))
    if (s1.length + s2.length === 0) return 0
    return Math.round((intersection.length * 2 / (s1.length + s2.length)) * 100)
  }

  // Selection Screen
  if (mode === "selection") {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onExit}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Geri
          </Button>
          <div>
            <h2 className="text-3xl font-bold">Bilet İmtahanı</h2>
            <p className="text-muted-foreground">
               {selectedCategory || "Ümumi"} — {totalTickets} Rəsmi Bilet
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Random Official Ticket */}
            <Card 
                className="cursor-pointer border-l-4 border-l-blue-500 hover:bg-blue-500/5 transition-all flex flex-col items-center justify-center p-8 min-h-[200px]"
                onClick={handleRandomOfficialTicket}
            >
                <div className="p-4 bg-blue-100 rounded-full mb-4 dark:bg-blue-900/30">
                    <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Təsadüfi Rəsmi Bilet</h3>
                <p className="text-muted-foreground text-center text-sm">
                   Mövcud {totalTickets} biletdən biri təsadüfi seçiləcək. (Suallar ardıcıl)
                </p>
            </Card>

             {/* Mixed Exam */}
             <Card 
                className="cursor-pointer border-l-4 border-l-purple-500 hover:bg-purple-500/5 transition-all flex flex-col items-center justify-center p-8 min-h-[200px]"
                onClick={handleMixedTicket}
            >
                <div className="p-4 bg-purple-100 rounded-full mb-4 dark:bg-purple-900/30">
                    <Shuffle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Qarışıq Sınaq</h3>
                <p className="text-muted-foreground text-center text-sm">
                   Bütün suallardan təsadüfi 5 dənəsi seçiləcək. (Tam qarışıq)
                </p>
            </Card>

            {/* List of Tickets */}
            <Card className="p-6 md:col-span-2 bg-slate-900/50">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" /> Bütün Rəsmi Biletlər
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {Array.from({ length: totalTickets }).map((_, idx) => {
                        const ticketNum = idx + 1
                        return (
                            <Button
                                key={ticketNum}
                                variant="outline"
                                className="h-16 flex flex-col items-center justify-center gap-1 hover:border-blue-500 hover:text-blue-500"
                                onClick={() => openTicket(ticketNum)}
                            >
                                <span className="text-xs text-muted-foreground">BİLET</span>
                                <span className="text-xl font-bold">{ticketNum}</span>
                            </Button>
                        )
                    })}
                </div>
            </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
        {/* Navigation & Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
             <Button variant="ghost" onClick={() => setMode("selection")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Biletlərə Qayıt
             </Button>

             <div className="flex bg-slate-100 p-1 rounded-lg dark:bg-slate-800">
                <Button 
                    variant={viewMode === "study" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("study")}
                    className="gap-2"
                >
                    <BookOpen className="w-4 h-4" /> Öyrənmə
                </Button>
                <Button 
                    variant={viewMode === "exam" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("exam")}
                    className="gap-2"
                >
                    <FileText className="w-4 h-4" /> İmtahan
                </Button>
             </div>
        </div>

        <div className="bg-white text-slate-900 p-6 sm:p-10 shadow-xl rounded-sm min-h-[600px] relative transition-all">
            {/* Header */}
            <div className="text-center border-b-2 border-slate-900 pb-6 mb-8">
                <h3 className="text-sm sm:text-lg font-bold uppercase tracking-wide opacity-80 mb-2">Azərbaycan Respublikası Elm və Təhsil Nazirliyi</h3>
                <h1 className="text-2xl sm:text-4xl font-black mb-4">
                    {isMixedMode ? "SINAQ İMTAHANI (QARIŞIQ)" : `İMTAHAN BİLETİ № ${selectedTicket}`}
                </h1>
                <div className="flex justify-between text-xs sm:text-sm font-serif italic text-slate-600 px-2 sm:px-8">
                    <span>Fənn: {selectedCategory || "Ümumi"}</span>
                    <span>Tarix: {new Date().toLocaleDateString('az-AZ')}</span>
                </div>
            </div>

            {/* Questions List */}
            <div className="space-y-10">
                {ticketQuestions.map((q, idx) => (
                    <div key={q.id} className="space-y-4">
                        <div className="flex gap-4">
                            <span className="font-bold text-xl font-serif text-slate-400 select-none">{idx + 1}.</span>
                            <div className="flex-1 space-y-4">
                                <p className="text-lg font-serif font-medium leading-relaxed">
                                    {q.question}
                                </p>
                                
                                {viewMode === "study" ? (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="bg-amber-50 p-6 rounded-lg border border-amber-200 shadow-sm space-y-4 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-1 px-3 bg-amber-200/50 text-amber-800 text-[10px] font-bold uppercase rounded-bl-lg">
                                            Cavab
                                        </div>
                                        <p className="font-serif text-slate-800 leading-relaxed whitespace-pre-line text-justify">
                                            {q.answer}
                                        </p>
                                        {(q as any).keywords && (q as any).keywords.length > 0 && (
                                            <div className="pt-4 border-t border-amber-200/50">
                                                <span className="text-xs font-bold text-amber-600 uppercase mb-2 block flex items-center gap-1">
                                                    <Eye className="w-3 h-3" /> Açar Sözlər
                                                </span>
                                                <div className="flex flex-wrap gap-2">
                                                    {(q as any).keywords.map((kw: string, kIdx: number) => (
                                                        <span key={kIdx} className="px-2 py-1 bg-white/60 border border-amber-300/30 rounded text-sm text-amber-900 font-medium">
                                                            {kw}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    // EXAM MODE
                                    ticketState === "active" ? (
                                        <Textarea 
                                            placeholder="Bu sualın cavabını bura yazın..."
                                            className="min-h-[120px] bg-slate-50 border-slate-300 focus:border-slate-900 text-slate-900 placeholder:text-slate-400 font-serif resize-none text-base p-4"
                                            value={userAnswers[q.id] || ""}
                                            onChange={(e) => setUserAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                        />
                                    ) : (
                                        // RESULT / FEEDBACK
                                        <div className="space-y-4">
                                            <div className="bg-slate-50 p-4 rounded border border-slate-200">
                                                <span className="text-xs font-bold uppercase text-slate-500 mb-1 block">Sizin Cavab:</span>
                                                <p className="font-serif text-slate-800 whitespace-pre-wrap">
                                                    {userAnswers[q.id] || <span className="text-slate-400 italic">(Cavab yazılmayıb)</span>}
                                                </p>
                                            </div>
                                            
                                            <div className="bg-green-50 p-4 rounded border border-green-200">
                                                <span className="text-xs font-bold uppercase text-green-700 mb-1 block">Doğru Cavab:</span>
                                                <p className="font-serif text-slate-800">
                                                    {q.answer}
                                                </p>
                                            </div>

                                            <div className="flex justify-end items-center gap-2">
                                                <div className="h-2 w-24 bg-slate-200 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${calculateSimilarity(userAnswers[q.id] || "", q.answer) > 60 ? "bg-green-500" : "bg-amber-500"}`}
                                                        style={{ width: `${calculateSimilarity(userAnswers[q.id] || "", q.answer)}%` }}
                                                    />
                                                </div>
                                                <span className={`text-sm font-bold ${
                                                    calculateSimilarity(userAnswers[q.id] || "", q.answer) > 60 ? "text-green-600" : "text-amber-600"
                                                }`}>
                                                    {calculateSimilarity(userAnswers[q.id] || "", q.answer)}%
                                                </span>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Seal/Signature area (Visual only) */}
            <div className="mt-16 pt-8 border-t border-slate-300 flex justify-between items-end text-sm font-serif text-slate-500">
                <div>
                    <p>İmza: _________________</p>
                </div>
                <div className="text-right">
                    <p>Tarix: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>

        {/* Action Bar */}
        <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur border-t border-slate-800 p-4 flex justify-center gap-4 z-50 shadow-2xl"
        >
             <Button variant="outline" size="lg" onClick={() => setMode("selection")}>
                  <RefreshCcw className="mr-2 h-4 w-4" /> Yeni İmtahan
             </Button>

            {viewMode === "exam" && ticketState === "active" && (
                <Button size="lg" className="bg-green-600 hover:bg-green-700 min-w-[200px]" onClick={handleSubmit}>
                    <Check className="mr-2 h-5 w-5" /> İmtahanı Təhvil Ver
                </Button>
            )}
        </motion.div>
    </div>
  )
}
