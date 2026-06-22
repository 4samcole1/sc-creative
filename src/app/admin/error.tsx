'use client'
import { useEffect } from 'react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Admin Error]', error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#070d17',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          background: '#0b1520',
          border: '1px solid rgba(240,96,96,0.2)',
          borderRadius: '12px',
          padding: '32px',
        }}
      >
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f06060', marginBottom: '12px' }}>
          Server Error
        </p>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f0f4f8', marginBottom: '8px' }}>
          Something went wrong
        </h2>
        <p style={{ fontSize: '13px', color: '#4a6a7a', marginBottom: '8px' }}>
          {error.message || 'An unexpected error occurred.'}
        </p>
        {error.digest && (
          <p style={{ fontSize: '11px', color: '#2a4a5a', marginBottom: '20px', fontFamily: 'monospace' }}>
            ID: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          style={{
            background: '#1cc7c3', color: '#070d17', fontWeight: 700, fontSize: '13px',
            border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </div>
    </div>
  )
}
