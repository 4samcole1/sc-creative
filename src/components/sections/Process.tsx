const steps = [
  { num: '01', name: 'Brand Blueprint', desc: 'Strategy & positioning before a single pixel is touched' },
  { num: '02', name: 'Visual Identity', desc: 'Logo, colors & brand that commands premium locally' },
  { num: '03', name: 'Website', desc: 'Built to rank, convert, and represent you at your best' },
  { num: '04', name: 'AI Systems', desc: 'Instant follow-up & chat that works while you sleep' },
  { num: '05', name: 'Growth', desc: 'SEO, GBP & ads that keep leads flowing every month' },
]

export default function Process() {
  return (
    <section id="process" className="bg-[#0d1f35] py-[100px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="flex items-end justify-between mb-16">
          <div>
            <div className="text-[11px] font-bold tracking-[.14em] uppercase text-[#00b5a5] mb-5">How We Work</div>
            <h2 className="text-[clamp(32px,3.5vw,52px)] font-extrabold text-white leading-[1.12]">
              The SC Creative<br />process.
            </h2>
          </div>
          <p className="text-[14px] text-white/35 max-w-[260px] text-right leading-[1.65] pb-2">
            Five stages that build on each other — from brand clarity to measurable growth.
          </p>
        </div>
        <div className="grid grid-cols-5">
          {steps.map((s, i) => (
            <div
              key={s.num}
              className={`p-7 ${i < 4 ? 'border-r border-white/[.07]' : ''} border-t border-white/[.07]`}
            >
              <div className="text-[56px] font-extrabold text-[#00b5a5] leading-none mb-6 opacity-50">
                {s.num}
              </div>
              <div className="text-[13px] font-bold text-white mb-2.5">{s.name}</div>
              <div className="text-[12px] text-white/35 leading-[1.65]">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
