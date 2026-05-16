'use client'
import { useState } from 'react'

const serviceOptions = ['Brand & Logo', 'Website', 'SEO & Growth', 'AI Systems', 'Everything — Full System']

export default function QuoteForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    const res = await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setStatus(res.ok ? 'success' : 'error')
  }

  return (
    <section id="quote" className="bg-[#0d1f35] py-[90px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="grid grid-cols-2 gap-16 items-start">
          <div>
            <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3">Get Started</div>
            <h2 className="text-[clamp(24px,3vw,38px)] font-extrabold text-white leading-[1.2] mb-4">
              Let&apos;s Talk About Your Business
            </h2>
            <p className="text-[15px] text-white/55 leading-[1.7] mb-7">
              Tell us a bit about where you are and what you&apos;re trying to grow — we&apos;ll put together a custom plan for you.
            </p>
            <div className="flex flex-col gap-3">
              {['No obligation, no hard sell', 'Custom quote based on your goals', 'Response within 24 hours'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-[13px] text-white/60">
                  <span className="text-white text-base">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-white mb-2">You&apos;re all set!</h3>
              <p className="text-white/60 text-sm">We&apos;ll be in touch within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[12px] font-semibold text-white/60 mb-1.5 tracking-[.04em]">First Name</label>
                  <input name="first_name" required placeholder="John" className="w-full bg-white/[.07] border border-white/15 rounded-md px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#00b5a5] transition-colors" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-white/60 mb-1.5 tracking-[.04em]">Last Name</label>
                  <input name="last_name" required placeholder="Smith" className="w-full bg-white/[.07] border border-white/15 rounded-md px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#00b5a5] transition-colors" />
                </div>
              </div>
              {[
                { name: 'business', label: 'Business Name', placeholder: 'Smith HVAC' },
                { name: 'phone', label: 'Phone', placeholder: '(205) 555-0100' },
                { name: 'email', label: 'Email', placeholder: 'john@smithhvac.com', required: true },
              ].map((f) => (
                <div key={f.name} className="mb-4">
                  <label className="block text-[12px] font-semibold text-white/60 mb-1.5 tracking-[.04em]">{f.label}</label>
                  <input name={f.name} type={f.name === 'email' ? 'email' : 'text'} required={f.required} placeholder={f.placeholder} className="w-full bg-white/[.07] border border-white/15 rounded-md px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#00b5a5] transition-colors" />
                </div>
              ))}
              <div className="mb-4">
                <label className="block text-[12px] font-semibold text-white/60 mb-1.5 tracking-[.04em]">What are you looking to improve?</label>
                <select name="service_interest" className="w-full bg-white/[.07] border border-white/15 rounded-md px-3.5 py-2.5 text-sm text-white/70 outline-none focus:border-[#00b5a5] transition-colors">
                  {serviceOptions.map((o) => <option key={o} value={o} className="bg-[#1a3557]">{o}</option>)}
                </select>
              </div>
              {status === 'error' && <p className="text-red-400 text-xs mb-3">Something went wrong. Please try again.</p>}
              <button type="submit" disabled={status === 'loading'} className="w-full bg-[#00b5a5] text-white text-sm font-bold py-3.5 rounded-md hover:opacity-90 transition-opacity disabled:opacity-60">
                {status === 'loading' ? 'Sending…' : 'Get My Custom Quote →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
