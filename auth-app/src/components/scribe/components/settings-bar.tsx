"use client"

import { Settings } from "lucide-react"

interface SettingsBarProps {
  onOpenSettings: () => void
}

export function SettingsBar({ onOpenSettings }: SettingsBarProps) {
  return (
    <div className="shrink-0 p-4" style={{ borderTop: '1px solid #e5e7eb', background: 'white' }}>
      <button
        onClick={onOpenSettings}
        className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
        style={{ color: '#4b5563' }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#f0f4ff'
          e.currentTarget.style.color = '#1a33cc'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = '#4b5563'
        }}
      >
        <Settings className="h-4 w-4 text-[#1a33cc]" />
        <span>Settings</span>
      </button>
    </div>
  )
}