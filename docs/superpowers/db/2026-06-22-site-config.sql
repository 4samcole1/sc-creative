-- docs/superpowers/db/2026-06-22-site-config.sql
-- Run once in the Supabase SQL editor.

create table if not exists site_config (
  id   int  primary key default 1,
  business_name    text not null default '',
  tagline          text not null default '',
  phone            text not null default '',
  email            text not null default '',
  address          text not null default '',
  meta_title       text not null default '',
  meta_description text not null default '',
  facebook_url     text not null default '',
  instagram_url    text not null default '',
  linkedin_url     text not null default '',
  twitter_url      text not null default '',
  youtube_url      text not null default '',
  color_primary    text not null default '#1cc7c3',
  color_background text not null default '#070d17',
  color_surface    text not null default '#0b1520',
  color_text       text not null default '#e8eef4',
  font_heading     text not null default 'poppins',
  font_body        text not null default 'poppins',
  h1_size int not null default 64,  h1_weight int not null default 800,
  h2_size int not null default 48,  h2_weight int not null default 700,
  h3_size int not null default 32,  h3_weight int not null default 700,
  h4_size int not null default 24,  h4_weight int not null default 600,
  body_size int not null default 16, body_weight int not null default 400,
  body_line_height numeric not null default 1.6,
  logo_light_url   text not null default '/images/logo-white.png',
  logo_dark_url    text not null default '/images/logo-dark.png',
  google_place_id  text not null default '',
  updated_at       timestamptz not null default now(),
  constraint site_config_singleton check (id = 1)
);

alter table site_config enable row level security;

-- Public site reads the config via the anon key:
create policy "site_config is publicly readable"
  on site_config for select to anon, authenticated using (true);
-- Writes happen only through the service-role key (admin actions), which
-- bypasses RLS — so no insert/update/delete policy is defined.

-- Seed the single row (idempotent):
insert into site_config (id) values (1) on conflict (id) do nothing;
