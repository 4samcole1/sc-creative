-- docs/superpowers/db/2026-06-22-leads.sql
-- Run once in the Supabase SQL editor.

create table if not exists leads (
  id            uuid primary key default gen_random_uuid(),
  challenge     text   not null default '',
  services      text[] not null default '{}',
  industry      text   not null default '',
  stage         text   not null default '',
  budget        text   not null default '',
  timeline      text   not null default '',
  has_website   text   not null default '',
  name          text   not null default '',
  business_name text   not null default '',
  email         text   not null default '',
  phone         text   not null default '',
  notes         text   not null default '',
  status        text   not null default 'new',
  created_at    timestamptz not null default now()
);

-- Reconcile a pre-existing leads table from the prior build (non-destructive):
alter table leads add column if not exists challenge     text   not null default '';
alter table leads add column if not exists services      text[] not null default '{}';
alter table leads add column if not exists industry      text   not null default '';
alter table leads add column if not exists stage         text   not null default '';
alter table leads add column if not exists budget        text   not null default '';
alter table leads add column if not exists timeline      text   not null default '';
alter table leads add column if not exists has_website   text   not null default '';
alter table leads add column if not exists name          text   not null default '';
alter table leads add column if not exists business_name text   not null default '';
alter table leads add column if not exists email         text   not null default '';
alter table leads add column if not exists phone         text   not null default '';
alter table leads add column if not exists notes         text   not null default '';
alter table leads add column if not exists status        text   not null default 'new';

alter table leads enable row level security;
-- No policies: leads are written by the public submit action and read by the admin,
-- both via the service-role key (which bypasses RLS). The anon client gets nothing.
