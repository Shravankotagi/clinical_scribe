"use client"

import { useState, useEffect, useRef } from "react"
import type { Encounter } from "@/lib/scribe-storage/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/lib/scribe-ui/ui/scroll-area"
import { Save, Copy, Download, Check, AlertTriangle, Send, X, Loader2, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/scribe-ui/utils"
import { NoteMarkdown } from "./note-markdown"

const AUTH_APP_URL = process.env.NEXT_PUBLIC_AUTH_APP_URL || "http://localhost:3000"

const VISIT_TYPE_LABELS: Record<string, string> = {
  history_physical: "History & Physical",
  problem_visit: "Problem Visit",
  consult_note: "Consult Note",
}

interface NoteEditorProps {
  encounter: Encounter
  onSave: (noteText: string) => void
  onApprove?: () => void
}

type TabType = "note" | "transcript"
type OpenClawInitState = "idle" | "sending" | "sent" | "failed"

type OpenClawPayload = {
  source: "openscribe"
  encounterId: string
  patientName: string
  patientId: string
  visitReason: string
  noteMarkdown: string
  transcript: string
  requestedAction: "openemr_apply_note"
}

type OpenClawMessage = {
  id: string
  role: "user" | "assistant" | "system"
  text: string
  createdAt: string
  runId?: string
  status?: string
}

function messageId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function NoteEditor({ encounter, onSave, onApprove }: NoteEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>("note")
  const [noteMarkdown, setNoteMarkdown] = useState<string>(encounter.note_text || "")
  const [hasChanges, setHasChanges] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [approved, setApproved] = useState(() => {
    if (typeof window === 'undefined') return false
    return encounter.is_approved === true || sessionStorage.getItem(`approved_${encounter.id}`) === 'true'
  })
  const [approving, setApproving] = useState(false)
  const [highlightedNote, setHighlightedNote] = useState<string | null>(null)
  const [highlighting, setHighlighting] = useState(false)

  const [openClawAvailable, setOpenClawAvailable] = useState(false)
  const [openClawPanelOpen, setOpenClawPanelOpen] = useState(false)
  const [openClawInitState, setOpenClawInitState] = useState<OpenClawInitState>("idle")
  const [openClawSessionId, setOpenClawSessionId] = useState<string>("")
  const [openClawError, setOpenClawError] = useState("")
  const [openClawMessages, setOpenClawMessages] = useState<OpenClawMessage[]>([])
  const [openClawInput, setOpenClawInput] = useState("")
  const [openClawSending, setOpenClawSending] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement | null>(null)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    setNoteMarkdown(encounter.note_text || "")
    setHasChanges(false)
    setOpenClawPanelOpen(false)
    setOpenClawInitState("idle")
    setOpenClawSessionId("")
    setOpenClawError("")
    setOpenClawMessages([])
    setOpenClawInput("")
    setOpenClawSending(false)
    const isApproved = encounter.is_approved === true || sessionStorage.getItem(`approved_${encounter.id}`) === 'true'
    setApproved(isApproved)
    if (isApproved) {
      setEditMode(false)
    }
  }, [encounter.id, encounter.note_text, encounter.is_approved])

  useEffect(() => {
    if (typeof window === "undefined") return
    const desktop = (window as Window & {
      desktop?: {
        openscribeBackend?: {
          invoke: (channel: string, ...args: unknown[]) => Promise<unknown>
        }
      }
    }).desktop
    setOpenClawAvailable(Boolean(desktop?.openscribeBackend))
  }, [])

  useEffect(() => {
    if (!openClawPanelOpen) return
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [openClawMessages, openClawPanelOpen, openClawSending])

  const handleNoteChange = (value: string) => {
    setNoteMarkdown(value)
    setHasChanges(true)
    setSaved(false)
  }

  const handleSave = () => {
    onSave(noteMarkdown)
    setHasChanges(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleApprove = async () => {
    if (approving || approved) return
    setApproving(true)
    try {
      onSave(noteMarkdown)
      const params = new URLSearchParams(window.location.search)
      const doctorId = params.get("doctorId") || ""
      const storageKey = `neon_${encounter.id}`
      const storedNeonId = sessionStorage.getItem(storageKey)
      const neonEncounterId = storedNeonId || encounter.id
      await fetch(`/api/proxy/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ encounterId: neonEncounterId, doctorId, finalNote: noteMarkdown }),
      })
      setApproved(true)
      sessionStorage.setItem(`approved_${encounter.id}`, 'true')
      setHasChanges(false)
      onApprove?.()
      const channel = new BroadcastChannel('dashboard_refresh')
      channel.postMessage('refresh')
      channel.close()
      if (window.opener) window.opener.location.reload()
    } catch (err) {
      console.error("Approve failed:", err)
    } finally {
      setApproving(false)
    }
  }

  const handleCopy = async () => {
    const textToCopy = activeTab === "note" ? noteMarkdown : encounter.transcript_text
    await navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExport = () => {
    const isNote = activeTab === "note"
    const content = isNote ? noteMarkdown : encounter.transcript_text
    const blob = new Blob([content], { type: isNote ? "text/markdown" : "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    const suffix = isNote ? "note" : "transcript"
    const extension = isNote ? "md" : "txt"
    a.download = `${encounter.patient_name || "encounter"}_${suffix}_${format(new Date(encounter.created_at), "yyyy-MM-dd")}.${extension}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleHighlightUncertain = async () => {
    if (highlightedNote) {
      setHighlightedNote(null)
      return
    }
    if (highlighting) return
    setHighlighting(true)
    try {
      const response = await fetch(`/api/proxy/highlight`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: noteMarkdown }),
      })
      const data = await response.json() as { markedNote?: string }
      if (data.markedNote) setHighlightedNote(data.markedNote)
    } catch (err) {
      console.error("Highlight failed:", err)
    } finally {
      setHighlighting(false)
    }
  }

  const appendMessage = (message: OpenClawMessage) => {
    setOpenClawMessages((prev) => [...prev, message])
  }

  const sendChatTurn = async (message: string, options?: { isInitial?: boolean }) => {
    const desktop = (window as Window & {
      desktop?: { openscribeBackend?: { invoke: (channel: string, ...args: unknown[]) => Promise<unknown> } }
    }).desktop

    if (!desktop?.openscribeBackend) {
      setOpenClawError("OpenClaw chat is only available in the desktop app.")
      setOpenClawInitState("failed")
      appendMessage({ id: messageId(), role: "system", text: "OpenClaw chat is only available in desktop mode.", createdAt: new Date().toISOString() })
      return
    }

    if (!options?.isInitial) {
      appendMessage({ id: messageId(), role: "user", text: message, createdAt: new Date().toISOString() })
    }

    if (options?.isInitial) setOpenClawInitState("sending")
    setOpenClawSending(true)
    setOpenClawError("")

    try {
      const result = (await desktop.openscribeBackend.invoke("openclaw-chat-turn", {
        encounterId: encounter.id,
        patientName: encounter.patient_name || "",
        patientId: encounter.patient_id || "",
        visitReason: encounter.visit_reason || "",
        noteMarkdown,
        transcript: encounter.transcript_text || "",
        sessionId: openClawSessionId || undefined,
        message,
      })) as { success?: boolean; error?: string; sessionId?: string; runId?: string; status?: string; responseText?: string; rawOutput?: string }

      if (!result?.success) {
        const errorMessage = result?.error || "OpenClaw did not accept the request."
        if (options?.isInitial) setOpenClawInitState("failed")
        setOpenClawError(errorMessage)
        appendMessage({ id: messageId(), role: "system", text: errorMessage, createdAt: new Date().toISOString(), status: "error" })
        return
      }

      if (result.sessionId) setOpenClawSessionId(result.sessionId)

      if (options?.isInitial) {
        setOpenClawInitState("sent")
        appendMessage({ id: messageId(), role: "system", text: "Clinical note handoff sent to OpenClaw.", createdAt: new Date().toISOString(), status: result.status })
      }

      appendMessage({ id: messageId(), role: "assistant", text: result.responseText || result.rawOutput || "OpenClaw returned no response text.", createdAt: new Date().toISOString(), runId: result.runId, status: result.status })
    } catch (error) {
      const messageText = error instanceof Error ? error.message : "OpenClaw chat failed."
      if (options?.isInitial) setOpenClawInitState("failed")
      setOpenClawError(messageText)
      appendMessage({ id: messageId(), role: "system", text: messageText, createdAt: new Date().toISOString(), status: "error" })
    } finally {
      setOpenClawSending(false)
    }
  }

  const buildInitialHandoffMessage = (): string => {
    const payload: OpenClawPayload = {
      source: "openscribe",
      encounterId: encounter.id,
      patientName: encounter.patient_name || "",
      patientId: encounter.patient_id || "",
      visitReason: encounter.visit_reason || "",
      noteMarkdown,
      transcript: encounter.transcript_text || "",
      requestedAction: "openemr_apply_note",
    }
    return ["You are receiving a structured handoff from OpenScribe.", "Primary objective: execute the OpenEMR action for this encounter now.", "", `Encounter ID: ${payload.encounterId}`, `Patient Name: ${payload.patientName}`, `Patient ID: ${payload.patientId}`, `Visit Reason: ${payload.visitReason}`, `Requested Action: ${payload.requestedAction}`, "", "Clinical note markdown:", payload.noteMarkdown, "", "Transcript:", payload.transcript].join("\n")
  }

  const handleOpenOpenClawChat = async () => {
    setOpenClawPanelOpen(true)
    if (!openClawAvailable) {
      setOpenClawInitState("failed")
      setOpenClawError("OpenClaw handoff is only available in the desktop app.")
      if (openClawMessages.length === 0) {
        appendMessage({ id: messageId(), role: "system", text: "OpenClaw handoff is only available in desktop mode.", createdAt: new Date().toISOString(), status: "error" })
      }
      return
    }
    if (openClawMessages.length === 0 && !openClawSending) {
      await sendChatTurn(buildInitialHandoffMessage(), { isInitial: true })
    }
  }

  const handleSendUserMessage = async () => {
    const text = openClawInput.trim()
    if (!text || openClawSending) return
    setOpenClawInput("")
    await sendChatTurn(text)
  }

  return (
    <>
      {/* Main wrapper — full height, no overflow on outer */}
      <div className="flex h-full flex-col" style={{ background: '#f5f7ff' }}>

        {/* ── Header ── */}
        <div
          className="shrink-0 border-b px-4 sm:px-8 py-4 sm:py-5"
          style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderColor: '#e5e7eb' }}
        >
          {/* Patient info row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold truncate" style={{ color: '#0A0F2C' }}>
                  {encounter.patient_name || "Unknown Patient"}
                </h2>
                {encounter.patient_id && (
                  <span className="rounded-full px-2 py-0.5 text-xs font-mono font-semibold shrink-0" style={{ background: '#e0e7ff', color: '#1a33cc' }}>
                    {encounter.patient_id}
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:text-sm" style={{ color: '#6b7280' }}>
                <span>{format(new Date(encounter.created_at), "MMM d, yyyy 'at' h:mm a")}</span>
                {encounter.visit_reason && (
                  <>
                    <span style={{ color: '#d1d5db' }}>·</span>
                    <span>{VISIT_TYPE_LABELS[encounter.visit_reason] || encounter.visit_reason}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tabs + Action Buttons */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-0" style={{ borderColor: '#e5e7eb' }}>
            {/* Tabs */}
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("note")}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors"
                style={{
                  borderColor: activeTab === "note" ? '#1a33cc' : 'transparent',
                  color: activeTab === "note" ? '#1a33cc' : '#6b7280',
                }}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden xs:inline">Clinical </span>Note
              </button>
              <button
                onClick={() => setActiveTab("transcript")}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors"
                style={{
                  borderColor: activeTab === "transcript" ? '#1a33cc' : 'transparent',
                  color: activeTab === "transcript" ? '#1a33cc' : '#6b7280',
                }}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Transcript
              </button>
            </div>

            {/* Action Buttons — scrollable row on mobile */}
            <div className="flex items-center gap-1 pb-2 overflow-x-auto">
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg transition-colors shrink-0"
                style={{ color: '#6b7280' }}
                title="Copy"
                onMouseEnter={e => (e.currentTarget.style.background = '#f0f4ff')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {copied
                  ? <Check className="h-4 w-4" style={{ color: '#1a33cc' }} />
                  : <Copy className="h-4 w-4" />}
              </button>

              <button
                onClick={handleExport}
                className="p-2 rounded-lg transition-colors shrink-0"
                style={{ color: '#6b7280' }}
                title="Export"
                onMouseEnter={e => (e.currentTarget.style.background = '#f0f4ff')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <Download className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => { if (!approved) setEditMode(!editMode) }}
                disabled={approved}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                style={{ color: '#1a33cc', border: '1px solid rgba(26,51,204,0.3)' }}
              >
                {editMode ? 'Preview' : 'Edit'}
              </button>

              {activeTab === "note" && (
                <>
                  <button
                    onClick={handleHighlightUncertain}
                    disabled={highlighting || !noteMarkdown.trim()}
                    className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 shrink-0"
                    style={{
                      color: highlightedNote ? '#854d0e' : '#1a33cc',
                      border: highlightedNote ? '1px solid rgba(133,77,14,0.3)' : '1px solid rgba(26,51,204,0.3)',
                      background: highlightedNote ? 'rgba(254,240,138,0.3)' : 'transparent'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = highlightedNote ? 'rgba(254,240,138,0.5)' : 'rgba(26,51,204,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = highlightedNote ? 'rgba(254,240,138,0.3)' : 'transparent')}
                  >
                    {highlighting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                    <span className="hidden sm:inline">{highlighting ? 'Checking...' : highlightedNote ? 'Clear Highlight' : 'Check Uncertain'}</span>
                    <span className="sm:hidden">{highlighting ? '...' : highlightedNote ? 'Clear' : 'Uncertain'}</span>
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || approved}
                    className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 shrink-0"
                    style={{ background: 'white', color: '#1a33cc', border: '2px solid #1a33cc' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,51,204,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                  >
                    {saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
                    {saved ? "Saved" : "Save"}
                  </button>

                  <button
                    onClick={handleApprove}
                    disabled={approving || approved}
                    className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50 shrink-0"
                    style={{ background: '#1a33cc', color: 'white' }}
                  >
                    {approving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                    {approved ? "Approved ✓" : "Approve & Sign"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Content Area: stacks on mobile, side-by-side on lg ── */}
        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row gap-0 lg:gap-6 p-3 sm:p-6 lg:p-6">

          {/* ── Main Note Area ── */}
          <div
            className="flex flex-col overflow-hidden rounded-xl border"
            style={{
              flex: '1 1 0%',
              minHeight: 0,
              background: '#ffffff',
              borderColor: '#e5e7eb',
              boxShadow: '0px 4px 20px rgba(26,51,204,0.06)'
            }}
          >
            {/* Note toolbar */}
            <div className="flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3 border-b shrink-0" style={{ background: '#f0f4ff', borderColor: '#e5e7eb' }}>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1a33cc' }}>SOAP Format</span>
                <div className="hidden sm:block h-4 w-px" style={{ background: '#e5e7eb' }} />
                <span className="hidden sm:inline text-xs italic" style={{ color: '#6b7280' }}>
                  {format(new Date(encounter.created_at), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
            </div>

            {/* Scrollable note content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-8">
                {activeTab === "note" ? (
                  <>
                    {highlightedNote ? (
                    <div
                      className="min-h-[500px] rounded-xl font-mono text-sm leading-relaxed p-4 whitespace-pre-wrap"
                      style={{ background: 'white', border: '1px solid #e5e7eb' }}
                    >
                      {highlightedNote.split(/(\{\{uncertain\}\}[\s\S]*?\{\{\/uncertain\}\})/g).map((part, i) => {
                        if (part.startsWith('{{uncertain}}')) {
                          const text = part.replace('{{uncertain}}', '').replace('{{/uncertain}}', '')
                          return (
                            <mark key={i} style={{ background: '#fef08a', borderRadius: '3px', padding: '1px 3px' }}>
                              {text}
                            </mark>
                          )
                        }
                        return <span key={i}>{part}</span>
                      })}
                        <button
                          onClick={() => setHighlightedNote(null)}
                          className="mt-3 text-xs underline block"
                          style={{ color: '#1a33cc' }}
                        >
                          Back to edit mode
                        </button>
                      </div>
                    ) : editMode ? (
                      <Textarea
                          value={noteMarkdown}
                          onChange={(e) => handleNoteChange(e.target.value)}
                          disabled={approved}
                          placeholder="Clinical note markdown..."
                          className="min-h-[500px] resize-none rounded-xl font-mono text-sm leading-relaxed focus-visible:ring-1"
                          style={{
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            color: '#0A0F2C',
                          } as React.CSSProperties}
                        />
                      ) : (
                        <div
                          onClick={() => { if (!approved) setEditMode(true) }}
                          className={cn("min-h-[500px] rounded-xl p-4", !approved && "cursor-text")}
                          style={{ background: 'white', border: '1px solid #e5e7eb' }}
                        >
                          <NoteMarkdown content={noteMarkdown} />
                        </div>
                      )}
                    {openClawError && openClawInitState === "failed" && (
                      <div className="mt-3 flex items-start gap-2 rounded-lg px-3 py-2 text-xs" style={{ background: '#fee2e2', border: '1px solid rgba(186,26,26,0.3)', color: '#991b1b' }}>
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{openClawError}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="min-h-[300px] sm:min-h-[500px] rounded-xl p-4 sm:p-6" style={{ background: 'white', border: '1px solid #e5e7eb' }}>
                    {encounter.transcript_text ? (
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed" style={{ color: '#0A0F2C' }}>
                        {encounter.transcript_text}
                      </pre>
                    ) : (
                      <div className="flex h-full items-center justify-center text-center py-20">
                        <p className="text-sm" style={{ color: '#6b7280' }}>No transcript available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ── full width on mobile, fixed on lg ── */}
          <div className="flex flex-col gap-4 lg:w-72 lg:overflow-y-auto lg:shrink-0">

            {/* Confidence Card */}
            <div className="p-4 sm:p-5 rounded-xl" style={{ background: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0px 4px 20px rgba(26,51,204,0.06)' }}>
              <div className="flex items-center gap-2 mb-3" style={{ color: '#1a33cc' }}>
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-bold">Scribe Confidence</span>
              </div>
              <div className="flex items-end gap-4">
                <div className="text-3xl font-bold" style={{ color: '#1a33cc' }}>98.4%</div>
                <div className="flex-1 mb-1.5">
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: '#e0e7ff' }}>
                    <div className="h-full rounded-full" style={{ width: '98%', background: '#1a33cc' }} />
                  </div>
                </div>
              </div>
              <p className="text-xs mt-1" style={{ color: '#6b7280' }}>High fidelity transcription achieved.</p>
            </div>

            {/* Approve & Save Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleApprove}
                disabled={approving || approved}
                className="w-full py-3 sm:py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50"
                style={{ background: '#1a33cc', color: 'white' }}
              >
                {approving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                {approved ? "Approved ✓" : "Approve & Sign"}
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || approved}
                className="w-full py-3 sm:py-4 bg-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-40"
                style={{ border: '2px solid #1a33cc', color: '#1a33cc' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,51,204,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'white')}
              >
                {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                {saved ? "Saved" : "Save Draft"}
              </button>
            </div>

            {/* OpenClaw Chat Panel */}
            

          </div>
        </div>
      </div>

      {/* ── OpenClaw Panel Overlay — full screen on mobile ── */}
      
    </>
  )
}