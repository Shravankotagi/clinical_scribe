import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/server/user'

export async function GET() {
  const session = await isAuthenticated()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ 
    id: session.user.id,
    name: session.user.name,
    role: session.user.role 
  })
}