import { NextResponse } from 'next/server'

export async function GET() {
  const anthropicKey = (process.env.ANTHROPIC_API_KEY || '').trim()
  const geminiKey = (process.env.GEMINI_API_KEY || '').trim()

  const hasKey = anthropicKey.length > 0 || geminiKey.length > 0

  return NextResponse.json({
    hasAnthropicKeyConfigured: hasKey,
    source: hasKey ? 'env' : 'none'
  })
}