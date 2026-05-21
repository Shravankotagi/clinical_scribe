import { isAuthenticated } from '@/server/user';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { AutoRefresh } from '@/components/dashboard/auto-refresh'
import { CodeChip } from '@/components/CodeChip'
export const dynamic = 'force-dynamic'

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter } = await searchParams
  const session = await isAuthenticated();

  if (!session) {
    redirect('/login');
  }

  const user = session.user;

  const encounters = await prisma.encounter.findMany({
    where: { doctorId: user.id },
    include: { clinicalNote: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const totalEncounters = encounters.length;
  const notesGenerated = encounters.filter(e => e.clinicalNote).length;
  const pendingApproval = encounters.filter(e => e.clinicalNote?.status === 'DRAFT').length;
  const displayEncounters = filter === 'pending'
    ? encounters.filter(e => e.clinicalNote?.status === 'DRAFT')
    : encounters

  return (
    <div className='mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-6 md:p-10'>
      <AutoRefresh intervalMs={15000} />
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-3xl font-bold tracking-tight'>
            Welcome, Dr. {user.name}
          </h1>
          <p className='text-muted-foreground'>
            Manage your patient encounters and clinical notes.
          </p>
        </div>
        <Link
          href={`${process.env.NEXT_PUBLIC_OPENSCRIBE_URL || 'http://localhost:3001'}?doctorId=${user.id}`}
          target='_blank'
          className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors'
        >
          <span>🎙️</span>
          New Encounter
        </Link>
      </div>

      {/* Stats Row */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <div className='rounded-xl border bg-card p-6'>
          <p className='text-sm text-muted-foreground'>Total Encounters</p>
          <p className='mt-1 text-3xl font-bold'>{totalEncounters}</p>
        </div>
        <div className='rounded-xl border bg-card p-6'>
          <p className='text-sm text-muted-foreground'>Notes Generated</p>
          <p className='mt-1 text-3xl font-bold'>{notesGenerated}</p>
        </div>
        <Link href='/dashboard?filter=pending' className='rounded-xl border bg-card p-6 hover:bg-muted/50 transition-colors cursor-pointer block'>
          <p className='text-sm text-muted-foreground'>Pending Approval</p>
          <p className='mt-1 text-3xl font-bold'>{pendingApproval}</p>
        </Link>
      </div>

      {/* Encounters Table */}
      <div className='rounded-xl border bg-card'>
        <div className='border-b px-6 py-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>
            {filter === 'pending' ? 'Pending Approval' : 'Recent Encounters'}
          </h2>
          {filter === 'pending' && (
            <Link href='/dashboard' className='text-sm text-blue-600 hover:underline'>
              Show all encounters
            </Link>
          )}
        </div>
        {displayEncounters.length === 0 ? (
          <div className='flex flex-col items-center justify-center gap-3 py-20 text-center'>
            <span className='text-5xl'>🩺</span>
            <p className='text-lg font-medium'>
              {filter === 'pending' ? 'No pending approvals' : 'No encounters yet'}
            </p>
            <p className='text-sm text-muted-foreground'>
              {filter === 'pending' ? 'All notes have been approved!' : 'Start a new encounter to record and transcribe a patient consultation.'}
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b text-left text-muted-foreground'>
                  <th className='px-6 py-3 font-medium'>Patient</th>
                  <th className='px-6 py-3 font-medium'>Note Type</th>
                  <th className='px-6 py-3 font-medium'>Date</th>
                  <th className='px-6 py-3 font-medium'>Status</th>
                  <th className='px-6 py-3 font-medium'>Note</th>
                  <th className='px-6 py-3 font-medium'>ICD Codes</th>
                  <th className='px-6 py-3 font-medium'>CPT Codes</th>
                </tr>
              </thead>
              <tbody>
                {displayEncounters.map((encounter) => (
                  <tr key={encounter.id} className='border-b last:border-0 hover:bg-muted/50'>
                    <td className='px-6 py-4 font-medium'>
                      {encounter.patientName || 'Unknown Patient'}
                    </td>
                    <td className='px-6 py-4 text-muted-foreground'>
                      {encounter.noteType}
                    </td>
                    <td className='px-6 py-4 text-muted-foreground'>
                      {new Date(encounter.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className='px-6 py-4'>
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        encounter.clinicalNote?.status === 'APPROVED'
                          ? 'bg-green-100 text-green-700'
                          : encounter.clinicalNote?.status === 'DRAFT'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {encounter.clinicalNote?.status || 'No Note'}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      {encounter.clinicalNote ? (
                        <div className='flex items-center gap-2'>
                          <span className='text-blue-600'>✓ Generated</span>
                          {encounter.clinicalNote.status === 'APPROVED' && (
                            <a
                              href={`/api/encounters/fhir-export?encounterId=${encounter.id}`}
                              download={`fhir-${encounter.id}.json`}
                              className='inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200'
                            >
                              ⬇ FHIR
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className='text-muted-foreground'>—</span>
                      )}
                    </td>
                    <td className='px-6 py-4'>
                      {encounter.clinicalNote?.icdCodes ? (() => {
                        try {
                          const codes = JSON.parse(encounter.clinicalNote!.icdCodes!) as string[]
                          return (
                            <div className='flex flex-wrap gap-1'>
                              {codes.slice(0, 3).map((code, i) => (
                                <CodeChip key={i} code={code} defaultConfidence='90' variant='blue' />
                              ))}
                            </div>
                          )
                        } catch { return <span className='text-muted-foreground'>—</span> }
                      })() : <span className='text-muted-foreground'>—</span>}
                    </td>
                    <td className='px-6 py-4'>
                      {encounter.clinicalNote?.cptCodes ? (() => {
                        try {
                          const codes = JSON.parse(encounter.clinicalNote!.cptCodes!) as string[]
                          return (
                            <div className='flex flex-wrap gap-1'>
                              {codes.slice(0, 3).map((code, i) => (
                                <CodeChip key={i} code={code} defaultConfidence='85' variant='purple' />
                              ))}
                            </div>
                          )
                        } catch { return <span className='text-muted-foreground'>—</span> }
                      })() : <span className='text-muted-foreground'>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}