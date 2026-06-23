'use client'
import { useActionState, useState } from 'react'
import type { CSSProperties } from 'react'
import { submitLeadAction } from './lead-actions'
import type { LeadInput } from './lead-validation'

const CHALLENGES = [
  'Not enough leads/customers',
  'Outdated or no website',
  'Weak/inconsistent branding',
  'Manual work eating my time (AI/automation)',
  'Launching something new',
  'Other',
]
const SERVICES  = ['Strategy/Blueprint', 'Branding', 'Website', 'AI Systems', 'Growth/Marketing']
const STAGES    = ['Just starting', 'Established, growing', 'Scaling']
const BUDGETS   = ['<$2k', '$2–5k', '$5–10k', '$10k+', 'Not sure']
const TIMELINES = ['ASAP', '1–3 months', 'Just exploring']
const WEBSITES  = ['Yes', 'No', 'Needs rebuild']

const TEAL = '#1cc7c3'
const INK  = '#0b1520'

const card: CSSProperties = {
  background: '#ffffff', border: '1px solid rgba(13,21,32,0.08)', borderTop: `3px solid ${TEAL}`,
  borderRadius: '18px', padding: '28px 26px', boxShadow: '0 18px 50px rgba(13,21,32,0.10)',
}
const label: CSSProperties = { fontSize: '13px', fontWeight: 700, color: INK, marginBottom: '12px', display: 'block' }
const input: CSSProperties = {
  width: '100%', background: '#f7f9fc', border: '1px solid rgba(13,21,32,0.12)', borderRadius: '10px',
  padding: '11px 13px', fontSize: '14px', color: INK, outline: 'none', boxSizing: 'border-box',
}
const pill = (active: boolean): CSSProperties => ({
  textAlign: 'left', width: '100%', cursor: 'pointer', padding: '11px 14px', borderRadius: '10px', fontSize: '13.5px',
  border: `1px solid ${active ? TEAL : 'rgba(13,21,32,0.12)'}`,
  background: active ? 'rgba(28,199,195,0.10)' : '#ffffff',
  color: active ? '#0e7a78' : '#46566a', fontWeight: active ? 700 : 500, transition: 'all 0.15s ease',
})

const EMPTY: LeadInput = {
  challenge: '', services: [], industry: '', stage: '', budget: '', timeline: '',
  has_website: '', name: '', business_name: '', email: '', phone: '', notes: '', company_website: '',
}

