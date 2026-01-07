"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Timer, Zap, ChevronLeft, ChevronRight, Flag, Check } from "lucide-react"

interface Question {
  id: string
  type: string
  question: string
  options?: string[]
  answer: string
  category: string
}

interface BlitzModeProps {
  questions: Question[]
  selectedCategory: string | null
  shuffleMode?: boolean
  questionLimit?: number
  examDuration?: number
  onComplete: (score: number, total: number) => void
  onExit: () => void
}

// Track answer state for each question
interface AnswerState {
  selectedAnswer: string | null
  isCorrect: boolean | null
  isSkipped: boolean
}

export function BlitzMode({ questions, selectedCategory, shuffleMode = true, questionLimit = 25, examDuration = 300, onComplete, onExit }: BlitzModeProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300)
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({})
  const [showReview, setShowReview] = useState(false)
  
  const [internalDuration, setInternalDuration] = useState(examDuration)
  const [internalLimit, setInternalLimit] = useState(questionLimit)

  useEffect(() => {
    setInternalDuration(examDuration)
  }, [examDuration])

  useEffect(() => {
    setInternalLimit(questionLimit)
  }, [questionLimit])

  // Filter MCQs by category (without limit)
  const availableQuestions = useMemo(() => {
    let filtered = questions.filter(q => q.type === 'mcq' && q.options && q.options.length >= 2)
    if (selectedCategory) {
      filtered = filtered.filter(q => q.category === selectedCategory)
    }
    return filtered
  }, [questions, selectedCategory])

  // Apply shuffle and limit
  const mcqQuestions = useMemo(() => {
    let filtered = [...availableQuestions]
    
    // Shuffle or keep sequential based on mode
    if (shuffleMode) {
      filtered.sort(() => Math.random() - 0.5)
    }
    
    // Apply question limit (0 means no limit)
    if (internalLimit > 0 && filtered.length > internalLimit) {
      filtered = filtered.slice(0, internalLimit)
    }
    return filtered
  }, [availableQuestions, shuffleMode, internalLimit])

  // Shuffle options for each question so correct answer isn't always first
  const shuffledOptionsMap = useMemo(() => {
    const map: Record<string, string[]> = {}
    mcqQuestions.forEach(q => {
      if (q.options) {
        // Create a shuffled copy of the options array
        map[q.id] = [...q.options].sort(() => Math.random() - 0.5)
      }
    })
    return map
  }, [mcqQuestions])

  // Calculate stats
  const stats = useMemo(() => {
    let correct = 0
    let wrong = 0
    let skipped = 0
    let answered = 0
    
    mcqQuestions.forEach(q => {
      const answer = answers[q.id]
      if (answer) {
        if (answer.isSkipped) {
          skipped++
        } else if (answer.selectedAnswer) {
          answered++
          if (answer.isCorrect) {
            correct++
          } else {
            wrong++
          }
        }
      }
    })
    
    return { correct, wrong, skipped, answered, unanswered: mcqQuestions.length - answered - skipped }
  }, [answers, mcqQuestions])
  


  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying && timeLeft > 0 && !showReview) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (isPlaying && timeLeft === 0 && !showReview) {
      setShowReview(true)
    }
    return () => clearInterval(timer)
  }, [isPlaying, timeLeft, showReview])

  const handleStart = () => {
    if (mcqQuestions.length === 0) {
      alert("Bu kateqoriyada sual yoxdur!")
      return
    }
    setIsPlaying(true)
    setTimeLeft(internalDuration)
    setCurrentQIndex(0)
    setAnswers({})
    setShowReview(false)
  }

  const handleAnswer = (option: string) => {
    const currentQ = mcqQuestions[currentQIndex]
    const isCorrect = option === currentQ.answer
    
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        selectedAnswer: option,
        isCorrect,
        isSkipped: false
      }
    }))
  }

  const handleSkip = () => {
    const currentQ = mcqQuestions[currentQIndex]
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        selectedAnswer: null,
        isCorrect: null,
        isSkipped: true
      }
    }))
    goToNext()
  }

  const goToPrevious = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(prev => prev - 1)
    }
  }

  const goToNext = () => {
    if (currentQIndex < mcqQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1)
    }
  }

  const goToQuestion = (index: number) => {
    setCurrentQIndex(index)
    setShowReview(false)
  }

  const handleFinish = () => {
    setShowReview(true)
  }

  const handleSubmit = () => {
    setIsPlaying(false)
    onComplete(stats.correct, stats.answered + stats.skipped)
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isPlaying) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-black text-primary flex items-center justify-center gap-3">
            <Zap className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            BLITZ MODE
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            {Math.floor(internalDuration / 60)} dəqiqəniz avtomatik seçildi. Aşağıdan tənzimləyə bilərsiniz.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">İmtahan Müddəti</label>
              <select 
                value={internalDuration}
                onChange={(e) => setInternalDuration(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-sans"
              >
                {[5, 15, 30, 45, 60, 90, 120].map((mins) => (
                  <option key={mins} value={mins * 60}>{mins} dəqiqə</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Sual Sayı</label>
              <select 
                value={internalLimit}
                onChange={(e) => setInternalLimit(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-sans"
              >
                {[10, 25, 50, 100].map((limit) => (
                  <option key={limit} value={limit}>{limit} sual</option>
                ))}
                <option value={0}>Hamısı ({availableQuestions.length})</option>
              </select>
            </div>
          </div>

          {selectedCategory && (
            <p className="text-primary font-semibold mt-4">
              Fənn: {selectedCategory}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            {mcqQuestions.length} sual mövcuddur
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="text-center py-8">
            <div className="text-6xl font-black text-white/90">
              {stats.correct} <span className="text-xl font-normal text-muted-foreground">DÜZGÜN</span>
            </div>
            {timeLeft === 0 && <p className="text-red-500 font-bold mt-2">VAXT BİTDİ!</p>}
          </div>
          <Button 
            size="lg" 
            onClick={handleStart} 
            className="w-full text-lg font-bold py-8 animate-pulse"
            disabled={mcqQuestions.length === 0}
          >
            {timeLeft === 0 || timeLeft < examDuration ? "YENİDƏN OYNA" : "BAŞLA"}
          </Button>
          <Button variant="ghost" onClick={onExit}>
            Geri Qayıt
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Review screen
  if (showReview) {
    return (
      <Card className="w-full max-w-3xl mx-auto border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Test Xülasəsi</CardTitle>
          <p className="text-muted-foreground">
            {timeLeft === 0 ? "Vaxt bitdi!" : "Testi bitirmək istəyirsiniz?"}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-green-500/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-500">{stats.correct}</div>
              <div className="text-xs text-muted-foreground">Düzgün</div>
            </div>
            <div className="bg-red-500/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-500">{stats.wrong}</div>
              <div className="text-xs text-muted-foreground">Səhv</div>
            </div>
            <div className="bg-yellow-500/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-500">{stats.skipped}</div>
              <div className="text-xs text-muted-foreground">Keçildi</div>
            </div>
            <div className="bg-slate-500/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-slate-400">{stats.unanswered}</div>
              <div className="text-xs text-muted-foreground">Cavabsız</div>
            </div>
          </div>

          {/* Question grid */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Suallara keçid:</p>
            <div className="max-h-[300px] overflow-y-auto p-2 border rounded-lg border-slate-800 bg-slate-900/30 custom-scrollbar">
              <div className="flex flex-wrap gap-2 justify-center">
                {mcqQuestions.map((q, idx) => {
                  const answer = answers[q.id]
                  let bgClass = "bg-slate-800 hover:bg-slate-700" // unanswered
                  if (answer) {
                    if (answer.isSkipped) {
                      bgClass = "bg-yellow-500/30 hover:bg-yellow-500/50"
                    } else if (answer.isCorrect === true) {
                      bgClass = "bg-green-500/30 hover:bg-green-500/50"
                    } else if (answer.isCorrect === false) {
                      bgClass = "bg-red-500/30 hover:bg-red-500/50"
                    }
                  }
                  return (
                    <button
                      key={q.id}
                      onClick={() => goToQuestion(idx)}
                      className={`w-10 h-10 rounded-lg font-bold transition-colors ${bgClass}`}
                    >
                      {idx + 1}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowReview(false)}
              disabled={timeLeft === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Davam Et
            </Button>
            <Button
              className="flex-1 bg-primary"
              onClick={handleSubmit}
            >
              <Check className="mr-2 h-4 w-4" />
              Testi Bitir
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentQ = mcqQuestions[currentQIndex]
  const currentAnswer = answers[currentQ?.id]

  if (!currentQ) {
    return (
      <Card className="w-full max-w-2xl mx-auto p-8 text-center">
        <p>Sual tapılmadı</p>
        <Button onClick={onExit} className="mt-4">Geri Qayıt</Button>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto relative space-y-4">
      {/* Header with timer and stats */}
      <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-800 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 font-bold text-lg tabular-nums ${timeLeft <= 60 ? 'text-red-500 animate-pulse' : 'text-yellow-500'}`}>
            <Timer className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-sm font-medium bg-slate-950/50 px-3 py-1.5 rounded-md border border-slate-800">
            <span className="text-green-500 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> {stats.correct}
            </span>
            <span className="text-red-500 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> {stats.wrong}
            </span>
          </div>
          
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleFinish}
            className="h-8 px-3 text-xs font-bold uppercase tracking-wider"
          >
            Bitir
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: "100%" }}
          animate={{ width: `${(timeLeft / internalDuration) * 100}%` }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </div>

      {/* Question navigation dots - Scrollable container for large sets */}
      <div className="max-h-[80px] overflow-y-auto px-2 py-2 border rounded-lg border-slate-800 bg-slate-900/30 custom-scrollbar">
        <div className="flex flex-wrap gap-1 justify-center">
          {mcqQuestions.map((q, idx) => {
            const answer = answers[q.id]
            let bgClass = "bg-slate-700" // unanswered
            if (answer) {
              if (answer.isSkipped) {
                bgClass = "bg-yellow-500"
              } else if (answer.selectedAnswer) {
                bgClass = answer.isCorrect ? "bg-green-500" : "bg-red-500"
              }
            }
            const isActive = idx === currentQIndex
            return (
              <button
                key={q.id}
                onClick={() => setCurrentQIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all flex-shrink-0 ${bgClass} ${isActive ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-125 z-10' : 'hover:scale-110'}`}
                title={`Sual ${idx + 1}`}
              />
            )
          })}
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-2 border-primary/10">
            <CardHeader>
              <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                <span>Sual {currentQIndex + 1} / {mcqQuestions.length}</span>
                {currentAnswer?.isSkipped && (
                  <span className="text-yellow-500 flex items-center gap-1">
                    <Flag className="w-3 h-3" /> Keçildi
                  </span>
                )}
              </div>
              <CardTitle className="text-xl leading-relaxed">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {(shuffledOptionsMap[currentQ.id] || currentQ.options)?.map((option, idx) => {
                const isSelected = currentAnswer?.selectedAnswer === option
                const isCorrectAnswer = option === currentQ.answer
                const hasAnswered = currentAnswer?.selectedAnswer !== undefined && currentAnswer?.selectedAnswer !== null
                
                let borderClass = ""
                let bgClass = "hover:bg-accent hover:text-accent-foreground cursor-pointer"
                
                if (hasAnswered) {
                  if (isSelected) {
                    bgClass = currentAnswer?.isCorrect ? "bg-green-600 text-white" : "bg-red-600 text-white"
                    borderClass = currentAnswer?.isCorrect ? "border-green-500" : "border-red-500"
                  } else if (isCorrectAnswer) {
                    borderClass = "border-green-500"
                    bgClass = "bg-green-600/20"
                  } else {
                    bgClass = "opacity-30"
                  }
                }

                return (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !hasAnswered && handleAnswer(option)}
                    disabled={hasAnswered}
                    className={`
                      w-full p-4 rounded-lg border-2 text-left font-medium transition-all duration-200
                      ${borderClass || "border-border"}
                      ${bgClass}
                      ${hasAnswered ? 'cursor-default' : ''}
                    `}
                  >
                    <div className="flex justify-between items-center gap-2">
                      <span className="flex-1">{option}</span>
                      {isSelected && currentAnswer?.isCorrect && <CheckCircle className="w-5 h-5 shrink-0" />}
                      {isSelected && !currentAnswer?.isCorrect && <XCircle className="w-5 h-5 shrink-0" />}
                    </div>
                  </motion.button>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={goToPrevious}
          disabled={currentQIndex === 0}
          className="flex-1"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Əvvəlki
        </Button>

        {!currentAnswer?.selectedAnswer && !currentAnswer?.isSkipped && (
          <Button
            variant="outline"
            onClick={handleSkip}
            className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
          >
            <Flag className="mr-2 h-4 w-4" />
            Keç
          </Button>
        )}

        {currentQIndex < mcqQuestions.length - 1 ? (
          <Button
            variant="outline"
            onClick={goToNext}
            className="flex-1"
          >
            Növbəti
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleFinish}
            className="flex-1 bg-primary"
          >
            <Check className="mr-2 h-4 w-4" />
            Bitir
          </Button>
        )}
      </div>
    </div>
  )
}
