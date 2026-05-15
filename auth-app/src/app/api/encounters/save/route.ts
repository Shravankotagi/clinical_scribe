import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3001',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

async function extractIcdCodes(note: string): Promise<string[]> {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY || ""
    if (!geminiApiKey) {
      console.log("No Gemini key found")
      return []
    }
    console.log("Extracting ICD codes, key length:", geminiApiKey.length)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a medical coding assistant. Extract ICD-10 codes from the clinical note below.
Return ONLY a JSON array of objects with "code", "description" and "confidence" fields. Confidence is a number 0-100 indicating how certain you are. No explanation, no markdown, just the JSON array.
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
    console.log("Gemini ICD response:", JSON.stringify(data).slice(0, 300))
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]"
    const clean = text.replace(/```json|```/g, "").trim()
    // Fix truncated JSON by finding the last complete object
    const lastBracket = clean.lastIndexOf('}')
    const safeJson = lastBracket > 0 ? clean.slice(0, lastBracket + 1) + ']' : '[]'
    const fixedJson = safeJson.startsWith('[') ? safeJson : '[' + safeJson
    const parsed = JSON.parse(fixedJson) as Array<{ code: string; description: string; confidence?: number }>
    console.log("ICD with confidence:", JSON.stringify(parsed))
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a medical coding assistant. Suggest appropriate CPT billing codes based on the clinical note below.
Always suggest at least one office visit CPT code (99201-99215) based on complexity.
Also suggest any procedure codes mentioned (ECG=93000, blood test=36415, lipid panel=80061, etc).
Keep descriptions very short (max 4 words).
Return ONLY a JSON array of objects with "code", "description" and "confidence" fields. Confidence is a number 0-100. No explanation, no markdown, just the JSON array.
Example: [{"code":"99213","description":"Office visit moderate","confidence":90},{"code":"93000","description":"ECG","confidence":85}]

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
    console.log("Gemini CPT response:", JSON.stringify(data).slice(0, 300))
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]"
    const clean = text.replace(/```json|```/g, "").trim()
    // Fix truncated JSON
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transcript, note, patientName, duration, doctorId } = body;
    console.log('Save encounter called for doctor:', doctorId)

    if (!doctorId || !transcript || !note) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers: corsHeaders }
      );
    }

    const icdCodes = await extractIcdCodes(note)
    console.log('ICD codes extracted:', icdCodes)

    const cptCodes = await extractCptCodes(note)
    console.log('CPT codes extracted:', cptCodes)

    const encounter = await prisma.encounter.create({
      data: {
        doctorId,
        patientName: patientName || 'Unknown Patient',
        duration: duration || 0,
        status: 'COMPLETED',
        transcript: {
          create: {
            content: transcript,
          },
        },
        clinicalNote: {
          create: {
            aiGeneratedContent: note,
            status: 'DRAFT',
            icdCodes: icdCodes.length > 0 ? JSON.stringify(icdCodes) : null,
            cptCodes: cptCodes.length > 0 ? JSON.stringify(cptCodes) : null,
          },
        },
      },
    });

    return NextResponse.json({ ok: true, encounterId: encounter.id }, { headers: corsHeaders });
  } catch (error) {
    console.error('Save encounter error:', error);
    return NextResponse.json(
      { error: 'Failed to save encounter' },
      { status: 500, headers: corsHeaders }
    );
  }
}