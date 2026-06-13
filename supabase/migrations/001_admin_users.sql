-- Admin users table (multi-user auth)
create table if not exists public.admin_users (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);

-- Disable RLS (service role key bypasses anyway, but make it explicit)
alter table public.admin_users disable row level security;

-- Seed users (hashes below are bcrypt with cost 12)
-- sam@samcolecreative.com / ScAdmin2025!
-- brian@brighttribe.com   / d8QMAyhLY9WVXqutg8sN
insert into public.admin_users (email, password_hash) values
  ('sam@samcolecreative.com', '$2b$12$WUMCegPIPn9PtOlw42tnhehIV1QQhc9F.mXpntjgMvX0x7B2u5dTa'),
  ('brian@brighttribe.com',   '$2b$12$HHSYrpSGRmNuPTSC8U.9E.ZgX0U0p4kq60N4xdLmF9h804K2UiVBa')
on conflict (email) do update set password_hash = excluded.password_hash;
