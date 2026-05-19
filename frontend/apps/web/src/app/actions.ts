"use server"

import type { ClinicalNoteRequest } from "@note-core"
import { createClinicalNoteText } from "@note-core"
import { getAnthropicApiKey } from "@storage/server-api-keys"
import { writeAuditEntry } from "@storage/audit-log"

async function extractIcdCodes(note: string): Promise<string[]> {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY || ""
    if (!geminiApiKey) return []

    console.log("Calling Gemini for ICD extraction, key length:", geminiApiKey.length)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a medical coding assistant. Extract ICD-10 codes from the clinical note below.
Return ONLY a JSON array of objects with "code" and "description" fields. No explanation, no markdown, just the JSON array.
Example: [{"code":"J06.9","description":"Acute upper respiratory infection"},{"code":"Z00.00","description":"General adult medical exam"}]

Clinical Note:
${note}`
            }]
          }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 500 }
        }),
      }
    )

    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    console.log("Gemini ICD response:", JSON.stringify(data).slice(0, 300))
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]"
    const clean = text.replace(/```json|```/g, "").trim()
    const parsed = JSON.parse(clean) as Array<{ code: string; description: string }>
    return parsed.map(p => `${p.code}: ${p.description}`)
  } catch (err) {
    console.error("ICD extraction failed:", JSON.stringify(err))
    return []
  }
}

export async function generateClinicalNote(
  params: ClinicalNoteRequest & { doctorId?: string; transcript?: string; duration?: number }
): Promise<{ note: string; neonEncounterId?: string; icdCodes?: string[] }> {
  const apiKey = getAnthropicApiKey()

  try {
    await writeAuditEntry({
      event_type: "note.generation_started",
      success: true,
      metadata: {
        template: params.template || "default",
        transcript_length: params.transcript?.length || 0,
      },
    })

    const result = await createClinicalNoteText({ ...params, apiKey })

    await writeAuditEntry({
      event_type: "note.generated",
      success: true,
      metadata: {
        template: params.template || "default",
        note_length: result.length,
      },
    })

    // Extract ICD-10 codes from the generated note
    const icdCodes = await extractIcdCodes(result)

    let neonEncounterId: string | undefined

    if (params.doctorId && params.transcript) {
      try {
        console.log("Saving to DB, doctorId:", params.doctorId, "transcript length:", params.transcript?.length)
        const saveRes = await fetch("http://auth-app:3000/api/encounters/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doctorId: params.doctorId,
            transcript: params.transcript,
            note: result,
            duration: params.duration || 0,
            patientName: params.patient_name || "",
            icdCodes,
          }),
        })
        const saveData = await saveRes.json() as { encounterId?: string }
        neonEncounterId = saveData.encounterId
      } catch (saveError) {
        console.error("Failed to save encounter to DB:", saveError)
      }
    }

    return { note: result, neonEncounterId, icdCodes }
  } catch (error) {
    await writeAuditEntry({
      event_type: "note.generation_failed",
      success: false,
      error_message: error instanceof Error ? error.message : String(error),
      metadata: {
        template: params.template || "default",
      },
    })
    throw error
  }
}