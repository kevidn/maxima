import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MarkdownRenderer({ content, className = '' }) {
  if (!content) return null

  return (
    <div className={`prose-pomelo text-xs sm:text-sm leading-relaxed text-stone-800 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-bold text-stone-950">{children}</strong>,
          em: ({ children }) => <em className="italic text-forest-900">{children}</em>,
          h1: ({ children }) => <h3 className="font-heading font-bold text-base sm:text-lg text-forest-900 mt-2.5 mb-1 pb-1 border-b border-stone-200">{children}</h3>,
          h2: ({ children }) => <h4 className="font-heading font-bold text-sm sm:text-base text-forest-900 mt-2 mb-1">{children}</h4>,
          h3: ({ children }) => <h5 className="font-heading font-bold text-xs sm:text-sm text-forest-800 mt-1.5 mb-0.5">{children}</h5>,
          ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-1.5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 my-1.5 font-medium">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          hr: () => <hr className="my-2.5 border-stone-200" />,
          code: ({ children }) => (
            <code className="bg-stone-100 text-forest-800 font-mono text-[11px] px-1.5 py-0.5 rounded border border-stone-200">
              {children}
            </code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-3 border-emerald-600 bg-emerald-50/50 pl-3 py-1 my-1.5 rounded-r-lg italic text-stone-700 text-xs">
              {children}
            </blockquote>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
