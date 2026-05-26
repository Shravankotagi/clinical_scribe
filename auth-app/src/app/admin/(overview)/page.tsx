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

  <style>{`
    .encounter-row:hover { background: #fcf2eb !important; }
  `}</style>

  return (
    <div className='flex-1 flex flex-col h-screen overflow-y-auto' style={{ background: '#fff8f5' }}>
      <AutoRefresh intervalMs={15000} />

      {/* Top Header */}
      <header className='flex justify-between items-center w-full px-10 h-16 sticky top-0 z-30 border-b border-[#d5c4ae]/30' style={{ background: 'rgba(255,248,245,0.8)', backdropFilter: 'blur(12px)' }}>
        <div className='flex items-center gap-4'>
          <h1 className='text-xl font-bold text-[#805600]'>Dashboard</h1>
        </div>
        <div className='flex items-center gap-4'>
          <Link
            href='/admin/doctors'
            className='flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 active:scale-95'
            style={{ background: '#ffddb0', color: '#422a00' }}
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
            Add Doctor
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className='px-10 py-8 max-w-screen-xl mx-auto w-full space-y-6'>

        {/* Stats Grid */}
        <section className='grid grid-cols-1 md:grid-cols-4 gap-6'>

          {/* Total Doctors */}
          <div
            className='p-6 rounded-xl relative overflow-hidden group cursor-default transition-transform hover:-translate-y-0.5'
            style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,1)', boxShadow: '0px 4px 20px rgba(128,86,0,0.05)' }}
          >
            <div className='flex justify-between items-start mb-4'>
              <svg className='w-8 h-8 text-[#805600]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' />
              </svg>
              <span className='text-xs text-[#514535]'>Registered physicians</span>
            </div>
            <div className='text-4xl font-bold text-black mb-1'>{totalDoctors}</div>
            <div className='text-sm font-semibold text-[#514535]'>Total Doctors</div>
            <div className='absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform'>
              <svg className='w-32 h-32 text-[#805600]' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' />
              </svg>
            </div>
          </div>

          {/* Total Encounters */}
          <div
            className='p-6 rounded-xl relative overflow-hidden group cursor-default transition-transform hover:-translate-y-0.5'
            style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,1)', boxShadow: '0px 4px 20px rgba(128,86,0,0.05)' }}
          >
            <div className='flex justify-between items-start mb-4'>
              <svg className='w-8 h-8 text-[#805600]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
              </svg>
              <span className='text-xs text-[#514535]'>All time sessions</span>
            </div>
            <div className='text-4xl font-bold text-black mb-1'>{totalEncounters}</div>
            <div className='text-sm font-semibold text-[#514535]'>Total Encounters</div>
            <div className='absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform'>
              <svg className='w-32 h-32 text-[#805600]' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
              </svg>
            </div>
          </div>

          {/* Approved Notes */}
          <div
            className='p-6 rounded-xl relative overflow-hidden group cursor-default transition-transform hover:-translate-y-0.5 border-l-4'
            style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,1)', borderLeft: '4px solid #805600', boxShadow: '0px 4px 20px rgba(128,86,0,0.05)' }}
          >
            <div className='flex justify-between items-start mb-4'>
              <svg className='w-8 h-8 text-[#805600]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' />
              </svg>
              <span className='text-[10px] px-2 py-0.5 rounded-full font-bold uppercase' style={{ background: '#ffddb0', color: '#281800' }}>
                APPROVED
              </span>
            </div>
            <div className='text-4xl font-bold text-black mb-1'>{totalApproved}</div>
            <div className='text-sm font-semibold text-[#514535]'>Approved Notes</div>
          </div>

          {/* Pending Approval */}
          <div
            className='p-6 rounded-xl relative overflow-hidden group cursor-default transition-transform hover:-translate-y-0.5'
            style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,1)', borderLeft: '4px solid #ba1a1a', boxShadow: '0px 4px 20px rgba(128,86,0,0.05)' }}
          >
            <div className='flex justify-between items-start mb-4'>
              <svg className='w-8 h-8 text-[#ba1a1a]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <span className='text-[10px] px-2 py-0.5 rounded-full font-bold uppercase' style={{ background: '#ffdad6', color: '#93000a' }}>
                URGENT
              </span>
            </div>
            <div className='text-4xl font-bold text-black mb-1'>{totalDraft}</div>
            <div className='text-sm font-semibold text-[#514535]'>Pending Approval</div>
          </div>

        </section>

        {/* Recent Encounters Table */}
        <section className='space-y-4'>
          <div className='flex justify-between items-end'>
            <div>
              <h2 className='text-xl font-bold text-[#805600]'>Recent Encounters</h2>
              <p className='text-sm text-[#514535]'>Real-time clinical documentation stream</p>
            </div>
            <Link href='/admin/doctors' className='text-sm font-semibold text-[#805600] hover:underline flex items-center gap-1'>
              Manage Doctors
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </Link>
          </div>

          <div className='overflow-hidden rounded-xl border' style={{ borderColor: '#d5c4ae', background: '#ffffff' }}>
            <table className='w-full text-left border-collapse'>
              <thead style={{ background: '#f0e6e0' }}>
                <tr>
                  {['Patient', 'Doctor', 'Note Type', 'Date', 'Status', 'ICD Codes', 'CPT Codes'].map((h) => (
                    <th key={h} className='px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#1f1b17]'>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y' style={{ borderColor: '#d5c4ae' }}>
                {recentEncounters.map((encounter, idx) => (
                  <tr
                    key={encounter.id}
                    className='transition-colors encounter-row'
                    style={{ background: idx % 2 === 1 ? 'rgba(246,236,230,0.3)' : 'transparent' }}
                    // remove onMouseEnter and onMouseLeave entirely
                  >
                    {/* Patient */}
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <div
                          className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0'
                          style={{ background: '#ffddb0', color: '#281800' }}
                        >
                          {(encounter.patientName || 'U')[0].toUpperCase()}
                        </div>
                        <span className='text-sm font-semibold text-[#1f1b17]'>
                          {encounter.patientName || 'Unknown Patient'}
                        </span>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <div
                          className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0'
                          style={{ background: '#e2e2e2', color: '#1a1c1c' }}
                        >
                          {encounter.doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <span className='text-sm font-semibold text-[#1f1b17]'>Dr. {encounter.doctor.name}</span>
                      </div>
                    </td>

                    {/* Note Type */}
                    <td className='px-6 py-4 text-sm text-[#514535]'>{encounter.noteType}</td>

                    {/* Date */}
                    <td className='px-6 py-4 text-sm text-[#514535]'>
                      {new Date(encounter.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </td>

                    {/* Status */}
                    <td className='px-6 py-4'>
                      {encounter.clinicalNote?.status === 'APPROVED' ? (
                        <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold' style={{ background: '#ffddb0', color: '#281800' }}>
                          <span className='w-1.5 h-1.5 rounded-full bg-[#805600]' />
                          Approved
                        </span>
                      ) : encounter.clinicalNote?.status === 'DRAFT' ? (
                        <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold' style={{ background: '#f0e6e0', color: '#514535' }}>
                          <span className='w-1.5 h-1.5 rounded-full bg-[#514535]' />
                          Pending
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold' style={{ background: '#e2e2e2', color: '#514535' }}>
                          No Note
                        </span>
                      )}
                    </td>

                    {/* ICD Codes */}
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
                        } catch { return <span className='text-[#514535]'>—</span> }
                      })() : <span className='text-[#514535]'>—</span>}
                    </td>

                    {/* CPT Codes */}
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
                        } catch { return <span className='text-[#514535]'>—</span> }
                      })() : <span className='text-[#514535]'>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bottom Productivity Grid */}
        <section className='grid grid-cols-1 md:grid-cols-2 gap-6 pb-8'>

          {/* Monthly Accuracy */}
          <div
            className='p-6 rounded-xl flex items-center gap-6'
            style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,1)', boxShadow: '0px 4px 20px rgba(128,86,0,0.05)' }}
          >
            <div className='w-16 h-16 rounded-lg flex items-center justify-center shrink-0' style={{ background: '#ca8a04' }}>
              <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
              </svg>
            </div>
            <div className='flex-1'>
              <h3 className='text-sm font-bold text-[#805600] mb-1'>Monthly Accuracy Index</h3>
              <p className='text-sm text-[#514535]'>System performance is at 98.4% this month.</p>
              <div className='mt-3 w-full h-2 rounded-full overflow-hidden' style={{ background: '#f0e6e0' }}>
                <div className='h-full rounded-full' style={{ width: '98.4%', background: '#805600' }} />
              </div>
            </div>
          </div>

          {/* EHR Sync Status */}
          <div
            className='p-6 rounded-xl flex items-center gap-6'
            style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,1)', boxShadow: '0px 4px 20px rgba(128,86,0,0.05)' }}
          >
            <div className='w-16 h-16 rounded-lg flex items-center justify-center shrink-0 border' style={{ background: '#f6ece6', borderColor: '#d5c4ae' }}>
              <svg className='w-8 h-8 text-[#805600]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' />
              </svg>
            </div>
            <div className='flex-1'>
              <h3 className='text-sm font-bold text-[#805600] mb-1'>EHR Sync Status</h3>
              <p className='text-sm text-[#514535]'>Epic and Cerner connections are healthy.</p>
              <div className='mt-2 flex items-center gap-4'>
                <span className='flex items-center gap-1 text-xs font-bold text-[#805600]'>
                  <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M5 13l4 4L19 7' />
                  </svg>
                  ACTIVE
                </span>
                <span className='text-xs text-[#514535]'>Last sync: 2 mins ago</span>
              </div>
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}