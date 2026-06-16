import { NextResponse } from 'next/server'

export async function POST() {
  // Keys are managed via environment variables on the server
  // This endpoint exists to prevent 404 errors from the client
  return NextResponse.json({ success: true })
}