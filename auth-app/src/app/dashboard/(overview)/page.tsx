import { isAuthenticated } from '@/server/user';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { AutoRefresh } from '@/components/dashboard/auto-refresh'
import { CodeChip } from '@/components/CodeChip'
import { EncounterRow } from '@/components/dashboard/encounter-row'
export const dynamic = 'force-dynamic'
import { FhirDownloadButton } from '@/components/dashboard/fhir-download-button'

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
    <div className="flex-1 flex flex-col min-h-screen" style={{ background: '#f5f7ff' }}>
      <AutoRefresh intervalMs={5000} />

      {/* Top App Bar */}
      <header className="flex justify-between items-center w-full px-4 sm:px-10 h-14 sm:h-16 sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <nav className="flex items-center gap-1 sm:gap-2 text-sm">
          <span className="text-gray-500 hidden sm:inline">Documents</span>
          <span className="text-gray-500 text-xs hidden sm:inline">›</span>
          <span className="text-[#1a33cc] font-bold border-b-2 border-[#1a33cc] pb-1">Dashboard</span>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href={`/scribe?doctorId=${user.id}`}
            className="flex items-center gap-1.5 bg-[#1a33cc] text-white px-3 sm:px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#1428a0] hover:shadow-md active:scale-95 transition-all duration-100"
          >
            <span className="text-base leading-none">+</span>
            <span>New Encounter</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-10 max-w-[1440px] w-full mx-auto">

        {/* Welcome Header */}
        <section className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-1 sm:mb-2"
              style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}>
            Welcome, Dr. {user.name}
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            {filter === 'pending'
              ? `You have ${pendingApproval} pending documents for review.`
              : 'Manage your patient encounters and clinical notes.'}
          </p>
        </section>

        {/* Stats Bento Grid */}
        <section className="grid grid-cols-3 gap-3 sm:gap-6 mb-8 sm:mb-12">

          {/* Total Encounters */}
          <div
            className="p-3 sm:p-6 rounded-xl flex flex-col gap-2 sm:gap-4 transition-transform duration-200 hover:-translate-y-1"
            style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid #e5e7eb',
              borderLeft: '4px solid #1a33cc',
              boxShadow: '0px 4px 20px rgba(26,51,204,0.06)',
            }}
          >
            <div>
              <p className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Total Encounters</p>
              <p className="text-xl sm:text-2xl font-bold text-black" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {totalEncounters}
              </p>
            </div>
          </div>

          {/* Notes Generated */}
          <div
            className="p-3 sm:p-6 rounded-xl flex flex-col gap-2 sm:gap-4 transition-transform duration-200 hover:-translate-y-1"
            style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid #e5e7eb',
              borderLeft: '4px solid #2563eb',
              boxShadow: '0px 4px 20px rgba(26,51,204,0.06)',
            }}
          >
            <div>
              <p className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Notes Generated</p>
              <p className="text-xl sm:text-2xl font-bold text-black" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {notesGenerated}
              </p>
            </div>
          </div>

          {/* Pending Approval */}
          <Link
            href="/dashboard?filter=pending"
            className="p-3 sm:p-6 rounded-xl flex flex-col gap-2 sm:gap-4 text-left group cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid #e5e7eb',
              borderLeft: '4px solid #ba1a1a',
              boxShadow: '0px 4px 20px rgba(26,51,204,0.06)',
            }}
          >
            <div className="flex justify-end">
              <span className="text-[#ba1a1a] text-xs group-hover:translate-x-1 transition-transform duration-200">→</span>
            </div>
            <div>
              <p className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Pending Approval</p>
              <p className="text-xl sm:text-2xl font-bold text-black" style={{ fontFamily: 'Manrope, sans-serif' }}>
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
            border: '1px solid #e5e7eb',
          }}
        >
          <div className="px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center border-b border-gray-200">
            <h3 className="text-base sm:text-xl font-semibold text-[#1a33cc]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {filter === 'pending' ? 'Pending Approval' : 'Recent Encounters'}
            </h3>
            <div className="flex items-center gap-3">
              {filter === 'pending' && (
                <Link href="/dashboard" className="text-xs sm:text-sm text-[#1a33cc] hover:underline">
                  Show all
                </Link>
              )}
            </div>
          </div>

          {displayEncounters.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center px-4">
              <span className="text-4xl sm:text-5xl">🩺</span>
              <p className="text-base sm:text-lg font-medium text-gray-900">
                {filter === 'pending' ? 'No pending approvals' : 'No encounters yet'}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {filter === 'pending'
                  ? 'All notes have been approved!'
                  : 'Start a new encounter to record and transcribe a patient consultation.'}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block sm:hidden divide-y divide-gray-100">
                {displayEncounters.map((encounter) => {
                  const isDraft = encounter.clinicalNote?.status === 'DRAFT';
                  const status = encounter.clinicalNote?.status;
                  let icdCodes: string[] = [];
                  let cptCodes: string[] = [];
                  try { icdCodes = JSON.parse(encounter.clinicalNote?.icdCodes || '[]'); } catch {}
                  try { cptCodes = JSON.parse(encounter.clinicalNote?.cptCodes || '[]'); } catch {}

                  return (
                    <EncounterRow
                      key={encounter.id}
                      encounterId={encounter.id}
                      doctorId={user.id}
                      isDraft={isDraft}
                    >
                      <td colSpan={7} className="px-4 py-4 w-full">
                        <div className="flex flex-col gap-2">
                          {/* Row 1: Patient + Status */}
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-bold text-gray-800">
                                {encounter.patientName || 'Unknown Patient'}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">{encounter.noteType}</p>
                            </div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                              status === 'APPROVED'
                                ? 'bg-green-100 text-green-700'
                                : status === 'DRAFT'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {status || 'NO NOTE'}
                            </span>
                          </div>

                          {/* Row 2: Date + Note/FHIR */}
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-400">
                              {new Date(encounter.createdAt).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric',
                              })}
                            </p>
                            <div className="flex items-center gap-2">
                              {encounter.clinicalNote && (
                                <span className="text-blue-600 text-xs font-medium flex items-center gap-0.5">
                                  <span className="text-[9px]">✓</span> Generated
                                </span>
                              )}
                              {status === 'APPROVED' && (
                                <FhirDownloadButton encounterId={encounter.id} />
                              )}
                            </div>
                          </div>

                          {/* Row 3: ICD + CPT Codes */}
                          {(icdCodes.length > 0 || cptCodes.length > 0) && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {icdCodes.slice(0, 2).map((code, i) => (
                                <CodeChip key={`icd-${i}`} code={code} defaultConfidence="90" variant="blue" />
                              ))}
                              {cptCodes.slice(0, 2).map((code, i) => (
                                <CodeChip key={`cpt-${i}`} code={code} defaultConfidence="85" variant="purple" />
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </EncounterRow>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto overflow-y-visible">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f0f4ff] text-gray-600">
                      <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">Patient</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">Note Type</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">Date</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-center">Status</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">Note</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">ICD Codes</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold">CPT Codes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {displayEncounters.map((encounter) => (
                      <EncounterRow
                        key={encounter.id}
                        encounterId={encounter.id}
                        doctorId={user.id}
                        isDraft={encounter.clinicalNote?.status === 'DRAFT'}
                      >
                        <td className="px-6 py-4 text-sm font-bold text-gray-800">
                          {encounter.patientName || 'Unknown Patient'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {encounter.noteType}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(encounter.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
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
                            <span className="text-gray-500 font-medium">—</span>
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
                            } catch { return <span className="text-gray-500">—</span> }
                          })() : <span className="text-gray-500">—</span>}
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
                            } catch { return <span className="text-gray-500">—</span> }
                          })() : <span className="text-gray-500">—</span>}
                        </td>
                      </EncounterRow>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Table Footer */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Showing {displayEncounters.length} of {totalEncounters} encounters
            </span>
            <div className="flex gap-2">
              <button className="p-1.5 sm:p-2 border border-gray-200 rounded-lg hover:bg-[#f0f4ff] disabled:opacity-30 transition-colors" disabled>
                ‹
              </button>
              <button className="p-1.5 sm:p-2 border border-gray-200 rounded-lg hover:bg-[#f0f4ff] transition-colors">
                ›
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}