const problems = [
  { icon: '🌐', title: 'Scattered Marketing', desc: "Disconnected tools that don't talk to each other or tell a consistent story." },
  { icon: '👻', title: 'Invisible Online', desc: "Competitors showing up first on Google while you're nowhere to be found." },
  { icon: '📉', title: 'Outdated Brand', desc: 'A logo and website that no longer reflect how good you actually are.' },
  { icon: '⏰', title: 'No Time to Fix It', desc: "You're running the business — there's no bandwidth to solve the marketing too." },
]

const solutions = [
  { icon: '🎯', title: 'One Integrated System', desc: 'Every piece built together — brand, site, AI, and growth working as one.' },
  { icon: '📍', title: 'Local-First SEO', desc: 'We know Walker County and build search strategies that win locally.' },
  { icon: '✨', title: 'Premium Brand Identity', desc: 'A complete brand system that positions you as the clear market leader.' },
  { icon: '🤖', title: 'AI That Works for You', desc: 'Systems that follow up, qualify, and convert leads while you sleep.' },
]

export default function Problem() {
  return (
    <section id="problem" className="bg-white py-[90px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="text-center mb-12">
          <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3">The Problem We Solve</div>
          <h2 className="text-[clamp(24px,3vw,38px)] font-extrabold text-[#1a3557] leading-[1.2]">
            Most Local Businesses Leave Growth on the Table
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-4">
            {problems.map((p) => (
              <div key={p.title} className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-base flex-shrink-0">{p.icon}</div>
                <div>
                  <h4 className="text-sm font-bold text-[#1a3557] mb-1">{p.title}</h4>
                  <p className="text-[13px] text-[#666] leading-[1.5]">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="text-[12px] font-bold tracking-[.1em] uppercase text-[#00b5a5] mb-4">The SC Creative Solution</div>
            <div className="flex flex-col gap-4">
              {solutions.map((s) => (
                <div key={s.title} className="flex gap-3.5 items-start">
                  <div className="w-9 h-9 rounded-lg bg-[#f0fdfb] flex items-center justify-center text-base flex-shrink-0">{s.icon}</div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1a3557] mb-1">{s.title}</h4>
                    <p className="text-[13px] text-[#666] leading-[1.5]">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
