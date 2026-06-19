"use client"

import { Cpu, Cloud } from "lucide-react"
import type { ProcessingMode } from "@/lib/scribe-storage/preferences"

interface ModelIndicatorProps {
  processingMode: ProcessingMode
}

export function ModelIndicator({ processingMode }: ModelIndicatorProps) {
  const noteModel = processingMode === "local" ? "Ollama (Local)" : "Claude (Cloud)"
  const NoteIcon = processingMode === "local" ? Cpu : Cloud

  return (
    <div className="shrink-0 px-4 py-3" style={{ borderTop: '1px solid #e5e7eb', background: 'white' }}>
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
        Models
      </p>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Cpu className="h-3.5 w-3.5 shrink-0 text-[#1a33cc]" />
          <span className="truncate">Whisper (Local)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <NoteIcon className="h-3.5 w-3.5 shrink-0 text-[#1a33cc]" />
          <span className="truncate">{noteModel}</span>
        </div>
      </div>
    </div>
  )
}