const problems = [
  { icon: '🌐', title: 'Your Website Is Costing You Jobs', desc: "An outdated or missing website tells potential customers to call your competitor instead." },
  { icon: '👻', title: 'Invisible on Google', desc: "When locals search for what you do, competitors are taking those calls — not you." },
  { icon: '📉', title: "Your Brand Doesn't Match Your Work", desc: "You do great work, but your logo, site, and marketing make you look like a side hustle." },
  { icon: '⏰', title: 'Leads Slip Through the Cracks', desc: "Without a follow-up system, leads that don't get a fast response go somewhere else." },
]

const solutions = [
  { icon: '🎯', title: 'A Site That Actually Converts', desc: 'Fast, professional, and written to generate calls — built in days, not months.' },
  { icon: '📍', title: '#1 in Walker County Searches', desc: 'Local SEO and GBP strategy built specifically for your market and your competitors.' },
  { icon: '✨', title: 'A Brand That Commands Premium', desc: 'Logo, colors, and identity that position you as the go-to in your area.' },
  { icon: '🤖', title: 'AI That Follows Up for You', desc: 'Instant response, 24/7 — so no lead ever goes cold, even at midnight.' },
]

export default function Problem() {
  return (
    <section id="problem" className="bg-white py-[90px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="text-center mb-12">
          <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3">The Problem We Solve</div>
          <h2 className="text-[clamp(24px,3vw,38px)] font-extrabold text-[#1a3557] leading-[1.2]">
            Why Good Businesses Stay Stuck
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
