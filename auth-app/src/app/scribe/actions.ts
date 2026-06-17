"use server"

import type { ClinicalNoteRequest } from "@/lib/note-core"
import { createClinicalNoteText } from "@/lib/note-core"
import { writeAuditEntry } from "@/lib/scribe-storage/audit-log"
import { getAnthropicApiKey } from "@/lib/scribe-storage/server-api-keys"
import prisma from "@/lib/prisma"
import { isAuthenticated } from '@/server/user'

async function extractIcdCodes(note: string): Promise<string[]> {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY || ""
    if (!geminiApiKey) return []

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a medical coding assistant. Extract ICD-10 codes from the clinical note below.
Return ONLY a JSON array of objects with "code", "description" and "confidence" fields. Confidence is a number 0-100. No explanation, no markdown, just the JSON array.
Example: [{"code":"J06.9","description":"Acute upper respiratory infection","confidence":95}]

Clinical Note:
${note}`
            }]
          }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1024 }
        }),
      }
    )

    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]"
    const clean = text.replace(/```json|```/g, "").trim()
    const lastBracket = clean.lastIndexOf('}')
    const safeJson = lastBracket > 0 ? clean.slice(0, lastBracket + 1) + ']' : '[]'
    const fixedJson = safeJson.startsWith('[') ? safeJson : '[' + safeJson
    const parsed = JSON.parse(fixedJson) as Array<{ code: string; description: string; confidence?: number }>
    return parsed.map(p => `${p.code}: ${p.description}: ${p.confidence ?? 90}`)
  } catch (err) {
    console.error("ICD extraction failed:", err)
    return []
  }
}

async function extractCptCodes(note: string): Promise<string[]> {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY || ""
    if (!geminiApiKey) return []

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a medical coding assistant. Suggest appropriate CPT billing codes based on the clinical note below.
Always suggest at least one office visit CPT code (99201-99215) based on complexity.
Keep descriptions very short (max 4 words).
Return ONLY a JSON array of objects with "code", "description" and "confidence" fields. Confidence is a number 0-100. No explanation, no markdown, just the JSON array.
Example: [{"code":"99213","description":"Office visit moderate","confidence":90}]

Clinical Note:
${note}`
            }]
          }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1024 }
        }),
      }
    )

    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]"
    const clean = text.replace(/```json|```/g, "").trim()
    const lastBrace = clean.lastIndexOf('}')
    const safeJson = lastBrace > 0 ? clean.slice(0, lastBrace + 1) + ']' : '[]'
    const fixedJson = safeJson.startsWith('[') ? safeJson : '[' + safeJson
    const parsed = JSON.parse(fixedJson) as Array<{ code: string; description: string; confidence?: number }>
    return parsed.map(p => `${p.code}: ${p.description}: ${p.confidence ?? 85}`)
  } catch (err) {
    console.error("CPT extraction failed:", err)
    return []
  }
}

export async function generateClinicalNote(
  params: ClinicalNoteRequest & { doctorId?: string; transcript?: string; duration?: number }
): Promise<{ note: string; neonEncounterId?: string; icdCodes?: string[]; cptCodes?: string[] }> {
  if (params.doctorId) {
    const session = await isAuthenticated()
    if (!session || session.user.id !== params.doctorId) {
      throw new Error('Unauthorized')
    }
  }
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

    const [icdCodes, cptCodes] = await Promise.all([
      extractIcdCodes(result),
      extractCptCodes(result),
    ])

    let neonEncounterId: string | undefined

    if (params.doctorId && params.transcript) {
      try {
        // Direct Prisma call — same app, no HTTP needed
        const encounter = await prisma.encounter.create({
          data: {
            doctorId: params.doctorId,
            patientName: params.patient_name || 'Unknown Patient',
            noteType: params.visit_reason || 'Problem Visit',
            duration: params.duration || 0,
            status: 'COMPLETED',
            transcript: {
              create: {
                content: params.transcript,
              },
            },
            clinicalNote: {
              create: {
                aiGeneratedContent: result,
                status: 'DRAFT',
                icdCodes: icdCodes.length > 0 ? JSON.stringify(icdCodes) : null,
                cptCodes: cptCodes.length > 0 ? JSON.stringify(cptCodes) : null,
              },
            },
          },
        })
        neonEncounterId = encounter.id
        console.log('Encounter saved to DB:', neonEncounterId)
      } catch (saveError) {
        console.error("Failed to save encounter to DB:", saveError)
      }
    }

    return { note: result, neonEncounterId, icdCodes, cptCodes }
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