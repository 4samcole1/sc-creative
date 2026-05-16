'use client'
import { useState } from 'react'

const STEPS = [
  {
    id: 'industry',
    question: 'What industry are you in?',
    options: [
      { label: 'Home Services', sub: 'HVAC, Plumbing, Electrical, Landscaping' },
      { label: 'Construction & Trades', sub: 'Contracting, Roofing, Concrete, Excavation' },
      { label: 'Healthcare & Wellness', sub: 'Medical, Dental, Chiropractic, Fitness' },
      { label: 'Legal & Professional', sub: 'Attorney, CPA, Consulting, Insurance' },
      { label: 'Food & Hospitality', sub: 'Restaurant, Catering, Lodging, Events' },
      { label: 'Real Estate', sub: 'Agents, Developers, Property Management' },
      { label: 'Retail & E-Commerce', sub: 'Local retail, boutique, online shop' },
      { label: 'Other', sub: 'Not listed above' },
    ],
  },
  {
    id: 'challenge',
    question: "What's your biggest challenge right now?",
    options: [
      { label: 'Not getting found on Google', sub: 'Competitors outrank me locally' },
      { label: 'Brand or website is outdated', sub: "Doesn't reflect how good we are" },
      { label: 'Not converting the leads I get', sub: 'Traffic but no calls or bookings' },
      { label: 'Losing leads to slow follow-up', sub: 'No system to respond fast enough' },
    ],
  },
  {
    id: 'interest',
    question: 'What are you most interested in building?',
    options: [
      { label: 'A new website', sub: 'Fast, professional, mobile-first' },
      { label: 'Website + local SEO', sub: 'Get found and get calls' },
      { label: 'Full brand + website', sub: 'Look premium, rank locally' },
      { label: 'The complete system', sub: 'Brand + website + AI + growth' },
    ],
  },
  {
    id: 'status',
    question: 'Where are you starting from?',
    options: [
      { label: 'No website yet', sub: 'Starting from scratch' },
      { label: "Website isn't working", sub: 'No leads, outdated, or slow' },
      { label: 'Have a site, need more leads', sub: 'Need SEO or ads to drive traffic' },
      { label: 'Need a full upgrade', sub: 'Brand, site, and marketing overhaul' },
    ],
  },
]

const TIERS: Record<string, { tagline: string; includes: string[]; price: string }> = {
  Starter: {
    tagline: 'The foundation every local business needs.',
    includes: [
      'Custom 5-page website',
      'Mobile-first design',
      'Foundational local SEO',
      'SSL + managed hosting',
      'Google Review integration',
    ],
    price: 'From $99/mo',
  },
  Growth: {
    tagline: 'Get found on Google. Get more calls.',
    includes: [
      'Custom 8-page website',
      'Local SEO strategy & implementation',
      'Google Business Profile setup & optimization',
      'Monthly performance reporting',
      'SSL + managed hosting',
    ],
    price: 'From $125/mo',
  },
  Pro: {
    tagline: 'Look like the premium option in your market.',
    includes: [
      'Full brand identity (logo, colors, guide)',
      'Custom 11-page website',
      'Local SEO + GBP management',
      'Brand messaging & copywriting',
      'SSL + managed hosting',
    ],
    price: 'From $149/mo',
  },
  Ultimate: {
    tagline: 'The complete digital growth system.',
    includes: [
      'Full brand identity',
      'Custom 15-page website',
      'AI lead follow-up & chat',
      'Local SEO + Google Ads management',
      'Google Business Profile management',
      'Monthly growth reporting',
    ],
    price: 'From $185/mo',
  },
}

function getTier(answers: Record<string, string>): string {
  const interest = answers.interest
  if (interest === 'The complete system') return 'Ultimate'
  if (interest === 'Full brand + website') return 'Pro'
  if (interest === 'Website + local SEO') return 'Growth'
  return 'Starter'
}

function getRecommendation(answers: Record<string, string>): string {
  const goalMap: Record<string, string> = {
    'Not getting found on Google': 'rank #1 in Walker County searches',
    'Brand or website is outdated': 'look as premium as your actual work',
    'Not converting the leads I get': 'turn your traffic into booked jobs',
    'Losing leads to slow follow-up': 'respond to every lead instantly — 24/7',
  }
  const goal = goalMap[answers.challenge] ?? 'grow your business online'
  const industry = answers.industry?.toLowerCase() ?? 'your industry'
  const tier = getTier(answers)
  return `Based on your answers, our ${tier} package is the right starting point for ${industry} businesses looking to ${goal}. We'll map out a custom plan built around your market, your competitors, and your goals.`
}

type ContactState = { name: string; email: string; phone: string }

