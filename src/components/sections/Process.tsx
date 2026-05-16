const steps = [
  { num: '01', name: 'Brand Blueprint', desc: 'We map your market, competitors & goals before touching a single pixel' },
  { num: '02', name: 'Visual Branding', desc: 'Logo, colors & identity that positions you as the premium option locally' },
  { num: '03', name: 'Website', desc: 'Built fast, built right — SEO-ready, mobile-first, and written to convert' },
  { num: '04', name: 'AI Systems', desc: 'Lead capture, instant follow-up & chat so no lead ever goes cold' },
  { num: '05', name: 'Growth', desc: 'Local SEO, GBP management & ads to keep the leads coming every month' },
]

export default function Process() {
  return (
    <section id="process" className="bg-[#0d1f35] py-[90px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3">How We Work</div>
        <h2 className="text-[clamp(24px,3vw,38px)] font-extrabold text-white leading-[1.2] mb-4">The SC Creative Process</h2>
        <p className="text-[15px] text-white/55 leading-[1.7] max-w-[520px] mb-12">
          Five integrated stages that build on each other — from brand clarity to measurable growth.
        </p>
        <div className="grid grid-cols-5 gap-4">
          {steps.map((s) => (
            <div key={s.num} className="bg-white/5 border border-white/[0.08] rounded-[10px] p-5 text-center hover:border-[rgba(0,181,165,.5)] transition-colors">
              <div className="text-[28px] font-extrabold text-[#00b5a5] leading-none mb-2">{s.num}</div>
              <div className="text-[12px] font-bold text-white mb-1">{s.name}</div>
              <div className="text-[10px] text-white/45 leading-[1.5]">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
