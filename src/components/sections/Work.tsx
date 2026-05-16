import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export default async function Work() {
  let items: { id: string; title: string; slug: string; client: string | null; services: string[]; cover_image: string | null }[] = []
  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase
      .from('projects')
      .select('id, title, slug, client, services, cover_image')
      .eq('status', 'published')
      .order('sort_order')
      .limit(3)
    items = data ?? []
  } catch {
    // Supabase not configured — show placeholder cards
  }

  return (
    <section id="work" className="bg-[#0d1f35] py-[90px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3">Featured Work</div>
        <h2 className="text-[clamp(24px,3vw,38px)] font-extrabold text-white leading-[1.2] mb-10">
          Real Results for Real Businesses
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {items.length > 0
            ? items.map((p) => (
                <Link
                  key={p.id}
                  href={`/work/${p.slug}`}
                  className="bg-white/5 border border-white/[0.08] rounded-xl overflow-hidden hover:border-[rgba(0,181,165,.4)] transition-colors"
                >
                  <div className="h-[140px] bg-gradient-to-br from-[#1a3a5c] to-[#0d2a40] flex items-center justify-center">
                    {p.cover_image
                      ? <img src={p.cover_image} alt={p.client ?? p.title} className="w-full h-full object-cover" />
                      : <div className="w-[80%] h-[60%] bg-white/5 rounded" />
                    }
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-bold text-white mb-1">{p.client ?? p.title}</div>
                    <div className="text-[11px] text-white/40">{p.services.join(' · ')}</div>
                  </div>
                </Link>
              ))
            : [
                { client: 'Ascon Paving', tags: 'Website · Branding · SEO' },
                { client: 'Smith Lake Family Care', tags: 'Website · Local SEO · GBP' },
                { client: 'Walker County HVAC', tags: 'Brand Blueprint · Website · AI' },
              ].map((p) => (
                <div key={p.client} className="bg-white/5 border border-white/[0.08] rounded-xl overflow-hidden">
                  <div className="h-[140px] bg-gradient-to-br from-[#1a3a5c] to-[#0d2a40]" />
                  <div className="p-4">
                    <div className="text-sm font-bold text-white mb-1">{p.client}</div>
                    <div className="text-[11px] text-white/40">{p.tags}</div>
                  </div>
                </div>
              ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/work" className="text-sm font-bold text-[#00b5a5] hover:underline">View Full Portfolio →</Link>
        </div>
      </div>
    </section>
  )
}
