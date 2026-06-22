'use client'
// Shared admin UI primitives used across all admin modules

import React from 'react'

// ── Form primitives ──────────────────────────────────────────────────────────

export const inputStyle: React.CSSProperties = {
  width: '100%', background: '#0d1a26', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#e8eef4',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
}

export const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234a6a7a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: '36px',
}

export function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4a6a7a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
      {children}
    </label>
  )
}

export function FormField({ label, name, value, type = 'text', placeholder = '', hint, required }: {
  label: string; name: string; value?: string; type?: string; placeholder?: string; hint?: string; required?: boolean
}) {
  return (
    <div>
      <FormLabel>{label}{required && <span style={{ color: '#f06060', marginLeft: '3px' }}>*</span>}</FormLabel>
      {type === 'textarea' ? (
        <textarea name={name} defaultValue={value} placeholder={placeholder} rows={3}
          style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} />
      ) : (
        <input name={name} type={type} defaultValue={value} placeholder={placeholder} style={inputStyle} />
      )}
      {hint && <p style={{ fontSize: '11px', color: '#2a4a5a', marginTop: '4px' }}>{hint}</p>}
    </div>
  )
}

export function FormSelect({ label, name, value, options, hint }: {
  label: string; name: string; value?: string
  options: { value: string; label: string }[]
  hint?: string
}) {
  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <select name={name} defaultValue={value} style={selectStyle}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint && <p style={{ fontSize: '11px', color: '#2a4a5a', marginTop: '4px' }}>{hint}</p>}
    </div>
  )
}

export function FormCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#0b1520', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
      {title && (
        <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#4a6a7a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{title}</p>
        </div>
      )}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {children}
      </div>
    </div>
  )
}

// ── Status badge ─────────────────────────────────────────────────────────────

export function StatusBadge({ status }: { status: string }) {
  const isPublished = status === 'published'
  return (
    <span style={{
      fontSize: '11px', fontWeight: 600, borderRadius: '4px', padding: '2px 8px',
      background: isPublished ? 'rgba(48,192,96,0.12)' : 'rgba(74,106,122,0.15)',
      border: `1px solid ${isPublished ? 'rgba(48,192,96,0.25)' : 'rgba(74,106,122,0.2)'}`,
      color: isPublished ? '#30c060' : '#4a6a7a',
    }}>
      {isPublished ? 'Published' : 'Draft'}
    </span>
  )
}

// ── Page shell ────────────────────────────────────────────────────────────────

export function AdminPageHeader({ title, subtitle, action }: {
  title: string; subtitle?: string; action?: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f0f4f8', marginBottom: '4px' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '13px', color: '#4a6a7a' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function NewButton({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#1cc7c3', color: '#070d17', fontWeight: 700, fontSize: '13px', textDecoration: 'none', borderRadius: '8px', padding: '9px 18px' }}>
      + {label}
    </a>
  )
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#4a6a7a', textDecoration: 'none', marginBottom: '20px' }}>
      ← {label}
    </a>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center', background: '#0b1520', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
      <p style={{ fontSize: '14px', color: '#2a4a5a' }}>{message}</p>
    </div>
  )
}

// ── Table ─────────────────────────────────────────────────────────────────────

export function AdminTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div style={{ background: '#0b1520', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {headers.map(h => (
              <th key={h} style={{ padding: '10px 18px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#2a4a5a', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function AdminTableRow({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return (
    <tr style={{ borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.04)' }}>
      {children}
    </tr>
  )
}

export function AdminTableCell({ children, muted, mono }: { children: React.ReactNode; muted?: boolean; mono?: boolean }) {
  return (
    <td style={{ padding: '12px 18px', fontSize: '13px', color: muted ? '#4a6a7a' : '#c0d0e0', fontFamily: mono ? 'monospace' : 'inherit' }}>
      {children}
    </td>
  )
}

// ── Delete button (form + confirm) ───────────────────────────────────────────

export function DeleteButton({ action, noun = 'record' }: { action: () => Promise<void>; noun?: string }) {
  return (
    <form
      action={action}
      onSubmit={e => {
        if (!confirm(`Delete this ${noun}? This cannot be undone.`)) e.preventDefault()
      }}
    >
      <button type="submit"
        style={{ fontSize: '12px', fontWeight: 600, color: '#f06060', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}
      >
        Delete
      </button>
    </form>
  )
}

// ── Save bar ─────────────────────────────────────────────────────────────────

export function SaveBar({ isPending, success, error }: { isPending: boolean; success: boolean; error: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <button type="submit" disabled={isPending}
        style={{ background: isPending ? 'rgba(28,199,195,0.5)' : '#1cc7c3', color: '#070d17', fontWeight: 700, fontSize: '13px', border: 'none', borderRadius: '8px', padding: '10px 22px', cursor: isPending ? 'not-allowed' : 'pointer' }}
      >
        {isPending ? 'Saving…' : 'Save'}
      </button>
      {success && <span style={{ fontSize: '13px', color: '#30c060', fontWeight: 600 }}>✓ Saved</span>}
      {error   && <span style={{ fontSize: '13px', color: '#f06060' }}>{error}</span>}
    </div>
  )
}
