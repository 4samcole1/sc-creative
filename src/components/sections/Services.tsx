import Link from 'next/link'

const services = [
  { num: '01', slug: 'brand-blueprint', name: 'Brand Blueprint', desc: 'Strategy, positioning, and messaging — the foundation everything else is built on.' },
  { num: '02', slug: 'visual-branding', name: 'Visual Identity', desc: 'Logo, color system, and brand guide that positions you as the premium choice locally.' },
  { num: '03', slug: 'website-design', name: 'Website', desc: 'Fast, mobile-first, written to convert — designed, built, and launched for your market.' },
  { num: '04', slug: 'ai-systems', name: 'AI Systems', desc: 'Lead intake, instant follow-up, and qualification running 24/7 without you lifting a finger.' },
  { num: '05', slug: 'growth', name: 'Growth', desc: 'Local SEO, Google Business Profile, and paid ads that keep leads flowing every month.' },
]

export default function Services() {
  return (
    <section id="services" className="bg-[#f8f7f5] py-[100px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="flex items-end justify-between mb-14">
          <div>
            <div className="text-[11px] font-bold tracking-[.14em] uppercase text-[#00b5a5] mb-5">What We Build</div>
            <h2 className="text-[clamp(32px,3.5vw,52px)] font-extrabold text-[#1a3557] leading-[1.12]">
              Five services.<br />One system.
            </h2>
          </div>
          <p className="text-[14px] text-[#888] max-w-[260px] text-right leading-[1.65] pb-2">
            Each service integrates with the others — every piece amplifies the whole.
          </p>
        </div>
        <div className="border-t border-[#e5e0d8]">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group flex items-center gap-8 py-6 border-b border-[#e5e0d8] hover:bg-white transition-colors rounded-sm -mx-4 px-4"
            >
              <span className="text-[12px] font-bold text-[#c8c2b8] w-7 flex-shrink-0 group-hover:text-[#00b5a5] transition-colors tabular-nums">
                {s.num}
              </span>
              <span className="text-[18px] font-extrabold text-[#1a3557] w-[180px] flex-shrink-0 group-hover:text-[#00b5a5] transition-colors">
                {s.name}
              </span>
              <span className="text-[14px] text-[#888] flex-1 leading-[1.65]">{s.desc}</span>
              <span className="text-[#00b5a5] text-xl opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
