
"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Check, X, RotateCcw, Brain, Timer, Trophy, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import confetti from "canvas-confetti"
import muhendisData from "@/data/muhendis-yaradiciliq-suallari.json"

// Type definition specifically for this data structure
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
  const [queue, setQueue] = useState<CramQuestion[]>([])
  const [completed, setCompleted] = useState<CramQuestion[]>([])
  const [isFlipped, setIsFlipped] = useState(false)
  const [startTime] = useState<number>(Date.now())
  const [elapsedTime, setElapsedTime] = useState("00:00")
  const [sessionGoal] = useState(muhendisData.questions.length)
  const [isFinished, setIsFinished] = useState(false)

  // Initialize data
  useEffect(() => {
    // Shuffle the questions initially for better randomness
    const shuffled = [...muhendisData.questions].sort(() => Math.random() - 0.5)
    setQueue(shuffled)
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
    setIsFinished(false)
    setCompleted([])
    const shuffled = [...muhendisData.questions].sort(() => Math.random() - 0.5)
    setQueue(shuffled)
  }

  if (queue.length === 0 && !isFinished) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Yüklənir...</div>

  return (
    <main className="min-h-screen bg-[#020817] text-white flex flex-col p-4 md:p-6 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 max-w-4xl mx-auto w-full z-10">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="text-slate-400 hover:text-white hover:bg-white/10">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex flex-col items-center">
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            Sürətli Hazırlıq
          </h1>
          <p className="text-xs text-slate-500 font-mono">Mühəndis yaradıcılıq prinsipləri</p>
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
                        <p className="text-lg md:text-xl leading-relaxed text-slate-100 mb-8 select-none">
                          {currentCard.answer}
                        </p>
                        
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

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[128px]" />
      </div>
    </main>
  )
}
