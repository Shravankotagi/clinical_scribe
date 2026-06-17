'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function AutoRefresh({ intervalMs = 5000 }: { intervalMs?: number }) {
  const router = useRouter()

  useEffect(() => {
    const channel = new BroadcastChannel('dashboard_refresh')
    
    const handleMessage = () => {
      router.refresh()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') router.refresh()
    }

    const handleFocus = () => router.refresh()

    channel.addEventListener('message', handleMessage)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    const interval = setInterval(() => router.refresh(), intervalMs)

    return () => {
      channel.removeEventListener('message', handleMessage)
      channel.close()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      clearInterval(interval)
    }
  }, [router, intervalMs])

  return null
}