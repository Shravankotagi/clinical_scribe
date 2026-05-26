"use client"

import type { Encounter } from "@storage/types"
import { cn } from "@ui/lib/utils"
import { Input } from "@ui/lib/ui/input"
import { ScrollArea } from "@ui/lib/ui/scroll-area"
import { Search, FileText, Clock, Trash2 } from "lucide-react"
import { useState, useMemo } from "react"
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
    <div className="flex h-full min-h-0 flex-col" style={{ background: '#342f2b', color: '#f9efe8' }}>

      {/* Branding */}
      <div className="px-6 py-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#805600' }}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white">OpenScribe</span>
        </div>

        {/* New Encounter Button */}
        <button
          onClick={onNewEncounter}
          disabled={disabled}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm shadow-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:pointer-events-none"
          style={{ background: '#866c39', color: 'white' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Encounter
        </button>
      </div>

      {/* Encounters Section */}
      <div className="px-4 pb-3">
        <p className="px-2 mb-3 text-[10px] uppercase tracking-widest font-bold" style={{ color: '#d5c4ae' }}>
          Encounters
        </p>
      </div>

      {/* Encounter List */}
      <ScrollArea className="flex-1 min-h-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <FileText className="mb-3 h-8 w-8" style={{ color: 'rgba(249,239,232,0.3)' }} />
            <p className="text-sm" style={{ color: '#837562' }}>
              {encounters.length === 0 ? "No encounters yet" : "No matching encounters"}
            </p>
          </div>
        ) : (
          <div className="px-3 pb-3">
            {filtered.map((encounter) => (
              <div
                key={encounter.id}
                className={cn(
                  "relative mb-1 w-full rounded-lg p-3 text-left transition-colors cursor-pointer",
                  selectedId === encounter.id
                    ? "bg-white/10"
                    : "hover:bg-white/5"
                )}
              >
                <button
                  onClick={() => onSelect(encounter)}
                  disabled={disabled}
                  className="w-full text-left focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  <div className="pr-8">
                    <p className="truncate text-sm font-semibold text-white">
                      {encounter.patient_name || "Unknown patient"}
                    </p>
                    <p className="mt-0.5 truncate text-xs" style={{ color: '#d5c4ae' }}>
                      {VISIT_TYPE_LABELS[encounter.visit_reason] || encounter.visit_reason || "No reason specified"}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: '#837562' }}>
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
                    className="absolute right-3 top-3 rounded-md p-1 transition-colors hover:bg-white/10 disabled:pointer-events-none disabled:opacity-50"
                    style={{ color: 'rgba(249,239,232,0.5)' }}
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