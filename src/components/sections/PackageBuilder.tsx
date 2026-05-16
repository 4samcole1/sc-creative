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
    includes: ['Custom 5-page website', 'Mobile-first design', 'Foundational local SEO', 'SSL + managed hosting', 'Google Review integration'],
    price: 'From $99/mo',
  },
  Growth: {
    tagline: 'Get found on Google. Get more calls.',
    includes: ['Custom 8-page website', 'Local SEO strategy & implementation', 'Google Business Profile setup & optimization', 'Monthly performance reporting', 'SSL + managed hosting'],
    price: 'From $125/mo',
  },
  Pro: {
    tagline: 'Look like the premium option in your market.',
    includes: ['Full brand identity (logo, colors, guide)', 'Custom 11-page website', 'Local SEO + GBP management', 'Brand messaging & copywriting', 'SSL + managed hosting'],
    price: 'From $149/mo',
  },
  Ultimate: {
    tagline: 'The complete digital growth system.',
    includes: ['Full brand identity', 'Custom 15-page website', 'AI lead follow-up & chat', 'Local SEO + Google Ads management', 'Google Business Profile management', 'Monthly growth reporting'],
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

const inputCls = 'w-full bg-[#f8f7f5] border border-[#e5e0d8] rounded-md px-3.5 py-2.5 text-sm text-[#1a3557] placeholder-[#bbb] outline-none focus:border-[#00b5a5] transition-colors'
const labelCls = 'block text-[11px] font-bold text-[#888] mb-1.5 tracking-[.06em] uppercase'

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
      <section id="package-builder" className="bg-white py-[100px]">
        <div className="max-w-[960px] mx-auto px-[60px]">
          <div className="mb-12">
            <div className="text-[11px] font-bold tracking-[.14em] uppercase text-[#00b5a5] mb-5">Your Custom Package</div>
            <h2 className="text-[clamp(32px,3.5vw,52px)] font-extrabold text-[#1a3557] leading-[1.12]">
              You&apos;re a perfect fit for<br />the <span className="text-[#00b5a5]">{tier}</span> package.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="border-2 border-[#00b5a5] rounded-xl p-8 bg-[#f0fdfb]">
              <div className="text-[10px] font-bold tracking-[.14em] uppercase text-[#00b5a5] mb-3">{tier} Package</div>
              <div className="text-[28px] font-extrabold text-[#1a3557] mb-1">{tierData.price}</div>
              <div className="text-[13px] text-[#888] mb-7">{tierData.tagline}</div>
              <ul className="flex flex-col gap-3">
                {tierData.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13px] text-[#444]">
                    <span className="text-[#00b5a5] mt-0.5 flex-shrink-0 font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-[#e5e0d8] rounded-xl p-8 flex flex-col justify-between bg-[#f8f7f5]">
              <div>
                <div className="text-[10px] font-bold tracking-[.14em] uppercase text-[#00b5a5] mb-3">Our Recommendation</div>
                <p className="text-[15px] text-[#555] leading-[1.75]">{getRecommendation(answers)}</p>
              </div>
              <div className="mt-8 flex flex-col gap-3">
                <a href="tel:6789971106" className="w-full text-center bg-[#1a3557] text-white text-sm font-bold py-3.5 rounded-md hover:bg-[#0d2a45] transition-colors">
                  Call (678) 997-1106
                </a>
                <a href="mailto:info@samcolecreative.com" className="w-full text-center border border-[#e5e0d8] text-[#555] text-sm font-medium py-3.5 rounded-md hover:border-[#00b5a5] hover:text-[#00b5a5] transition-all">
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
      <section id="package-builder" className="bg-white py-[100px]">
        <div className="max-w-[480px] mx-auto px-[60px]">
          <div className="text-[11px] font-bold tracking-[.14em] uppercase text-[#00b5a5] mb-5">Almost There</div>
          <h2 className="text-[clamp(28px,3vw,42px)] font-extrabold text-[#1a3557] leading-[1.12] mb-3">
            Where should we<br />send your package?
          </h2>
          <p className="text-[14px] text-[#888] leading-[1.65] mb-9">Enter your info to unlock your custom recommendation.</p>
          <form onSubmit={handleContactSubmit} className="flex flex-col gap-5">
            <div>
              <label className={labelCls}>Your Name</label>
              <input required placeholder="John Smith" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input required type="email" placeholder="john@smithhvac.com" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input required type="tel" placeholder="(205) 555-0100" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className={inputCls} />
            </div>
            {submitStatus === 'error' && <p className="text-red-500 text-xs">Something went wrong. Please try again.</p>}
            <button type="submit" disabled={submitStatus === 'loading'} className="bg-[#00b5a5] text-white text-sm font-bold py-3.5 rounded-md hover:opacity-90 transition-opacity disabled:opacity-60">
              {submitStatus === 'loading' ? 'Building your package…' : 'See My Custom Package →'}
            </button>
          </form>
          <button onClick={() => setStep(step - 1)} className="mt-5 text-[12px] text-[#bbb] hover:text-[#888] transition-colors">
            ← Go back
          </button>
        </div>
      </section>
    )
  }

  const currentStep = STEPS[step]

  return (
    <section id="package-builder" className="bg-white py-[100px]">
      <div className="max-w-[900px] mx-auto px-[60px]">
        <div className="mb-10">
          <div className="text-[11px] font-bold tracking-[.14em] uppercase text-[#00b5a5] mb-5">Build Your Package</div>
          <h2 className="text-[clamp(28px,3vw,44px)] font-extrabold text-[#1a3557] leading-[1.12]">
            {currentStep.question}
          </h2>
          <div className="flex items-center gap-4 mt-5">
            <div className="flex-1 bg-[#f0ece6] rounded-full h-[3px]">
              <div className="bg-[#00b5a5] h-[3px] rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="text-[11px] text-[#bbb] flex-shrink-0">Step {step + 1} of {STEPS.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {currentStep.options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => selectOption(opt.label)}
              className="text-left bg-[#f8f7f5] border border-[#e5e0d8] rounded-xl p-5 hover:border-[#00b5a5] hover:bg-[#f0fdfb] transition-all group"
            >
              <div className="text-[14px] font-bold text-[#1a3557] group-hover:text-[#00b5a5] transition-colors leading-snug">
                {opt.label}
              </div>
              <div className="text-[11px] text-[#aaa] mt-1">{opt.sub}</div>
            </button>
          ))}
        </div>

        {step > 0 && (
          <div className="mt-7">
            <button onClick={() => setStep(step - 1)} className="text-[12px] text-[#bbb] hover:text-[#888] transition-colors">
              ← Go back
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
