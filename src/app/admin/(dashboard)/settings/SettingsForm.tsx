'use client'
import { useActionState } from 'react'
import type { SiteConfig } from '@/lib/site-config'
import { saveSettingsAction, uploadLogoAction } from './actions'

const INITIAL = { error: '', success: false }

const FONT_OPTIONS = [
  { value: 'poppins',    label: 'Poppins' },
  { value: 'inter',      label: 'Inter' },
  { value: 'montserrat', label: 'Montserrat' },
  { value: 'lato',       label: 'Lato' },
]

const WEIGHT_OPTIONS = [300, 400, 500, 600, 700, 800, 900]

// ── Primitives ──────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4a6a7a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
      {children}
    </label>
  )
}

const inputBase: React.CSSProperties = {
  width: '100%', background: '#0d1a26', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#e8eef4',
  outline: 'none', boxSizing: 'border-box',
}

function Field({ label, name, value, type = 'text', placeholder = '', hint }: {
  label: string; name: string; value: string; type?: string; placeholder?: string; hint?: string
}) {
  return (
    <div>
      <Label>{label}</Label>
      {type === 'textarea' ? (
        <textarea name={name} defaultValue={value} placeholder={placeholder} rows={3}
          style={{ ...inputBase, resize: 'vertical', fontFamily: 'inherit' }} />
      ) : (
        <input name={name} type={type} defaultValue={value} placeholder={placeholder} style={inputBase} />
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
        <input type="color" name={name} defaultValue={value}
          style={{ width: '48px', height: '48px', padding: '3px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', background: '#0d1a26', cursor: 'pointer', display: 'block' }} />
        <div>
          <p style={{ fontSize: '12px', fontFamily: 'monospace', color: '#8aaabb', letterSpacing: '0.05em' }}>{value}</p>
          <p style={{ fontSize: '11px', color: '#2a4a5a', marginTop: '2px' }}>Click swatch to change</p>
        </div>
      </div>
      {hint && <p style={{ fontSize: '11px', color: '#2a4a5a', marginTop: '6px' }}>{hint}</p>}
    </div>
  )
}

const selectStyle: React.CSSProperties = {
  ...inputBase,
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234a6a7a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: '36px',
}

function FontSelect({ label, name, value }: { label: string; name: string; value: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <select name={name} defaultValue={value} style={selectStyle}>
        {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
      </select>
    </div>
  )
}

function WeightSelect({ name, value }: { name: string; value: number }) {
  return (
    <select name={name} defaultValue={value}
      style={{ ...selectStyle, padding: '9px 34px 9px 10px', backgroundPosition: 'right 8px center' }}>
      {WEIGHT_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
    </select>
  )
}

function NumberInput({ name, value, min, max, step = 1 }: { name: string; value: number; min: number; max: number; step?: number }) {
  return (
    <input type="number" name={name} defaultValue={value} min={min} max={max} step={step}
      style={{ ...inputBase, padding: '9px 10px' }} />
  )
}

// ── Sections ─────────────────────────────────────────────────────────────────

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

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '11px', fontWeight: 700, color: '#3a5a6a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
      {children}
    </p>
  )
}

// ── Typography rows ──────────────────────────────────────────────────────────

function TypographyRow({ label, name, size, weight, sizeMin, sizeMax }: {
  label: string; name: string; size: number; weight: number; sizeMin: number; sizeMax: number
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr 1fr', gap: '10px', alignItems: 'center' }}>
      <p style={{ fontSize: '12px', fontWeight: 700, color: '#5a7a8a', lineHeight: 1 }}>{label}</p>
      <div>
        <p style={{ fontSize: '10px', color: '#2a4a5a', marginBottom: '4px' }}>Size (px)</p>
        <NumberInput name={`${name}_size`} value={size} min={sizeMin} max={sizeMax} />
      </div>
      <div>
        <p style={{ fontSize: '10px', color: '#2a4a5a', marginBottom: '4px' }}>Weight</p>
        <WeightSelect name={`${name}_weight`} value={weight} />
      </div>
    </div>
  )
}

// ── Logo upload ──────────────────────────────────────────────────────────────

function LogoUploadForm({ field, currentUrl, label, hint, previewBg }: {
  field: 'logo_light_url' | 'logo_dark_url'
  currentUrl: string
  label: string
  hint: string
  previewBg: string
}) {
  const [state, formAction, isPending] = useActionState(
    uploadLogoAction.bind(null, field),
    { error: '', url: currentUrl },
  )
  const displayUrl = state.url || currentUrl

  return (
    <div>
      <Label>{label}</Label>

      {/* Preview */}
      <div style={{ background: previewBg, border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '14px 18px', marginBottom: '10px', minHeight: '52px', display: 'flex', alignItems: 'center' }}>
        {displayUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={displayUrl} alt={label} style={{ height: '28px', objectFit: 'contain', maxWidth: '200px' }} />
        ) : (
          <p style={{ fontSize: '12px', color: '#2a4a5a' }}>No logo uploaded yet — falls back to /images/{field === 'logo_light_url' ? 'logo-white' : 'logo-dark'}.png</p>
        )}
      </div>

      <form action={formAction} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="file"
          name="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          style={{ flex: 1, fontSize: '12px', color: '#8aaabb', background: '#0d1a26', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 10px', cursor: 'pointer' }}
        />
        <button
          type="submit"
          disabled={isPending}
          style={{ background: isPending ? 'rgba(28,199,195,0.4)' : '#1cc7c3', color: '#070d17', fontWeight: 700, fontSize: '12px', border: 'none', borderRadius: '8px', padding: '9px 18px', cursor: isPending ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
        >
          {isPending ? 'Uploading…' : 'Upload'}
        </button>
      </form>

      {state.error && <p style={{ fontSize: '12px', color: '#f06060', marginTop: '6px' }}>{state.error}</p>}
      {!state.error && state.url && state.url !== currentUrl && (
        <p style={{ fontSize: '12px', color: '#30c060', marginTop: '6px' }}>✓ Logo updated</p>
      )}
      <p style={{ fontSize: '11px', color: '#2a4a5a', marginTop: '6px' }}>{hint}</p>
    </div>
  )
}

// ── Main form ────────────────────────────────────────────────────────────────

export default function SettingsForm({ config }: { config: SiteConfig }) {
  const [state, formAction, isPending] = useActionState(saveSettingsAction, INITIAL)

  return (
    <div>
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

        {/* Colors */}
        <Section title="Brand Colors" description="Changes apply site-wide after saving.">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <ColorField label="Primary / Accent" name="color_primary"    value={config.color_primary}    hint="Buttons, links, highlights" />
            <ColorField label="Page Background"  name="color_background" value={config.color_background} />
            <ColorField label="Surface / Cards"  name="color_surface"    value={config.color_surface}    hint="Cards, panels, sidebars" />
            <ColorField label="Body Text"        name="color_text"       value={config.color_text} />
          </div>
        </Section>

        {/* Typography */}
        <Section title="Typography" description="Controls heading and body type globally.">
          {/* Font families */}
          <div>
            <SubLabel>Font Families</SubLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <FontSelect label="Heading Font (H1–H4)" name="font_heading" value={config.font_heading} />
              <FontSelect label="Body Font (paragraphs)" name="font_body" value={config.font_body} />
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

          {/* Heading scales */}
          <div>
            <SubLabel>Heading Scale</SubLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <TypographyRow label="H1" name="h1" size={config.h1_size} weight={config.h1_weight} sizeMin={24} sizeMax={128} />
              <TypographyRow label="H2" name="h2" size={config.h2_size} weight={config.h2_weight} sizeMin={20} sizeMax={100} />
              <TypographyRow label="H3" name="h3" size={config.h3_size} weight={config.h3_weight} sizeMin={16} sizeMax={80} />
              <TypographyRow label="H4" name="h4" size={config.h4_size} weight={config.h4_weight} sizeMin={14} sizeMax={60} />
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

          {/* Body */}
          <div>
            <SubLabel>Body Text</SubLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <Label>Size (px)</Label>
                <NumberInput name="body_size" value={config.body_size} min={12} max={24} />
              </div>
              <div>
                <Label>Weight</Label>
                <WeightSelect name="body_weight" value={config.body_weight} />
              </div>
              <div>
                <Label>Line Height</Label>
                <NumberInput name="body_line_height" value={config.body_line_height} min={1} max={3} step={0.1} />
              </div>
            </div>
          </div>

          {/* Live preview */}
          <div style={{ background: '#070d17', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '20px 22px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#2a4a5a', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px' }}>Type Preview (current saved values)</p>
            <p style={{ fontSize: `${config.h1_size}px`, fontWeight: config.h1_weight, color: '#c0d0e0', lineHeight: 1.1, marginBottom: '4px' }}>H1 Heading</p>
            <p style={{ fontSize: `${config.h2_size}px`, fontWeight: config.h2_weight, color: '#a0b4c4', lineHeight: 1.15, marginBottom: '4px' }}>H2 Heading</p>
            <p style={{ fontSize: `${config.h3_size}px`, fontWeight: config.h3_weight, color: '#809aaa', lineHeight: 1.2, marginBottom: '4px' }}>H3 Heading</p>
            <p style={{ fontSize: `${config.h4_size}px`, fontWeight: config.h4_weight, color: '#6080909', lineHeight: 1.3, marginBottom: '8px' }}>H4 Heading</p>
            <p style={{ fontSize: `${config.body_size}px`, fontWeight: config.body_weight, lineHeight: config.body_line_height, color: '#4a6a7a' }}>
              Body — The quick brown fox jumps over the lazy dog. 0123456789
            </p>
          </div>
        </Section>

        {/* SEO */}
        <Section title="SEO Defaults">
          <Field label="Default Meta Title" name="meta_title" value={config.meta_title}
            placeholder="SC Creative — Walker County's Growth Partner"
            hint="Fallback title when no page-specific title is set." />
          <Field label="Default Meta Description" name="meta_description" value={config.meta_description} type="textarea"
            placeholder="We build the digital systems that grow local businesses in Walker County, AL."
            hint="160 characters max for best search results." />
        </Section>

        {/* Social */}
        <Section title="Social Links">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Facebook"    name="facebook_url"   value={config.facebook_url}   placeholder="https://facebook.com/…" />
            <Field label="Instagram"   name="instagram_url"  value={config.instagram_url}  placeholder="https://instagram.com/…" />
            <Field label="LinkedIn"    name="linkedin_url"   value={config.linkedin_url}   placeholder="https://linkedin.com/in/…" />
            <Field label="Twitter / X" name="twitter_url"    value={config.twitter_url}    placeholder="https://twitter.com/…" />
            <Field label="YouTube"     name="youtube_url"    value={config.youtube_url}    placeholder="https://youtube.com/@…" />
          </div>
        </Section>

        {/* Save */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '4px', marginBottom: '32px' }}>
          <button
            type="submit"
            disabled={isPending}
            style={{ background: isPending ? 'rgba(28,199,195,0.5)' : '#1cc7c3', color: '#070d17', fontWeight: 700, fontSize: '13px', border: 'none', borderRadius: '8px', padding: '11px 24px', cursor: isPending ? 'not-allowed' : 'pointer' }}
          >
            {isPending ? 'Saving…' : 'Save Settings'}
          </button>
          {state.success && <span style={{ fontSize: '13px', color: '#30c060', fontWeight: 600 }}>✓ Saved</span>}
          {state.error   && <span style={{ fontSize: '13px', color: '#f06060' }}>{state.error}</span>}
        </div>
      </form>

      {/* Logos — separate forms, can't be nested inside the main form */}
      <Section title="Logos" description="Upload PNG, JPG, SVG, or WebP. Max 2 MB. Requires the 'logos' Supabase Storage bucket to be public.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <LogoUploadForm
            field="logo_light_url"
            currentUrl={config.logo_light_url}
            label="Light Logo (for dark backgrounds)"
            hint="Used in the footer, dark hero sections, admin sidebar."
            previewBg="#070d17"
          />
          <LogoUploadForm
            field="logo_dark_url"
            currentUrl={config.logo_dark_url}
            label="Dark Logo (for light backgrounds)"
            hint="Used in the navigation pill."
            previewBg="#ffffff"
          />
        </div>
      </Section>
    </div>
  )
}
