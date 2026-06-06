"use client"

import Markdown from "react-markdown"
import { ReactNode } from "react"

interface MarkdownTextProps {
  children: string
  className?: string
  size?: "sm" | "base" | "lg"
  theme?: "dark" | "light"
}

export function MarkdownText({ children, className = "", size = "base", theme = "dark" }: MarkdownTextProps) {
  const sizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg"
  }[size]

  const isDark = theme === "dark"
  const strongClass = isDark ? "font-bold text-emerald-400" : "font-bold text-amber-900"
  const emClass = isDark ? "italic text-amber-300" : "italic text-amber-700"
  const liBulletClass = isDark ? "text-emerald-400" : "text-amber-600"
  const codeBg = isDark ? "bg-slate-800 text-amber-300" : "bg-amber-100 text-amber-900"
  const blockquoteClass = isDark
    ? "border-l-2 border-emerald-500/50 pl-3 my-2 text-muted-foreground italic"
    : "border-l-2 border-amber-500/50 pl-3 my-2 text-slate-600 italic"
  const hrClass = isDark ? "my-3 border-slate-700" : "my-3 border-slate-300"
  const linkClass = isDark
    ? "text-blue-400 underline hover:text-blue-300"
    : "text-blue-700 underline hover:text-blue-600"
  const baseText = isDark ? "text-slate-100" : "text-slate-800"

  return (
    <div className={`markdown-content ${sizeClasses} ${baseText} ${className}`}>
      <Markdown
        components={{
          p: ({ children }: any) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
          strong: ({ children }: any) => <strong className={strongClass}>{children}</strong>,
          em: ({ children }: any) => <em className={emClass}>{children}</em>,
          ul: ({ children }: any) => <ul className="my-2 space-y-1.5 list-none pl-0">{children}</ul>,
          ol: ({ children }: any) => <ol className="my-2 space-y-1.5 list-decimal pl-6">{children}</ol>,
          li: ({ children }: any) => (
            <li className="leading-relaxed flex gap-2">
              <span className={`${liBulletClass} shrink-0 select-none`}>•</span>
              <span className="flex-1">{children}</span>
            </li>
          ),
          h1: ({ children }: any) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
          h2: ({ children }: any) => <h2 className="text-lg font-bold mt-3 mb-2">{children}</h2>,
          h3: ({ children }: any) => <h3 className="text-base font-bold mt-3 mb-2">{children}</h3>,
          h4: ({ children }: any) => <h4 className="text-base font-semibold mt-2 mb-1">{children}</h4>,
          code: ({ children }: any) => (
            <code className={`px-1.5 py-0.5 rounded text-sm font-mono ${codeBg}`}>
              {children}
            </code>
          ),
          blockquote: ({ children }: any) => (
            <blockquote className={blockquoteClass}>
              {children}
            </blockquote>
          ),
          hr: () => <hr className={hrClass} />,
          a: ({ href, children }: any) => (
            <a href={href} className={linkClass} target="_blank" rel="noreferrer">
              {children}
            </a>
          )
        }}
      >
        {children}
      </Markdown>
    </div>
  )
}

export function renderAnswerWithLineBreaks(text: string): ReactNode {
  return <MarkdownText>{text}</MarkdownText>
}