export default function OnboardingForm() {
  const [step, setStep] = useState(1)
  const [a, setA] = useState<LeadInput>(EMPTY)
  const [stepError, setStepError] = useState('')
  const [state, submit, isPending] = useActionState(submitLeadAction, { ok: false, error: '' })

  const set = (patch: Partial<LeadInput>) => setA(prev => ({ ...prev, ...patch }))
  const toggleService = (s: string) =>
    set({ services: a.services.includes(s) ? a.services.filter(x => x !== s) : [...a.services, s] })

  function next() {
    if (step === 1 && !a.challenge) { setStepError('Pick the option that fits best.'); return }
    setStepError(''); setStep(s => Math.min(4, s + 1))
  }
  function back() { setStepError(''); setStep(s => Math.max(1, s - 1)) }

  function onSubmit() {
    const email = a.email.trim()
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setStepError('Enter a valid email so we can reach you.'); return }
    setStepError(''); submit(a)
  }

  if (state.ok) {
    return (
      <div style={card}>
        <div style={{ fontSize: '15px', fontWeight: 800, color: INK, marginBottom: '8px' }}>Thanks{a.name ? `, ${a.name.split(' ')[0]}` : ''} — request received.</div>
        <p style={{ fontSize: '13.5px', color: '#5a6a7a', lineHeight: 1.6 }}>
          We&apos;ll review what you shared and reach out within 1 business day to talk through your project and a quote.
        </p>
      </div>
    )
  }

  return (
    <div style={card}>
      {/* progress */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEAL }}>Start your project</span>
          <span style={{ fontSize: '11px', color: '#8a98a6' }}>Step {step} of 4</span>
        </div>
        <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(13,21,32,0.08)' }}>
          <div style={{ height: '100%', width: `${(step / 4) * 100}%`, borderRadius: '2px', background: TEAL, transition: 'width 0.25s ease' }} />
        </div>
      </div>

      {step === 1 && (
        <div>
          <label style={label}>What&apos;s your biggest challenge right now?</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {CHALLENGES.map(c => (
              <button key={c} type="button" style={pill(a.challenge === c)} onClick={() => set({ challenge: c })}>{c}</button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={label}>Which services are you interested in?</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SERVICES.map(s => (
                <button key={s} type="button" style={{ ...pill(a.services.includes(s)), width: 'auto' }} onClick={() => toggleService(s)}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={label}>What does your business do?</label>
            <input style={input} value={a.industry} onChange={e => set({ industry: e.target.value })} placeholder="e.g. Roofing, dental, restaurant…" />
          </div>
          <div>
            <label style={label}>Where are you at?</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {STAGES.map(s => (
                <button key={s} type="button" style={{ ...pill(a.stage === s), width: 'auto' }} onClick={() => set({ stage: s })}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={label}>Rough budget?</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {BUDGETS.map(b => (
                <button key={b} type="button" style={{ ...pill(a.budget === b), width: 'auto' }} onClick={() => set({ budget: b })}>{b}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={label}>Timeline?</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {TIMELINES.map(tline => (
                <button key={tline} type="button" style={{ ...pill(a.timeline === tline), width: 'auto' }} onClick={() => set({ timeline: tline })}>{tline}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={label}>Do you have a website now?</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {WEBSITES.map(w => (
                <button key={w} type="button" style={{ ...pill(a.has_website === w), width: 'auto' }} onClick={() => set({ has_website: w })}>{w}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div><label style={label}>Your name</label><input style={input} value={a.name} onChange={e => set({ name: e.target.value })} placeholder="Full name" /></div>
          <div><label style={label}>Business name</label><input style={input} value={a.business_name} onChange={e => set({ business_name: e.target.value })} placeholder="Business name" /></div>
          <div><label style={label}>Email *</label><input style={input} type="email" value={a.email} onChange={e => set({ email: e.target.value })} placeholder="you@business.com" /></div>
          <div><label style={label}>Phone (optional)</label><input style={input} value={a.phone} onChange={e => set({ phone: e.target.value })} placeholder="(555) 555-5555" /></div>
          <div><label style={label}>Anything else?</label><textarea style={{ ...input, minHeight: '64px', resize: 'vertical' }} value={a.notes} onChange={e => set({ notes: e.target.value })} placeholder="Tell us a bit more…" /></div>
          {/* honeypot — visually hidden, off-screen, not tab-focusable */}
          <input
            type="text" name="company_website" tabIndex={-1} autoComplete="off"
            value={a.company_website} onChange={e => set({ company_website: e.target.value })}
            aria-hidden style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
          />
        </div>
      )}

      {(stepError || state.error) && (
        <p style={{ fontSize: '12.5px', color: '#d4574e', marginTop: '12px', marginBottom: 0 }}>{stepError || state.error}</p>
      )}

      {/* nav */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
        {step > 1 && (
          <button type="button" onClick={back} disabled={isPending}
            style={{ flex: '0 0 auto', padding: '12px 18px', borderRadius: '10px', border: '1px solid rgba(13,21,32,0.14)', background: '#fff', color: '#46566a', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
            Back
          </button>
        )}
        {step < 4 ? (
          <button type="button" onClick={next}
            style={{ flex: 1, padding: '12px 18px', borderRadius: '10px', border: 'none', background: TEAL, color: '#06201f', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>
            Continue →
          </button>
        ) : (
          <button type="button" onClick={onSubmit} disabled={isPending}
            style={{ flex: 1, padding: '12px 18px', borderRadius: '10px', border: 'none', background: isPending ? 'rgba(28,199,195,0.6)' : TEAL, color: '#06201f', fontWeight: 800, fontSize: '14px', cursor: isPending ? 'not-allowed' : 'pointer' }}>
            {isPending ? 'Sending…' : 'Request My Quote'}
          </button>
        )}
      </div>

      <p style={{ fontSize: '11.5px', color: '#8a98a6', textAlign: 'center', marginTop: '14px', marginBottom: 0 }}>
        🔒 No spam — just a real conversation. Takes about a minute.
      </p>
    </div>
  )
}
