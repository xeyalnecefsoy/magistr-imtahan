
"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Check, X, RotateCcw, Brain, Timer, Trophy, Sparkles, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { MarkdownText } from "@/components/MarkdownText"
import confetti from "canvas-confetti"
import layiheIdareData from "@/data/layihe-idare-suallari.json"
import teskilatiDizaynData from "@/data/teskilati-dizayn-suallari.json"
import komputerDizayn2Data from "@/data/komputer-dizayn-2-suallari.json"
import bediiResmData from "@/data/bedii-resm-suallari.json"
import istehsalProsesiData from "@/data/istehsal-prosesi-suallari.json"

type RawQuestion = {
  id: number
  question: string
  answer?: string
  category?: string
  keywords?: string[]
}

type SubjectFile = {
  subject: string
  questions: RawQuestion[]
}

const SUBJECTS = [
  { id: "layihe", name: "Layihələrin idarə olunması", data: layiheIdareData as unknown as SubjectFile },
  { id: "teskilati", name: "Təşkilati dizayn", data: teskilatiDizaynData as unknown as SubjectFile },
  { id: "komputer2", name: "Sənaye dizaynında kompüter layihələndirilməsi-2", data: komputerDizayn2Data as unknown as SubjectFile },
  { id: "bedii", name: "Bədii layihələndirmədə texniki rəsm", data: bediiResmData as unknown as SubjectFile },
  { id: "istehsal", name: "İstehsal prosesinin texnoloji əsasları", data: istehsalProsesiData as unknown as SubjectFile },
] as const

type CramQuestion = {
  id: number
  question: string
  answer: string
  category: string
  keywords?: string[]
}

