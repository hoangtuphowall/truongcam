-- 006_moderation.sql

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  entity_type text not null check (entity_type in ('post', 'comment', 'reel', 'message', 'profile', 'group')),
  entity_id uuid not null,
  reason text not null,
  details text,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);
alter table public.reports enable row level security;
create index reports_entity_idx on public.reports(entity_type, entity_id);

create policy "reports_select_own"
  on public.reports for select to authenticated using (reporter_id = auth.uid());
create policy "reports_insert_self"
  on public.reports for insert to authenticated with check (reporter_id = auth.uid());

create table public.moderation_actions (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.reports(id) on delete set null,
  moderator_id uuid not null references public.profiles(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  action text not null check (action in ('hide', 'remove', 'restore', 'warn_user', 'suspend_user', 'no_action')),
  notes text,
  created_at timestamptz not null default now()
);
alter table public.moderation_actions enable row level security;

-- Moderation data is admin-only. There is no per-school admin role table
-- yet (see school_members.member_type = 'admin'); this policy checks that
-- flag directly. Tighten/extend once a dedicated moderator role exists.
create policy "moderation_actions_select_admins"
  on public.moderation_actions for select to authenticated
  using (exists (select 1 from public.school_members sm where sm.user_id = auth.uid() and sm.member_type = 'admin'));
create policy "moderation_actions_insert_admins"
  on public.moderation_actions for insert to authenticated
  with check (
    moderator_id = auth.uid()
    and exists (select 1 from public.school_members sm where sm.user_id = auth.uid() and sm.member_type = 'admin')
  );
