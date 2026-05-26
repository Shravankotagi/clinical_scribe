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
    <div className="flex-1 flex flex-col min-h-screen bg-[#fff8f5]">
      <AutoRefresh intervalMs={15000} />

      {/* Top App Bar */}
      <header className="flex justify-between items-center w-full px-10 h-16 sticky top-0 z-30 bg-[#fff8f5]/80 backdrop-blur-md border-b border-[#d5c4ae]/30">
        <nav className="flex items-center gap-2 text-sm">
          <span className="text-[#514535]">Documents</span>
          <span className="text-[#514535] text-xs">›</span>
          <span className="text-[#805600] font-bold border-b-2 border-[#805600] pb-1">Dashboard</span>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href={`${process.env.NEXT_PUBLIC_OPENSCRIBE_URL || 'http://localhost:3001'}?doctorId=${user.id}`}
            target="_blank"
            className="flex items-center gap-2 bg-[#805600] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#614000] hover:shadow-md active:scale-95 transition-all duration-100"
          >
            <span className="text-base">+</span>
            New Encounter
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-10 max-w-[1440px] w-full mx-auto">

        {/* Welcome Header */}
        <section className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-[#1f1b17] mb-2"
              style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}>
            Welcome, Dr. {user.name}
          </h1>
          <p className="text-[#514535]">
            {filter === 'pending'
              ? `You have ${pendingApproval} pending documents for review.`
              : 'Manage your patient encounters and clinical notes.'}
          </p>
        </section>

        {/* Stats Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          {/* Total Encounters */}
          <div
            className="p-6 rounded-xl flex flex-col gap-4 border-l-4 border-l-[#805600] transition-transform duration-200 hover:-translate-y-1"
            style={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(128,86,0,0.1)',
              borderLeft: '4px solid #805600',
              boxShadow: '0px 4px 20px rgba(128,86,0,0.05)',
            }}
          >
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-[#ffddb0]/40">
                <span className="text-[#805600] text-xl">✅</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-[#514535] uppercase tracking-wider font-medium mb-1">Total Encounters</p>
              <p className="text-2xl font-bold text-black" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {totalEncounters}
              </p>
            </div>
          </div>

          {/* Notes Generated */}
          <div
            className="p-6 rounded-xl flex flex-col gap-4 border-l-4 border-l-[#ffba46] transition-transform duration-200 hover:-translate-y-1"
            style={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(128,86,0,0.1)',
              borderLeft: '4px solid #ffba46',
              boxShadow: '0px 4px 20px rgba(128,86,0,0.05)',
            }}
          >
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-[#ffddb0]/40">
                <span className="text-[#805600] text-xl">📄</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-[#514535] uppercase tracking-wider font-medium mb-1">Notes Generated</p>
              <p className="text-2xl font-bold text-black" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {notesGenerated}
              </p>
            </div>
          </div>

          {/* Pending Approval */}
          <Link
            href="/dashboard?filter=pending"
            className="p-6 rounded-xl flex flex-col gap-4 border-l-4 border-l-[#ba1a1a] text-left group cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            style={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(128,86,0,0.1)',
              borderLeft: '4px solid #ba1a1a',
              boxShadow: '0px 4px 20px rgba(128,86,0,0.05)',
            }}
          >
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-[#ffdad6]/40">
                <span className="text-[#ba1a1a] text-xl">⏳</span>
              </div>
              <span className="text-[#ba1a1a] group-hover:translate-x-1 transition-transform duration-200">→</span>
            </div>
            <div>
              <p className="text-xs text-[#514535] uppercase tracking-wider font-medium mb-1">Pending Approval</p>
              <p className="text-2xl font-bold text-black" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {pendingApproval}
              </p>
            </div>
          </Link>
        </section>

        {/* Recent Encounters Table */}
        <section
          className="rounded-xl overflow-hidden shadow-sm"
          style={{
            background: '#ffffff',
            border: '1px solid rgba(213,196,174,0.3)',
          }}
        >
          <div className="px-6 py-5 flex justify-between items-center border-b border-[#d5c4ae]/30">
            <h3 className="text-xl font-semibold text-[#805600]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {filter === 'pending' ? 'Pending Approval' : 'Recent Encounters'}
            </h3>
            <div className="flex items-center gap-3">
              {filter === 'pending' && (
                <Link href="/dashboard" className="text-sm text-[#805600] hover:underline">
                  Show all encounters
                </Link>
              )}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#514535] text-sm">🔍</span>
                <input
                  className="pl-9 pr-4 py-2 bg-[#fcf2eb] border border-[#d5c4ae]/20 rounded-lg text-sm focus:ring-2 focus:ring-[#805600] focus:outline-none w-64 transition-all"
                  placeholder="Filter encounters..."
                  type="text"
                />
              </div>
            </div>
          </div>

          {displayEncounters.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <span className="text-5xl">🩺</span>
              <p className="text-lg font-medium text-[#1f1b17]">
                {filter === 'pending' ? 'No pending approvals' : 'No encounters yet'}
              </p>
              <p className="text-sm text-[#514535]">
                {filter === 'pending'
                  ? 'All notes have been approved!'
                  : 'Start a new encounter to record and transcribe a patient consultation.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f0e6e0] text-[#514535]">
                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">Patient</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">Note Type</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">Date</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-center">Status</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">Note</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">ICD Codes</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">CPT Codes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d5c4ae]/20">
                  {displayEncounters.map((encounter) => (
                    <tr key={encounter.id} className="hover:bg-[#fcf2eb] transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-[#1f1b17]">
                        {encounter.patientName || 'Unknown Patient'}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#514535]">
                        {encounter.noteType}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#514535]">
                        {new Date(encounter.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                          encounter.clinicalNote?.status === 'APPROVED'
                            ? 'bg-green-100 text-green-700'
                            : encounter.clinicalNote?.status === 'DRAFT'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {encounter.clinicalNote?.status || 'NO NOTE'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {encounter.clinicalNote ? (
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600 text-sm font-medium flex items-center gap-1">
                              <span className="text-[10px]">✓</span> Generated
                            </span>
                            {encounter.clinicalNote.status === 'APPROVED' && (
                              <a
                                href={`/api/encounters/fhir-export?encounterId=${encounter.id}`}
                                download={`fhir-${encounter.id}.json`}
                                className="flex items-center gap-1 px-2 py-0.5 bg-[#e6fcf5] text-emerald-700 rounded-md text-[10px] font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors"
                              >
                                <span className="text-xs">↓</span> FHIR
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#514535] font-medium">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {encounter.clinicalNote?.icdCodes ? (() => {
                          try {
                            const codes = JSON.parse(encounter.clinicalNote!.icdCodes!) as string[]
                            return (
                              <div className="flex flex-wrap gap-1">
                                {codes.slice(0, 3).map((code, i) => (
                                  <CodeChip key={i} code={code} defaultConfidence="90" variant="blue" />
                                ))}
                              </div>
                            )
                          } catch { return <span className="text-[#514535]">—</span> }
                        })() : <span className="text-[#514535]">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        {encounter.clinicalNote?.cptCodes ? (() => {
                          try {
                            const codes = JSON.parse(encounter.clinicalNote!.cptCodes!) as string[]
                            return (
                              <div className="flex flex-wrap gap-1">
                                {codes.slice(0, 3).map((code, i) => (
                                  <CodeChip key={i} code={code} defaultConfidence="85" variant="purple" />
                                ))}
                              </div>
                            )
                          } catch { return <span className="text-[#514535]">—</span> }
                        })() : <span className="text-[#514535]">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-[#d5c4ae]/30 flex items-center justify-between">
            <span className="text-xs text-[#514535]">
              Showing {displayEncounters.length} of {totalEncounters} encounters
            </span>
            <div className="flex gap-2">
              <button
                className="p-2 border border-[#d5c4ae]/30 rounded-lg hover:bg-[#fcf2eb] disabled:opacity-30 transition-colors"
                disabled
              >
                ‹
              </button>
              <button className="p-2 border border-[#d5c4ae]/30 rounded-lg hover:bg-[#fcf2eb] transition-colors">
                ›
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}