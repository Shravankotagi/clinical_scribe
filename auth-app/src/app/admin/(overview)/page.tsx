import { isAuthenticated } from '@/server/user';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { AutoRefresh } from '@/components/dashboard/auto-refresh'
export const dynamic = 'force-dynamic'
export const revalidate = 0
import { CodeChip } from '@/components/CodeChip'
export default async function AdminDashboardPage() {
  const session = await isAuthenticated();
  if (!session) redirect('/login');
  if (session.user.role !== 'admin') redirect('/dashboard');

  const [
    totalDoctors,
    totalEncounters,
    totalApproved,
    totalDraft,
    recentEncounters,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'doctor' } }),
    prisma.encounter.count(),
    prisma.clinicalNote.count({ where: { status: 'APPROVED' } }),
    prisma.clinicalNote.count({ where: { status: 'DRAFT' } }),
    prisma.encounter.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { clinicalNote: true, doctor: { select: { name: true } } },
    }),
  ]);

  return (
    <div className='mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-6 md:p-10'>
      <AutoRefresh intervalMs={15000} />
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Admin Dashboard</h1>
          <p className='text-muted-foreground mt-1'>Clinical scribe platform overview</p>
        </div>
        <Link
          href='/admin/doctors'
          className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors'
        >
          + Add Doctor
        </Link>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-xl border bg-card p-6'>
          <p className='text-sm text-muted-foreground'>Total Doctors</p>
          <p className='mt-1 text-3xl font-bold'>{totalDoctors}</p>
          <p className='mt-1 text-xs text-muted-foreground'>Registered physicians</p>
        </div>
        <div className='rounded-xl border bg-card p-6'>
          <p className='text-sm text-muted-foreground'>Total Encounters</p>
          <p className='mt-1 text-3xl font-bold'>{totalEncounters}</p>
          <p className='mt-1 text-xs text-muted-foreground'>All time sessions</p>
        </div>
        <div className='rounded-xl border bg-card p-6'>
          <p className='text-sm text-muted-foreground'>Approved Notes</p>
          <p className='mt-1 text-3xl font-bold text-green-600'>{totalApproved}</p>
          <p className='mt-1 text-xs text-muted-foreground'>Physician approved</p>
        </div>
        <div className='rounded-xl border bg-card p-6'>
          <p className='text-sm text-muted-foreground'>Pending Approval</p>
          <p className='mt-1 text-3xl font-bold text-yellow-600'>{totalDraft}</p>
          <p className='mt-1 text-xs text-muted-foreground'>Awaiting review</p>
        </div>
      </div>

      {/* Recent Encounters Table */}
      <div className='rounded-xl border bg-card'>
        <div className='border-b px-6 py-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Recent Encounters</h2>
          <Link href='/admin/doctors' className='text-sm text-blue-600 hover:underline'>
            Manage Doctors →
          </Link>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b text-left text-muted-foreground'>
                <th className='px-6 py-3 font-medium'>Patient</th>
                <th className='px-6 py-3 font-medium'>Doctor</th>
                <th className='px-6 py-3 font-medium'>Note Type</th>
                <th className='px-6 py-3 font-medium'>Date</th>
                <th className='px-6 py-3 font-medium'>Status</th>
                <th className='px-6 py-3 font-medium'>ICD Codes</th>
                <th className='px-6 py-3 font-medium'>CPT Codes</th>
              </tr>
            </thead>
            <tbody>
              {recentEncounters.map((encounter) => (
                <tr key={encounter.id} className='border-b last:border-0 hover:bg-muted/50'>
                  <td className='px-6 py-4 font-medium'>
                    {encounter.patientName || 'Unknown Patient'}
                  </td>
                  <td className='px-6 py-4 text-muted-foreground'>
                    Dr. {encounter.doctor.name}
                  </td>
                  <td className='px-6 py-4 text-muted-foreground'>
                    {encounter.noteType}
                  </td>
                  <td className='px-6 py-4 text-muted-foreground'>
                    {new Date(encounter.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
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
      </div>
    </div>
  );
}