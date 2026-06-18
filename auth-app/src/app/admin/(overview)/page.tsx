import { isAuthenticated } from '@/server/user';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Fragment } from 'react';
import { AutoRefresh } from '@/components/dashboard/auto-refresh'
import { CodeChip } from '@/components/CodeChip'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const session = await isAuthenticated();
  if (!session) redirect('/login');
  if (session.user.role !== 'admin') redirect('/dashboard');

  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam || '1'))
  const perPage = 50

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
      take: perPage,
      skip: (page - 1) * perPage,
      include: { clinicalNote: true, doctor: { select: { name: true } } },
    }),
  ]);

  const totalPages = Math.ceil(totalEncounters / perPage)

  return (
    <div className="flex-1 flex flex-col min-h-screen" style={{ background: '#f5f7ff' }}>
      <AutoRefresh intervalMs={5000} />

      {/* Top Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 w-full px-4 sm:px-6 lg:px-10 py-3 sm:h-16 sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <nav className="flex items-center gap-2 text-sm shrink-0">
          <span className="text-gray-500">Platform</span>
          <span className="text-gray-500 text-xs">›</span>
          <span className="text-[#1a33cc] font-bold border-b-2 border-[#1a33cc] pb-1">Dashboard</span>
        </nav>
        <div className='flex items-center gap-4 shrink-0'>
          <Link
            href='/admin/doctors'
            className='flex items-center gap-1.5 px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all hover:opacity-90 active:scale-95 whitespace-nowrap'
            style={{ background: '#1a33cc', color: '#ffffff' }}
          >
            <svg className='w-4 h-4 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
            <span className="hidden sm:inline">Add Doctor</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 sm:px-6 sm:py-8 lg:p-10 max-w-[1440px] w-full mx-auto">
        <section className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-2"
              style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}>
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-500">Monitor all clinical encounters and manage doctors.</p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
          <div
            className="p-4 sm:p-6 rounded-xl flex flex-col gap-2 sm:gap-4 transition-transform duration-200 hover:-translate-y-1"
            style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', border: '1px solid #e5e7eb', borderLeft: '4px solid #1a33cc', boxShadow: '0px 4px 20px rgba(26,51,204,0.06)' }}
          >
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Total Doctors</p>
              <p className="text-xl sm:text-2xl font-bold text-black" style={{ fontFamily: 'Manrope, sans-serif' }}>{totalDoctors}</p>
            </div>
          </div>

          <div
            className="p-4 sm:p-6 rounded-xl flex flex-col gap-2 sm:gap-4 transition-transform duration-200 hover:-translate-y-1"
            style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', border: '1px solid #e5e7eb', borderLeft: '4px solid #2563eb', boxShadow: '0px 4px 20px rgba(26,51,204,0.06)' }}
          >
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Total Encounters</p>
              <p className="text-xl sm:text-2xl font-bold text-black" style={{ fontFamily: 'Manrope, sans-serif' }}>{totalEncounters}</p>
            </div>
          </div>

          <div
            className="p-4 sm:p-6 rounded-xl flex flex-col gap-2 sm:gap-4 transition-transform duration-200 hover:-translate-y-1"
            style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', border: '1px solid #e5e7eb', borderLeft: '4px solid #1a33cc', boxShadow: '0px 4px 20px rgba(26,51,204,0.06)' }}
          >
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Approved Notes</p>
              <p className="text-xl sm:text-2xl font-bold text-black" style={{ fontFamily: 'Manrope, sans-serif' }}>{totalApproved}</p>
            </div>
          </div>

          <div
            className="p-4 sm:p-6 rounded-xl flex flex-col gap-2 sm:gap-4 transition-transform duration-200 hover:-translate-y-1"
            style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', border: '1px solid #e5e7eb', borderLeft: '4px solid #ba1a1a', boxShadow: '0px 4px 20px rgba(26,51,204,0.06)' }}
          >
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Pending Approval</p>
              <p className="text-xl sm:text-2xl font-bold text-black" style={{ fontFamily: 'Manrope, sans-serif' }}>{totalDraft}</p>
            </div>
          </div>
        </section>

        {/* Recent Encounters */}
        <section className="rounded-xl overflow-hidden shadow-sm mb-12" style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}>
          <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-[#1a33cc]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Recent Encounters
            </h3>
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-xs text-gray-500">
                Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, totalEncounters)} of {totalEncounters}
              </span>
              <Link href='/admin/doctors' className='text-sm font-semibold text-[#1a33cc] hover:underline whitespace-nowrap'>
                Manage Doctors →
              </Link>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className='w-full text-left border-collapse'>
              <thead style={{ background: '#f0f4ff' }}>
                <tr>
                  {['Patient', 'Doctor', 'Note Type', 'Date', 'Status', 'ICD Codes', 'CPT Codes'].map((h) => (
                    <th key={h} className='px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600 whitespace-nowrap'>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {recentEncounters.map((encounter, idx) => (
                  <tr
                    key={encounter.id}
                    className='transition-colors hover:bg-[#f0f4ff]'
                    style={{ background: idx % 2 === 1 ? 'rgba(240,244,255,0.3)' : 'transparent' }}
                  >
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0' style={{ background: '#dbeafe', color: '#1e40af' }}>
                          {(encounter.patientName || 'U')[0].toUpperCase()}
                        </div>
                        <span className='text-sm font-semibold text-gray-800 whitespace-nowrap'>{encounter.patientName || 'Unknown Patient'}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0' style={{ background: '#e2e2e2', color: '#1a1c1c' }}>
                          {encounter.doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <span className='text-sm font-semibold text-gray-800 whitespace-nowrap'>Dr. {encounter.doctor.name}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>{encounter.noteType}</td>
                    <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
                      {new Date(encounter.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className='px-6 py-4'>
                      {encounter.clinicalNote?.status === 'APPROVED' ? (
                        <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap' style={{ background: '#dcfce7', color: '#15803d' }}>
                          <span className='w-1.5 h-1.5 rounded-full bg-green-500' />Approved
                        </span>
                      ) : encounter.clinicalNote?.status === 'DRAFT' ? (
                        <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap' style={{ background: '#fef9c3', color: '#854d0e' }}>
                          <span className='w-1.5 h-1.5 rounded-full bg-yellow-500' />Pending
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap' style={{ background: '#e2e2e2', color: '#514535' }}>No Note</span>
                      )}
                    </td>
                    <td className='px-6 py-4'>
                      {encounter.clinicalNote?.icdCodes ? (() => {
                        try {
                          const codes = JSON.parse(encounter.clinicalNote!.icdCodes!) as string[]
                          return <div className='flex flex-wrap gap-1'>{codes.slice(0, 3).map((code, i) => <CodeChip key={i} code={code} defaultConfidence='90' variant='blue' />)}</div>
                        } catch { return <span className='text-gray-400'>—</span> }
                      })() : <span className='text-gray-400'>—</span>}
                    </td>
                    <td className='px-6 py-4'>
                      {encounter.clinicalNote?.cptCodes ? (() => {
                        try {
                          const codes = JSON.parse(encounter.clinicalNote!.cptCodes!) as string[]
                          return <div className='flex flex-wrap gap-1'>{codes.slice(0, 3).map((code, i) => <CodeChip key={i} code={code} defaultConfidence='85' variant='purple' />)}</div>
                        } catch { return <span className='text-gray-400'>—</span> }
                      })() : <span className='text-gray-400'>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-gray-100">
            {recentEncounters.map((encounter) => (
              <div key={encounter.id} className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: '#dbeafe', color: '#1e40af' }}>
                      {(encounter.patientName || 'U')[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-800 truncate">{encounter.patientName || 'Unknown Patient'}</span>
                  </div>
                  {encounter.clinicalNote?.status === 'APPROVED' ? (
                    <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shrink-0' style={{ background: '#dcfce7', color: '#15803d' }}>
                      <span className='w-1.5 h-1.5 rounded-full bg-green-500' />Approved
                    </span>
                  ) : encounter.clinicalNote?.status === 'DRAFT' ? (
                    <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shrink-0' style={{ background: '#fef9c3', color: '#854d0e' }}>
                      <span className='w-1.5 h-1.5 rounded-full bg-yellow-500' />Pending
                    </span>
                  ) : (
                    <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shrink-0' style={{ background: '#e2e2e2', color: '#514535' }}>No Note</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1.5 truncate">
                    <span className='w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0' style={{ background: '#e2e2e2', color: '#1a1c1c' }}>
                      {encounter.doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                    Dr. {encounter.doctor.name}
                  </span>
                  <span className="shrink-0">{new Date(encounter.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <div className="text-xs text-gray-500">{encounter.noteType}</div>

                {(encounter.clinicalNote?.icdCodes || encounter.clinicalNote?.cptCodes) && (
                  <div className="flex flex-col gap-1.5">
                    {encounter.clinicalNote?.icdCodes && (() => {
                      try {
                        const codes = JSON.parse(encounter.clinicalNote!.icdCodes!) as string[]
                        return codes.length ? (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wide self-center mr-1">ICD</span>
                            {codes.slice(0, 3).map((code, i) => <CodeChip key={i} code={code} defaultConfidence='90' variant='blue' />)}
                          </div>
                        ) : null
                      } catch { return null }
                    })()}
                    {encounter.clinicalNote?.cptCodes && (() => {
                      try {
                        const codes = JSON.parse(encounter.clinicalNote!.cptCodes!) as string[]
                        return codes.length ? (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wide self-center mr-1">CPT</span>
                            {codes.slice(0, 3).map((code, i) => <CodeChip key={i} code={code} defaultConfidence='85' variant='purple' />)}
                          </div>
                        ) : null
                      } catch { return null }
                    })()}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          <div className='px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3'>
            <span className='text-xs text-gray-500 order-2 sm:order-1'>
              Page {page} of {totalPages} · {totalEncounters} total encounters
            </span>
            <div className='flex items-center gap-2 order-1 sm:order-2'>
              {page > 1 && (
                <Link
                  href={`/admin?page=${page - 1}`}
                  className='px-3 sm:px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-[#f0f4ff] transition-colors'
                  style={{ color: '#1a33cc' }}
                >
                  ← Previous
                </Link>
              )}
              <div className="hidden sm:flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, i, arr) => (
                    <Fragment key={p}>
                      {i > 0 && arr[i - 1] !== p - 1 && <span className='text-gray-400 text-sm'>...</span>}
                      <Link
                        href={`/admin?page=${p}`}
                        className='w-9 h-9 flex items-center justify-center text-sm font-semibold rounded-lg transition-colors'
                        style={{
                          background: p === page ? '#1a33cc' : 'transparent',
                          color: p === page ? 'white' : '#1a33cc',
                          border: p === page ? 'none' : '1px solid #e5e7eb',
                        }}
                      >
                        {p}
                      </Link>
                    </Fragment>
                  ))}
              </div>
              {page < totalPages && (
                <Link
                  href={`/admin?page=${page + 1}`}
                  className='px-3 sm:px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-[#f0f4ff] transition-colors'
                  style={{ color: '#1a33cc' }}
                >
                  Next →
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}