"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface NoteMarkdownProps {
  content: string
}

export function NoteMarkdown({ content }: NoteMarkdownProps) {
  return (
    <div style={{ color: '#0A0F2C', fontSize: '0.875rem', lineHeight: 1.7 }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a33cc', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#1a33cc', marginTop: '1.25rem', marginBottom: '0.5rem' }}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0A0F2C', marginTop: '1rem', marginBottom: '0.5rem' }}>{children}</h3>
          ),
          p: ({ children }) => (
            <p style={{ marginBottom: '0.75rem' }}>{children}</p>
          ),
          ul: ({ children }) => (
            <ul style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem' }}>{children}</ul>
          ),
          li: ({ children }) => (
            <li style={{ marginBottom: '0.25rem' }}>{children}</li>
          ),
          strong: ({ children }) => (
            <strong style={{ fontWeight: 700, color: '#0A0F2C' }}>{children}</strong>
          ),
          hr: () => (
            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '1rem 0' }} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}