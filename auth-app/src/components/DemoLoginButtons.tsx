'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
// NOTE: adjust this import to wherever your Better Auth client is exported from.
// Most Better Auth + Next.js setups put it at src/lib/auth-client.ts, e.g.:
//   import { createAuthClient } from "better-auth/react"
//   export const authClient = createAuthClient()
import { authClient } from '@/lib/auth-client'

type DemoRole = 'admin' | 'doctor'

const DEMO_ACCOUNTS: Record<DemoRole, { email: string; password: string; redirectTo: string }> = {
  admin: { email: 'admin@clinic.com', password: 'Admin@123', redirectTo: '/admin' },
  doctor: { email: 'doctor@clinic.com', password: 'Doctor@123', redirectTo: '/dashboard' },
}

export function DemoLoginButton({ role, color }: { role: DemoRole; color: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { email, password, redirectTo } = DEMO_ACCOUNTS[role]

    try {
      const { error: signInError } = await authClient.signIn.email({ email, password })

      if (signInError) {
        setError('Demo login failed. Please try again.')
        setLoading(false)
        return
      }

      // Force a full navigation so the session cookie is picked up by the
      // server components on the dashboard/admin route.
      router.push(redirectTo)
      router.refresh()
    } catch (err) {
      setError('Demo login failed. Please try again.')
      setLoading(false)
    }
  }

  const label = role === 'admin' ? 'Login as Admin' : 'Login as Doctor'

  return (
    <div>
      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          display: 'block',
          width: '100%',
          background: color,
          color: '#fff',
          padding: '0.875rem',
          borderRadius: '10px',
          border: 'none',
          fontWeight: 700,
          fontSize: '0.9375rem',
          cursor: loading ? 'wait' : 'pointer',
          opacity: loading ? 0.75 : 1,
        }}
      >
        {loading ? 'Signing in…' : `${label} →`}
      </button>
      {error && (
        <p style={{ color: '#dc2626', fontSize: '0.8125rem', marginTop: '0.5rem' }}>{error}</p>
      )}
    </div>
  )
}