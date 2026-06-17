import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const encounter = await prisma.encounter.findUnique({
      where: { id },
      include: { clinicalNote: true, transcript: true },
    })
    if (!encounter) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(encounter)
  } catch (error) {
    console.error('Fetch encounter error:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const neonId = id
    await prisma.clinicalNote.deleteMany({ where: { encounterId: neonId } })
    await prisma.transcript.deleteMany({ where: { encounterId: neonId } })
    await prisma.encounter.deleteMany({ where: { id: neonId } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Delete encounter error:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}