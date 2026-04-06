-- ============================================================
-- Migration 002: Row Level Security Policies
-- ============================================================

-- Enable RLS on all user-facing tables
alter table public.profiles enable row level security;
alter table public.daily_logs enable row level security;
alter table public.milestones enable row level security;

-- stat_categories is public reference data — read-only for all authenticated users
alter table public.stat_categories enable row level security;

create policy "stat_categories are readable by all"
  on public.stat_categories for select
  to authenticated
  using (true);

-- profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

-- daily_logs policies
create policy "Users can view own logs"
  on public.daily_logs for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert own logs"
  on public.daily_logs for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own logs"
  on public.daily_logs for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own logs"
  on public.daily_logs for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- milestones policies
create policy "Users can manage own milestones"
  on public.milestones for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
