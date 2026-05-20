import { NextRequest, NextResponse } from 'next/server';

const OPENSCRIBE_URL = process.env.OPENSCRIBE_URL || 'http://localhost:3001'
const corsHeaders = {
  'Access-Control-Allow-Origin': OPENSCRIBE_URL,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { note } = await req.json();
    if (!note) {
      return NextResponse.json({ error: 'Missing note' }, { status: 400, headers: corsHeaders });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY || ""
    if (!geminiApiKey) {
      return NextResponse.json({ markedNote: note }, { headers: corsHeaders });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a medical documentation reviewer. Review the clinical note below and wrap any uncertain, assumed, or inferred content in {{uncertain}}...{{/uncertain}} tags.
Uncertain content includes: assumed findings not explicitly stated, inferred diagnoses, medications not clearly mentioned, or any information not directly supported by the conversation.
Return the COMPLETE note with only the uncertain parts wrapped. Do not change any other text. Do not add markdown or explanation.

Clinical Note:
${note}`
            }]
          }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 2048 }
        }),
      }
    )

    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    const markedNote = data.candidates?.[0]?.content?.parts?.[0]?.text || note

    return NextResponse.json({ markedNote }, { headers: corsHeaders });
  } catch (error) {
    console.error('Highlight uncertain error:', error);
    return NextResponse.json({ error: 'Failed to highlight' }, { status: 500, headers: corsHeaders });
  }
}