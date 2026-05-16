import Link from 'next/link'

const cities = ['Jasper', 'Cordova', 'Sumiton', 'Dora', 'Parrish', 'Carbon Hill', 'Oakman']

export default function CTA() {
  return (
    <section id="cta" className="bg-[#0d1f35] py-[90px] text-center">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <h2 className="text-[clamp(28px,3vw,44px)] font-extrabold text-white leading-[1.2] mb-4">
          Your Competitors Are Online.<br />Let&apos;s Make Sure You Win.
        </h2>
        <p className="text-[16px] text-white/60 leading-[1.7] mb-4 max-w-[560px] mx-auto">
          Answer 4 quick questions and we&apos;ll build your custom package — no obligation, response within 24 hours.
        </p>
        <p className="text-[13px] text-white/35 mb-8">
          Serving {cities.join(' · ')}
        </p>
        <a
          href="#package-builder"
          className="inline-block bg-[#00b5a5] text-white text-[15px] font-bold px-10 py-4 rounded-lg hover:opacity-90 transition-opacity"
        >
          Build My Package →
        </a>
      </div>
    </section>
  )
}
