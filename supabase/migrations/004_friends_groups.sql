-- 004_friends_groups.sql

create table public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  check (sender_id <> receiver_id)
);
alter table public.friend_requests enable row level security;
create index friend_requests_receiver_id_idx on public.friend_requests(receiver_id);
create index friend_requests_sender_id_idx on public.friend_requests(sender_id);
create unique index friend_requests_unique_pending
  on public.friend_requests(sender_id, receiver_id)
  where status = 'pending';

create policy "friend_requests_select_participant"
  on public.friend_requests for select to authenticated
  using (sender_id = auth.uid() or receiver_id = auth.uid());
create policy "friend_requests_insert_as_sender"
  on public.friend_requests for insert to authenticated
  with check (sender_id = auth.uid());
create policy "friend_requests_update_participant"
  on public.friend_requests for update to authenticated
  using (sender_id = auth.uid() or receiver_id = auth.uid())
  with check (sender_id = auth.uid() or receiver_id = auth.uid());

-- ---------------------------------------------------------------------------
-- friendships (canonical ordering: user_a < user_b)
-- ---------------------------------------------------------------------------
create table public.friendships (
  user_a uuid not null references public.profiles(id) on delete cascade,
  user_b uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_a, user_b),
  check (user_a < user_b)
);
alter table public.friendships enable row level security;
create index friendships_user_b_idx on public.friendships(user_b);

create policy "friendships_select_participant"
  on public.friendships for select to authenticated
  using (user_a = auth.uid() or user_b = auth.uid());

create or replace function public.accept_friend_request(request_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  req record;
  lo uuid;
  hi uuid;
begin
  select * into req from public.friend_requests where id = request_id for update;

  if req is null then
    raise exception 'Friend request not found';
  end if;

  if req.receiver_id <> auth.uid() then
    raise exception 'Not authorized to accept this request';
  end if;

  if req.status <> 'pending' then
    raise exception 'Request is no longer pending';
  end if;

  update public.friend_requests
    set status = 'accepted', responded_at = now()
    where id = request_id;

  lo := least(req.sender_id, req.receiver_id);
  hi := greatest(req.sender_id, req.receiver_id);

  insert into public.friendships (user_a, user_b)
  values (lo, hi)
  on conflict do nothing;
end;
$$;

create table public.blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);
alter table public.blocks enable row level security;

create policy "blocks_select_self" on public.blocks for select to authenticated using (blocker_id = auth.uid());
create policy "blocks_insert_self" on public.blocks for insert to authenticated with check (blocker_id = auth.uid());
create policy "blocks_delete_self" on public.blocks for delete to authenticated using (blocker_id = auth.uid());

-- ---------------------------------------------------------------------------
-- groups + group_members
-- Both tables are created FIRST (no policies yet), because groups' policies
-- need to reference group_members, and group_members' policies need to
-- reference itself — so every table this file uses must exist before any
-- policy on either table is created.
-- ---------------------------------------------------------------------------
create table public.groups (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references public.schools(id) on delete set null,
  name text not null,
  description text not null default '',
  category text not null default 'School' check (category in ('School', 'College', 'Work', 'Interest')),
  avatar_url text,
  cover_url text,
  visibility text not null default 'public' check (visibility in ('public', 'private')),
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.groups enable row level security;

create trigger groups_set_updated_at
  before update on public.groups
  for each row execute function public.set_updated_at();

create table public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  status text not null default 'active' check (status in ('active', 'pending', 'left')),
  joined_at timestamptz not null default now(),
  unique (group_id, user_id)
);
alter table public.group_members enable row level security;
create index group_members_group_id_idx on public.group_members(group_id);
create index group_members_user_id_idx on public.group_members(user_id);

-- Now that both tables exist, the cross-referencing policies can be created.
create policy "groups_select_public_or_member"
  on public.groups for select to authenticated
  using (
    visibility = 'public'
    or exists (select 1 from public.group_members gm where gm.group_id = groups.id and gm.user_id = auth.uid())
  );
create policy "groups_insert_self"
  on public.groups for insert to authenticated with check (created_by = auth.uid());
create policy "groups_update_owner_or_admin"
  on public.groups for update to authenticated
  using (exists (select 1 from public.group_members gm where gm.group_id = groups.id and gm.user_id = auth.uid() and gm.role in ('owner', 'admin')))
  with check (true);

create policy "group_members_select_same_group"
  on public.group_members for select to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from public.group_members me where me.group_id = group_members.group_id and me.user_id = auth.uid())
  );
create policy "group_members_insert_self"
  on public.group_members for insert to authenticated with check (user_id = auth.uid());
create policy "group_members_delete_self"
  on public.group_members for delete to authenticated using (user_id = auth.uid());
