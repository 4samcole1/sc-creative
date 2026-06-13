// node scripts/seed-pages.mjs
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

// Load .env.local
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const env = Object.fromEntries(
  readFileSync(resolve(root, '.env.local'), 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const now = new Date().toISOString()

const parents = [
  { id: '00000000-0000-0000-0000-000000000001', title: 'Home',         slug: 'home',         parent_id: null, sort_order: 0 },
  { id: '00000000-0000-0000-0000-000000000002', title: 'Work',         slug: 'work',         parent_id: null, sort_order: 1 },
  { id: '00000000-0000-0000-0000-000000000003', title: 'Blueprint',    slug: 'blueprint',    parent_id: null, sort_order: 2 },
  { id: '00000000-0000-0000-0000-000000000004', title: 'Branding',     slug: 'branding',     parent_id: null, sort_order: 3 },
  { id: '00000000-0000-0000-0000-000000000005', title: 'Website',      slug: 'website',      parent_id: null, sort_order: 4 },
  { id: '00000000-0000-0000-0000-000000000006', title: 'AI Solutions', slug: 'ai-solutions', parent_id: null, sort_order: 5 },
  { id: '00000000-0000-0000-0000-000000000007', title: 'Growth',       slug: 'growth',       parent_id: null, sort_order: 6 },
  { id: '00000000-0000-0000-0000-000000000008', title: 'About',        slug: 'about',        parent_id: null, sort_order: 7 },
  { id: '00000000-0000-0000-0000-000000000009', title: 'Contact',      slug: 'contact',      parent_id: null, sort_order: 8 },
]

const children = [
  // Work
  { id: '00000000-0000-0000-0000-000000000010', title: 'Featured Projects',       slug: 'work/featured-projects',            parent_id: '00000000-0000-0000-0000-000000000002', sort_order: 0 },
  { id: '00000000-0000-0000-0000-000000000011', title: 'Case Studies',            slug: 'work/case-studies',                 parent_id: '00000000-0000-0000-0000-000000000002', sort_order: 1 },
  // Blueprint
  { id: '00000000-0000-0000-0000-000000000012', title: 'Overview',                slug: 'blueprint/overview',                parent_id: '00000000-0000-0000-0000-000000000003', sort_order: 0 },
  { id: '00000000-0000-0000-0000-000000000013', title: 'Brand Clarity Blueprint', slug: 'blueprint/brand-clarity-blueprint', parent_id: '00000000-0000-0000-0000-000000000003', sort_order: 1 },
  { id: '00000000-0000-0000-0000-000000000014', title: 'Messaging & Positioning', slug: 'blueprint/messaging-positioning',   parent_id: '00000000-0000-0000-0000-000000000003', sort_order: 2 },
  // Branding
  { id: '00000000-0000-0000-0000-000000000015', title: 'Overview',                slug: 'branding/overview',                 parent_id: '00000000-0000-0000-0000-000000000004', sort_order: 0 },
  { id: '00000000-0000-0000-0000-000000000016', title: 'Brand Identity',          slug: 'branding/brand-identity',           parent_id: '00000000-0000-0000-0000-000000000004', sort_order: 1 },
  { id: '00000000-0000-0000-0000-000000000017', title: 'Logo Design',             slug: 'branding/logo-design',              parent_id: '00000000-0000-0000-0000-000000000004', sort_order: 2 },
  // Website
  { id: '00000000-0000-0000-0000-000000000018', title: 'Website Design',          slug: 'website/website-design',            parent_id: '00000000-0000-0000-0000-000000000005', sort_order: 0 },
  { id: '00000000-0000-0000-0000-000000000019', title: 'E-Commerce',              slug: 'website/e-commerce',                parent_id: '00000000-0000-0000-0000-000000000005', sort_order: 1 },
  { id: '00000000-0000-0000-0000-000000000020', title: 'Custom Platforms',        slug: 'website/custom-platforms',          parent_id: '00000000-0000-0000-0000-000000000005', sort_order: 2 },
  { id: '00000000-0000-0000-0000-000000000021', title: 'Hosting & Maintenance',   slug: 'website/hosting-maintenance',       parent_id: '00000000-0000-0000-0000-000000000005', sort_order: 3 },
  // AI Solutions
  { id: '00000000-0000-0000-0000-000000000022', title: 'Custom Applications',     slug: 'ai-solutions/custom-applications',  parent_id: '00000000-0000-0000-0000-000000000006', sort_order: 0 },
  { id: '00000000-0000-0000-0000-000000000023', title: 'Automation',              slug: 'ai-solutions/automation',           parent_id: '00000000-0000-0000-0000-000000000006', sort_order: 1 },
  { id: '00000000-0000-0000-0000-000000000024', title: 'Client Portals',          slug: 'ai-solutions/client-portals',       parent_id: '00000000-0000-0000-0000-000000000006', sort_order: 2 },
  { id: '00000000-0000-0000-0000-000000000025', title: 'Business Systems',        slug: 'ai-solutions/business-systems',     parent_id: '00000000-0000-0000-0000-000000000006', sort_order: 3 },
  // Growth
  { id: '00000000-0000-0000-0000-000000000026', title: 'SEO',                     slug: 'growth/seo',                        parent_id: '00000000-0000-0000-0000-000000000007', sort_order: 0 },
  { id: '00000000-0000-0000-0000-000000000027', title: 'Google Business Profile', slug: 'growth/google-business-profile',    parent_id: '00000000-0000-0000-0000-000000000007', sort_order: 1 },
  { id: '00000000-0000-0000-0000-000000000028', title: 'Paid Advertising',        slug: 'growth/paid-advertising',           parent_id: '00000000-0000-0000-0000-000000000007', sort_order: 2 },
  // About
  { id: '00000000-0000-0000-0000-000000000029', title: 'Our Story',               slug: 'about/our-story',                   parent_id: '00000000-0000-0000-0000-000000000008', sort_order: 0 },
  { id: '00000000-0000-0000-0000-000000000030', title: 'Our Process',             slug: 'about/our-process',                 parent_id: '00000000-0000-0000-0000-000000000008', sort_order: 1 },
  { id: '00000000-0000-0000-0000-000000000031', title: 'Insights',                slug: 'about/insights',                    parent_id: '00000000-0000-0000-0000-000000000008', sort_order: 2 },
]

function makeRow(p) {
  return { ...p, status: 'draft', content: '', meta_title: p.title, meta_description: '', created_at: now, updated_at: now }
}

console.log('Seeding parent pages…')
const { error: e1 } = await supabase.from('pages').upsert(parents.map(makeRow), { onConflict: 'id' })
if (e1) { console.error('Parents failed:', e1.message); process.exit(1) }
console.log(`✓ ${parents.length} parent pages inserted`)

console.log('Seeding child pages…')
const { error: e2 } = await supabase.from('pages').upsert(children.map(makeRow), { onConflict: 'id' })
if (e2) { console.error('Children failed:', e2.message); process.exit(1) }
console.log(`✓ ${children.length} child pages inserted`)

console.log(`\n✓ Done — ${parents.length + children.length} pages seeded`)
