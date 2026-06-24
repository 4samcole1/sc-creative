'use client'
import { useActionState, useState } from 'react'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import { loginAction } from './actions'

const initialState = { error: '' }

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#070d17',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Image
            src="/images/logo-white.png"
            alt="SC Creative"
            width={160}
            height={23}
            style={{ height: '26px', width: 'auto', display: 'inline-block' }}
          />
          <p style={{ fontSize: '12px', color: '#3a5a6a', marginTop: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
            Admin Dashboard
          </p>
        </div>

        <div
          style={{
            background: '#0b1520',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px',
            padding: '36px 32px',
          }}
        >
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#f0f4f8', marginBottom: '6px' }}>
            Sign in
          </h1>
          <p style={{ fontSize: '13px', color: '#4a6070', marginBottom: '28px' }}>
            Admin access only
          </p>

          <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7a8898', marginBottom: '6px', letterSpacing: '0.06em' }}>
                EMAIL
              </label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                style={{
                  width: '100%', background: '#0d1a26', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px', padding: '11px 14px', fontSize: '14px', color: '#e8eef4',
                  outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(28,199,195,0.4)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7a8898', marginBottom: '6px', letterSpacing: '0.06em' }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  style={{
                    width: '100%', background: '#0d1a26', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px', padding: '11px 44px 11px 14px', fontSize: '14px', color: '#e8eef4',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(28,199,195,0.4)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute', top: '50%', right: '8px', transform: 'translateY(-50%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'none', border: 'none', padding: '6px', cursor: 'pointer', color: '#5a7080',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#1cc7c3')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#5a7080')}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {state.error && (
              <p style={{ fontSize: '13px', color: '#f06060', background: 'rgba(240,96,96,0.08)', border: '1px solid rgba(240,96,96,0.18)', borderRadius: '6px', padding: '9px 12px', margin: 0 }}>
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              style={{
                marginTop: '4px', background: isPending ? 'rgba(28,199,195,0.5)' : '#1cc7c3',
                color: '#070d17', fontWeight: 700, fontSize: '14px', border: 'none',
                borderRadius: '8px', padding: '12px', cursor: isPending ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.15s ease',
              }}
            >
              {isPending ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
