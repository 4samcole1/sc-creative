-- Add hierarchy columns to pages table
alter table pages
  add column if not exists parent_id uuid references pages(id) on delete set null,
  add column if not exists sort_order int default 0;

-- ── Parent pages ──────────────────────────────────────────────────────────────
insert into pages (id, title, slug, parent_id, sort_order, status, content, meta_title, meta_description, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000001', 'Home',         'home',         null, 0, 'draft', '', 'Home',         '', now(), now()),
  ('00000000-0000-0000-0000-000000000002', 'Work',         'work',         null, 1, 'draft', '', 'Work',         '', now(), now()),
  ('00000000-0000-0000-0000-000000000003', 'Blueprint',    'blueprint',    null, 2, 'draft', '', 'Blueprint',    '', now(), now()),
  ('00000000-0000-0000-0000-000000000004', 'Branding',     'branding',     null, 3, 'draft', '', 'Branding',     '', now(), now()),
  ('00000000-0000-0000-0000-000000000005', 'Website',      'website',      null, 4, 'draft', '', 'Website',      '', now(), now()),
  ('00000000-0000-0000-0000-000000000006', 'AI Solutions', 'ai-solutions', null, 5, 'draft', '', 'AI Solutions', '', now(), now()),
  ('00000000-0000-0000-0000-000000000007', 'Growth',       'growth',       null, 6, 'draft', '', 'Growth',       '', now(), now()),
  ('00000000-0000-0000-0000-000000000008', 'About',        'about',        null, 7, 'draft', '', 'About',        '', now(), now()),
  ('00000000-0000-0000-0000-000000000009', 'Contact',      'contact',      null, 8, 'draft', '', 'Contact',      '', now(), now())
on conflict (id) do update set
  title      = excluded.title,
  slug       = excluded.slug,
  sort_order = excluded.sort_order,
  parent_id  = excluded.parent_id;

-- ── Child pages ───────────────────────────────────────────────────────────────
insert into pages (id, title, slug, parent_id, sort_order, status, content, meta_title, meta_description, created_at, updated_at)
values
  -- Work
  ('00000000-0000-0000-0000-000000000010', 'Featured Projects',       'work/featured-projects',             '00000000-0000-0000-0000-000000000002', 0, 'draft', '', 'Featured Projects',       '', now(), now()),
  ('00000000-0000-0000-0000-000000000011', 'Case Studies',            'work/case-studies',                  '00000000-0000-0000-0000-000000000002', 1, 'draft', '', 'Case Studies',            '', now(), now()),
  -- Blueprint
  ('00000000-0000-0000-0000-000000000012', 'Overview',                'blueprint/overview',                 '00000000-0000-0000-0000-000000000003', 0, 'draft', '', 'Overview',                '', now(), now()),
  ('00000000-0000-0000-0000-000000000013', 'Brand Clarity Blueprint', 'blueprint/brand-clarity-blueprint',  '00000000-0000-0000-0000-000000000003', 1, 'draft', '', 'Brand Clarity Blueprint', '', now(), now()),
  ('00000000-0000-0000-0000-000000000014', 'Messaging & Positioning', 'blueprint/messaging-positioning',    '00000000-0000-0000-0000-000000000003', 2, 'draft', '', 'Messaging & Positioning', '', now(), now()),
  -- Branding
  ('00000000-0000-0000-0000-000000000015', 'Overview',                'branding/overview',                  '00000000-0000-0000-0000-000000000004', 0, 'draft', '', 'Overview',                '', now(), now()),
  ('00000000-0000-0000-0000-000000000016', 'Brand Identity',          'branding/brand-identity',            '00000000-0000-0000-0000-000000000004', 1, 'draft', '', 'Brand Identity',          '', now(), now()),
  ('00000000-0000-0000-0000-000000000017', 'Logo Design',             'branding/logo-design',               '00000000-0000-0000-0000-000000000004', 2, 'draft', '', 'Logo Design',             '', now(), now()),
  -- Website
  ('00000000-0000-0000-0000-000000000018', 'Website Design',          'website/website-design',             '00000000-0000-0000-0000-000000000005', 0, 'draft', '', 'Website Design',          '', now(), now()),
  ('00000000-0000-0000-0000-000000000019', 'E-Commerce',              'website/e-commerce',                 '00000000-0000-0000-0000-000000000005', 1, 'draft', '', 'E-Commerce',              '', now(), now()),
  ('00000000-0000-0000-0000-000000000020', 'Custom Platforms',        'website/custom-platforms',           '00000000-0000-0000-0000-000000000005', 2, 'draft', '', 'Custom Platforms',        '', now(), now()),
  ('00000000-0000-0000-0000-000000000021', 'Hosting & Maintenance',   'website/hosting-maintenance',        '00000000-0000-0000-0000-000000000005', 3, 'draft', '', 'Hosting & Maintenance',   '', now(), now()),
  -- AI Solutions
  ('00000000-0000-0000-0000-000000000022', 'Custom Applications',     'ai-solutions/custom-applications',   '00000000-0000-0000-0000-000000000006', 0, 'draft', '', 'Custom Applications',     '', now(), now()),
  ('00000000-0000-0000-0000-000000000023', 'Automation',              'ai-solutions/automation',            '00000000-0000-0000-0000-000000000006', 1, 'draft', '', 'Automation',              '', now(), now()),
  ('00000000-0000-0000-0000-000000000024', 'Client Portals',          'ai-solutions/client-portals',        '00000000-0000-0000-0000-000000000006', 2, 'draft', '', 'Client Portals',          '', now(), now()),
  ('00000000-0000-0000-0000-000000000025', 'Business Systems',        'ai-solutions/business-systems',      '00000000-0000-0000-0000-000000000006', 3, 'draft', '', 'Business Systems',        '', now(), now()),
  -- Growth
  ('00000000-0000-0000-0000-000000000026', 'SEO',                     'growth/seo',                         '00000000-0000-0000-0000-000000000007', 0, 'draft', '', 'SEO',                     '', now(), now()),
  ('00000000-0000-0000-0000-000000000027', 'Google Business Profile', 'growth/google-business-profile',     '00000000-0000-0000-0000-000000000007', 1, 'draft', '', 'Google Business Profile', '', now(), now()),
  ('00000000-0000-0000-0000-000000000028', 'Paid Advertising',        'growth/paid-advertising',            '00000000-0000-0000-0000-000000000007', 2, 'draft', '', 'Paid Advertising',        '', now(), now()),
  -- About
  ('00000000-0000-0000-0000-000000000029', 'Our Story',               'about/our-story',                    '00000000-0000-0000-0000-000000000008', 0, 'draft', '', 'Our Story',               '', now(), now()),
  ('00000000-0000-0000-0000-000000000030', 'Our Process',             'about/our-process',                  '00000000-0000-0000-0000-000000000008', 1, 'draft', '', 'Our Process',             '', now(), now()),
  ('00000000-0000-0000-0000-000000000031', 'Insights',                'about/insights',                     '00000000-0000-0000-0000-000000000008', 2, 'draft', '', 'Insights',                '', now(), now())
on conflict (id) do update set
  title      = excluded.title,
  slug       = excluded.slug,
  sort_order = excluded.sort_order,
  parent_id  = excluded.parent_id;
