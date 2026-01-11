"use client"

import React, { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Check, X, RotateCcw, HelpCircle, Eye, Send } from "lucide-react"

interface Question {
  id: string
  type: string
  question: string
  answer: string
  category: string
}

interface WriteModeProps {
  questions: Question[]
  selectedCategory: string | null
  shuffleMode?: boolean
  questionLimit?: number
  onExit: () => void
}

export function WriteMode({ questions, selectedCategory, shuffleMode = true, questionLimit = 25, onExit }: WriteModeProps) {
  const [index, setIndex] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [feedback, setFeedback] = useState<"idle" | "correct" | "close" | "wrong">("idle")
  const [showAnswer, setShowAnswer] = useState(false)
  const [hintLevel, setHintLevel] = useState(0) // 0: no hint, 1: keywords, 2: partial text
  const [stats, setStats] = useState({ correct: 0, wrong: 0, close: 0 })

  // Filter by category and apply limit
  const filteredQuestions = useMemo(() => {
    let filtered = questions
    if (selectedCategory) {
      filtered = filtered.filter(q => q.category === selectedCategory)
    }
    // Filter only flashcard/written compatible questions (those with text answers)
    filtered = filtered.filter(q => q.answer && typeof q.answer === 'string')
    
    if (shuffleMode) {
      filtered = [...filtered].sort(() => Math.random() - 0.5)
    }
    if (questionLimit > 0 && filtered.length > questionLimit) {
      filtered = filtered.slice(0, questionLimit)
    }
    return filtered
  }, [questions, selectedCategory, shuffleMode, questionLimit])

  const currentQuestion = filteredQuestions[index]

  // Reset state on question change
  useEffect(() => {
    setUserInput("")
    setFeedback("idle")
    setShowAnswer(false)
    setHintLevel(0)
  }, [index])

  const checkSimilarity = (str1: string, str2: string) => {
    const s1 = str1.toLowerCase().replace(/[^\w\səöğüşıç]/g, '').trim().split(/\s+/)
    const s2 = str2.toLowerCase().replace(/[^\w\səöğüşıç]/g, '').trim().split(/\s+/)
    
    const intersection = s1.filter(word => s2.includes(word))
    const similarity = (intersection.length * 2) / (s1.length + s2.length)
    return similarity
  }

  const handleCheck = () => {
    if (!userInput.trim()) return

    const similarity = checkSimilarity(userInput, currentQuestion.answer)
    
    if (similarity > 0.7) {
      setFeedback("correct")
      if (feedback !== "correct") setStats(s => ({ ...s, correct: s.correct + 1 }))
    } else if (similarity > 0.4) {
      setFeedback("close")
      if (feedback !== "close") setStats(s => ({ ...s, close: s.close + 1 }))
    } else {
      setFeedback("wrong")
      if (feedback !== "wrong") setStats(s => ({ ...s, wrong: s.wrong + 1 }))
    }
  }

  const handleNext = () => {
    if (index < filteredQuestions.length - 1) {
      setIndex(i => i + 1)
    } else {
      // End of session, maybe loop or show summary
      setIndex(0) // restart for now
    }
  }

  const handleHint = () => {
    setHintLevel(prev => Math.min(prev + 1, 3))
  }

  const getHintText = () => {
    const words = currentQuestion.answer.split(" ")
    if (hintLevel === 1) {
      // Show first letter of each word
      return words.map(w => w[0] + (w.length > 1 ? "_".repeat(w.length - 1) : "")).join(" ")
    }
    if (hintLevel === 2) {
      // Show 50% of words
      return words.map((w, i) => i % 2 === 0 ? w : "_".repeat(w.length)).join(" ")
    }
    if (hintLevel >= 3) {
      return currentQuestion.answer
    }
    return ""
  }

  if (filteredQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-muted-foreground">Bu kateqoriyada sual yoxdur</p>
        <Button onClick={onExit}>Geri Qayıt</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto space-y-6 w-full">
      {/* Header */}
      <div className="w-full flex justify-between items-center text-muted-foreground">
        <Button variant="ghost" size="sm" onClick={onExit}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Geri
        </Button>
        <span className="font-mono text-sm">{index + 1} / {filteredQuestions.length}</span>
        <div className="flex gap-3 text-xs">
            <span className="text-green-500 flex items-center"><Check className="w-3 h-3 mr-1"/> {stats.correct}</span>
            <span className="text-yellow-500 flex items-center"><HelpCircle className="w-3 h-3 mr-1"/> {stats.close}</span>
            <span className="text-red-500 flex items-center"><X className="w-3 h-3 mr-1"/> {stats.wrong}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
          <p className="text-primary font-semibold text-sm text-center">
            {selectedCategory || currentQuestion.category}
          </p>
          <p className="text-xs text-muted-foreground">
            Sualı oxuyun və cavabı yazın
          </p>
      </div>

      {/* Main Card */}
      <Card className="w-full p-6 sm:p-8 space-y-6 bg-slate-900/50 border-slate-800">
        <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Sual</span>
            <h3 className="text-lg sm:text-xl font-bold leading-relaxed">{currentQuestion.question}</h3>
        </div>

        {/* Input Area */}
        <div className="space-y-4">
            <Textarea 
                placeholder="Cavabınızı bura yazın..." 
                className={`min-h-[120px] bg-slate-950/50 border-slate-800 resize-none text-base p-4 transition-colors ${
                    feedback === "correct" ? "border-green-500/50 focus:border-green-500" :
                    feedback === "close" ? "border-yellow-500/50 focus:border-yellow-500" :
                    feedback === "wrong" ? "border-red-500/50 focus:border-red-500" : ""
                }`}
                value={userInput}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUserInput(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleCheck()
                    }
                }}
            />

            {/* Hint Area */}
            <AnimatePresence>
                {(hintLevel > 0 || feedback !== "idle") && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-slate-800/50 rounded-lg p-4 text-sm"
                    >
                        {hintLevel > 0 && !showAnswer && (
                            <div className="mb-2">
                                <span className="text-yellow-500 font-bold text-xs uppercase mb-1 block">İpucu {hintLevel}/3</span>
                                <p className="font-mono text-slate-300 leading-relaxed tracking-wide">
                                    {getHintText()}
                                </p>
                            </div>
                        )}
                        
                        {feedback !== "idle" && (
                            <div className="flex items-start gap-3">
                                {feedback === "correct" && <div className="bg-green-500/20 p-2 rounded-full"><Check className="w-4 h-4 text-green-500" /></div>}
                                {feedback === "close" && <div className="bg-yellow-500/20 p-2 rounded-full"><HelpCircle className="w-4 h-4 text-yellow-500" /></div>}
                                {feedback === "wrong" && <div className="bg-red-500/20 p-2 rounded-full"><X className="w-4 h-4 text-red-500" /></div>}
                                
                                <div>
                                    <p className={`font-bold ${
                                        feedback === "correct" ? "text-green-500" :
                                        feedback === "close" ? "text-yellow-500" : "text-red-500"
                                    }`}>
                                        {feedback === "correct" ? "Tamamilə Doğrudur!" :
                                         feedback === "close" ? "Çox Yaxındır!" : "Səhvdir"}
                                    </p>
                                    <p className="text-slate-400 mt-1">
                                        {feedback === "correct" ? "Əla nəticə! Cavabı tam mənimsədiniz." :
                                         feedback === "close" ? "Bəzi açar sözlər düzgündür, amma tam deyil." :
                                         "Təəssüf ki, cavab uyğun gəlmir, yenidən cəhd edin və ya cavaba baxın."}
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Answer Reveal */}
            <AnimatePresence>
                {showAnswer && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4"
                    >
                        <span className="text-blue-400 font-bold text-xs uppercase mb-2 block">Düzgün Cavab</span>
                        <p className="text-blue-50 leading-relaxed">
                            {currentQuestion.answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </Card>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 w-full justify-center">
        {feedback === "correct" ? (
             <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700" onClick={() => {
                 setIndex(i => i + 1)
             }}>
                Növbəti Sual <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
             </Button>
        ) : (
            <>
                <Button variant="outline" onClick={handleHint} disabled={hintLevel >= 3}>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    İpucu ({3 - hintLevel})
                </Button>
                
                <Button variant="outline" onClick={() => setShowAnswer(!showAnswer)}>
                    <Eye className="w-4 h-4 mr-2" />
                    {showAnswer ? "Gizlət" : "Cavabı Göstər"}
                </Button>

                <Button className="w-full sm:w-auto min-w-[120px]" onClick={handleCheck}>
                    <Send className="w-4 h-4 mr-2" />
                    Yoxla
                </Button>
                
                <Button variant="ghost" className="text-muted-foreground hover:text-white" onClick={handleNext}>
                    Keç <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
            </>
        )}
      </div>
    </div>
  )
}
