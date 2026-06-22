-- docs/superpowers/db/2026-06-22-admin-and-clients.sql
-- Run in Supabase SQL editor.
-- ⚠️ RUN ONCE. The clients table has no unique key — re-running this file duplicates every client row.

-- 1. Admin users (email + bcrypt hash) ------------------------------------
create table if not exists admin_users (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  password_hash text not null,
  name          text not null default '',
  created_at    timestamptz not null default now()
);
alter table admin_users enable row level security;
-- No public policies: admin_users is read ONLY via the service-role key
-- (which bypasses RLS). The anon client must never see it.

-- 2. Clients (single source of truth) -------------------------------------
create table if not exists clients (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  city            text not null default '',
  state           text not null default '',
  lat             double precision,
  lng             double precision,
  industry        text not null default '',
  website         text not null default '',
  logo_url        text not null default '',
  blurb           text not null default '',
  show_trust_bar  boolean not null default false,
  show_map        boolean not null default false,
  show_portfolio  boolean not null default false,
  gbp_url         text,
  needs_review    boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
alter table clients enable row level security;

-- Public site reads clients (map + trust bar) via the anon key:
create policy "clients are publicly readable"
  on clients for select
  to anon, authenticated
  using (true);
-- Writes happen only through the service-role key (admin server actions),
-- which bypasses RLS — so no insert/update/delete policy is defined.

-- 3. Seed admin users -----------------------------------------------------
-- Generate each hash locally first (Task 2 documents the command), then paste:
insert into admin_users (email, name, password_hash) values
  ('sam@samcolecreative.com', 'Sam Cole', '<<BCRYPT_HASH_SAM>>'),
  ('brian@brighttribe.com',   'Brian',    '<<BCRYPT_HASH_BRIAN>>')
on conflict (email) do nothing;

-- 4. Seed clients ---------------------------------------------------------
-- Trust-bar names (location blank; dropped per Phase 1 spec: "Jasper AL",
-- "Southeastern Construction", "4 Seasons Landscaping").
insert into clients (name, show_trust_bar) values
  ('67 Magazine', true), ('Always Answered', true), ('Andrews Mechanical', true),
  ('Answer Pro', true), ('AOC Connect', true), ('ARS Roofing', true),
  ('At The Lake Spa & Wellness', true), ('Backyard Blessings', true),
  ('Bethlehem Doodles', true), ('BoatSafe', true), ('Brandblueprint.ai', true),
  ('Brock Transportation', true), ('Carson Plumbing', true), ('Clarry Lane', true),
  ('Color Faux Walls', true), ('Daybreak Care', true), ('DirectLine', true),
  ('Divergent', true), ('Ducktown Lodge', true), ('Employee Hotlines', true),
  ('Expert Language Services', true), ('GB Construction', true), ('Gen Growth', true),
  ('Georgia Standard', true), ('Glory Fellowship Baptist Church', true),
  ('Hallway Healthcare', true), ('HaulX Moving', true), ('Heritage Home Painting', true),
  ('Imago Dei Academy', true), ('James Health', true), ('Loyal Standard', true),
  ('Mann Home Services', true), ('Mastercraft Plumbing', true), ('Mayer Landscaping', true),
  ('MCM Clothing', true), ('Medical Diagnostics', true), ('Mentality', true),
  ('Miller Roofing', true), ('Muncie Rooterman', true), ('Peak Performance', true),
  ('Piece by Peace', true), ('Precision Bill Review', true), ('Roundtable Advisors', true),
  ('Sanders Aviation', true), ('SHOAlign', true), ('Smith Lake Family Care', true),
  ('Soukkala', true), ('TaleGate Sports', true), ('Talladega County Sheriff', true),
  ('The Walker Leader', true), ('United Physician Group', true), ('Vote Beaty', true),
  ('Water Extraction Tech', true);

-- Map clients: set show_map + city-level coords. Update the rows that already
-- exist from the trust-bar seed; insert Sanders Aviation's extra locations and
-- Walker Medical Diagnostics as new map-only rows.
update clients set city='Northport', state='AL', lat=33.2290, lng=-87.5772, show_map=true where name='ARS Roofing';
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='At The Lake Spa & Wellness';
update clients set city='Dora',      state='AL', lat=33.7301, lng=-87.0905, show_map=true where name='Backyard Blessings';
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='Glory Fellowship Baptist Church';
update clients set city='Cumming',   state='GA', lat=34.2073, lng=-84.1402, show_map=true where name='HaulX Moving';
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='Imago Dei Academy';
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='Loyal Standard';
update clients set city='Pelham',    state='AL', lat=33.2857, lng=-86.8097, show_map=true, needs_review=true where name='Mann Home Services';
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='Miller Roofing';
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='Smith Lake Family Care';
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='TaleGate Sports';
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='The Walker Leader';
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='67 Magazine';
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='Water Extraction Tech';
update clients set city='Talladega', state='AL', lat=33.4359, lng=-86.1058, show_map=true where name='Talladega County Sheriff';
-- Sanders Aviation: 3 pins. The trust-bar row becomes the Jasper pin; add 2 more.
update clients set city='Jasper',    state='AL', lat=33.8312, lng=-87.2772, show_map=true where name='Sanders Aviation';
insert into clients (name, city, state, lat, lng, show_map) values
  ('Sanders Aviation', 'Huntsville',  'AL', 34.7304, -86.5861, true),
  ('Sanders Aviation', 'Tuscaloosa',  'AL', 33.2098, -87.5692, true);
-- Walker Medical Diagnostics (map-only; "Medical Diagnostics" stays as the trust-bar name)
insert into clients (name, city, state, lat, lng, show_map) values
  ('Walker Medical Diagnostics', 'Jasper', 'AL', 33.8312, -87.2772, true);
