'use client'
import { useState, useEffect, useRef } from 'react'

export function CodeChip({ code, defaultConfidence, variant }: {
  code: string
  defaultConfidence: string
  variant: 'blue' | 'purple'
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const parts = code.split(':')
  const codeNum = parts[0]?.trim()
  const description = parts[1]?.trim() ?? 'No description'
  const confidence = parts[2]?.trim() ?? defaultConfidence

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const chip = variant === 'blue'
    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
  const pct = variant === 'blue' ? 'text-blue-400' : 'text-purple-400'

  return (
    <div ref={ref} className='relative'>
      <span
        onClick={() => setOpen(o => !o)}
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium cursor-pointer ${chip}`}
      >
        {codeNum}
        <span className={`text-[10px] ${pct}`}>{confidence}%</span>
      </span>
      {open && (
        <div className='absolute bottom-full left-0 mb-1 z-50 w-52 rounded-lg bg-gray-900 text-white text-xs p-3 shadow-xl border border-gray-700'>
          <p className='font-semibold'>{codeNum}</p>
          <p className='text-gray-300 mt-1 leading-relaxed'>{description}</p>
          <p className='text-gray-400 mt-1'>Confidence: {confidence}%</p>
        </div>
      )}
    </div>
  )
}