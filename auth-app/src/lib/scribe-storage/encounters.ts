import type { Encounter } from "./types"
import { loadSecureItem, saveSecureItem } from "./secure-storage"

const STORAGE_KEY = "openscribe_encounters"

export function generateId(): string {
  return crypto.randomUUID()
}

export async function getEncounters(): Promise<Encounter[]> {
  if (typeof window === "undefined") return []
  const encounters = await loadSecureItem<Encounter[]>(STORAGE_KEY)
  if (!encounters) return []
  return encounters
}

export async function saveEncounters(encounters: Encounter[]): Promise<void> {
  if (typeof window === "undefined") return
  // Remove audio blobs before saving (can't serialize Blob to JSON)
  const sanitized = encounters.map((e) => ({ ...e, audio_blob: undefined }))
  await saveSecureItem(STORAGE_KEY, sanitized)
}

export async function bulkMergeEncounters(newEncounters: Encounter[]): Promise<Encounter[]> {
  const existing = await getEncounters()
  const existingMap = new Map(existing.map(e => [e.id, e]))
  
  newEncounters.forEach(newEnc => {
    const ext = existingMap.get(newEnc.id)
    if (ext) {
      existingMap.set(newEnc.id, {
        ...ext,
        ...newEnc,
        audio_blob: ext.audio_blob || newEnc.audio_blob,
      })
    } else {
      existingMap.set(newEnc.id, newEnc)
    }
  })
  
  const merged = Array.from(existingMap.values())
  await saveEncounters(merged)
  return merged
}

export function createEncounter(data: Partial<Encounter>): Encounter {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    patient_name: data.patient_name || "",
    patient_id: data.patient_id || "",
    visit_reason: data.visit_reason || "",
    session_id: data.session_id,
    created_at: now,
    updated_at: now,
    transcript_text: "",
    note_text: "",
    status: "idle",
    language: "en",
    ...data,
  }
}

export function updateEncounter(encounters: Encounter[], id: string, updates: Partial<Encounter>): Encounter[] {
  return encounters.map((e) => (e.id === id ? { ...e, ...updates, updated_at: new Date().toISOString() } : e))
}

export function deleteEncounter(encounters: Encounter[], id: string): Encounter[] {
  return encounters.filter((e) => e.id !== id)
}
