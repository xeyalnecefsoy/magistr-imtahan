"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, FileText, PenTool, Brush } from "lucide-react"
import { cn } from "@/lib/utils"

type ExamType = "test" | "written" | "drawing"

interface Exam {
  id: string
  subject: string
  date: string
  type: ExamType
  teacher: string
}

const exams: Exam[] = [
  {
    id: "1",
    subject: "Layihələrin idarə olunması",
    date: "2026-06-08",
    type: "written",
    teacher: "Qarayev Maarif"
  },
  {
    id: "2",
    subject: "Təşkilati dizayn",
    date: "2026-06-12",
    type: "written",
    teacher: "Kərimov Hüsnü"
  },
  {
    id: "3",
    subject: "Sənaye dizaynında kompüter layihələndirilməsi-2",
    date: "2026-06-17",
    type: "drawing",
    teacher: "Mirzəyev Razil"
  },
  {
    id: "4",
    subject: "Bədii layihələndirmədə texniki rəsm",
    date: "2026-06-22",
    type: "drawing",
    teacher: "Əliyev Şakir"
  },
  {
    id: "5",
    subject: "İstehsal prosesinin texnoloji əsasları",
    date: "2026-06-26",
    type: "written",
    teacher: "Hacıyev Cahangir"
  }
]

const examTypeLabels: Record<ExamType, string> = {
  test: "Test (MCQ)",
  written: "Yazılı (Written)",
  drawing: "Rəsm (Drawing)"
}

const examTypeIcons: Record<ExamType, typeof PenTool> = {
  test: PenTool,
  written: FileText,
  drawing: Brush
}

const examTypeBadgeVariant: Record<ExamType, "default" | "secondary" | "outline"> = {
  test: "default",
  written: "secondary",
  drawing: "outline"
}

interface ExamScheduleProps {
  onExamClick?: (subject: string, type: ExamType) => void
}

export function ExamSchedule({ onExamClick }: ExamScheduleProps) {
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
          const TypeIcon = examTypeIcons[exam.type]

          return (
            <Card 
              key={exam.id} 
              className={cn(
                "border-l-4 transition-all hover:bg-slate-900/50 cursor-pointer overflow-hidden transform hover:scale-[1.02]",
                isUrgent ? 'border-l-red-500 animate-pulse' : 'border-l-primary',
                isPast ? 'opacity-60' : ''
              )}
              onClick={() => onExamClick?.(exam.subject, exam.type)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant={examTypeBadgeVariant[exam.type]}>
                    {examTypeLabels[exam.type]}
                  </Badge>
                  {daysLeft >= 0 ? (
                    <span className={cn("text-xs font-mono font-bold", isUrgent ? 'text-red-500' : 'text-muted-foreground')}>
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
                  <TypeIcon className="w-4 h-4" />
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
