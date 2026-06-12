'use client'
import { useActionState } from 'react'
import { saveSettingsAction, type SiteConfig } from './actions'

const initial = { error: '', success: false }

function Field({
  label, name, value, type = 'text', placeholder = '', hint,
}: {
  label: string
  name: string
  value: string
  type?: string
  placeholder?: string
  hint?: string
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4a6a7a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          defaultValue={value}
          placeholder={placeholder}
          rows={3}
          style={{
            width: '100%', background: '#0d1a26', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#e8eef4',
            outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit',
          }}
        />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={value}
          placeholder={placeholder}
          style={{
            width: '100%', background: '#0d1a26', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#e8eef4',
            outline: 'none', boxSizing: 'border-box',
          }}
        />
      )}
      {hint && <p style={{ fontSize: '11px', color: '#2a4a5a', marginTop: '4px' }}>{hint}</p>}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#0b1520', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
      <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#7a9aaa' }}>{title}</h2>
      </div>
      <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {children}
      </div>
    </div>
  )
}

export default function SettingsForm({ config }: { config: SiteConfig }) {
  const [state, formAction, isPending] = useActionState(saveSettingsAction, initial)

  return (
    <form action={formAction}>
      <Section title="Business">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Business Name" name="business_name" value={config.business_name} placeholder="SC Creative" />
          <Field label="Tagline" name="tagline" value={config.tagline} placeholder="Walker County's Growth Partner" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Phone" name="phone" value={config.phone} type="tel" placeholder="(678) 997-1106" />
          <Field label="Email" name="email" value={config.email} type="email" placeholder="info@samcolecreative.com" />
        </div>
        <Field label="Address" name="address" value={config.address} placeholder="Jasper, AL" />
      </Section>

      <Section title="SEO Defaults">
        <Field
          label="Default Meta Title"
          name="meta_title"
          value={config.meta_title}
          placeholder="SC Creative — Walker County's Growth Partner"
          hint="Used as the fallback page title when no page-specific title is set."
        />
        <Field
          label="Default Meta Description"
          name="meta_description"
          value={config.meta_description}
          type="textarea"
          placeholder="We build the digital systems that grow local businesses in Walker County, AL."
          hint="160 characters max for best results in search."
        />
      </Section>

      <Section title="Social Links">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Facebook" name="facebook_url" value={config.facebook_url} placeholder="https://facebook.com/…" />
          <Field label="Instagram" name="instagram_url" value={config.instagram_url} placeholder="https://instagram.com/…" />
          <Field label="LinkedIn" name="linkedin_url" value={config.linkedin_url} placeholder="https://linkedin.com/in/…" />
          <Field label="Twitter / X" name="twitter_url" value={config.twitter_url} placeholder="https://twitter.com/…" />
          <Field label="YouTube" name="youtube_url" value={config.youtube_url} placeholder="https://youtube.com/@…" />
        </div>
      </Section>

      {/* Footer actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '4px' }}>
        <button
          type="submit"
          disabled={isPending}
          style={{
            background: isPending ? 'rgba(28,199,195,0.5)' : '#1cc7c3',
            color: '#070d17', fontWeight: 700, fontSize: '13px', border: 'none',
            borderRadius: '8px', padding: '11px 24px', cursor: isPending ? 'not-allowed' : 'pointer',
            transition: 'opacity 0.15s ease',
          }}
        >
          {isPending ? 'Saving…' : 'Save Settings'}
        </button>

        {state.success && (
          <span style={{ fontSize: '13px', color: '#30c060', fontWeight: 600 }}>
            ✓ Saved
          </span>
        )}
        {state.error && (
          <span style={{ fontSize: '13px', color: '#f06060' }}>
            {state.error}
          </span>
        )}
      </div>
    </form>
  )
}
