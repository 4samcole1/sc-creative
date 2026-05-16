import Link from 'next/link'

const industries = [
  { icon: '🔧', name: 'Home & Trade', desc: 'HVAC, Plumbing, Electrical', slug: 'home-trade' },
  { icon: '🩺', name: 'Medical & Dental', desc: 'Clinics & practices', slug: 'medical-dental' },
  { icon: '⚖️', name: 'Legal & Professional', desc: 'Attorneys & consultants', slug: 'legal-professional' },
  { icon: '🏗️', name: 'Construction', desc: 'Contractors & builders', slug: 'construction' },
  { icon: '💰', name: 'Financial', desc: 'Accountants & advisors', slug: 'financial' },
  { icon: '🚗', name: 'Automotive', desc: 'Dealers & service shops', slug: 'automotive' },
  { icon: '🏠', name: 'Senior Care', desc: 'Care homes & wellness', slug: 'senior-care' },
  { icon: '🏢', name: 'Real Estate', desc: 'Agents & developers', slug: 'real-estate' },
]

export default function Industries() {
  return (
    <section id="industries" className="bg-white py-[90px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3">Who We Work With</div>
        <h2 className="text-[clamp(24px,3vw,38px)] font-extrabold text-[#1a3557] leading-[1.2] mb-10">
          Built for Established Walker County Businesses
        </h2>
        <div className="grid grid-cols-4 gap-3.5">
          {industries.map((ind) => (
            <Link
              key={ind.slug}
              href={`/industries/${ind.slug}`}
              className="bg-[#f8f7f5] border border-[#e8e4de] rounded-[10px] p-5 text-center hover:border-[#00b5a5] hover:bg-[#f0fdfb] transition-all"
            >
              <div className="text-2xl mb-2">{ind.icon}</div>
              <div className="text-[13px] font-bold text-[#1a3557] mb-0.5">{ind.name}</div>
              <div className="text-[11px] text-[#888]">{ind.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
