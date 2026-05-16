import Link from 'next/link'

const services = [
  {
    num: '01', slug: 'brand-blueprint', name: 'Strategy & Messaging',
    desc: 'We start every engagement by building the strategic foundation — target market, voice, positioning, and messaging that makes everything else work harder.',
    tags: ['Brand Strategy', 'Messaging', 'Positioning'], featured: false,
  },
  {
    num: '02', slug: 'visual-branding', name: 'Logo & Brand Identity',
    desc: 'A complete visual identity system — logo, color palette, typography, and brand guidelines — built to position you as the premium option in your market.',
    tags: ['Logo Design', 'Identity System', 'Brand Guide'], featured: false,
  },
  {
    num: '03', slug: 'website-design', name: 'Performance Websites That Convert',
    desc: 'Fast, responsive, and built to generate leads — not just look good. Every site we build is engineered to rank, convert, and represent your brand at its best.',
    tags: ['Web Design', 'Development', 'CRO', 'Mobile-First'], featured: true,
  },
  {
    num: '04', slug: 'ai-systems', name: 'Automation & Smart Tools',
    desc: "Custom AI systems that handle lead intake, follow-up, and qualification — so you're responsive 24/7 without adding headcount.",
    tags: ['Lead Automation', 'AI Chat', 'CRM Integration'], featured: false,
  },
  {
    num: '05', slug: 'growth', name: 'SEO, GBP & Local Ads',
    desc: 'Comprehensive local growth — Google Business Profile optimization, SEO, targeted ads, and backlinking — all focused on ranking #1 in Walker County.',
    tags: ['Local SEO', 'Google Ads', 'GBP', 'Backlinking'], featured: false,
  },
]

export default function Services() {
  return (
    <section id="services" className="bg-[#f5f3ef] py-[90px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3">What We Build</div>
        <h2 className="text-[clamp(24px,3vw,38px)] font-extrabold text-[#1a3557] leading-[1.2] mb-3">Five Services. One Cohesive System.</h2>
        <p className="text-[15px] text-[#666] leading-[1.7] mb-10">Each service is designed to integrate with the others — so your brand, site, and marketing amplify each other.</p>
        <div className="grid grid-cols-2 gap-6">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className={`bg-white rounded-xl overflow-hidden border border-[#ece8e2] hover:border-[#00b5a5] transition-colors ${s.featured ? 'col-span-2' : ''}`}
            >
              <div className={`bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center p-5 ${s.featured ? 'h-[160px]' : 'h-[120px]'}`}>
                <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5]">{s.num} — {s.name}</div>
              </div>
              <div className="p-5">
                <div className="text-[17px] font-extrabold text-[#1a3557] mb-1.5">{s.name}</div>
                <p className="text-[13px] text-[#666] leading-[1.6] mb-3.5">{s.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map((t) => <span key={t} className="text-[10px] font-semibold bg-[#f0fdfb] text-[#00b5a5] px-2.5 py-1 rounded-full border border-[#c8f5f0]">{t}</span>)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
