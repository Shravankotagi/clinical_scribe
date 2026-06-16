'use client'

interface CodeChipProps {
  code: string
  defaultConfidence?: string
  variant: 'blue' | 'purple'
}

export function CodeChip({ code, defaultConfidence = '90', variant }: CodeChipProps) {
  const parts = code.split(':')
  const codeNum = parts[0]?.trim()
  const description = parts[1]?.trim() ?? 'No description available'
  const confidence = parts[2]?.trim() ?? defaultConfidence

  const colors = variant === 'blue'
    ? { chip: 'bg-blue-100 text-blue-700 hover:bg-blue-200', pct: 'text-blue-400' }
    : { chip: 'bg-purple-100 text-purple-700 hover:bg-purple-200', pct: 'text-purple-400' }

  return (
    <div className='relative group'>
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium cursor-pointer ${colors.chip}`}>
        {codeNum}
        <span className={`text-[10px] ${colors.pct}`}>{confidence}%</span>
      </span>
      <div className='absolute top-full left-0 mt-1 z-[999] w-52 rounded-lg bg-gray-900 text-white text-xs p-3 shadow-xl border border-gray-700 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150'>
        <p className='font-semibold'>{codeNum}</p>
        <p className='text-gray-300 mt-1 leading-relaxed'>{description}</p>
        <p className='text-gray-400 mt-1'>Confidence: {confidence}%</p>
      </div>
    </div>
  )
}