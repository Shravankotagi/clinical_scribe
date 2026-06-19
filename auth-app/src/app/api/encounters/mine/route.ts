import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/server/user'
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await isAuthenticated()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const encounters = await prisma.encounter.findMany({
    where: { doctorId: session.user.id },
    include: { clinicalNote: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json(encounters.map(e => ({
    id: e.id,
    patient_name: e.patientName,
    patient_id: '',
    visit_reason: e.noteType,
    created_at: e.createdAt.toISOString(),
    updated_at: e.updatedAt.toISOString(),
    transcript_text: '',
    note_text: e.clinicalNote?.finalContent || e.clinicalNote?.aiGeneratedContent || '',
    status: 'completed' as const,
    language: 'en',
    recording_duration: e.duration,
    is_approved: e.clinicalNote?.status === 'APPROVED',
  })))
}