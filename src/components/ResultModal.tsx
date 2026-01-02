"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Target, Star, Sparkles, X, RotateCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ResultModalProps {
  isOpen: boolean
  correctCount: number
  totalCount: number
  onClose: () => void
  onPlayAgain: () => void
}

export function ResultModal({ isOpen, correctCount, totalCount, onClose, onPlayAgain }: ResultModalProps) {
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0
  
  // Determine performance level
  const getPerformanceData = () => {
    if (percentage >= 90) {
      return {
        title: "Əla Nəticə!",
        subtitle: "Sən mükəmməlsən! 🎉",
        color: "from-yellow-400 via-amber-500 to-orange-500",
        icon: Trophy,
        bgGlow: "bg-yellow-500/20"
      }
    } else if (percentage >= 70) {
      return {
        title: "Yaxşı İş!",
        subtitle: "Davam et! 💪",
        color: "from-green-400 via-emerald-500 to-teal-500",
        icon: Star,
        bgGlow: "bg-green-500/20"
      }
    } else if (percentage >= 50) {
      return {
        title: "Pis Deyil!",
        subtitle: "Bir az da çalış! 📚",
        color: "from-blue-400 via-cyan-500 to-teal-500",
        icon: Target,
        bgGlow: "bg-blue-500/20"
      }
    } else {
      return {
        title: "Davam Et!",
        subtitle: "Məşq mükəmməlləşdirir! 🌟",
        color: "from-purple-400 via-pink-500 to-rose-500",
        icon: Sparkles,
        bgGlow: "bg-purple-500/20"
      }
    }
  }

  const performance = getPerformanceData()
  const IconComponent = performance.icon

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md"
          >
            {/* Glow Effect */}
            <div className={`absolute -inset-4 ${performance.bgGlow} rounded-3xl blur-2xl opacity-50`} />
            
            {/* Card */}
            <div className="relative bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header Gradient */}
              <div className={`h-2 bg-gradient-to-r ${performance.color}`} />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>

              {/* Content */}
              <div className="p-8 text-center space-y-6">
                {/* Icon */}
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className={`inline-flex p-5 rounded-full bg-gradient-to-br ${performance.color}`}
                >
                  <IconComponent className="w-10 h-10 text-white" />
                </motion.div>

                {/* Title */}
                <div className="space-y-1">
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`text-3xl font-black bg-gradient-to-r ${performance.color} bg-clip-text text-transparent`}
                  >
                    {performance.title}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-400"
                  >
                    {performance.subtitle}
                  </motion.p>
                </div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  {/* Percentage Circle */}
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-32 h-32 transform -rotate-90">
                      {/* Background Circle */}
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-slate-800"
                      />
                      {/* Progress Circle */}
                      <motion.circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0 352" }}
                        animate={{ strokeDasharray: `${(percentage / 100) * 352} 352` }}
                        transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-4xl font-black text-white"
                      >
                        {percentage}%
                      </motion.span>
                    </div>
                  </div>

                  {/* Score Details */}
                  <div className="flex justify-center gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{correctCount}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide">Düzgün</div>
                    </div>
                    <div className="w-px bg-slate-700" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-400">{totalCount}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide">Ümumi</div>
                    </div>
                    <div className="w-px bg-slate-700" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">{totalCount - correctCount}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide">Səhv</div>
                    </div>
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex gap-3 pt-4"
                >
                  <Button
                    variant="outline"
                    className="flex-1 h-12 border-slate-700 hover:bg-slate-800"
                    onClick={onClose}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Ana Səhifə
                  </Button>
                  <Button
                    className={`flex-1 h-12 bg-gradient-to-r ${performance.color} hover:opacity-90 text-white font-bold`}
                    onClick={onPlayAgain}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Yenidən
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
