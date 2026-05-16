const stats = [
  { value: '13', label: 'Years of expertise' },
  { value: '33yr', label: 'Family legacy in digital marketing' },
  { value: '100s', label: 'Businesses served' },
  { value: 'WC', label: 'Walker County focused' },
]

export default function StatsBar() {
  return (
    <div className="bg-[#0d1f35] py-10 border-t border-white/[.04]">
      <div className="max-w-[1240px] mx-auto px-[60px] grid grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`text-center ${i < 3 ? 'border-r border-white/[.08]' : ''} px-6`}>
            <div className="text-[34px] font-extrabold text-[#00b5a5] leading-none">{s.value}</div>
            <div className="text-[11px] text-white/40 mt-2 leading-snug">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
