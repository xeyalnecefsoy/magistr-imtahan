"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { Zap, Layers, BookOpen, BrainCircuit, ChevronRight } from "lucide-react"

import questionsData from "@/data/questions.json"
import akademikYaziData from "@/data/akademik-yazi.json"
import dizaynSuallariData from "@/data/dizayn-suallari.json"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BlitzMode } from "@/components/BlitzMode"
import { FlashcardMode } from "@/components/FlashcardMode"
import { CircularProgress } from "@/components/CircularProgress"
import { ExamSchedule } from "@/components/ExamSchedule"
import { ResultModal } from "@/components/ResultModal"
import erqonomikaSuallariData from "@/data/erqonomika-suallari.json"

// Transform dizayn questions to match the app format - all under ONE category
const dizaynQuestions = dizaynSuallariData.questions.map(q => ({
  id: `dizayn-${q.id}`,
  type: "flashcard" as const,
  question: q.question,
  answer: q.answer,
  category: "Sənaye dizaynında fəaliyyət sahələri"
}))

// Transform erqonomika questions to match the app format - all under ONE category
const erqonomikaQuestions = erqonomikaSuallariData.questions.map(q => ({
  id: `erqonomika-${q.id}`,
  type: "flashcard" as const,
  question: q.question,
  answer: q.answer || "",
  category: "Erqonomika və texniki dizayn"
}))

// Merge all question sources
const initialQuestions = [
  ...questionsData.map(q => ({ ...q, id: `general-${q.id}`, answer: q.answer || "" })),
  ...akademikYaziData.map(q => ({ ...q, id: `akademik-${q.id}`, answer: q.answer || "" })),
  ...dizaynQuestions,
  ...erqonomikaQuestions
]

type AppMode = "home" | "select-category" | "blitz" | "flashcards"

