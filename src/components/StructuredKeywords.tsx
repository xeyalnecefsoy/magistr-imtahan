"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Key, Eye, EyeOff, ChevronDown, ChevronUp, Layers, BookOpen } from "lucide-react"

interface Question {
  id: string | number
  question: string
  answer: string
  category: string
  keywords?: string[]
}

interface StructuredKeywordsProps {
  questions: Question[]
  selectedCategory: string | null
  onExit: () => void
}

export function StructuredKeywords({ questions, selectedCategory, onExit }: StructuredKeywordsProps) {
  // State
  const [expandedTickets, setExpandedTickets] = useState<Set<number>>(new Set())
  const [showAnswerHints, setShowAnswerHints] = useState<Record<string, boolean>>({})
  const [viewMode, setViewMode] = useState<"tickets" | "all">("tickets")

  // Constants
  const QUESTIONS_PER_TICKET = 5

  // Filter questions with keywords for the selected category
  const filteredQuestions = useMemo(() => {
    let filtered = questions.filter(q => q.keywords && q.keywords.length > 0)
    if (selectedCategory) {
      filtered = filtered.filter(q => q.category === selectedCategory)
    }
    // Sort by ID to maintain order
    return filtered.sort((a, b) => {
      const idA = parseInt(String(a.id).replace(/\D/g, '')) || 0
      const idB = parseInt(String(b.id).replace(/\D/g, '')) || 0
      return idA - idB
    })
  }, [questions, selectedCategory])

  const totalTickets = Math.max(1, Math.ceil(filteredQuestions.length / QUESTIONS_PER_TICKET))

  const getTicketQuestions = (ticketNumber: number) => {
    const startIndex = (ticketNumber - 1) * QUESTIONS_PER_TICKET
    return filteredQuestions.slice(startIndex, startIndex + QUESTIONS_PER_TICKET)
  }

  const toggleTicket = (ticketNumber: number) => {
    setExpandedTickets(prev => {
      const newSet = new Set(prev)
      if (newSet.has(ticketNumber)) {
        newSet.delete(ticketNumber)
      } else {
        newSet.add(ticketNumber)
      }
      return newSet
    })
  }

  const expandAll = () => {
    setExpandedTickets(new Set(Array.from({ length: totalTickets }, (_, i) => i + 1)))
  }

  const collapseAll = () => {
    setExpandedTickets(new Set())
  }

  const toggleAnswerHint = (questionId: string | number) => {
    setShowAnswerHints(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onExit}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Geri
          </Button>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Layers className="w-6 h-6 text-cyan-500" />
              Struktur Açar Sözlər
            </h2>
            <p className="text-muted-foreground text-sm">
              {selectedCategory || "Ümumi"} — {filteredQuestions.length} sual, {totalTickets} bilet
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-slate-800/50 p-1 rounded-lg">
          <Button 
            variant={viewMode === "tickets" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("tickets")}
            className="gap-2"
          >
            <FileText className="w-4 h-4" /> Biletlər
          </Button>
          <Button 
            variant={viewMode === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("all")}
            className="gap-2"
          >
            <BookOpen className="w-4 h-4" /> Hamısı
          </Button>
        </div>
      </div>

      {/* Description Card */}
      <Card className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-cyan-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg shrink-0">
              <Key className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-300">
                <strong className="text-cyan-400">Məqsəd:</strong> Bu bölmədə yalnız sualların açar sözləri göstərilir.
              </p>
              <p className="text-xs text-slate-400">
                Açar sözlərə baxaraq cavabın strukturunu xatırlamağa çalışın. Lazım olduqda sualı görə bilərsiniz.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      {viewMode === "tickets" && (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={expandAll} className="gap-1">
            <ChevronDown className="w-4 h-4" /> Hamısını Aç
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll} className="gap-1">
            <ChevronUp className="w-4 h-4" /> Hamısını Bağla
          </Button>
        </div>
      )}

      {/* Content */}
      {viewMode === "tickets" ? (
        <div className="space-y-4">
          {Array.from({ length: totalTickets }).map((_, idx) => {
            const ticketNum = idx + 1
            const ticketQuestions = getTicketQuestions(ticketNum)
            const isExpanded = expandedTickets.has(ticketNum)

            if (ticketQuestions.length === 0) return null

            return (
              <motion.div
                key={ticketNum}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className={`overflow-hidden transition-all ${isExpanded ? 'border-cyan-500/50' : 'border-slate-800'}`}>
                  {/* Ticket Header */}
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
                    onClick={() => toggleTicket(ticketNum)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                        <span className="text-xl font-bold text-white">{ticketNum}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Bilet #{ticketNum}</h3>
                        <p className="text-xs text-slate-400">{ticketQuestions.length} sual</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    </motion.div>
                  </div>

                  {/* Ticket Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-slate-800 p-4 space-y-4">
                          {ticketQuestions.map((q, qIdx) => (
                            <div 
                              key={q.id}
                              className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 space-y-3"
                            >
                              {/* Question Number & Toggle */}
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-mono text-cyan-500">
                                  Sual {qIdx + 1}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleAnswerHint(q.id)
                                  }}
                                  className="gap-1 text-xs h-7"
                                >
                                  {showAnswerHints[q.id] ? (
                                    <>
                                      <EyeOff className="w-3 h-3" /> Sualı Gizlə
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-3 h-3" /> Sualı Göstər
                                    </>
                                  )}
                                </Button>
                              </div>

                              {/* Show Question if toggled */}
                              <AnimatePresence>
                                {showAnswerHints[q.id] && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 mb-2">
                                      <p className="text-sm text-slate-300 font-medium">
                                        {q.question}
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Keywords */}
                              <div className="flex flex-wrap gap-2">
                                {q.keywords?.map((kw, kwIdx) => (
                                  <motion.span
                                    key={kwIdx}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: kwIdx * 0.1 }}
                                    className="px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-sm font-medium text-cyan-300"
                                  >
                                    {kw}
                                  </motion.span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            )
          })}
        </div>
      ) : (
        // All Questions View
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.5) }}
            >
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-sm font-bold text-cyan-400">
                        {idx + 1}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        Bilet {Math.floor(idx / QUESTIONS_PER_TICKET) + 1} / Sual {(idx % QUESTIONS_PER_TICKET) + 1}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAnswerHint(q.id)}
                      className="gap-1 text-xs h-7"
                    >
                      {showAnswerHints[q.id] ? (
                        <>
                          <EyeOff className="w-3 h-3" /> Gizlə
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" /> Sual
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Question (if shown) */}
                  <AnimatePresence>
                    {showAnswerHints[q.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                          <p className="text-sm text-slate-300 font-medium">
                            {q.question}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-2">
                    {q.keywords?.map((kw, kwIdx) => (
                      <span
                        key={kwIdx}
                        className="px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-sm font-medium text-cyan-300"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {filteredQuestions.length === 0 && (
        <Card className="p-8 text-center bg-slate-900/50 border-slate-800">
          <Key className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-400">Açar Söz Tapılmadı</h3>
          <p className="text-sm text-slate-500 mt-2">
            Bu kateqoriyada açar sözü olan sual yoxdur.
          </p>
        </Card>
      )}
    </div>
  )
}
