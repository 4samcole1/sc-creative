'use client'
import { useActionState } from 'react'
import { saveSettingsAction, type SiteConfig } from './actions'

const initial = { error: '', success: false }

const FONT_OPTIONS = [
  { value: 'poppins',    label: 'Poppins',    preview: 'Geometric, modern, friendly' },
  { value: 'inter',      label: 'Inter',      preview: 'Clean, neutral, highly legible' },
  { value: 'montserrat', label: 'Montserrat', preview: 'Bold, geometric, professional' },
  { value: 'lato',       label: 'Lato',       preview: 'Humanist, warm, approachable' },
]

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4a6a7a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
      {children}
    </label>
  )
}

function Field({
  label, name, value, type = 'text', placeholder = '', hint,
}: {
  label: string; name: string; value: string; type?: string; placeholder?: string; hint?: string
}) {
  return (
    <div>
      <Label>{label}</Label>
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

function ColorField({ label, name, value, hint }: { label: string; name: string; value: string; hint?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <input
            type="color"
            name={name}
            defaultValue={value}
            style={{
              width: '48px',
              height: '48px',
              padding: '3px',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              background: '#0d1a26',
              cursor: 'pointer',
              display: 'block',
            }}
          />
        </div>
        <div>
          <p style={{ fontSize: '13px', fontFamily: 'monospace', color: '#8aaabb', letterSpacing: '0.05em' }}>{value}</p>
          <p style={{ fontSize: '11px', color: '#2a4a5a', marginTop: '2px' }}>Click to change</p>
        </div>
      </div>
      {hint && <p style={{ fontSize: '11px', color: '#2a4a5a', marginTop: '6px' }}>{hint}</p>}
    </div>
  )
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#0b1520', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
      <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#7a9aaa' }}>{title}</h2>
        {description && <p style={{ fontSize: '12px', color: '#2a4a5a', marginTop: '3px' }}>{description}</p>}
      </div>
      <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {children}
      </div>
    </div>
  )
}

export default function SettingsForm({ config }: { config: SiteConfig }) {
  const [state, formAction, isPending] = useActionState(saveSettingsAction, initial)

  return (
    <form action={formAction}>

      {/* Business */}
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

      {/* Design & Theme */}
      <Section
        title="Design & Theme"
        description="Changes take effect on the next page load after saving."
      >
        {/* Colors */}
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#3a5a6a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>
            Colors
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <ColorField
              label="Primary / Brand"
              name="color_primary"
              value={config.color_primary}
              hint="Buttons, links, highlights"
            />
            <ColorField
              label="Page Background"
              name="color_background"
              value={config.color_background}
            />
            <ColorField
              label="Surface / Cards"
              name="color_surface"
              value={config.color_surface}
              hint="Cards, panels, nav"
            />
            <ColorField
              label="Body Text"
              name="color_text"
              value={config.color_text}
            />
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

        {/* Typography */}
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#3a5a6a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>
            Typography
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start' }}>
            <div>
              <Label>Font Family</Label>
              <select
                name="font_family"
                defaultValue={config.font_family}
                style={{
                  width: '100%', background: '#0d1a26', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#e8eef4',
                  outline: 'none', cursor: 'pointer', appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%234a6a7a\' stroke-width=\'2\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  paddingRight: '36px',
                }}
              >
                {FONT_OPTIONS.map(f => (
                  <option key={f.value} value={f.value}>{f.label} — {f.preview}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Base Font Size (px)</Label>
              <input
                type="number"
                name="font_size_base"
                defaultValue={config.font_size_base}
                min={12}
                max={24}
                step={1}
                style={{
                  width: '100%', background: '#0d1a26', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#e8eef4',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              <p style={{ fontSize: '11px', color: '#2a4a5a', marginTop: '4px' }}>12–24px</p>
            </div>
          </div>

          {/* Font preview */}
          <div style={{ marginTop: '16px', background: '#070d17', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px 18px' }}>
            <p style={{ fontSize: '11px', color: '#2a4a5a', marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>Preview</p>
            <p style={{ fontSize: '22px', fontWeight: 700, color: '#c0d0e0', lineHeight: 1.2, marginBottom: '4px' }}>
              The quick brown fox
            </p>
            <p style={{ fontSize: '14px', color: '#4a6a7a', lineHeight: 1.5 }}>
              jumps over the lazy dog. 0123456789
            </p>
          </div>
        </div>
      </Section>

      {/* SEO Defaults */}
      <Section title="SEO Defaults">
        <Field
          label="Default Meta Title"
          name="meta_title"
          value={config.meta_title}
          placeholder="SC Creative — Walker County's Growth Partner"
          hint="Fallback page title when no page-specific title is set."
        />
        <Field
          label="Default Meta Description"
          name="meta_description"
          value={config.meta_description}
          type="textarea"
          placeholder="We build the digital systems that grow local businesses in Walker County, AL."
          hint="160 characters max for best search results."
        />
      </Section>

      {/* Social Links */}
      <Section title="Social Links">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Facebook"   name="facebook_url"   value={config.facebook_url}   placeholder="https://facebook.com/…" />
          <Field label="Instagram"  name="instagram_url"  value={config.instagram_url}  placeholder="https://instagram.com/…" />
          <Field label="LinkedIn"   name="linkedin_url"   value={config.linkedin_url}   placeholder="https://linkedin.com/in/…" />
          <Field label="Twitter / X" name="twitter_url"  value={config.twitter_url}    placeholder="https://twitter.com/…" />
          <Field label="YouTube"    name="youtube_url"    value={config.youtube_url}    placeholder="https://youtube.com/@…" />
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
          }}
        >
          {isPending ? 'Saving…' : 'Save Settings'}
        </button>

        {state.success && (
          <span style={{ fontSize: '13px', color: '#30c060', fontWeight: 600 }}>✓ Saved — reload the site to see changes</span>
        )}
        {state.error && (
          <span style={{ fontSize: '13px', color: '#f06060' }}>{state.error}</span>
        )}
      </div>
    </form>
  )
}
