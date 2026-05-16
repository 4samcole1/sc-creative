import Link from 'next/link'
import HeroDemo from './HeroDemo'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-[#0b1e35] via-[#112b4e] to-[#0d2a40] pt-[100px] pb-[90px]">
      <div className="max-w-[1240px] mx-auto px-[60px] grid grid-cols-[0.9fr_1.1fr] gap-12 items-center">
        <div>
          <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3.5">
            Walker County&apos;s Growth Partner
          </div>
          <h1 className="text-[clamp(28px,3vw,44px)] font-extrabold text-white leading-[1.2] mb-4">
            We Build the Digital<br />Systems That Grow<br />Local Businesses
          </h1>
          <p className="text-[15px] text-white/60 leading-[1.65] mb-8 max-w-[400px]">
            Brand, website, AI systems, and local SEO — built as one integrated system for established Walker County businesses ready to dominate their market.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/quote" className="bg-[#00b5a5] text-white text-sm font-bold px-7 py-3 rounded-[5px] hover:opacity-90 transition-opacity">
              Get My Custom Quote →
            </Link>
            <Link href="/work" className="border border-white/30 text-white/80 text-sm font-medium px-6 py-3 rounded-[5px] hover:border-white/60 hover:text-white transition-all">
              See Our Work
            </Link>
          </div>
        </div>
        <HeroDemo />
      </div>
    </section>
  )
}
