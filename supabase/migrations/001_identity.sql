-- 001_identity.sql
-- Identity foundation: profiles (1:1 with auth.users), schools, school membership, classes.

create extension if not exists "pgcrypto";

-- Generic updated_at trigger helper, reused by every table below.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  bio text not null default '',
  avatar_url text,
  cover_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles_insert_self"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "profiles_update_self"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row whenever a new Supabase Auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
begin
  base_username := coalesce(
    new.raw_user_meta_data->>'username',
    'user_' || substr(new.id::text, 1, 8)
  );

  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    base_username,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, base_username), '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- schools
-- ---------------------------------------------------------------------------
create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  address text,
  logo_url text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.schools enable row level security;

create policy "schools_select_authenticated"
  on public.schools for select
  to authenticated
  using (true);

create trigger schools_set_updated_at
  before update on public.schools
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- school_members
-- ---------------------------------------------------------------------------
create table public.school_members (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  member_type text not null check (member_type in ('student', 'teacher', 'staff', 'admin')),
  student_code text,
  status text not null default 'active' check (status in ('active', 'pending', 'suspended', 'left')),
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  created_at timestamptz not null default now(),
  unique (school_id, user_id)
);

alter table public.school_members enable row level security;

create index school_members_school_id_idx on public.school_members(school_id);
create index school_members_user_id_idx on public.school_members(user_id);

-- A user can see their own membership row, and can see the roster of a
-- school they already belong to (needed to render classmates/teachers),
-- but student_code stays restricted to the row owner via a separate view later.
create policy "school_members_select_own_or_same_school"
  on public.school_members for select
  to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.school_members me
      where me.school_id = school_members.school_id
        and me.user_id = auth.uid()
        and me.status = 'active'
    )
  );

create policy "school_members_insert_self"
  on public.school_members for insert
  to authenticated
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- classes
-- ---------------------------------------------------------------------------
create table public.classes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  grade text,
  academic_year text,
  homeroom_teacher_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.classes enable row level security;

create policy "classes_select_same_school"
  on public.classes for select
  to authenticated
  using (
    exists (
      select 1 from public.school_members sm
      where sm.school_id = classes.school_id
        and sm.user_id = auth.uid()
        and sm.status = 'active'
    )
  );

create trigger classes_set_updated_at
  before update on public.classes
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- class_members
-- ---------------------------------------------------------------------------
create table public.class_members (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'student' check (role in ('student', 'monitor', 'vice_monitor', 'teacher')),
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  unique (class_id, user_id)
);

alter table public.class_members enable row level security;

create index class_members_class_id_idx on public.class_members(class_id);
create index class_members_user_id_idx on public.class_members(user_id);

create policy "class_members_select_same_class"
  on public.class_members for select
  to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.class_members me
      where me.class_id = class_members.class_id
        and me.user_id = auth.uid()
    )
  );
