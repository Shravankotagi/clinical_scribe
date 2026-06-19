"use client"

import type { Encounter } from "@/lib/scribe-storage/types"
import { cn } from "@/lib/scribe-ui/utils"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/lib/scribe-ui/ui/scroll-area"
import { Search, FileText, Clock, Trash2 } from "lucide-react"
import { useState, useMemo, useRef, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"

const VISIT_TYPE_LABELS: Record<string, string> = {
  history_physical: "History & Physical",
  problem_visit: "Problem Visit",
  consult_note: "Consult Note",
}

interface EncounterListProps {
  encounters: Encounter[]
  selectedId: string | null
  onSelect: (encounter: Encounter) => void
  onNewEncounter: () => void
  onDeleteEncounter?: (id: string) => void | Promise<void>
  disabled?: boolean
}

export function EncounterList({
  encounters,
  selectedId,
  onSelect,
  onNewEncounter,
  onDeleteEncounter,
  disabled,
}: EncounterListProps) {
  const [search, setSearch] = useState("")
  const activeItemRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (selectedId) {
      const timer = setTimeout(() => {
        activeItemRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [selectedId])

  const filtered = useMemo(() => {
    if (!search.trim()) return encounters
    const q = search.toLowerCase()
    return encounters.filter(
      (e) =>
        e.patient_name.toLowerCase().includes(q) ||
        e.visit_reason.toLowerCase().includes(q) ||
        e.patient_id.toLowerCase().includes(q),
    )
  }, [encounters, search])

  return (
    <div className="flex h-full min-h-0 flex-col" style={{ background: 'white', color: '#1f2937' }}>

      {/* Branding */}
      <div className="px-6 py-6 flex flex-col gap-4">
        {/* Changed items-center to items-start for left alignment */}
        <a href="/dashboard" className="flex flex-col items-start gap-1 py-2">
          <img 
            src="https://enlightlab.com/wp-content/uploads/2023/03/Layer_1.png" 
            alt="Enlight Lab" 
            className="h-8 w-auto brightness-100"
          />
          {/* Added marginLeft: '34px' to match navigation headers and sidebars */}
          <span className="text-[11px] font-bold tracking-widest text-[#0A1F6B]" style={{ marginLeft: '34px' }}>
            CARESCRIBE AI
          </span>
        </a>

        {/* New Encounter Button */}
        <button
          onClick={onNewEncounter}
          disabled={disabled}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm shadow-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:pointer-events-none"
          style={{ background: '#1a33cc', color: 'white' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Encounter
        </button>
      </div>

      {/* Encounters Section */}
      <div className="px-4 pb-3">
        <p className="px-2 mb-3 text-[10px] uppercase tracking-widest font-bold" style={{ color: '#9ca3af' }}>
          Encounters
        </p>
      </div>

      {/* Encounter List */}
      <ScrollArea className="flex-1 min-h-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <FileText className="mb-3 h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-400">
              {encounters.length === 0 ? "No encounters yet" : "No matching encounters"}
            </p>
          </div>
        ) : (
          <div className="px-3 pb-3">
            {filtered.map((encounter) => (
              <div
                key={encounter.id}
                ref={selectedId === encounter.id ? activeItemRef : undefined}
                className={cn(
                  "relative mb-1 w-full rounded-lg p-3 text-left transition-colors cursor-pointer",
                  selectedId === encounter.id
                    ? "bg-[#f0f4ff]"
                    : "hover:bg-gray-50"
                )}
              >
                <button
                  onClick={() => onSelect(encounter)}
                  disabled={disabled}
                  className="w-full text-left focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  <div className="pr-8">
                    <p className={cn(
                      "truncate text-sm font-semibold",
                      selectedId === encounter.id ? "text-[#1a33cc]" : "text-gray-900"
                    )}>
                      {encounter.patient_name || "Unknown patient"}
                    </p>
                    <p className="mt-0.5 truncate text-xs" style={{ color: selectedId === encounter.id ? '#1a33ccb0' : '#6b7280' }}>
                      {VISIT_TYPE_LABELS[encounter.visit_reason] || encounter.visit_reason || "No reason specified"}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: selectedId === encounter.id ? '#1a33cca0' : '#9ca3af' }}>
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(encounter.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </button>

                {onDeleteEncounter && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      void onDeleteEncounter(encounter.id)
                    }}
                    disabled={disabled}
                    aria-label="Delete encounter"
                    className="absolute right-3 top-3 rounded-md p-1 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50"
                    style={{ color: selectedId === encounter.id ? '#1a33cca0' : '#9ca3af' }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}