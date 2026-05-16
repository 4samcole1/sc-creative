const problems = [
  { n: '01', title: 'Your website is costing you jobs', desc: 'An outdated or missing site tells potential customers to call your competitor instead of you.' },
  { n: '02', title: "You're invisible on Google", desc: "When locals search for what you do, competitors are taking those calls. Not you." },
  { n: '03', title: "Your brand doesn't match your work", desc: "You do great work — but your logo, site, and marketing make you look like a side hustle." },
  { n: '04', title: 'Leads are slipping through the cracks', desc: "Without a follow-up system, leads that don't get a fast response go somewhere else." },
]

export default function Problem() {
  return (
    <section id="problem" className="bg-white py-[100px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="grid grid-cols-[1fr_1.2fr] gap-20 items-start">
          <div>
            <div className="text-[11px] font-bold tracking-[.14em] uppercase text-[#00b5a5] mb-5">The Problem</div>
            <h2 className="text-[clamp(32px,3.5vw,52px)] font-extrabold text-[#1a3557] leading-[1.12]">
              Why good<br />businesses<br />stay stuck.
            </h2>
            <p className="text-[15px] text-[#888] leading-[1.75] mt-6 max-w-[320px]">
              It&apos;s not the quality of your work. It&apos;s the systems — or lack of them — working against you.
            </p>
          </div>
          <div className="flex flex-col divide-y divide-[#f0ece6]">
            {problems.map((p) => (
              <div key={p.n} className="py-7 first:pt-0 last:pb-0">
                <div className="text-[10px] font-bold text-[#00b5a5] tracking-[.14em] uppercase mb-2">{p.n}</div>
                <h3 className="text-[16px] font-bold text-[#1a3557] mb-2 leading-snug">{p.title}</h3>
                <p className="text-[14px] text-[#888] leading-[1.65]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
