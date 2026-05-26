"use client"

import { useState, useEffect, useRef } from "react"
import type { Encounter } from "@storage/types"
import { Button } from "@ui/lib/ui/button"
import { Textarea } from "@ui/lib/ui/textarea"
import { ScrollArea } from "@ui/lib/ui/scroll-area"
import { Save, Copy, Download, Check, AlertTriangle, Send, X, MessageSquare, Loader2, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@ui/lib/utils"

const AUTH_APP_URL = process.env.NEXT_PUBLIC_AUTH_APP_URL || "http://localhost:3000"

const VISIT_TYPE_LABELS: Record<string, string> = {
  history_physical: "History & Physical",
  problem_visit: "Problem Visit",
  consult_note: "Consult Note",
}

interface NoteEditorProps {
  encounter: Encounter
  onSave: (noteText: string) => void
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

export function NoteEditor({ encounter, onSave }: NoteEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>("note")
  const [noteMarkdown, setNoteMarkdown] = useState<string>(encounter.note_text || "")
  const [hasChanges, setHasChanges] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [approved, setApproved] = useState(false)
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
  }, [encounter.id, encounter.note_text])

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

  const handleHighlightUncertain = async () => {
    if (highlighting || highlightedNote) return
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
      setHasChanges(false)
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
      <div className="flex h-full flex-col" style={{ background: '#fff8f5' }}>

        {/* Header */}
        <div className="shrink-0 border-b px-8 py-5" style={{ background: 'rgba(255,248,245,0.8)', backdropFilter: 'blur(12px)', borderColor: '#d5c4ae' }}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold" style={{ color: '#1f1b17' }}>
                  {encounter.patient_name || "Unknown Patient"}
                </h2>
                {encounter.patient_id && (
                  <span className="rounded-full px-2 py-0.5 text-xs font-mono font-semibold" style={{ background: '#f0e6e0', color: '#514535' }}>
                    {encounter.patient_id}
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm" style={{ color: '#514535' }}>
                <span>{format(new Date(encounter.created_at), "MMM d, yyyy 'at' h:mm a")}</span>
                {encounter.visit_reason && (
                  <>
                    <span style={{ color: '#d5c4ae' }}>·</span>
                    <span>{VISIT_TYPE_LABELS[encounter.visit_reason] || encounter.visit_reason}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tabs + Action Buttons */}
          <div className="flex items-center justify-between border-b pb-0" style={{ borderColor: '#d5c4ae' }}>
            {/* Tabs */}
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("note")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors"
                style={{
                  borderColor: activeTab === "note" ? '#805600' : 'transparent',
                  color: activeTab === "note" ? '#805600' : '#514535',
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Clinical Note
              </button>
              <button
                onClick={() => setActiveTab("transcript")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors"
                style={{
                  borderColor: activeTab === "transcript" ? '#805600' : 'transparent',
                  color: activeTab === "transcript" ? '#805600' : '#514535',
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Transcript
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 pb-2">
              {/* Copy */}
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg transition-colors"
                style={{ color: '#514535' }}
                title="Copy"
                onMouseEnter={e => (e.currentTarget.style.background = '#f0e6e0')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {copied
                  ? <Check className="h-4 w-4" style={{ color: '#805600' }} />
                  : <Copy className="h-4 w-4" />}
              </button>

              {/* Export */}
              <button
                onClick={handleExport}
                className="p-2 rounded-lg transition-colors"
                style={{ color: '#514535' }}
                title="Export"
                onMouseEnter={e => (e.currentTarget.style.background = '#f0e6e0')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <Download className="h-4 w-4" />
              </button>

              {activeTab === "note" && (
                <>
                  {/* Send to OpenClaw */}
                  <button
                    onClick={handleOpenOpenClawChat}
                    disabled={!noteMarkdown.trim() || openClawInitState === "sending"}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                    style={{ color: '#514535', border: '1px solid #d5c4ae' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f0e6e0')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {openClawInitState === "sending" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : openClawInitState === "sent" ? <Check className="h-3.5 w-3.5" /> : <MessageSquare className="h-3.5 w-3.5" />}
                    {openClawInitState === "sending" ? "Opening..." : openClawInitState === "sent" ? "OpenClaw Chat" : "Send to OpenClaw"}
                  </button>

                  {/* Check Uncertain */}
                  <button
                    onClick={handleHighlightUncertain}
                    disabled={highlighting || !noteMarkdown.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                    style={{ color: '#805600', border: '1px solid rgba(128,86,0,0.3)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(128,86,0,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {highlighting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                    {highlightedNote ? 'Highlighted' : 'Check Uncertain'}
                  </button>

                  {/* Save */}
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40"
                    style={{ background: 'white', color: '#805600', border: '2px solid #805600' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(128,86,0,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                  >
                    {saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
                    {saved ? "Saved" : "Save"}
                  </button>

                  {/* Approve */}
                  <button
                    onClick={handleApprove}
                    disabled={approving || approved}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50"
                    style={{ background: approved ? '#805600' : '#805600', color: 'white' }}
                  >
                    {approving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                    {approved ? "Approved ✓" : "Approve & Sign"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Area - Split layout */}
        <div className="flex flex-1 overflow-hidden gap-6 p-6">

          {/* Main Note Area */}
          <div className="flex-1 flex flex-col overflow-hidden rounded-xl border" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', borderColor: 'rgba(213,196,174,0.3)', boxShadow: '0px 4px 20px rgba(128,86,0,0.05)' }}>
            {/* Note toolbar */}
            <div className="flex justify-between items-center px-4 py-3 border-b" style={{ background: 'rgba(252,242,235,0.5)', borderColor: 'rgba(213,196,174,0.2)' }}>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#805600' }}>SOAP Format</span>
                <div className="h-4 w-px" style={{ background: '#d5c4ae' }} />
                <span className="text-xs italic" style={{ color: '#514535' }}>
                  {format(new Date(encounter.created_at), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-8">
                {activeTab === "note" ? (
                  <>
                    {highlightedNote ? (
                      <div
                        className="min-h-[500px] rounded-xl font-mono text-sm leading-relaxed p-4 whitespace-pre-wrap"
                        style={{ background: 'white', border: '1px solid #d5c4ae' }}
                      >
                        {highlightedNote.split(/(\{\{uncertain\}\}.*?\{\{\/uncertain\}\})/gs).map((part, i) => {
                          if (part.startsWith('{{uncertain}}')) {
                            const text = part.replace('{{uncertain}}', '').replace('{{/uncertain}}', '')
                            return (
                              <mark key={i} style={{ background: 'rgba(255,221,176,0.4)', borderBottom: '2px dashed #805600', cursor: 'help' }}>
                                {text}
                              </mark>
                            )
                          }
                          return <span key={i}>{part}</span>
                        })}
                        <button
                          onClick={() => setHighlightedNote(null)}
                          className="mt-3 text-xs underline block"
                          style={{ color: '#514535' }}
                        >
                          Back to edit mode
                        </button>
                      </div>
                    ) : (
                      <Textarea
                        value={noteMarkdown}
                        onChange={(e) => handleNoteChange(e.target.value)}
                        placeholder="Clinical note markdown..."
                        className="min-h-[500px] resize-none rounded-xl font-mono text-sm leading-relaxed focus-visible:ring-1"
                        style={{
                          background: 'white',
                          border: '1px solid #d5c4ae',
                          color: '#1f1b17',
                          focusRing: '#805600',
                        } as React.CSSProperties}
                      />
                    )}
                    {openClawError && openClawInitState === "failed" && (
                      <div className="mt-3 flex items-start gap-2 rounded-lg px-3 py-2 text-xs" style={{ background: '#ffdad6', border: '1px solid rgba(186,26,26,0.3)', color: '#93000a' }}>
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{openClawError}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="min-h-[500px] rounded-xl p-6" style={{ background: 'white', border: '1px solid #d5c4ae' }}>
                    {encounter.transcript_text ? (
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed" style={{ color: '#1f1b17' }}>
                        {encounter.transcript_text}
                      </pre>
                    ) : (
                      <div className="flex h-full items-center justify-center text-center py-20">
                        <p className="text-sm" style={{ color: '#514535' }}>No transcript available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Sidebar */}
          <div className="w-72 flex flex-col gap-4 overflow-y-auto">

            {/* Confidence Card */}
            <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,1)', boxShadow: '0px 4px 20px rgba(128,86,0,0.05)' }}>
              <div className="flex items-center gap-2 mb-3" style={{ color: '#805600' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-bold">Scribe Confidence</span>
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#805600' }}>98.4%</div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: '#f0e6e0' }}>
                <div className="h-full rounded-full" style={{ width: '98%', background: '#ca8a04' }} />
              </div>
              <p className="text-xs mt-2" style={{ color: '#514535' }}>High fidelity transcription achieved.</p>
            </div>

            {/* Approve & Save Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleApprove}
                disabled={approving || approved}
                className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50"
                style={{ background: '#805600', color: 'white' }}
              >
                {approving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                {approved ? "Approved ✓" : "Approve & Sign"}
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="w-full py-4 bg-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-40"
                style={{ border: '2px solid #837562', color: '#805600' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(128,86,0,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'white')}
              >
                {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                {saved ? "Saved" : "Save Draft"}
              </button>
            </div>

            {/* OpenClaw Chat Panel */}
            <div className="flex-1 flex flex-col rounded-xl p-4 min-h-[280px]" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(213,196,174,0.3)', boxShadow: '0px 4px 20px rgba(128,86,0,0.05)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#805600' }}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm font-bold" style={{ color: '#805600' }}>OpenClaw Assistant</span>
              </div>

              <div className="flex-1 text-sm overflow-y-auto space-y-3 pr-1 mb-4" style={{ color: '#514535' }}>
                {openClawMessages.length === 0 ? (
                  <p className="text-xs italic" style={{ color: '#837562' }}>
                    Send to OpenClaw to start a clinical handoff session.
                  </p>
                ) : (
                  openClawMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "max-w-[90%] rounded-xl px-3 py-2 text-xs",
                        msg.role === "user" && "ml-auto text-white",
                        msg.role === "assistant" && "mr-auto",
                        msg.role === "system" && "mr-auto",
                      )}
                      style={{
                        background: msg.role === "user" ? '#805600' : msg.role === "assistant" ? '#f0e6e0' : '#ffddb0',
                        color: msg.role === "user" ? 'white' : '#1f1b17',
                        border: msg.role !== "user" ? '1px solid rgba(213,196,174,0.3)' : 'none',
                      }}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                      <div className="mt-1 text-[10px] opacity-70">
                        {format(new Date(msg.createdAt), "h:mm:ss a")}
                        {msg.status ? ` · ${msg.status}` : ""}
                      </div>
                    </div>
                  ))
                )}
                {openClawSending && (
                  <div className="mr-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs" style={{ background: '#f0e6e0', border: '1px solid rgba(213,196,174,0.3)', color: '#514535' }}>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Waiting for OpenClaw...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              <div className="relative">
                <input
                  value={openClawInput}
                  onChange={(e) => setOpenClawInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void handleSendUserMessage() } }}
                  placeholder="Ask OpenClaw..."
                  disabled={openClawSending || openClawInitState === "sending"}
                  className="w-full rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2"
                  style={{
                    background: 'white',
                    border: '1px solid #d5c4ae',
                    color: '#1f1b17',
                  }}
                />
                <button
                  onClick={handleSendUserMessage}
                  disabled={!openClawInput.trim() || openClawSending}
                  className="absolute right-3 top-3 disabled:opacity-40"
                  style={{ color: '#805600' }}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* OpenClaw Panel Overlay */}
      {openClawPanelOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setOpenClawPanelOpen(false)} />
          <aside className="fixed right-0 top-0 z-50 h-screen w-[440px] shadow-2xl" style={{ background: '#fff8f5', borderLeft: '1px solid #d5c4ae' }}>
            <div className="flex h-full flex-col">
              <div className="px-4 py-3 border-b" style={{ borderColor: '#d5c4ae' }}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#1f1b17' }}>OpenClaw Chat</p>
                    <p className="text-xs" style={{ color: '#514535' }}>
                      {openClawSessionId ? `Session: ${openClawSessionId}` : "Preparing session..."}
                    </p>
                  </div>
                  <button
                    onClick={() => setOpenClawPanelOpen(false)}
                    className="p-1 rounded-full transition-colors"
                    style={{ color: '#514535' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f0e6e0')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {openClawMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn("max-w-[90%] rounded-xl px-3 py-2 text-xs", msg.role === "user" && "ml-auto")}
                    style={{
                      background: msg.role === "user" ? '#805600' : msg.role === "assistant" ? '#f0e6e0' : '#ffddb0',
                      color: msg.role === "user" ? 'white' : '#1f1b17',
                      border: msg.role !== "user" ? '1px solid rgba(213,196,174,0.3)' : 'none',
                    }}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                    <div className="mt-1 text-[10px] opacity-70">
                      {format(new Date(msg.createdAt), "h:mm:ss a")}
                      {msg.runId ? ` · run ${msg.runId}` : ""}
                      {msg.status ? ` · ${msg.status}` : ""}
                    </div>
                  </div>
                ))}
                {openClawSending && (
                  <div className="mr-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs" style={{ background: '#f0e6e0', border: '1px solid rgba(213,196,174,0.3)', color: '#514535' }}>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Waiting for OpenClaw...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              <div className="border-t p-3" style={{ borderColor: '#d5c4ae' }}>
                <div className="flex items-end gap-2">
                  <Textarea
                    value={openClawInput}
                    onChange={(e) => setOpenClawInput(e.target.value)}
                    placeholder="Message OpenClaw..."
                    className="min-h-[44px] max-h-[140px] resize-y rounded-xl text-sm"
                    style={{ background: 'white', border: '1px solid #d5c4ae', color: '#1f1b17' }}
                    disabled={openClawSending || openClawInitState === "sending"}
                  />
                  <Button
                    size="sm"
                    onClick={handleSendUserMessage}
                    disabled={!openClawInput.trim() || openClawSending || openClawInitState === "sending"}
                    className="h-10 rounded-full px-3"
                    style={{ background: '#805600', color: 'white' }}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  )
}