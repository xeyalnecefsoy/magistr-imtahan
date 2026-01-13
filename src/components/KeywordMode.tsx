"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, X, RotateCcw, Eye, ChevronRight } from "lucide-react"

interface Question {
  id: string
  type: string
  question: string
  answer: string
  category: string
  keywords?: string[]
}

interface KeywordModeProps {
  questions: Question[]
  selectedCategory: string | null
  shuffleMode?: boolean
  questionLimit?: number
  onExit: () => void
}

export function KeywordMode({ questions, selectedCategory, shuffleMode = true, questionLimit = 25, onExit }: KeywordModeProps) {
  const [index, setIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showFullAnswer, setShowFullAnswer] = useState(false)
  const [learnedCount, setLearnedCount] = useState(0)
  const [forgotCount, setForgotCount] = useState(0)

  // Filter by category and apply limit
  // CRITICAL: Only filter questions that HAVE keywords
  const filteredQuestions = useMemo(() => {
    let filtered = questions.filter(q => q.keywords && q.keywords.length > 0)
    
    if (selectedCategory) {
      filtered = filtered.filter(q => q.category === selectedCategory)
    }
    // Shuffle or keep sequential based on mode
    if (shuffleMode) {
      filtered = [...filtered].sort(() => Math.random() - 0.5)
    }
    // Apply question limit (0 means no limit)
    if (questionLimit > 0 && filtered.length > questionLimit) {
      filtered = filtered.slice(0, questionLimit)
    }
    return filtered
  }, [questions, selectedCategory, shuffleMode, questionLimit])

  const currentCard = filteredQuestions[index]

  const handleNext = (learned: boolean) => {
    if (learned) {
      setLearnedCount(c => c + 1)
    } else {
      setForgotCount(c => c + 1)
    }
    
    setIsFlipped(false)
    setShowFullAnswer(false)
    
    setTimeout(() => {
        if (index < filteredQuestions.length - 1) {
            setIndex(i => i + 1)
        } else {
            // End of deck - show summary or restart
            setIndex(0)
        }
    }, 200) 
  }

  const handleSkip = () => {
    setIsFlipped(false)
    setShowFullAnswer(false)
    
    setTimeout(() => {
        if (index < filteredQuestions.length - 1) {
            setIndex(i => i + 1)
        } else {
            // End of deck - show summary or restart
            setIndex(0)
        }
    }, 200) 
  }

  const handleReset = () => {
    setIndex(0)
    setLearnedCount(0)
    setForgotCount(0)
    setIsFlipped(false)
    setShowFullAnswer(false)
  }

  if (filteredQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-muted-foreground">Bu kateqoriyada açar sözlü sual yoxdur</p>
        <Button onClick={onExit}>Geri Qayıt</Button>
      </div>
    )
  }

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-muted-foreground">Sual tapılmadı</p>
        <Button onClick={onExit}>Geri Qayıt</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-xl mx-auto space-y-8">
      {/* Navigation Header */}
      <div className="w-full flex justify-between items-center text-muted-foreground">
        <Button variant="ghost" size="sm" onClick={onExit}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Geri
        </Button>
        <span className="font-mono text-sm">{index + 1} / {filteredQuestions.length}</span>
        <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Category Label */}
      {selectedCategory && (
        <div className="flex flex-col items-center gap-1 mb-2">
          <p className="text-primary font-semibold text-sm text-center">
            {selectedCategory}
          </p>
          <p className="text-xs text-muted-foreground">
            Açar sözləri xatırlamağa çalışın
          </p>
        </div>
      )}

      {/* Card Area */}
      <div className="relative w-full min-h-[400px]" style={{ perspective: "1000px" }}>
        <motion.div
            className="w-full h-full relative cursor-pointer"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ transformStyle: "preserve-3d" }}
        >
            {/* Front: Question */}
            <div 
              className="absolute inset-0" 
              style={{ backfaceVisibility: "hidden" }}
            >
                <Card className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-6 sm:p-8 text-center bg-card border-l-4 border-l-amber-500 shadow-xl">
                    <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Sual</span>
                    <h3 className="text-lg sm:text-xl font-bold leading-relaxed">{currentCard.question}</h3>
                    <p className="text-xs text-muted-foreground mt-8 animate-pulse">
                        (Açar sözləri görmək üçün klikləyin)
                    </p>
                </Card>
            </div>

            {/* Back: Keywords */}
            <div 
                className="absolute inset-0" 
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
                <Card className="w-full h-full min-h-[400px] max-h-[70vh] flex flex-col items-center bg-card border-l-4 border-l-amber-500 shadow-xl relative overflow-hidden">
                    <div className="p-4 border-b border-border shrink-0 w-full text-center">
                      <span className="text-sm uppercase tracking-widest text-amber-500 font-bold">Açar Sözlər</span>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3 w-full overflow-y-auto">
                        {currentCard.keywords?.map((keyword, idx) => (
                             <motion.div 
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-500 font-medium text-center w-full max-w-[80%]"
                             >
                                {keyword}
                             </motion.div>
                        ))}

                         <AnimatePresence>
                            {showFullAnswer && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4 p-4 bg-slate-900/50 rounded-lg text-sm text-slate-300 text-left w-full border border-slate-800"
                                >
                                    <p className="font-bold text-xs text-slate-500 mb-1">TAM CAVAB:</p>
                                    {currentCard.answer}
                                </motion.div>
                            )}
                         </AnimatePresence>
                    </div>

                    {!showFullAnswer && (
                         <div className="p-4 shrink-0 w-full flex justify-center bg-card/80 backdrop-blur-sm border-t border-border/50">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs text-muted-foreground hover:text-white"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowFullAnswer(true)
                                }}
                            >
                                <Eye className="w-3 h-3 mr-1" /> Tam cavabı göstər
                            </Button>
                         </div>
                    )}
                </Card>
            </div>
        </motion.div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-4 w-full justify-center">
        <Button 
            variant="outline" 
            size="lg" 
            className="w-32 sm:w-36 border-red-500/50 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500"
            onClick={(e) => {
                e.stopPropagation();
                handleNext(false); 
            }}
        >
            <X className="mr-2 h-5 w-5" /> Unutdum
        </Button>

        <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-12 h-12 border border-slate-700 hover:bg-slate-800"
            onClick={(e) => {
                e.stopPropagation();
                handleSkip();
            }}
            title="Keç"
        >
            <ChevronRight className="h-6 w-6" />
        </Button>

        <Button 
            variant="outline" 
            size="lg" 
            className="w-32 sm:w-36 border-green-500/50 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500"
            onClick={(e) => {
                e.stopPropagation();
                handleNext(true);
            }}
        >
            <Check className="mr-2 h-5 w-5" /> Bildim
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-6 text-sm text-muted-foreground">
        <span className="text-green-500">✓ Bildim: {learnedCount}</span>
        <span className="text-red-500">✗ Unutdum: {forgotCount}</span>
      </div>
    </div>
  )
}
