import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { encounterId, doctorId, finalNote } = await req.json()

    if (!encounterId && !doctorId) {
      return NextResponse.json({ error: 'Missing encounterId or doctorId' }, { status: 400 })
    }

    let clinicalNote = await prisma.clinicalNote.findUnique({
      where: { encounterId },
    })

    if (!clinicalNote && doctorId) {
      const recentEncounter = await prisma.encounter.findFirst({
        where: { doctorId },
        orderBy: { createdAt: 'desc' },
        include: { clinicalNote: true },
      })
      clinicalNote = recentEncounter?.clinicalNote || null
    }

    if (!clinicalNote) {
      return NextResponse.json({ error: 'No clinical note found' }, { status: 404 })
    }

    await prisma.clinicalNote.update({
      where: { encounterId: clinicalNote.encounterId },
      data: {
        finalContent: finalNote,
        status: 'APPROVED',
        approvedAt: new Date(),
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: doctorId || 'unknown',
        encounterId: clinicalNote.encounterId,
        action: 'NOTE_APPROVED',
        details: 'Physician approved clinical note',
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Approve error:', error)
    return NextResponse.json({ error: 'Failed to approve' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return NextResponse.json({})
}