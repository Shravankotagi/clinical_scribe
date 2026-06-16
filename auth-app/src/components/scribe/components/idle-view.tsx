"use client"

interface IdleViewProps {
  onStartNew: () => void
}

export function IdleView({ onStartNew }: IdleViewProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 gap-8" style={{ background: '#f5f7ff' }}>
      
      {/* Microphone Button with pulse rings */}
      <div className="relative group">
        <div
          className="absolute rounded-full animate-ping"
          style={{
            inset: '-32px',
            background: 'rgba(26, 51, 204, 0.1)',
          }}
        />
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            inset: '-16px',
            background: 'rgba(26, 51, 204, 0.2)',
          }}
        />
        <button
          onClick={onStartNew}
          className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-300 active:scale-95"
          style={{ background: '#1a33cc', color: 'white' }}
        >
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </button>
      </div>

      {/* Text */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2" style={{ color: '#0A0F2C' }}>
          Start a New Session
        </h2>
        <p className="text-lg" style={{ color: '#6b7280' }}>
          Ambiently record your clinical encounter.
        </p>
      </div>

      {/* Info Pills */}
      <div className="flex gap-4 flex-wrap justify-center">
        <div
          className="px-6 py-3 rounded-full flex items-center gap-2 border"
          style={{ background: 'white', borderColor: '#e5e7eb', color: '#6b7280' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          <span className="text-sm font-semibold">Mic: System Default</span>
        </div>
        <div
          className="px-6 py-3 rounded-full flex items-center gap-2 border"
          style={{ background: 'white', borderColor: '#e5e7eb', color: '#6b7280' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <span className="text-sm font-semibold">Language: English</span>
        </div>
      </div>

    </div>
  )
}