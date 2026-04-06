-- ============================================================
-- Migration 001: Initial Schema
-- ============================================================

-- Stat categories reference table (seeded, not user-editable in Phase 1)
create table public.stat_categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  label       text not null,
  description text,
  icon        text,
  color       text not null,
  sort_order  smallint not null default 0,
  created_at  timestamptz not null default now()
);

-- User profiles (extends auth.users with app-specific data)
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  avatar_url    text,
  timezone      text not null default 'UTC',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Daily log entries: one row per user per category per day
create table public.daily_logs (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  log_date        date not null,
  category_id     uuid not null references public.stat_categories(id),
  hours           numeric(4,2) not null
                    check (hours >= 0 and hours <= 24),
  notes           text,
  -- Phase 2 hook: null in Phase 1, populated when deep work multiplier is added
  work_type       text
                    check (work_type in ('deep', 'shallow')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  -- One entry per user per category per day
  unique (user_id, log_date, category_id)
);

-- Index for fast per-user date range queries
create index daily_logs_user_date_idx on public.daily_logs (user_id, log_date desc);

-- Milestones table (Phase 2 — created empty now to avoid breaking migrations later)
create table public.milestones (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  category_id   uuid references public.stat_categories(id),
  title         text not null,
  achieved_at   date not null,
  bonus_xp      integer not null default 0,
  created_at    timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at on profiles
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger daily_logs_updated_at
  before update on public.daily_logs
  for each row execute procedure public.set_updated_at();