export default function Home() {
  const [questions, setQuestions] = useState(initialQuestions)
  const [mode, setMode] = useState<AppMode>("home")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [pendingMode, setPendingMode] = useState<"blitz" | "flashcards" | null>(null)
  const [shuffleMode, setShuffleMode] = useState<boolean>(true) // true = qarışıq, false = ardıcıl
  const [questionLimit, setQuestionLimit] = useState<number>(25) // sessiya başına sual limiti
  const [examDuration, setExamDuration] = useState<number>(300) // 5 dəqiqə (saniyə ilə)
  const [showResultModal, setShowResultModal] = useState(false)
  const [resultData, setResultData] = useState({ correct: 0, total: 0 })
   /* 
     State for Real Stats 
  */
  const [stats, setStats] = useState({
      learned: 0,
      streak: 0,
      totalAnswered: 0
  })

  // Load stats from generic storage on mount
  useEffect(() => {
      const stored = localStorage.getItem("magistr-stats")
      if (stored) {
          const parsed = JSON.parse(stored)
          // validasiya edək
          const lastDate = parsed.lastDate || new Date().toDateString()
          const today = new Date().toDateString()
          
          let newStreak = parsed.streak || 0
          if (lastDate !== today) {
              const diff = new Date(today).getTime() - new Date(lastDate).getTime()
              if (diff <= 86400000 * 2) { // 48 saat aralığı (dünən giribsə)
                  // streak qalsın və ya artsın, bunu oyun bitəndə artırarıq
              } else {
                  newStreak = 0 // sıfırla
              }
          }
          
          setStats({
              learned: parsed.learned || 0,
              streak: newStreak,
              totalAnswered: parsed.totalAnswered || 0
          })
      }
  }, [])

  const updateStats = (newLearned: number) => {
      setStats(prev => {
          const updated = {
              ...prev,
              learned: prev.learned + newLearned,
              totalAnswered: prev.totalAnswered + newLearned,
              lastDate: new Date().toDateString()
          }
          // Streak yalnız gün ərzində ilk dəfədirsə artır
          const stored = localStorage.getItem("magistr-stats")
          const parsed = stored ? JSON.parse(stored) : {}
          const today = new Date().toDateString()
          
          if (parsed.lastDate !== today) {
              updated.streak = (Number(parsed.streak) || 0) + 1
          } else {
              updated.streak = prev.streak
          }

          localStorage.setItem("magistr-stats", JSON.stringify(updated))
          return updated
      })
  }
  
  const progressPercent = questions.length > 0 
    ? Math.min(100, Math.round((stats.learned / questions.length) * 100)) 
    : 0

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(questions.map(q => q.category))
    return Array.from(cats).sort()
  }, [questions])

  // Count questions per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, { mcq: number; flashcard: number }> = {}
    for (const q of questions) {
      if (!counts[q.category]) {
        counts[q.category] = { mcq: 0, flashcard: 0 }
      }
      if (q.type === 'mcq' && q.options && q.options.length >= 2) {
        counts[q.category].mcq++
      } else {
        counts[q.category].flashcard++
      }
    }
    return counts
  }, [questions])

  const handleModeSelect = (targetMode: "blitz" | "flashcards") => {
    setPendingMode(targetMode)
    setMode("select-category")
  }

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category)
    if (pendingMode) {
      setMode(pendingMode)
    }
  }

  const handleBackToHome = () => {
    setMode("home")
    setSelectedCategory(null)
    setPendingMode(null)
  }

  const handleExamClick = (subject: string, type: "test" | "written") => {
    setSelectedCategory(subject)
    
    // Choose mode based on exam type
    if (type === "test") {
      setPendingMode("blitz")
      setMode("blitz")
    } else {
      setPendingMode("flashcards")
      setMode("flashcards")
    }
  }

  const renderContent = () => {
    switch (mode) {
      case "select-category":
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Hazırlıq Parametrləri</h2>
              <p className="text-muted-foreground">
                {pendingMode === "blitz" ? "Test rejimi" : "Flashcard rejimi"} üçün seçim edin
              </p>
            </div>

            {/* Shuffle Toggle */}
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Sual Sırası</p>
                  <p className="text-sm text-slate-400">
                    {shuffleMode ? "Suallar təsadüfi sıra ilə göstəriləcək" : "Suallar ardıcıl sıra ilə göstəriləcək"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={shuffleMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShuffleMode(true)}
                    className={shuffleMode ? "bg-primary" : ""}
                  >
                    Qarışıq
                  </Button>
                  <Button 
                    variant={!shuffleMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShuffleMode(false)}
                    className={!shuffleMode ? "bg-primary" : ""}
                  >
                    Ardıcıl
                  </Button>
                </div>
              </div>
            </div>

            {/* Question Limit Selection */}
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-white">Sual Sayı</p>
                  <p className="text-sm text-slate-400">
                    Bir sessiyada neçə sual həll etmək istəyirsiniz?
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[10, 25, 50, 100].map((limit) => (
                    <Button 
                      key={limit}
                      variant={questionLimit === limit ? "default" : "outline"}
                      size="sm"
                      onClick={() => setQuestionLimit(limit)}
                      className={questionLimit === limit ? "bg-primary" : ""}
                    >
                      {limit} sual
                    </Button>
                  ))}
                  <Button 
                    variant={questionLimit === 0 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setQuestionLimit(0)}
                    className={questionLimit === 0 ? "bg-primary" : ""}
                  >
                    Hamısı
                  </Button>
                </div>
              </div>
            </div>

            {/* Exam Duration Selection - Only for Blitz Mode */}
            {pendingMode === "blitz" && (
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-white">İmtahan Müddəti</p>
                    <p className="text-sm text-slate-400">
                      İmtahan üçün ayrılan vaxtı seçin
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[5, 15, 30, 60, 90, 120].map((mins) => (
                      <Button 
                        key={mins}
                        variant={examDuration === mins * 60 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setExamDuration(mins * 60)}
                        className={examDuration === mins * 60 ? "bg-primary" : ""}
                      >
                        {mins} dəq
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">Mövzu Seçin</p>
              <div className="grid gap-3">
                {/* All categories option */}
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Card 
                    className="cursor-pointer hover:border-primary transition-colors border-2 border-transparent hover:border-primary"
                    onClick={() => handleCategorySelect(null)}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-white">Bütün Mövzular</p>
                          <p className="text-sm text-muted-foreground">
                            {pendingMode === "blitz" 
                              ? `${questions.filter(q => q.type === 'mcq' && q.options).length} test sualı`
                              : `${questions.length} sual`
                            }
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </motion.div>

                {categories.map((cat) => {
                  const counts = categoryCounts[cat] || { mcq: 0, flashcard: 0 }
                  const relevantCount = pendingMode === "blitz" ? counts.mcq : counts.mcq + counts.flashcard
                  
                  if (relevantCount === 0) return null
                  
                  return (
                    <motion.div key={cat} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Card 
                        className="cursor-pointer hover:border-primary transition-colors border-2 border-transparent"
                        onClick={() => handleCategorySelect(cat)}
                      >
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                              <BrainCircuit className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-white truncate">{cat}</p>
                              <p className="text-sm text-muted-foreground">
                                {pendingMode === "blitz" 
                                  ? `${counts.mcq} test sualı`
                                  : `${counts.mcq + counts.flashcard} sual`
                                }
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <Button variant="ghost" className="w-full" onClick={handleBackToHome}>
              Geri Qayıt
            </Button>
          </div>
        )

      case "blitz":
        return (
          <BlitzMode 
            questions={questions} 
            selectedCategory={selectedCategory}
            shuffleMode={shuffleMode}
            questionLimit={questionLimit}
            examDuration={examDuration}
            onComplete={(correctCount, answeredCount) => {
                setResultData({ correct: correctCount, total: answeredCount })
                updateStats(correctCount)
                setShowResultModal(true)
            }}
            onExit={handleBackToHome}
          />
        )

      case "flashcards":
        return (
          <FlashcardMode 
            questions={questions} 
            selectedCategory={selectedCategory}
            shuffleMode={shuffleMode}
            questionLimit={questionLimit}
            onExit={() => {
                // Flashcardda konkret 'öyrəndim' sayı yoxdursa, sadəcə baxdıqlarımızı qeyd edə bilərik
                // Amma indi onExit-ə heçnə ötürmürük. 
                // Gələcəkdə FlashcardMode-dan 'learnedCount' qaytarmaq olar.
                // İndilik sadəcə streak yenilənsin deyə dummy update
                updateStats(0)
                handleBackToHome()
            }}
          />
        )

      default:
        return (
          <div className="space-y-8 max-w-4xl mx-auto pb-12">
            
            {/* Hero Section - Responsive Fix (lg:flex-row) */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-950 border border-white/10 p-6 sm:p-10 shadow-2xl">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent opacity-50" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-900/20 rounded-full blur-3xl animate-pulse" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 md:gap-12">
                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wide">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Magistratura 2026 Hazırlığı
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-[0.9]">
                                MAGİSTR
                            </h1>
                            <p className="text-slate-400 text-lg sm:text-xl font-light">
                                Sürətli imtahan simulyasiyası.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            <Button 
                                size="lg"
                                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all transform hover:scale-105 cursor-pointer"
                                onClick={() => handleModeSelect("blitz")}
                            >
                                <Zap className="mr-2 h-5 w-5 fill-current" />
                                BLITZ BAŞLA
                            </Button>
                        </div>
                    </div>

                    {/* Right Content - Stats - 100% width on mobile, auto on desktop */}
                    <div className="w-full lg:w-auto flex flex-col gap-4">
                        <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between lg:justify-start gap-6 min-w-[300px]">
                            <div className="relative shrink-0">
                                {/* Using distinct colors for visual separation */}
                                <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl" />
                                <CircularProgress 
                                    value={progressPercent} 
                                    size={80} 
                                    strokeWidth={8} 
                                    color={progressPercent > 50 ? "oklch(0.623 0.214 259.815)" : "oklch(0.5 0.1 240)"} 
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-bold text-white">{progressPercent}%</span>
                                </div>
                            </div>
                            
                            <div className="space-y-1.5 text-left flex-1">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    Ümumi Mənimsəmə
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-lg font-semibold text-white">
                                        {progressPercent < 10 ? "Başlanğıc" : progressPercent < 50 ? "Orta Səviyyə" : "Peşəkar"}
                                    </span>
                                </div>
                                <div className="text-xs text-slate-400">
                                    {questions.length} sualdan <span className="text-green-400 font-bold">{stats.learned}</span> öyrənilib
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-center">
                                <div className="text-2xl font-bold text-white">{questions.length}</div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase">Toplam Sual</div>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-center">
                                <div className="text-2xl font-bold text-yellow-500 flex items-center justify-center gap-1">
                                    {stats.streak} <span className="text-xs text-slate-500">gün</span>
                                </div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase">Streak</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exam Schedule */}
            <ExamSchedule onExamClick={handleExamClick} />

            {/* Mode Cards - Only show if not accessed from hero */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card 
                        className="cursor-pointer border-l-4 border-l-primary hover:bg-primary/5 transition-all"
                        onClick={() => handleModeSelect("blitz")}
                    >
                        <CardHeader className="flex flex-row items-center gap-4 p-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                                <Zap className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Blitz Mode</CardTitle>
                                <CardDescription className="text-sm">5 dəqiqə, sürət testi</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card 
                        className="cursor-pointer border-l-4 border-l-secondary hover:bg-secondary/5 transition-all"
                        onClick={() => handleModeSelect("flashcards")}
                    >
                        <CardHeader className="flex flex-row items-center gap-4 p-4">
                            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                                <Layers className="w-5 h-5 text-secondary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Flashcard</CardTitle>
                                <CardDescription className="text-sm">Aktiv yaddaş metodu</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                </motion.div>
            </div>
          </div>
        )
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6 pt-12 md:p-12 font-sans selection:bg-primary selection:text-primary-foreground">
        <div className="max-w-5xl mx-auto">
             <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                key={mode + (selectedCategory || "")}
             >
                {renderContent()}
             </motion.div>
        </div>

        {/* Result Modal */}
        <ResultModal
          isOpen={showResultModal}
          correctCount={resultData.correct}
          totalCount={resultData.total}
          onClose={() => {
            setShowResultModal(false)
            handleBackToHome()
          }}
          onPlayAgain={() => {
            setShowResultModal(false)
            // Stay in select-category mode to start again
            setMode("select-category")
          }}
        />
    </main>
  )
}
