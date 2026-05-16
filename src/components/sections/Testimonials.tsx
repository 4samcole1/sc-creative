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
    { id: '1', author: 'Client Name', company: 'Home Services · Walker County', quote: 'Working with Sam completely transformed our online presence. We went from invisible on Google to getting consistent leads every week — and our brand finally looks as professional as our work.' },
    { id: '2', author: 'Client Name', company: 'Construction · Walker County', quote: 'Our leads doubled within 3 months of the new site going live. The whole process was easy, fast, and the results have been beyond what we expected.' },
  ]

  const display = items.length > 0 ? items : fallback

  return (
    <section id="testimonials" className="bg-[#f8f7f5] py-[100px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="text-[11px] font-bold tracking-[.14em] uppercase text-[#00b5a5] mb-5">What Clients Say</div>
        <h2 className="text-[clamp(32px,3.5vw,52px)] font-extrabold text-[#1a3557] leading-[1.12] mb-16">
          Walker County businesses<br />trust SC Creative.
        </h2>
        <div className="grid grid-cols-2 gap-14">
          {display.map((t) => (
            <div key={t.id} className="border-t-2 border-[#00b5a5] pt-8">
              <p className="text-[17px] text-[#333] leading-[1.8] italic mb-7">&ldquo;{t.quote}&rdquo;</p>
              <div className="text-[12px] font-bold text-[#1a3557]">
                {t.author}
                {t.company ? <span className="text-[#aaa] font-normal"> · {t.company}</span> : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
