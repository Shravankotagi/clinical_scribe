import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const AUTH_APP_URL = process.env.AUTH_APP_URL || 'http://localhost:3000'
  const body = await req.json()
  const res = await fetch(`${AUTH_APP_URL}/api/encounters/highlight-uncertain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data)
}