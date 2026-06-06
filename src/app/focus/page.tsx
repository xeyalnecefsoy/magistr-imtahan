"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, 
  Zap, Trophy, Target, Coffee, Flame, Star, ChevronRight,
  Brain, Timer, Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MarkdownText } from "@/components/MarkdownText"
import layiheIdareData from "@/data/layihe-idare-suallari.json"
import teskilatiDizaynData from "@/data/teskilati-dizayn-suallari.json"
import komputerDizayn2Data from "@/data/komputer-dizayn-2-suallari.json"
import bediiResmData from "@/data/bedii-resm-suallari.json"
import istehsalProsesiData from "@/data/istehsal-prosesi-suallari.json"

type Subject = "all" | "layihe" | "teskilati" | "komputer2" | "bedii" | "istehsal"

type GameState = "menu" | "select-subject" | "focus" | "break" | "question" | "answer" | "session-complete" | "all-complete"

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

const layiheFile = layiheIdareData as unknown as SubjectFile
const teskilatiFile = teskilatiDizaynData as unknown as SubjectFile
const komputer2File = komputerDizayn2Data as unknown as SubjectFile
const bediiFile = bediiResmData as unknown as SubjectFile
const istehsalFile = istehsalProsesiData as unknown as SubjectFile

type Question = {
  id: number
  question: string
  answer: string
  category: string
  keywords?: string[]
}

// Pomodoro settings
const FOCUS_DURATION = 25 * 60 // 25 minutes in seconds
const BREAK_DURATION = 5 * 60 // 5 minutes in seconds
const QUESTIONS_PER_SESSION = 10

