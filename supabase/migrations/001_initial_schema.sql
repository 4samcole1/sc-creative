create extension if not exists "uuid-ossp";

-- Posts (blog / insights)
create table posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  content text,
  excerpt text,
  cover_image text,
  published_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

-- Projects (portfolio)
create table projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  client text,
  services text[] default '{}',
  cover_image text,
  gallery text[] default '{}',
  summary text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order int default 0,
  created_at timestamptz not null default now()
);

-- Case studies
create table case_studies (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  client text,
  project_id uuid references projects(id) on delete set null,
  content text,
  results text[] default '{}',
  cover_image text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- Testimonials
create table testimonials (
  id uuid primary key default uuid_generate_v4(),
  author text not null,
  company text,
  quote text not null,
  avatar text,
  visible boolean not null default true,
  sort_order int default 0,
  created_at timestamptz not null default now()
);

-- Leads (quote form submissions)
create table leads (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  business text,
  phone text,
  email text not null,
  service_interest text,
  message text,
  created_at timestamptz not null default now()
);

-- Industry pages
create table industry_pages (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  headline text,
  content text,
  services text[] default '{}',
  hero_image text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

-- Service area pages
create table service_area_pages (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  city text not null,
  county text not null default 'Walker County',
  content text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

-- RLS
alter table posts enable row level security;
alter table projects enable row level security;
alter table case_studies enable row level security;
alter table testimonials enable row level security;
alter table leads enable row level security;
alter table industry_pages enable row level security;
alter table service_area_pages enable row level security;

-- Public read policies
create policy "public read published posts" on posts for select using (status = 'published');
create policy "public read published projects" on projects for select using (status = 'published');
create policy "public read published case_studies" on case_studies for select using (status = 'published');
create policy "public read visible testimonials" on testimonials for select using (visible = true);
create policy "public read published industry_pages" on industry_pages for select using (status = 'published');
create policy "public read published service_area_pages" on service_area_pages for select using (status = 'published');

-- Admin full access
create policy "admin all posts" on posts for all using (auth.role() = 'authenticated');
create policy "admin all projects" on projects for all using (auth.role() = 'authenticated');
create policy "admin all case_studies" on case_studies for all using (auth.role() = 'authenticated');
create policy "admin all testimonials" on testimonials for all using (auth.role() = 'authenticated');
create policy "admin all leads" on leads for all using (auth.role() = 'authenticated');
create policy "admin all industry_pages" on industry_pages for all using (auth.role() = 'authenticated');
create policy "admin all service_area_pages" on service_area_pages for all using (auth.role() = 'authenticated');

-- Allow anon form submissions
create policy "anon insert leads" on leads for insert with check (true);
