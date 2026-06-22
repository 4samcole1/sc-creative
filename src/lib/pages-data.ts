// NOTE: Static, Supabase-free stub created during the fresh-start migration.
// The original fetched pages / posts / nav menus from Supabase. For the home-page
// design we only need the nav links and an optional per-page meta override, so those
// are hardcoded below. Add a real data source later if/when you need it.

export interface PageRecord {
  id: string
  title: string
  slug: string
  parent_id: string | null
  sort_order: number
  content: string
  status: 'draft' | 'published'
  meta_title: string
  meta_description: string
  og_image_url: string
  created_at: string
  updated_at: string
}

export interface NavLink {
  label: string
  url: string
  opens_new_tab: boolean
}

// Static primary nav. Edit to taste — these drive the header.
const PRIMARY_NAV: NavLink[] = [
  { label: 'Work',         url: '/work',                     opens_new_tab: false },
  { label: 'Blueprint',    url: '/services/brand-blueprint', opens_new_tab: false },
  { label: 'Branding',     url: '/services/visual-branding', opens_new_tab: false },
  { label: 'Website',      url: '/services/website-design',  opens_new_tab: false },
  { label: 'AI Solutions', url: '/services/ai-systems',      opens_new_tab: false },
  { label: 'Growth',       url: '/services/growth',          opens_new_tab: false },
  { label: 'About',        url: '/about',                    opens_new_tab: false },
]

export async function getPageBySlug(_slug: string): Promise<PageRecord | null> {
  // No CMS — page-level meta falls back to the defaults in the page component.
  return null
}

export async function getNavMenuItems(): Promise<NavLink[]> {
  return PRIMARY_NAV
}
