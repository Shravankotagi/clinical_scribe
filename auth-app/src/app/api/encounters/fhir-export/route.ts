import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const encounterId = searchParams.get('encounterId');

    if (!encounterId) {
      return NextResponse.json({ error: 'Missing encounterId' }, { status: 400 });
    }

    const encounter = await prisma.encounter.findUnique({
      where: { id: encounterId },
      include: { clinicalNote: true },
    });

    if (!encounter) {
      return NextResponse.json({ error: 'Encounter not found' }, { status: 404 });
    }

    if (!encounter.clinicalNote) {
      return NextResponse.json({ error: 'No clinical note for this encounter' }, { status: 404 });
    }

    if (encounter.clinicalNote.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Note is not approved yet' }, { status: 400 });
    }

    const noteText: string =
      encounter.clinicalNote.finalContent ??
      encounter.clinicalNote.aiGeneratedContent ??
      '';

    const base64Note = Buffer.from(noteText).toString('base64');

    type IcdEntry = { system: string; code: string; display: string };
    let icdCodes: IcdEntry[] = [];

    if (encounter.clinicalNote.icdCodes) {
      try {
        const parsed = JSON.parse(encounter.clinicalNote.icdCodes) as string[];
        icdCodes = parsed.map((entry) => {
          const [code, ...displayParts] = entry.split(':');
          return {
            system: 'http://hl7.org/fhir/sid/icd-10',
            code: code.trim(),
            display: displayParts.join(':').trim() || code.trim(),
          };
        });
      } catch {
        // icdCodes stays empty — safe to continue
      }
    }

    const fhirDocument = {
      resourceType: 'DocumentReference',
      id: encounter.id,
      status: 'current',
      docStatus: 'final',
      type: {
        coding: [
          {
            system: 'http://loinc.org',
            code: '11488-4',
            display: 'Consult note',
          },
        ],
        text: encounter.noteType ?? 'Clinical Note',
      },
      subject: {
        display: encounter.patientName ?? 'Unknown Patient',
      },
      date: encounter.clinicalNote.approvedAt?.toISOString() ?? encounter.createdAt.toISOString(),
      author: [
        {
          display: `Doctor ID: ${encounter.doctorId}`,
        },
      ],
      description: `${encounter.noteType ?? 'Clinical Note'} — ${encounter.patientName ?? 'Unknown Patient'}`,
      content: [
        {
          attachment: {
            contentType: 'text/plain',
            data: base64Note,
            title: `${encounter.noteType ?? 'Clinical Note'} - ${encounter.patientName ?? 'Unknown'}`,
            creation: encounter.createdAt.toISOString(),
          },
        },
      ],
      ...(icdCodes.length > 0 && {
        context: {
          related: icdCodes.map((code) => ({
            coding: [code],
          })),
        },
      }),
    };

    return NextResponse.json(fhirDocument, { status: 200 });
  } catch (error) {
    console.error('FHIR export error:', error);
    return NextResponse.json({ error: 'Failed to generate FHIR export' }, { status: 500 });
  }
}