export default function FocusPage() {
  const router = useRouter()
  
  // Game state
  const [gameState, setGameState] = useState<GameState>("menu")
  const [selectedSubject, setSelectedSubject] = useState<Subject>("all")
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([])
  
  // Pomodoro timer
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<"focus" | "break">("focus")
  
  // Gamification
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  
  // Audio
  const [soundEnabled, setSoundEnabled] = useState(true)
  const correctSoundRef = useRef<HTMLAudioElement | null>(null)
  const levelUpSoundRef = useRef<HTMLAudioElement | null>(null)
  
  // Speech synthesis
  const [isSpeaking, setIsSpeaking] = useState(false)
  

  
  // NOTE: Initial loading useEffect removed to prevent race conditions.
  // Questions are now loaded directly when starting the game.
  
  // Timer logic
  useEffect(() => {
    if (!isTimerRunning || gameState === "menu") return
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up!
          if (currentPhase === "focus") {
            setCurrentPhase("break")
            setGameState("break")
            setTimeLeft(BREAK_DURATION)
            playSound("levelup")
          } else {
            setCurrentPhase("focus")
            setGameState("focus")
            setTimeLeft(FOCUS_DURATION)
          }
          return prev
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [isTimerRunning, currentPhase, gameState])
  
  // Format time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }
  
  // Play pleasant game-like sounds
  const playSound = (type: "correct" | "levelup") => {
    if (!soundEnabled) return
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      if (type === "correct") {
        // Pleasant ascending two-note chime (like coin collect)
        const playNote = (freq: number, startTime: number, duration: number, volume: number) => {
          const osc = audioContext.createOscillator()
          const gain = audioContext.createGain()
          
          osc.connect(gain)
          gain.connect(audioContext.destination)
          
          osc.frequency.value = freq
          osc.type = "sine"
          
          // Smooth envelope for pleasant sound
          gain.gain.setValueAtTime(0, startTime)
          gain.gain.linearRampToValueAtTime(volume, startTime + 0.02)
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
          
          osc.start(startTime)
          osc.stop(startTime + duration)
        }
        
        const now = audioContext.currentTime
        // C5 -> E5 (major third - happy sound!)
        playNote(523.25, now, 0.15, 0.12)        // C5
        playNote(659.25, now + 0.08, 0.2, 0.15)  // E5
        
      } else {
        // Triumphant level-up fanfare!
        const playNote = (freq: number, startTime: number, duration: number, volume: number) => {
          const osc = audioContext.createOscillator()
          const gain = audioContext.createGain()
          
          osc.connect(gain)
          gain.connect(audioContext.destination)
          
          osc.frequency.value = freq
          osc.type = "triangle" // Softer, more musical tone
          
          gain.gain.setValueAtTime(0, startTime)
          gain.gain.linearRampToValueAtTime(volume, startTime + 0.02)
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
          
          osc.start(startTime)
          osc.stop(startTime + duration)
        }
        
        const now = audioContext.currentTime
        // C-E-G arpeggio (C major chord - very triumphant!)
        playNote(523.25, now, 0.25, 0.12)         // C5
        playNote(659.25, now + 0.1, 0.25, 0.12)   // E5
        playNote(783.99, now + 0.2, 0.35, 0.15)   // G5
        playNote(1046.5, now + 0.3, 0.5, 0.1)     // C6 (octave up - grand finale!)
      }
    } catch (e) {
      console.log("Audio not supported")
    }
  }
  
  // Speak text - try to find the most natural voice available
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return
    
    window.speechSynthesis.cancel()
    
    // Convert Azerbaijani-specific characters for better pronunciation
    let processedText = text
      .replace(/ə/g, 'e')
      .replace(/Ə/g, 'E')
      .replace(/x/g, 'h')
      .replace(/X/g, 'H')
      .replace(/q/g, 'g')
      .replace(/Q/g, 'G')
      // Add natural pauses at punctuation
      .replace(/\./g, '... ')
      .replace(/,/g, ', ')
      .replace(/:/g, ': ')
    
    const utterance = new SpeechSynthesisUtterance(processedText)
    
    // Try to find the best voice
    const voices = window.speechSynthesis.getVoices()
    
    // Priority: Turkish female > Turkish male > any Turkish > English female > default
    const turkishFemale = voices.find(v => v.lang.startsWith('tr') && v.name.toLowerCase().includes('female'))
    const turkishVoice = voices.find(v => v.lang.startsWith('tr'))
    const googleTurkish = voices.find(v => v.lang.startsWith('tr') && v.name.includes('Google'))
    const naturalVoice = voices.find(v => v.name.includes('Natural') || v.name.includes('neural'))
    
    // Select best available
    utterance.voice = googleTurkish || turkishFemale || naturalVoice || turkishVoice || null
    utterance.lang = 'tr-TR'
    utterance.rate = 0.9      // Natural speaking pace
    utterance.pitch = 1.05    // Slightly higher pitch sounds more natural
    utterance.volume = 1.0
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    // Voices may not be loaded yet, wait for them
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.speak(utterance)
      }
    } else {
      window.speechSynthesis.speak(utterance)
    }
  }
  
  // Start game with specific subject
  const handleStart = (subject: Subject) => {
    setSelectedSubject(subject)
    
    let allQuestions: Question[] = []
    
    if (subject === "all" || subject === "layihe") {
      allQuestions = [...allQuestions, ...layiheFile.questions.map(q => ({...q, category: "Layihələrin idarə olunması", answer: q.answer || ""}))]
    }
    if (subject === "all" || subject === "teskilati") {
      allQuestions = [...allQuestions, ...teskilatiFile.questions.map(q => ({...q, category: "Təşkilati dizayn", answer: q.answer || ""}))]
    }
    if (subject === "all" || subject === "komputer2") {
      allQuestions = [...allQuestions, ...komputer2File.questions.map(q => ({...q, category: "Sənaye dizaynında kompüter layihələndirilməsi-2", answer: q.answer || ""}))]
    }
    if (subject === "all" || subject === "bedii") {
      allQuestions = [...allQuestions, ...bediiFile.questions.map(q => ({...q, category: "Bədii layihələndirmədə texniki rəsm", answer: q.answer || ""}))]
    }
    if (subject === "all" || subject === "istehsal") {
      allQuestions = [...allQuestions, ...istehsalFile.questions.map(q => ({...q, category: "İstehsal prosesinin texnoloji əsasları", answer: q.answer || ""}))]
    }
    
    // Filter out questions with empty answers
    allQuestions = allQuestions.filter(q => q.answer && q.answer.trim().length > 0)
    
    const shuffled = allQuestions.sort(() => Math.random() - 0.5)
    setQuestions(shuffled)
    
    // Trigger start logic immediately with the new shuffled list
    startSession(shuffled)
  }

  // Start session (can optionally take questions list if newly created)
  const startSession = (specificQuestions?: Question[]) => {
    const currentQuestions = specificQuestions || questions
    const startIndex = sessionsCompleted * QUESTIONS_PER_SESSION
    const endIndex = Math.min(startIndex + QUESTIONS_PER_SESSION, currentQuestions.length)
    
    if (startIndex >= currentQuestions.length) {
      setGameState("all-complete")
      return
    }
    
    setSessionQuestions(currentQuestions.slice(startIndex, endIndex))
    setCurrentIndex(0)
    setGameState("question")
    setIsTimerRunning(true)
    setCurrentPhase("focus")
    setTimeLeft(FOCUS_DURATION)
  }
  
  // Resume from break
  const resumeFromBreak = () => {
    setGameState("question")
    setCurrentPhase("focus")
    setTimeLeft(FOCUS_DURATION)
    setIsTimerRunning(true)
  }
  
  // Handle answer
  const handleKnow = () => {
    const points = 10 + (combo * 2) // Combo bonus
    setScore(prev => prev + points)
    setCombo(prev => prev + 1)
    setMaxCombo(prev => Math.max(prev, combo + 1))
    setQuestionsAnswered(prev => prev + 1)
    playSound("correct")
    nextQuestion()
  }
  
  const handleDontKnow = () => {
    setCombo(0)
    setQuestionsAnswered(prev => prev + 1)
    nextQuestion()
  }
  
  const nextQuestion = () => {
    // Stop any ongoing speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
    
    setGameState("question")
    if (currentIndex + 1 >= sessionQuestions.length) {
      // Session complete
      setSessionsCompleted(prev => prev + 1)
      setGameState("session-complete")
      playSound("levelup")
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }
  
  // Current question
  const currentQuestion = sessionQuestions[currentIndex]
  
  // Calculate level
  const level = Math.floor(score / 100) + 1
  const progressToNextLevel = (score % 100)
  
  // Total progress
  const totalProgress = Math.round((questionsAnswered / questions.length) * 100)

  return (
    <main className="min-h-screen bg-[#020817] text-white flex flex-col overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-900/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[128px]" />
      </div>
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 md:p-6 max-w-4xl mx-auto w-full">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="text-slate-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-bold flex items-center gap-2 text-orange-400">
            <Flame className="w-5 h-5" />
            Fokus Oyun
          </h1>
          <p className="text-xs text-slate-500">Diqqət + Əyləncə</p>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-slate-400 hover:text-white"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <AnimatePresence mode="wait">
          
          {/* MENU STATE */}
          {gameState === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md w-full space-y-6"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 mb-4">
                  <Flame className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-black">Fokus Oyun</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Pomodoro texnikası + Oyunlaşdırma.<br/>
                  <span className="text-orange-400">25 dəqiqə</span> fokus, <span className="text-green-400">5 dəqiqə</span> fasilə.<br/>
                  Hər sessiya yalnız <span className="text-blue-400">10 sual</span>.
                </p>
              </div>
              
              {/* Stats Preview */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-3 text-center bg-slate-900/50 border-slate-800">
                  <Target className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-lg font-bold">{questions.length}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Sual</div>
                </Card>
                <Card className="p-3 text-center bg-slate-900/50 border-slate-800">
                  <Timer className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                  <div className="text-lg font-bold">25</div>
                  <div className="text-[10px] text-slate-500 uppercase">Dəqiqə</div>
                </Card>
                <Card className="p-3 text-center bg-slate-900/50 border-slate-800">
                  <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <div className="text-lg font-bold">10</div>
                  <div className="text-[10px] text-slate-500 uppercase">Sessiya</div>
                </Card>
              </div>
              
              <Button 
                size="lg" 
                className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold text-lg"
                onClick={() => setGameState("select-subject")}
              >
                <Play className="w-5 h-5 mr-2" />
                BAŞLA
              </Button>
              
              <p className="text-center text-xs text-slate-600">
                Hazırladı: Fokus sistemi ilə diqqəti itirmə, xal qazan!
              </p>
            </motion.div>
          )}

          {/* SELECT SUBJECT STATE */}
          {gameState === "select-subject" && (
            <motion.div
              key="select-subject"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md w-full space-y-4"
            >
              <h2 className="text-2xl font-bold text-center mb-6">Fənn Seç</h2>
              
              <div className="grid gap-3">
                <Button 
                  variant="outline" 
                  className="h-16 justify-start px-6 border-slate-700 hover:bg-slate-800 hover:border-orange-500/50 group"
                  onClick={() => handleStart("layihe")}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 group-hover:bg-blue-500/30 transition-colors">
                    <Brain className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-white">Layihələrin idarə olunması</div>
                    <div className="text-xs text-slate-500">{layiheFile.questions.length} sual</div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-16 justify-start px-6 border-slate-700 hover:bg-slate-800 hover:border-orange-500/50 group"
                  onClick={() => handleStart("teskilati")}
                >
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center mr-4 group-hover:bg-pink-500/30 transition-colors">
                    <Sparkles className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-white">Təşkilati dizayn</div>
                    <div className="text-xs text-slate-500">{teskilatiFile.questions.length} sual</div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-16 justify-start px-6 border-slate-700 hover:bg-slate-800 hover:border-orange-500/50 group"
                  onClick={() => handleStart("komputer2")}
                >
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center mr-4 group-hover:bg-cyan-500/30 transition-colors">
                    <Coffee className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-white">Kompüter layihələndirilməsi-2</div>
                    <div className="text-xs text-slate-500">{komputer2File.questions.length} sual</div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-16 justify-start px-6 border-slate-700 hover:bg-slate-800 hover:border-orange-500/50 group"
                  onClick={() => handleStart("bedii")}
                >
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mr-4 group-hover:bg-violet-500/30 transition-colors">
                    <Flame className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-white">Bədii texniki rəsm</div>
                    <div className="text-xs text-slate-500">{bediiFile.questions.length} sual</div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-16 justify-start px-6 border-slate-700 hover:bg-slate-800 hover:border-orange-500/50 group"
                  onClick={() => handleStart("istehsal")}
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mr-4 group-hover:bg-emerald-500/30 transition-colors">
                    <Star className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-white">İstehsal prosesi</div>
                    <div className="text-xs text-slate-500">{istehsalFile.questions.length} sual</div>
                  </div>
                </Button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-800"></span></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#020817] px-2 text-slate-500">və ya</span></div>
                </div>

                <Button 
                  className="h-16 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white"
                  onClick={() => handleStart("all")}
                >
                  <Flame className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-bold">Qarışıq Rejim</div>
                    <div className="text-xs opacity-80">Bütün fənlərdən suallar</div>
                  </div>
                </Button>
              </div>

              <Button variant="ghost" className="w-full mt-4" onClick={() => setGameState("menu")}>
                Geri
              </Button>
            </motion.div>
          )}
          
          {/* BREAK STATE */}
          {gameState === "break" && (
            <motion.div
              key="break"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md w-full text-center space-y-8"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20 animate-pulse">
                <Coffee className="w-12 h-12 text-green-400" />
              </div>
              
              <div>
                <h2 className="text-3xl font-black text-green-400 mb-2">Fasilə Vaxtı!</h2>
                <p className="text-slate-400">Gözlərini dinləndir, su iç, hərəkət et.</p>
              </div>
              
              <div className="text-6xl font-mono font-bold text-green-400">
                {formatTime(timeLeft)}
              </div>
              
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2">
                <p className="text-sm text-slate-400">Bu sessiyada:</p>
                <div className="flex justify-around">
                  <div>
                    <div className="text-2xl font-bold text-white">{score}</div>
                    <div className="text-xs text-slate-500">XAL</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400">{maxCombo}x</div>
                    <div className="text-xs text-slate-500">MAKS KOMBO</div>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" onClick={resumeFromBreak} className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                Fasiləni Bitir
              </Button>
            </motion.div>
          )}
          
          {/* QUESTION STATE */}
          {(gameState === "question" || gameState === "answer") && currentQuestion && (
            <motion.div
              key="question"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl w-full space-y-4"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between gap-4">
                {/* Timer */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm ${
                  timeLeft < 60 ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-300'
                }`}>
                  <Timer className="w-4 h-4" />
                  {formatTime(timeLeft)}
                </div>
                
                {/* Score */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">{score}</span>
                  </div>
                  
                  {combo > 0 && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 text-orange-400 bg-orange-500/10 px-2 py-1 rounded-full"
                    >
                      <Flame className="w-4 h-4" />
                      <span className="font-bold text-sm">{combo}x</span>
                    </motion.div>
                  )}
                </div>
                
                {/* Question Progress */}
                <div className="text-slate-400 text-sm">
                  {currentIndex + 1}/{sessionQuestions.length}
                </div>
              </div>
              
              {/* Level Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Səviyyə {level}</span>
                  <span>{progressToNextLevel}/100 XP</span>
                </div>
                <Progress value={progressToNextLevel} className="h-1.5 bg-slate-800" indicatorClassName="bg-gradient-to-r from-yellow-500 to-orange-500" />
              </div>
              
              {/* Question Card */}
              <Card 
                className="p-8 bg-slate-900/80 border-slate-700 cursor-pointer hover:border-slate-600 transition-colors min-h-[300px] flex flex-col"
                onClick={() => {
                  if (gameState === "question") {
                    setGameState("answer")
                    speakText(currentQuestion.answer)
                  } else if (gameState === "answer") {
                    // Allow flipping back to see question again
                    setGameState("question")
                  }
                }}
              >
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full mb-6">
                    {currentQuestion.category}
                  </span>
                  
                  <AnimatePresence mode="wait">
                    {gameState === "question" ? (
                      <motion.div
                        key="q"
                        initial={{ opacity: 0, rotateX: -90 }}
                        animate={{ opacity: 1, rotateX: 0 }}
                        exit={{ opacity: 0, rotateX: 90 }}
                        className="space-y-4"
                      >
                        <h3 className="text-2xl font-bold leading-relaxed">
                          {currentQuestion.question}
                        </h3>
                        <p className="text-slate-500 text-sm animate-pulse">
                          Cavabı görmək üçün toxun
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="a"
                        initial={{ opacity: 0, rotateX: -90 }}
                        animate={{ opacity: 1, rotateX: 0 }}
                        exit={{ opacity: 0, rotateX: 90 }}
                        className="space-y-4 w-full"
                      >
                        <div className="text-slate-200 text-left">
                          <MarkdownText size="base">
                            {currentQuestion.answer}
                          </MarkdownText>
                        </div>
                        
                        {currentQuestion.keywords && currentQuestion.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-2 justify-center mt-4">
                            {currentQuestion.keywords.map((kw, i) => (
                              <span key={i} className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-1 rounded">
                                #{kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Speak Button */}
                {gameState === "answer" && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-4 right-4 text-slate-400"
                    onClick={(e) => {
                      e.stopPropagation()
                      speakText(currentQuestion.answer)
                    }}
                  >
                    <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-blue-400 animate-pulse' : ''}`} />
                  </Button>
                )}
              </Card>
              
              {/* Action Buttons */}
              {gameState === "answer" && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <Button 
                    size="lg"
                    variant="outline"
                    className="h-14 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                    onClick={handleDontKnow}
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Yenidən Öyrən
                  </Button>
                  <Button 
                    size="lg"
                    className="h-14 bg-green-500 hover:bg-green-400 text-black font-bold"
                    onClick={handleKnow}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Bildim! (+{10 + combo * 2} xal)
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
          
          {/* SESSION COMPLETE */}
          {gameState === "session-complete" && (
            <motion.div
              key="session-complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md w-full text-center space-y-6"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                <Trophy className="w-12 h-12 text-black" />
              </div>
              
              <div>
                <h2 className="text-3xl font-black mb-2">Sessiya Bitdi!</h2>
                <p className="text-slate-400">Əla iş! Bir az dincəl.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-slate-900/50 border-slate-800 text-center">
                  <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{score}</div>
                  <div className="text-xs text-slate-500">TOPLAM XAL</div>
                </Card>
                <Card className="p-4 bg-slate-900/50 border-slate-800 text-center">
                  <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{maxCombo}x</div>
                  <div className="text-xs text-slate-500">MAKS KOMBO</div>
                </Card>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Ümumi proqres</span>
                  <span>{totalProgress}%</span>
                </div>
                <Progress value={totalProgress} className="h-2 bg-slate-800" indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500" />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setGameState("break")}
                >
                  <Coffee className="w-4 h-4 mr-2" />
                  5 dəq Fasilə
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500"
                  onClick={() => startSession()}
                >
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Davam Et
                </Button>
              </div>
            </motion.div>
          )}
          
          {/* ALL COMPLETE */}
          {gameState === "all-complete" && (
            <motion.div
              key="all-complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md w-full text-center space-y-6"
            >
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                <Sparkles className="w-16 h-16 text-white" />
              </div>
              
              <div>
                <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  MÜKƏMMƏLSƏN!
                </h2>
                <p className="text-slate-400">Bütün sualları bitirdin!</p>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-4 bg-slate-900/50 border-slate-800 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{score}</div>
                  <div className="text-xs text-slate-500">XAL</div>
                </Card>
                <Card className="p-4 bg-slate-900/50 border-slate-800 text-center">
                  <div className="text-2xl font-bold text-purple-400">Lv.{level}</div>
                  <div className="text-xs text-slate-500">SƏVİYYƏ</div>
                </Card>
                <Card className="p-4 bg-slate-900/50 border-slate-800 text-center">
                  <div className="text-2xl font-bold text-orange-400">{maxCombo}x</div>
                  <div className="text-xs text-slate-500">KOMBO</div>
                </Card>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => router.push("/")}>
                  Ana Səhifə
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                  onClick={() => {
                    setScore(0)
                    setCombo(0)
                    setMaxCombo(0)
                    setSessionsCompleted(0)
                    setQuestionsAnswered(0)
                    handleStart(selectedSubject)
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Yenidən Başla
                </Button>
              </div>
            </motion.div>
          )}
          
        </AnimatePresence>
      </div>
    </main>
  )
}
