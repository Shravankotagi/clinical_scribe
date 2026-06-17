'use client'

interface EncounterRowProps {
  encounterId: string
  doctorId: string
  isDraft: boolean
  children: React.ReactNode
}

export function EncounterRow({ encounterId, doctorId, isDraft, children }: EncounterRowProps) {
  return (
    <tr
      className="hover:bg-[#f0f4ff] transition-colors"
      style={{ cursor: isDraft ? 'pointer' : 'default' }}
      onClick={() => {
        if (isDraft) {
          window.location.href = `/scribe?doctorId=${doctorId}&encounterId=${encounterId}`
        }
      }}
    >
      {children}
    </tr>
  )
}