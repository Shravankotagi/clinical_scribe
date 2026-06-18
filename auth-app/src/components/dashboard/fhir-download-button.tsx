'use client'

export function FhirDownloadButton({ encounterId }: { encounterId: string }) {
  return (
    <a
      href={`/api/encounters/fhir-export?encounterId=${encounterId}`}
      download={`fhir-${encounterId}.json`}
      onClick={e => e.stopPropagation()}
      className="flex items-center gap-0.5 px-2 py-0.5 bg-[#e6fcf5] text-emerald-700 rounded-md text-[10px] font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors"
    >
      <span>↓</span> FHIR
    </a>
  )
}