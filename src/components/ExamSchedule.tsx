"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, FileText, PenTool } from "lucide-react"

interface Exam {
  id: string
  subject: string
  date: string
  type: "test" | "written"
  teacher: string
}

const exams: Exam[] = [
  {
    id: "1",
    subject: "Akademik yazı və etika",
    date: "2026-01-08", // Correcting assumed typo from 2025 to 2026 based on other dates
    type: "test",
    teacher: "Əhmədova Mətanət"
  },
  {
    id: "2",
    subject: "Mühəndis yaradıcılıq prinsipləri",
    date: "2026-01-14",
    type: "written",
    teacher: "Kərimov Tarıverdi"
  },
  {
    id: "3",
    subject: "Sənaye dizaynında fəaliyyət sahələri",
    date: "2026-01-19",
    type: "written",
    teacher: "Əliyev Şakir"
  },
  {
    id: "4",
    subject: "Erqonomika və texniki dizayn",
    date: "2026-01-23",
    type: "written",
    teacher: "Əliyev Şakir"
  },
  {
    id: "5",
    subject: "Sənaye dizaynında kompüter layihələndirilməsi-1",
    date: "2026-01-28",
    type: "written",
    teacher: "Hacıyev İmaş"
  }
]

export function ExamSchedule() {
  const calculateDaysLeft = (dateStr: string) => {
    const examDate = new Date(dateStr)
    const today = new Date()
    const diffTime = examDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <CalendarDays className="w-6 h-6 text-primary" />
        İmtahan Cədvəli
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => {
          const daysLeft = calculateDaysLeft(exam.date)
          const isUrgent = daysLeft >= 0 && daysLeft <= 3
          const isPast = daysLeft < 0

          return (
            <Card key={exam.id} className={`border-l-4 ${isUrgent ? 'border-l-red-500 animate-pulse' : 'border-l-primary'} ${isPast ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant={exam.type === 'test' ? 'default' : 'secondary'}>
                    {exam.type === 'test' ? 'Test (MCQ)' : 'Yazılı (Written)'}
                  </Badge>
                  {daysLeft >= 0 ? (
                    <span className={`text-xs font-mono font-bold ${isUrgent ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {daysLeft} gün qalıb
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-muted-foreground">Bartdı</span>
                  )}
                </div>
                <CardTitle className="text-lg leading-tight mt-2 min-h-[3rem]">
                  {exam.subject}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {new Date(exam.date).toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-2">
                  {exam.type === 'test' ? <PenTool className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  {exam.teacher}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
