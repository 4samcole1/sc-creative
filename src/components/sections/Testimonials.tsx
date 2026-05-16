import { createSupabaseServerClient } from '@/lib/supabase-server'

export default async function Testimonials() {
  let items: { id: string; author: string; company: string | null; quote: string }[] = []
  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase
      .from('testimonials')
      .select('id, author, company, quote')
      .eq('visible', true)
      .order('sort_order')
    items = data ?? []
  } catch {
    // Supabase not configured — use fallback
  }

  const fallback = [
    { id: '1', author: 'Client Name', company: 'Industry · Walker County', quote: 'Working with Sam completely transformed our online presence. We went from invisible on Google to getting consistent leads every week — and our brand finally looks as professional as our work.' },
    { id: '2', author: 'Client Name', company: 'Industry · Walker County', quote: 'Our leads doubled within 3 months of the new site going live. The whole process was easy, fast, and the results have been beyond what we expected.' },
  ]

  const display = items.length > 0 ? items : fallback

  return (
    <section id="testimonials" className="bg-[#f5f3ef] py-[90px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3">What Clients Say</div>
        <h2 className="text-[clamp(24px,3vw,38px)] font-extrabold text-[#1a3557] leading-[1.2] mb-10">
          Walker County Businesses Trust SC Creative
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {display.map((t) => (
            <div key={t.id} className="bg-white rounded-xl p-7 border-l-4 border-[#00b5a5] shadow-[0_2px_12px_rgba(0,0,0,.06)]">
              <p className="text-[15px] text-[#444] leading-[1.7] mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="text-[12px] font-bold text-[#00b5a5]">— {t.author}{t.company ? `, ${t.company}` : ''}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
