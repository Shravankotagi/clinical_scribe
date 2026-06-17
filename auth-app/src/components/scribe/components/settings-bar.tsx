"use client"

import { Settings } from "lucide-react"

interface SettingsBarProps {
  onOpenSettings: () => void
}

export function SettingsBar({ onOpenSettings }: SettingsBarProps) {
  return (
    <div className="shrink-0 p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: '#0f1e6e' }}>
      <button
        onClick={onOpenSettings}
        className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
        style={{ color: 'rgba(255,255,255,0.65)' }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
          e.currentTarget.style.color = 'white'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
        }}
      >
        <Settings className="h-4 w-4" style={{ color: '#60a5fa' }} />
        <span>Settings</span>
      </button>
    </div>
  )
}