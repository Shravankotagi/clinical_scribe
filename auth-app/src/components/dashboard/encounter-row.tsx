'use client'

interface EncounterRowProps {
  encounterId: string
  doctorId: string
  isDraft: boolean
  children: React.ReactNode
  as?: 'tr' | 'div'
  className?: string
}

export function EncounterRow({
  encounterId,
  doctorId,
  children,
  as = 'tr',
  className = "hover:bg-[#f0f4ff] transition-colors cursor-pointer"
}: EncounterRowProps) {
  const Component = as
  return (
    <Component
      className={className}
      onClick={() => {
        window.location.href = `/scribe?doctorId=${doctorId}&encounterId=${encounterId}`
      }}
    >
      {children}
    </Component>
  )
}