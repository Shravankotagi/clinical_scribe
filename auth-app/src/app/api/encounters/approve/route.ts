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

export async function POST(req: NextRequest) {
  try {
    const { encounterId, doctorId, finalNote } = await req.json();
    console.log('Approve called with encounterId:', encounterId, 'doctorId:', doctorId)

    if (!encounterId && !doctorId) {
      return NextResponse.json({ error: 'Missing encounterId or doctorId' }, { status: 400, headers: corsHeaders });
    }

    // Try direct lookup first
    let clinicalNote = await prisma.clinicalNote.findUnique({
      where: { encounterId },
    });

    // If not found, get the most recent DRAFT note for this doctor
    if (!clinicalNote && doctorId) {
      console.log('Direct lookup failed, trying most recent DRAFT for doctor:', doctorId)
      const recentEncounter = await prisma.encounter.findFirst({
        where: { doctorId },
        orderBy: { createdAt: 'desc' },
        include: { clinicalNote: true },
      });
      clinicalNote = recentEncounter?.clinicalNote || null;
      
      if (clinicalNote) {
        console.log('Found recent encounter note:', clinicalNote.encounterId)
        await prisma.clinicalNote.update({
          where: { encounterId: clinicalNote.encounterId },
          data: {
            finalContent: finalNote,
            status: 'APPROVED',
            approvedAt: new Date(),
          },
        });

        await prisma.auditLog.create({
          data: {
            userId: doctorId,
            encounterId: clinicalNote.encounterId,
            action: 'NOTE_APPROVED',
            details: 'Physician approved clinical note',
          },
        });

        return NextResponse.json({ ok: true }, { headers: corsHeaders });
      }
    }

    if (!clinicalNote) {
      return NextResponse.json({ error: 'No clinical note found' }, { status: 404, headers: corsHeaders });
    }

    await prisma.clinicalNote.update({
      where: { encounterId },
      data: {
        finalContent: finalNote,
        status: 'APPROVED',
        approvedAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: doctorId || 'unknown',
        encounterId,
        action: 'NOTE_APPROVED',
        details: 'Physician approved clinical note',
      },
    });

    return NextResponse.json({ ok: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Approve error:', error);
    return NextResponse.json({ error: 'Failed to approve' }, { status: 500, headers: corsHeaders });
  }
}