export default function PackageBuilder() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [contact, setContact] = useState<ContactState>({ name: '', email: '', phone: '' })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  const CONTACT_STEP = STEPS.length
  const RESULTS_STEP = STEPS.length + 1

  function selectOption(value: string) {
    const newAnswers = { ...answers, [STEPS[step].id]: value }
    setAnswers(newAnswers)
    setStep(step < STEPS.length - 1 ? step + 1 : CONTACT_STEP)
  }

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitStatus('loading')
    const [first_name, ...rest] = contact.name.trim().split(' ')
    const res = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name,
        last_name: rest.join(' ') || '',
        email: contact.email,
        phone: contact.phone,
        service_interest: getTier(answers),
        message: Object.entries(answers).map(([k, v]) => `${k}: ${v}`).join('\n'),
      }),
    })
    if (res.ok) {
      setStep(RESULTS_STEP)
    } else {
      setSubmitStatus('error')
    }
  }

  const tier = getTier(answers)
  const tierData = TIERS[tier]
  const progressPct = Math.round((step / STEPS.length) * 100)

  if (step === RESULTS_STEP) {
    return (
      <section id="package-builder" className="bg-[#0d1f35] py-[90px]">
        <div className="max-w-[900px] mx-auto px-[60px]">
          <div className="text-center mb-10">
            <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3">Your Custom Package</div>
            <h2 className="text-[clamp(24px,3vw,38px)] font-extrabold text-white leading-[1.2]">
              You&apos;re a perfect fit for the <span className="text-[#00b5a5]">{tier}</span> package.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 border border-[#00b5a5] rounded-xl p-7">
              <div className="text-[10px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-2">{tier} Package</div>
              <div className="text-[26px] font-extrabold text-white mb-1">{tierData.price}</div>
              <div className="text-[13px] text-white/50 mb-6">{tierData.tagline}</div>
              <ul className="flex flex-col gap-2.5">
                {tierData.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13px] text-white/75">
                    <span className="text-[#00b5a5] mt-0.5 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 border border-white/[0.08] rounded-xl p-7 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-2">Our Recommendation</div>
                <p className="text-[14px] text-white/70 leading-[1.75]">{getRecommendation(answers)}</p>
              </div>
              <div className="mt-8 flex flex-col gap-3">
                <a
                  href="tel:6789971106"
                  className="w-full text-center bg-[#00b5a5] text-white text-sm font-bold py-3.5 rounded-md hover:opacity-90 transition-opacity"
                >
                  Call (678) 997-1106
                </a>
                <a
                  href="mailto:info@samcolecreative.com"
                  className="w-full text-center border border-white/20 text-white/60 text-sm font-medium py-3.5 rounded-md hover:border-white/40 hover:text-white transition-all"
                >
                  Email Us Instead
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (step === CONTACT_STEP) {
    return (
      <section id="package-builder" className="bg-[#0d1f35] py-[90px]">
        <div className="max-w-[500px] mx-auto px-[60px] text-center">
          <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3">Almost There</div>
          <h2 className="text-[clamp(22px,2.5vw,32px)] font-extrabold text-white leading-[1.2] mb-3">
            Where should we send your package?
          </h2>
          <p className="text-[14px] text-white/45 mb-8">Enter your info to unlock your custom recommendation.</p>
          <form onSubmit={handleContactSubmit} className="flex flex-col gap-4 text-left">
            <div>
              <label className="block text-[12px] font-semibold text-white/50 mb-1.5 tracking-[.04em]">Your Name</label>
              <input
                required
                placeholder="John Smith"
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                className="w-full bg-white/[.07] border border-white/15 rounded-md px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#00b5a5] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-white/50 mb-1.5 tracking-[.04em]">Email</label>
              <input
                required
                type="email"
                placeholder="john@smithhvac.com"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className="w-full bg-white/[.07] border border-white/15 rounded-md px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#00b5a5] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-white/50 mb-1.5 tracking-[.04em]">Phone</label>
              <input
                required
                type="tel"
                placeholder="(205) 555-0100"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                className="w-full bg-white/[.07] border border-white/15 rounded-md px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#00b5a5] transition-colors"
              />
            </div>
            {submitStatus === 'error' && (
              <p className="text-red-400 text-xs">Something went wrong. Please try again.</p>
            )}
            <button
              type="submit"
              disabled={submitStatus === 'loading'}
              className="bg-[#00b5a5] text-white text-sm font-bold py-3.5 rounded-md hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {submitStatus === 'loading' ? 'Building your package…' : 'See My Custom Package →'}
            </button>
          </form>
          <button
            onClick={() => setStep(step - 1)}
            className="mt-5 text-[12px] text-white/30 hover:text-white/55 transition-colors"
          >
            ← Go back
          </button>
        </div>
      </section>
    )
  }

  const currentStep = STEPS[step]
  const cols = currentStep.options.length > 4 ? 'grid-cols-2' : 'grid-cols-2'

  return (
    <section id="package-builder" className="bg-[#0d1f35] py-[90px]">
      <div className="max-w-[860px] mx-auto px-[60px]">
        <div className="text-center mb-8">
          <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3">Build Your Package</div>
          <h2 className="text-[clamp(22px,2.5vw,34px)] font-extrabold text-white leading-[1.2] mb-2">
            {currentStep.question}
          </h2>
          <div className="text-[12px] text-white/30 mt-3">Step {step + 1} of {STEPS.length}</div>
        </div>

        <div className="w-full bg-white/10 rounded-full h-[3px] mb-8">
          <div
            className="bg-[#00b5a5] h-[3px] rounded-full transition-all duration-400"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className={`grid ${cols} gap-3`}>
          {currentStep.options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => selectOption(opt.label)}
              className="text-left bg-white/5 border border-white/[0.08] rounded-xl p-5 hover:border-[#00b5a5] hover:bg-white/[.09] transition-all group"
            >
              <div className="text-[14px] font-bold text-white group-hover:text-[#00b5a5] transition-colors leading-snug">
                {opt.label}
              </div>
              <div className="text-[11px] text-white/35 mt-1">{opt.sub}</div>
            </button>
          ))}
        </div>

        {step > 0 && (
          <div className="text-center mt-7">
            <button
              onClick={() => setStep(step - 1)}
              className="text-[12px] text-white/30 hover:text-white/55 transition-colors"
            >
              ← Go back
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
