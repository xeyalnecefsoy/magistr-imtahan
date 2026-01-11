"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, X, RotateCcw } from "lucide-react"

interface Question {
  id: string
  type: string
  question: string
  answer: string
  category: string
}

interface FlashcardModeProps {
  questions: Question[]
  selectedCategory: string | null
  shuffleMode?: boolean
  questionLimit?: number
  onExit: () => void
}

export function FlashcardMode({ questions, selectedCategory, shuffleMode = true, questionLimit = 25, onExit }: FlashcardModeProps) {
  const [index, setIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [learnedCount, setLearnedCount] = useState(0)
  const [forgotCount, setForgotCount] = useState(0)

  // Filter by category and apply limit
  const filteredQuestions = useMemo(() => {
    let filtered = questions
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
  }

  if (filteredQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-muted-foreground">Bu kateqoriyada sual yoxdur</p>
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
      <div className="w-full flex justify-between items-center text-muted-foreground">
        <Button variant="ghost" size="sm" onClick={onExit}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Geri
        </Button>
        <span className="font-mono text-sm">{index + 1} / {filteredQuestions.length}</span>
        <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {selectedCategory && (
        <div className="flex flex-col items-center gap-1 mb-2">
          <p className="text-primary font-semibold text-sm text-center">
            {selectedCategory}
          </p>
          <p className="text-xs text-muted-foreground animate-pulse">
            (Çevirmək üçün klikləyin)
          </p>
        </div>
      )}

      <div className="relative w-full min-h-[400px]" style={{ perspective: "1000px" }}>
        <motion.div
            className="w-full h-full relative cursor-pointer"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ transformStyle: "preserve-3d" }}
        >
            {/* Front */}
            <div 
              className="absolute inset-0" 
              style={{ backfaceVisibility: "hidden" }}
            >
                <Card className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-6 sm:p-8 text-center bg-card border-l-4 border-l-primary shadow-xl">
                    <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Sual</span>
                    <h3 className="text-lg sm:text-xl font-bold leading-relaxed">{currentCard.question}</h3>
                </Card>
            </div>

            {/* Back */}
            <div 
                className="absolute inset-0" 
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
                <Card className="w-full h-full min-h-[400px] max-h-[70vh] flex flex-col bg-card border-l-4 border-l-secondary shadow-xl">
                    <div className="p-4 border-b border-border shrink-0">
                      <span className="text-sm uppercase tracking-widest text-muted-foreground">Cavab</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                      <div className="text-sm sm:text-base leading-relaxed text-left whitespace-pre-line">
                        {currentCard.answer}
                      </div>
                    </div>
                </Card>
            </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-4 w-full justify-center">
        <Button 
            variant="outline" 
            size="lg" 
            className="w-36 border-red-500/50 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500"
            onClick={(e) => {
                e.stopPropagation();
                handleNext(false); 
            }}
        >
            <X className="mr-2 h-5 w-5" /> Unutdum
        </Button>
        <Button 
            variant="outline" 
            size="lg" 
            className="w-36 border-green-500/50 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500"
            onClick={(e) => {
                e.stopPropagation();
                handleNext(true);
            }}
        >
            <Check className="mr-2 h-5 w-5" /> Bildim
        </Button>
      </div>

      <div className="flex gap-6 text-sm text-muted-foreground">
        <span className="text-green-500">✓ Bildim: {learnedCount}</span>
        <span className="text-red-500">✗ Unutdum: {forgotCount}</span>
      </div>
    </div>
  )
}