export default function CramPage() {
  const router = useRouter()
  
  // State
  const [selectedSubject, setSelectedSubject] = useState<string>("layihe")
  const [queue, setQueue] = useState<CramQuestion[]>([])
  const [completed, setCompleted] = useState<CramQuestion[]>([])
  const [isFlipped, setIsFlipped] = useState(false)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [elapsedTime, setElapsedTime] = useState("00:00")
  const [sessionGoal, setSessionGoal] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [showSubjectPicker, setShowSubjectPicker] = useState(true)

  const currentSubject = SUBJECTS.find(s => s.id === selectedSubject)!
  const questions = currentSubject.data.questions

  // Initialize data when subject changes
  const initSession = (subjectId: string) => {
    const subject = SUBJECTS.find(s => s.id === subjectId)!
    const shuffled = [...subject.data.questions]
      .map(q => ({...q, category: subject.name, answer: q.answer || ""}))
      .sort(() => Math.random() - 0.5)
    setQueue(shuffled)
    setCompleted([])
    setIsFinished(false)
    setStartTime(Date.now())
    setElapsedTime("00:00")
    setSessionGoal(shuffled.length)
    setIsFlipped(false)
    setShowSubjectPicker(false)
  }

  useEffect(() => {
    initSession(selectedSubject)
  }, [])

  // Timer logic
  useEffect(() => {
    if (isFinished) return
    
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime) / 1000)
      const m = Math.floor(seconds / 60).toString().padStart(2, '0')
      const s = (seconds % 60).toString().padStart(2, '0')
      setElapsedTime(`${m}:${s}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime, isFinished])

  // Current card
  const currentCard = queue[0]
  const progress = Math.round((completed.length / sessionGoal) * 100)

  // Handlers
  const handleFlip = () => setIsFlipped(!isFlipped)

  const handleKnow = () => {
    setIsFlipped(false)
    // Add to completed
    setCompleted([...completed, currentCard])
    // Remove from queue
    const newQueue = queue.slice(1)
    setQueue(newQueue)
    
    if (newQueue.length === 0) {
      finishSession()
    }
  }

  const handleDontKnow = () => {
    setIsFlipped(false)
    // Move current card to back of queue (or stick it in the middle for SR-lite)
    // Let's put it 5 cards back or at the end if length < 5
    const newQueue = [...queue.slice(1)]
    const insertIndex = Math.min(newQueue.length, 5)
    newQueue.splice(insertIndex, 0, currentCard)
    setQueue(newQueue)
  }

  const finishSession = () => {
    setIsFinished(true)
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  const handleRestart = () => {
    initSession(selectedSubject)
  }

  const handleChangeSubject = (subjectId: string) => {
    setSelectedSubject(subjectId)
    initSession(subjectId)
  }

  if (queue.length === 0 && !isFinished && !showSubjectPicker) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Yüklənir...</div>

  return (
    <main className="min-h-screen bg-[#020817] text-white flex flex-col p-4 md:p-6 overflow-hidden">
      {/* Subject Picker */}
      {showSubjectPicker ? (
        <div className="flex-1 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 max-w-lg w-full px-4"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Fənni seçin</h2>
            <p className="text-slate-400 text-sm">Sürətli hazırlıq üçün fənn seçin</p>
            <div className="space-y-3">
              {SUBJECTS.map(subject => (
                <button
                  key={subject.id}
                  onClick={() => handleChangeSubject(subject.id)}
                  className="w-full p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 transition-all text-left flex items-center justify-between group"
                >
                  <span className="font-medium text-white group-hover:text-purple-400 transition-colors">{subject.name}</span>
                  <ChevronDown className="w-5 h-5 text-slate-500 -rotate-90 group-hover:text-purple-400 transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <>
      {/* Header */}
      <header className="flex items-center justify-between mb-6 max-w-4xl mx-auto w-full z-10">
        <Button variant="ghost" size="icon" onClick={() => setShowSubjectPicker(true)} className="text-slate-400 hover:text-white hover:bg-white/10">
          <ChevronDown className="w-6 h-6 rotate-90" />
        </Button>
        <div className="flex flex-col items-center">
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            Sürətli Hazırlıq
          </h1>
          <p className="text-xs text-slate-500 font-mono">{currentSubject.name}</p>
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-mono text-sm bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
          <Timer className="w-4 h-4" />
          {elapsedTime}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-xl mx-auto w-full mb-8 z-10">
        <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
          <span>Öyrənildi: {completed.length}</span>
          <span>Qalıb: {queue.length}</span>
        </div>
        <Progress value={progress} className="h-2 bg-slate-800" indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full relative z-0">
        
        {/* Finished State */}
        {isFinished ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 bg-slate-900/50 p-12 rounded-3xl border border-slate-800 backdrop-blur-sm"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Trophy className="w-12 h-12 text-black" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Təbriklər!</h2>
              <p className="text-slate-400">Bütün sualları nəzərdən keçirdiniz.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-left bg-black/20 p-4 rounded-xl">
              <div>
                <p className="text-xs text-slate-500">Ümumi vaxt</p>
                <p className="text-xl font-mono">{elapsedTime}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Öyrənilən sual</p>
                <p className="text-xl font-mono">{sessionGoal}</p>
              </div>
            </div>
            <Button onClick={handleRestart} className="w-full bg-white text-black hover:bg-slate-200" size="lg">
              <RotateCcw className="w-4 h-4 mr-2" /> Yenidən Başla
            </Button>
          </motion.div>
        ) : (
          /* Card Interaction */
          <div className="w-full h-[500px] perspective-1000 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard.id}
                initial={{ opacity: 0, y: 50, rotateX: -10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, x: -50, rotateZ: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full cursor-pointer preserve-3d group"
                onClick={handleFlip}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div 
                  className="w-full h-full relative"
                  initial={false}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* FRONT */}
                  <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 shadow-2xl text-center">
                     <div className="absolute top-4 right-4 text-xs font-bold text-slate-600 uppercase tracking-widest border border-slate-800 px-2 py-1 rounded">
                        Sual
                     </div>
                     <span className="text-sm font-mono text-purple-400 mb-6 bg-purple-500/10 px-3 py-1 rounded-full">
                        {currentCard.category}
                     </span>
                     <h3 className="text-2xl md:text-3xl font-bold leading-tight select-none">
                        {currentCard.question}
                     </h3>
                     <p className="absolute bottom-8 text-slate-500 text-sm animate-pulse">
                        Cavabı görmək üçün toxun
                     </p>
                  </Card>

                  {/* BACK */}
                  <Card className="absolute inset-0 backface-hidden flex flex-col p-8 bg-slate-900 border-slate-800 shadow-2xl overflow-y-auto no-scrollbar" style={{ transform: "rotateY(180deg)" }}>
                    <div className="absolute top-4 right-4 text-xs font-bold text-slate-600 uppercase tracking-widest border border-slate-800 px-2 py-1 rounded">
                        Cavab
                     </div>
                     <div className="flex-1 flex flex-col justify-center items-center text-center">
                         <div className="text-slate-100 mb-8 select-none w-full text-left">
                           <MarkdownText size="base">
                             {currentCard.answer}
                           </MarkdownText>
                         </div>
                         
                         {currentCard.keywords && (
                           <div className="flex flex-wrap gap-2 justify-center">
                             {currentCard.keywords.map((kw, i) => (
                               <span key={i} className="text-xs bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-1 rounded-md">
                                 #{kw}
                               </span>
                             ))}
                           </div>
                         )}
                      </div>
                  </Card>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Controls */}
      {!isFinished && (
        <div className="max-w-xl mx-auto w-full grid grid-cols-2 gap-4 mt-8 z-10">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleDontKnow}
            className="h-14 border-red-500/20 hover:bg-red-500/10 hover:text-red-400 text-red-500/50 transition-all text-lg font-medium"
          >
            <X className="w-6 h-6 mr-2" />
            Təkrarla
          </Button>
          <Button 
            size="lg" 
            onClick={handleKnow}
            className="h-14 bg-green-500 hover:bg-green-600 text-black font-bold text-lg shadow-lg shadow-green-500/20 transition-all"
          >
            <Check className="w-6 h-6 mr-2" />
            Bilirəm
          </Button>
        </div>
      )}

        </>
      )}

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[128px]" />
      </div>
    </main>
  )
}
