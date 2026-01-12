
"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Search, Filter, BookOpen, Layers, CheckCircle2, FlaskConical, ChevronDown, ChevronUp } from "lucide-react"
import { getAllQuestions, Question } from "@/lib/questions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function BankCard({ q }: { q: Question }) {
    const [showVariants, setShowVariants] = useState(false)

    return (
        <Card className="h-full flex flex-col hover:border-primary/50 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                {q.type === 'mcq' ? <FlaskConical className="w-12 h-12" /> : <Layers className="w-12 h-12" />}
            </div>
            
            <CardHeader className="pb-3">
            <div className="flex justify-between items-start gap-2">
                <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider mb-2 line-clamp-1">
                    {q.category}
                </Badge>
                {/* ID-ni sildik */}
            </div>
            <CardTitle className="text-base leading-snug font-medium">
                {q.question}
            </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <div className="pt-4 border-t border-slate-800/50 mt-auto">
                    {/* Əgər MCQ-dirsə və variantlar gizlidirsə, flashcard kimi davranır */}
                    {q.type === 'mcq' && q.options ? (
                        <div className="space-y-3">
                             {/* Doğru cavab həmişə görünür */}
                            <div className="p-3 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-medium">
                                <span className="mr-2">✓</span> {q.answer}
                            </div>

                            {/* Digər variantlar üçün toggle */}
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full text-xs text-muted-foreground h-auto py-1"
                                onClick={() => setShowVariants(!showVariants)}
                            >
                                {showVariants ? (
                                    <div className="flex items-center gap-1">
                                        <ChevronUp className="w-3 h-3" /> Variantları gizlət
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1">
                                        <ChevronDown className="w-3 h-3" /> Digər variantları göstər
                                    </div>
                                )}
                            </Button>

                             {/* Gizli variantlar */}
                             {showVariants && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="grid grid-cols-1 gap-1"
                                >
                                    {q.options.filter(opt => opt !== q.answer).map((opt, i) => (
                                         <div key={i} className="text-xs p-2 rounded bg-slate-900/40 text-slate-500">
                                            {opt}
                                         </div>
                                    ))}
                                </motion.div>
                             )}
                        </div>
                    ) : (
                         <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                            {q.answer}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default function BankPage() {
  const router = useRouter()
  const allQuestions = useMemo(() => getAllQuestions(), [])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Extract unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(allQuestions.map(q => q.category))).sort()
  }, [allQuestions])

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      const matchesSearch = 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory ? q.category === selectedCategory : true

      return matchesSearch && matchesCategory
    })
  }, [allQuestions, searchQuery, selectedCategory])

  return (
    <main className="min-h-screen bg-background text-foreground p-6 pt-8 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.push("/")} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Sual Bankı</h1>
              <p className="text-muted-foreground">Bütün sualları axtarın və nəzərdən keçirin</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800 text-sm font-medium">
             <BookOpen className="w-4 h-4 text-primary" />
             <span>{filteredQuestions.length} sual</span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="sticky top-4 z-30 bg-background/80 backdrop-blur-md p-4 rounded-xl border border-slate-800 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Sual və ya cavab üzrə axtarış..." 
                className="pl-9 bg-slate-900/50 border-slate-700 focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
            <Badge 
               variant={selectedCategory === null ? "default" : "outline"}
               className="cursor-pointer whitespace-nowrap px-4 py-1.5 text-sm hover:bg-primary/90 transition-colors"
               onClick={() => setSelectedCategory(null)}
            >
              Hamısı
            </Badge>
            {categories.map(cat => (
              <Badge 
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap px-4 py-1.5 text-sm hover:bg-primary/90 transition-colors data-[state=active]:bg-primary"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.length === 0 ? (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg">Heç nə tapılmadı</p>
            </div>
          ) : (
             filteredQuestions.map((q) => (
              <motion.div 
                key={q.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                layoutId={String(q.id)}
              >
                 <BankCard q={q} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
