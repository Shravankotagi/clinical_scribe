import { NextResponse } from 'next/server'

export async function GET() {
  const key = (process.env.ANTHROPIC_API_KEY || '').trim()
  const hasKey = key.length > 0 && key.startsWith('sk-ant-')

  return NextResponse.json({
    hasAnthropicKeyConfigured: hasKey,
    source: hasKey ? 'env' : 'none'
  })
}