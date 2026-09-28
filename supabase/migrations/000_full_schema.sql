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
-- 002_social_core.sql
-- Posts, post media, post interactions, comments.

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  school_id uuid references public.schools(id) on delete set null,
  content text not null default '',
  post_type text not null default 'text' check (post_type in ('text', 'image', 'quote')),
  visibility text not null default 'school' check (visibility in ('school', 'class', 'friends', 'public', 'private')),
  status text not null default 'published' check (status in ('published', 'hidden', 'removed', 'under_review')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.posts enable row level security;

create index posts_author_id_idx on public.posts(author_id);
create index posts_school_id_idx on public.posts(school_id);
create index posts_created_at_idx on public.posts(created_at desc);

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- Simplified visibility for v1: any authenticated user can read a published,
-- non-deleted post. Author can always see/manage their own post regardless
-- of status. Tighten this once `visibility` scoping (friends/class) is wired.
create policy "posts_select_published_or_own"
  on public.posts for select
  to authenticated
  using (
    (status = 'published' and deleted_at is null)
    or author_id = auth.uid()
  );

create policy "posts_insert_own"
  on public.posts for insert
  to authenticated
  with check (author_id = auth.uid());

create policy "posts_update_own"
  on public.posts for update
  to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

create policy "posts_delete_own"
  on public.posts for delete
  to authenticated
  using (author_id = auth.uid());

-- ---------------------------------------------------------------------------
-- post_media
-- ---------------------------------------------------------------------------
create table public.post_media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  storage_path text not null,
  media_type text not null check (media_type in ('image', 'video')),
  mime_type text,
  width int,
  height int,
  duration numeric,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.post_media enable row level security;
create index post_media_post_id_idx on public.post_media(post_id);

create policy "post_media_select_via_post"
  on public.post_media for select
  to authenticated
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_media.post_id
        and (p.status = 'published' or p.author_id = auth.uid())
        and p.deleted_at is null
    )
  );

create policy "post_media_insert_own_post"
  on public.post_media for insert
  to authenticated
  with check (
    exists (select 1 from public.posts p where p.id = post_media.post_id and p.author_id = auth.uid())
  );

create policy "post_media_delete_own_post"
  on public.post_media for delete
  to authenticated
  using (
    exists (select 1 from public.posts p where p.id = post_media.post_id and p.author_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- post_likes / post_saves / post_shares
-- ---------------------------------------------------------------------------
create table public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
alter table public.post_likes enable row level security;
create index post_likes_post_id_idx on public.post_likes(post_id);
create index post_likes_user_id_idx on public.post_likes(user_id);

create policy "post_likes_select_authenticated"
  on public.post_likes for select to authenticated using (true);
create policy "post_likes_insert_self"
  on public.post_likes for insert to authenticated with check (user_id = auth.uid());
create policy "post_likes_delete_self"
  on public.post_likes for delete to authenticated using (user_id = auth.uid());

create table public.post_saves (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
alter table public.post_saves enable row level security;
create index post_saves_user_id_idx on public.post_saves(user_id);

create policy "post_saves_select_self"
  on public.post_saves for select to authenticated using (user_id = auth.uid());
create policy "post_saves_insert_self"
  on public.post_saves for insert to authenticated with check (user_id = auth.uid());
create policy "post_saves_delete_self"
  on public.post_saves for delete to authenticated using (user_id = auth.uid());

create table public.post_shares (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.post_shares enable row level security;
create index post_shares_post_id_idx on public.post_shares(post_id);

create policy "post_shares_select_authenticated"
  on public.post_shares for select to authenticated using (true);
create policy "post_shares_insert_self"
  on public.post_shares for insert to authenticated with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- comments
-- ---------------------------------------------------------------------------
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  content text not null,
  status text not null default 'published' check (status in ('published', 'hidden', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
alter table public.comments enable row level security;
create index comments_post_id_idx on public.comments(post_id);
create index comments_author_id_idx on public.comments(author_id);

create trigger comments_set_updated_at
  before update on public.comments
  for each row execute function public.set_updated_at();

create policy "comments_select_via_post"
  on public.comments for select
  to authenticated
  using (
    status = 'published' and deleted_at is null
    or author_id = auth.uid()
  );

create policy "comments_insert_self"
  on public.comments for insert
  to authenticated
  with check (author_id = auth.uid());

create policy "comments_update_own"
  on public.comments for update
  to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

create policy "comments_delete_own"
  on public.comments for delete
  to authenticated
  using (author_id = auth.uid());

create table public.comment_likes (
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);
alter table public.comment_likes enable row level security;

create policy "comment_likes_select_authenticated"
  on public.comment_likes for select to authenticated using (true);
create policy "comment_likes_insert_self"
  on public.comment_likes for insert to authenticated with check (user_id = auth.uid());
create policy "comment_likes_delete_self"
  on public.comment_likes for delete to authenticated using (user_id = auth.uid());
-- 003_stories_reels.sql

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'expired', 'removed')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours')
);
alter table public.stories enable row level security;
create index stories_author_id_idx on public.stories(author_id);

create policy "stories_select_active_or_own"
  on public.stories for select to authenticated
  using ((status = 'active' and expires_at > now()) or author_id = auth.uid());
create policy "stories_insert_self"
  on public.stories for insert to authenticated with check (author_id = auth.uid());
create policy "stories_delete_own"
  on public.stories for delete to authenticated using (author_id = auth.uid());

create table public.story_media (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  media_type text not null check (media_type in ('photo', 'quote')),
  storage_path text,
  text_content text,
  background text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.story_media enable row level security;
create index story_media_story_id_idx on public.story_media(story_id);

create policy "story_media_select_via_story"
  on public.story_media for select to authenticated
  using (exists (
    select 1 from public.stories s where s.id = story_media.story_id
      and ((s.status = 'active' and s.expires_at > now()) or s.author_id = auth.uid())
  ));
create policy "story_media_insert_own_story"
  on public.story_media for insert to authenticated
  with check (exists (select 1 from public.stories s where s.id = story_media.story_id and s.author_id = auth.uid()));

create table public.story_views (
  story_id uuid not null references public.stories(id) on delete cascade,
  viewer_id uuid not null references public.profiles(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  primary key (story_id, viewer_id)
);
alter table public.story_views enable row level security;

create policy "story_views_select_author_or_self"
  on public.story_views for select to authenticated
  using (
    viewer_id = auth.uid()
    or exists (select 1 from public.stories s where s.id = story_views.story_id and s.author_id = auth.uid())
  );
create policy "story_views_insert_self"
  on public.story_views for insert to authenticated with check (viewer_id = auth.uid());

-- ---------------------------------------------------------------------------
-- reels
-- ---------------------------------------------------------------------------
create table public.reels (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  caption text not null default '',
  sound_track text,
  status text not null default 'published' check (status in ('published', 'hidden', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.reels enable row level security;
create index reels_author_id_idx on public.reels(author_id);

create trigger reels_set_updated_at
  before update on public.reels
  for each row execute function public.set_updated_at();

create policy "reels_select_published_or_own"
  on public.reels for select to authenticated
  using (status = 'published' or author_id = auth.uid());
create policy "reels_insert_self"
  on public.reels for insert to authenticated with check (author_id = auth.uid());
create policy "reels_update_own"
  on public.reels for update to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "reels_delete_own"
  on public.reels for delete to authenticated using (author_id = auth.uid());

create table public.reel_media (
  id uuid primary key default gen_random_uuid(),
  reel_id uuid not null references public.reels(id) on delete cascade,
  storage_path text not null,
  mime_type text,
  duration numeric,
  created_at timestamptz not null default now()
);
alter table public.reel_media enable row level security;

create policy "reel_media_select_via_reel"
  on public.reel_media for select to authenticated
  using (exists (select 1 from public.reels r where r.id = reel_media.reel_id and (r.status = 'published' or r.author_id = auth.uid())));
create policy "reel_media_insert_own_reel"
  on public.reel_media for insert to authenticated
  with check (exists (select 1 from public.reels r where r.id = reel_media.reel_id and r.author_id = auth.uid()));

create table public.reel_likes (
  reel_id uuid not null references public.reels(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (reel_id, user_id)
);
alter table public.reel_likes enable row level security;
create policy "reel_likes_select_authenticated" on public.reel_likes for select to authenticated using (true);
create policy "reel_likes_insert_self" on public.reel_likes for insert to authenticated with check (user_id = auth.uid());
create policy "reel_likes_delete_self" on public.reel_likes for delete to authenticated using (user_id = auth.uid());

create table public.reel_saves (
  reel_id uuid not null references public.reels(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (reel_id, user_id)
);
alter table public.reel_saves enable row level security;
create policy "reel_saves_select_self" on public.reel_saves for select to authenticated using (user_id = auth.uid());
create policy "reel_saves_insert_self" on public.reel_saves for insert to authenticated with check (user_id = auth.uid());
create policy "reel_saves_delete_self" on public.reel_saves for delete to authenticated using (user_id = auth.uid());

create table public.reel_views (
  id uuid primary key default gen_random_uuid(),
  reel_id uuid not null references public.reels(id) on delete cascade,
  viewer_id uuid references public.profiles(id) on delete set null,
  viewed_at timestamptz not null default now()
);
alter table public.reel_views enable row level security;
create index reel_views_reel_id_idx on public.reel_views(reel_id);
create policy "reel_views_insert_self" on public.reel_views for insert to authenticated with check (viewer_id = auth.uid());
create policy "reel_views_select_author" on public.reel_views for select to authenticated
  using (exists (select 1 from public.reels r where r.id = reel_views.reel_id and r.author_id = auth.uid()));
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
-- 005_chat_notifications.sql

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('direct', 'group', 'class')),
  title text,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.conversations enable row level security;

create trigger conversations_set_updated_at
  before update on public.conversations
  for each row execute function public.set_updated_at();

create table public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  last_read_message_id uuid,
  primary key (conversation_id, user_id)
);
alter table public.conversation_members enable row level security;
create index conversation_members_user_id_idx on public.conversation_members(user_id);

-- Both tables exist now, so the cross-referencing policies can be added.
create policy "conversations_select_member"
  on public.conversations for select to authenticated
  using (exists (select 1 from public.conversation_members cm where cm.conversation_id = conversations.id and cm.user_id = auth.uid()));
create policy "conversations_insert_self"
  on public.conversations for insert to authenticated with check (created_by = auth.uid());

create policy "conversation_members_select_same_conversation"
  on public.conversation_members for select to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from public.conversation_members me where me.conversation_id = conversation_members.conversation_id and me.user_id = auth.uid())
  );
create policy "conversation_members_insert_self_or_owner"
  on public.conversation_members for insert to authenticated
  with check (
    user_id = auth.uid()
    or exists (select 1 from public.conversations c where c.id = conversation_members.conversation_id and c.created_by = auth.uid())
  );
create policy "conversation_members_update_self"
  on public.conversation_members for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text,
  message_type text not null default 'text' check (message_type in ('text', 'image', 'system')),
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz
);
alter table public.messages enable row level security;
create index messages_conversation_id_idx on public.messages(conversation_id);
create index messages_created_at_idx on public.messages(created_at);

create policy "messages_select_member"
  on public.messages for select to authenticated
  using (exists (select 1 from public.conversation_members cm where cm.conversation_id = messages.conversation_id and cm.user_id = auth.uid()));
create policy "messages_insert_member"
  on public.messages for insert to authenticated
  with check (
    sender_id = auth.uid()
    and exists (select 1 from public.conversation_members cm where cm.conversation_id = messages.conversation_id and cm.user_id = auth.uid())
  );
create policy "messages_update_own"
  on public.messages for update to authenticated
  using (sender_id = auth.uid())
  with check (sender_id = auth.uid());

create table public.message_attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  storage_path text not null,
  mime_type text,
  created_at timestamptz not null default now()
);
alter table public.message_attachments enable row level security;

create policy "message_attachments_select_via_message"
  on public.message_attachments for select to authenticated
  using (exists (
    select 1 from public.messages m
    join public.conversation_members cm on cm.conversation_id = m.conversation_id
    where m.id = message_attachments.message_id and cm.user_id = auth.uid()
  ));
create policy "message_attachments_insert_own_message"
  on public.message_attachments for insert to authenticated
  with check (exists (select 1 from public.messages m where m.id = message_attachments.message_id and m.sender_id = auth.uid()));

alter publication supabase_realtime add table public.messages;

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  type text not null check (type in ('like', 'comment', 'friend_request', 'friend_accept', 'group_invite', 'message', 'system')),
  entity_type text,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.notifications enable row level security;
create index notifications_recipient_id_idx on public.notifications(recipient_id);
create index notifications_created_at_idx on public.notifications(created_at desc);

create policy "notifications_select_self"
  on public.notifications for select to authenticated using (recipient_id = auth.uid());
create policy "notifications_update_self"
  on public.notifications for update to authenticated
  using (recipient_id = auth.uid())
  with check (recipient_id = auth.uid());

alter publication supabase_realtime add table public.notifications;
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
-- 007_school_apps_demo.sql
-- Cẩm Canteen (real order flow) + Cẩm Pay (explicitly a DEMO school-credit
-- ledger only — no real money, no card data, per product decision).

create table public.canteens (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references public.schools(id) on delete set null,
  name text not null,
  created_at timestamptz not null default now()
);
alter table public.canteens enable row level security;
create policy "canteens_select_authenticated" on public.canteens for select to authenticated using (true);

create table public.canteen_items (
  id uuid primary key default gen_random_uuid(),
  canteen_id uuid not null references public.canteens(id) on delete cascade,
  name text not null,
  price integer not null check (price >= 0),
  category text not null check (category in ('Ăn sáng', 'Đồ uống', 'Ăn vặt', 'Dụng cụ học tập')),
  emoji text,
  image_url text,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.canteen_items enable row level security;
create index canteen_items_canteen_id_idx on public.canteen_items(canteen_id);
create policy "canteen_items_select_authenticated" on public.canteen_items for select to authenticated using (true);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  canteen_id uuid not null references public.canteens(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled')),
  total_amount integer not null default 0 check (total_amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.orders enable row level security;
create index orders_buyer_id_idx on public.orders(buyer_id);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create policy "orders_select_own"
  on public.orders for select to authenticated using (buyer_id = auth.uid());
create policy "orders_insert_self"
  on public.orders for insert to authenticated with check (buyer_id = auth.uid());

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  canteen_item_id uuid not null references public.canteen_items(id),
  quantity integer not null check (quantity > 0),
  unit_price integer not null check (unit_price >= 0)
);
alter table public.order_items enable row level security;
create index order_items_order_id_idx on public.order_items(order_id);

create policy "order_items_select_via_order"
  on public.order_items for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_items.order_id and o.buyer_id = auth.uid()));
create policy "order_items_insert_via_order"
  on public.order_items for insert to authenticated
  with check (exists (select 1 from public.orders o where o.id = order_items.order_id and o.buyer_id = auth.uid()));

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  changed_at timestamptz not null default now()
);
alter table public.order_status_history enable row level security;

create policy "order_status_history_select_via_order"
  on public.order_status_history for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_status_history.order_id and o.buyer_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- Cẩm Pay — DEMO wallet only.
-- No real currency processing, no card/bank data ever stored here.
-- Every user gets a starting demo balance; orders/transfers just move the
-- number around via a ledger so the UI has something real to read/write.
-- ---------------------------------------------------------------------------
create table public.wallet_accounts (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  balance integer not null default 150000 check (balance >= 0), -- demo VNĐ, not real money
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.wallet_accounts enable row level security;

create trigger wallet_accounts_set_updated_at
  before update on public.wallet_accounts
  for each row execute function public.set_updated_at();

create policy "wallet_accounts_select_self"
  on public.wallet_accounts for select to authenticated using (user_id = auth.uid());

create table public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount integer not null,              -- negative = debit, positive = credit (demo units)
  kind text not null check (kind in ('demo_topup', 'canteen_order', 'transfer_out', 'transfer_in')),
  related_order_id uuid references public.orders(id),
  note text,
  created_at timestamptz not null default now()
);
alter table public.wallet_transactions enable row level security;
create index wallet_transactions_user_id_idx on public.wallet_transactions(user_id);

create policy "wallet_transactions_select_self"
  on public.wallet_transactions for select to authenticated using (user_id = auth.uid());
-- No direct insert policy: transactions are only ever written by the
-- security-definer function below, which also updates the balance, so a
-- client can never fabricate a transaction or push balance negative.

create or replace function public.ensure_wallet_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.wallet_accounts (user_id) values (auth.uid())
  on conflict (user_id) do nothing;
end;
$$;

create or replace function public.wallet_apply_transaction(p_amount integer, p_kind text, p_note text default null, p_order_id uuid default null)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_balance integer;
begin
  perform public.ensure_wallet_account();

  update public.wallet_accounts
    set balance = balance + p_amount
    where user_id = auth.uid()
    returning balance into new_balance;

  if new_balance < 0 then
    raise exception 'Insufficient demo balance';
  end if;

  insert into public.wallet_transactions (user_id, amount, kind, related_order_id, note)
  values (auth.uid(), p_amount, p_kind, p_order_id, p_note);

  return new_balance;
end;
$$;
-- 008_storage_buckets.sql
-- Storage buckets. avatars/post-media/story-media/reel-media are public-read
-- (typical for a social feed); chat-attachments and school-documents are
-- private and require a signed URL / RLS-gated read.

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('post-media', 'post-media', true),
  ('story-media', 'story-media', true),
  ('reel-media', 'reel-media', true),
  ('chat-attachments', 'chat-attachments', false),
  ('school-documents', 'school-documents', false)
on conflict (id) do nothing;

-- Public buckets: anyone authenticated can read; only the owner (folder
-- named after their user id) can write to their own path.
create policy "public_media_read"
  on storage.objects for select
  to authenticated
  using (bucket_id in ('avatars', 'post-media', 'story-media', 'reel-media'));

create policy "public_media_write_own_folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('avatars', 'post-media', 'story-media', 'reel-media')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "public_media_update_own_folder"
  on storage.objects for update
  to authenticated
  using (
    bucket_id in ('avatars', 'post-media', 'story-media', 'reel-media')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "public_media_delete_own_folder"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('avatars', 'post-media', 'story-media', 'reel-media')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Private buckets: owner-folder read/write only. Sharing a chat attachment
-- with the other participant should go through a signed URL generated by a
-- server-side call that has already checked conversation membership.
create policy "private_media_owner_read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id in ('chat-attachments', 'school-documents')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "private_media_owner_write"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('chat-attachments', 'school-documents')
    and (storage.foldername(name))[1] = auth.uid()::text
  );
-- 009_notification_triggers.sql
-- Notifications are written by triggers (security definer, run as the
-- function owner) — never by direct client insert — so a client can never
-- fabricate a notification for someone else. See 005_chat_notifications.sql
-- for the table + its (select/update-only) RLS policies.

create or replace function public.notify_on_post_like()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner uuid;
begin
  select author_id into v_owner from public.posts where id = new.post_id;
  if v_owner is null or v_owner = new.user_id then
    return new; -- don't notify yourself
  end if;

  insert into public.notifications (recipient_id, actor_id, type, entity_type, entity_id)
  values (v_owner, new.user_id, 'like', 'post', new.post_id);

  return new;
end;
$$;

create trigger post_likes_notify
  after insert on public.post_likes
  for each row execute function public.notify_on_post_like();

create or replace function public.notify_on_comment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner uuid;
begin
  select author_id into v_owner from public.posts where id = new.post_id;
  if v_owner is null or v_owner = new.author_id then
    return new;
  end if;

  insert into public.notifications (recipient_id, actor_id, type, entity_type, entity_id, payload)
  values (v_owner, new.author_id, 'comment', 'post', new.post_id, jsonb_build_object('comment_id', new.id));

  return new;
end;
$$;

create trigger comments_notify
  after insert on public.comments
  for each row execute function public.notify_on_comment();

create or replace function public.notify_on_friend_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (recipient_id, actor_id, type, entity_type, entity_id)
  values (new.receiver_id, new.sender_id, 'friend_request', 'friend_request', new.id);
  return new;
end;
$$;

create trigger friend_requests_notify_insert
  after insert on public.friend_requests
  for each row execute function public.notify_on_friend_request();

create or replace function public.notify_on_friend_accept()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'accepted' and old.status is distinct from 'accepted' then
    insert into public.notifications (recipient_id, actor_id, type, entity_type, entity_id)
    values (new.sender_id, new.receiver_id, 'friend_accept', 'friend_request', new.id);
  end if;
  return new;
end;
$$;

create trigger friend_requests_notify_accept
  after update on public.friend_requests
  for each row execute function public.notify_on_friend_accept();

create or replace function public.notify_on_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_recipient uuid;
begin
  -- Direct conversations only have 2 members; notify "the other one(s)".
  for v_recipient in
    select cm.user_id from public.conversation_members cm
    where cm.conversation_id = new.conversation_id and cm.user_id <> new.sender_id
  loop
    insert into public.notifications (recipient_id, actor_id, type, entity_type, entity_id)
    values (v_recipient, new.sender_id, 'message', 'conversation', new.conversation_id);
  end loop;
  return new;
end;
$$;

create trigger messages_notify
  after insert on public.messages
  for each row execute function public.notify_on_message();

-- Client-callable helper: mark every unread notification as read in one call.
create or replace function public.mark_all_notifications_read()
returns void
language sql
security definer
set search_path = public
as $$
  update public.notifications set read_at = now() where recipient_id = auth.uid() and read_at is null;
$$;
-- 010_school_seed_and_enrollment.sql

-- Seed the one real school this app is for. Idempotent: safe to re-run.
insert into public.schools (id, name, slug, address, status)
values ('00000000-0000-0000-0000-000000000001', 'THPT Cẩm Bình', 'thpt-cam-binh', 'Cẩm Xuyên, Hà Tĩnh', 'active')
on conflict (id) do nothing;

insert into public.classes (school_id, name, grade, academic_year)
select '00000000-0000-0000-0000-000000000001', name, grade, '2024 - 2027'
from (values
  ('12A1', '12'), ('12A2', '12'), ('12A3', '12'), ('12A4', '12'),
  ('11A1', '11'), ('11A2', '11'), ('11A3', '11'),
  ('10A1', '10'), ('10A2', '10'), ('10A3', '10')
) as seed(name, grade)
where not exists (
  select 1 from public.classes c
  where c.school_id = '00000000-0000-0000-0000-000000000001' and c.name = seed.name
);

-- Self-enrollment: a student can add themselves to a class they claim to be
-- in (this is a claimed/self-declared enrollment, not school-admin-verified
-- — see the brief's own note not to overbuild verification in Phase 1).
create policy "class_members_insert_self"
  on public.class_members for insert
  to authenticated
  with check (user_id = auth.uid());
-- 011_canteen_seed.sql

insert into public.canteens (id, school_id, name)
values ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Căng-tin THPT Cẩm Bình')
on conflict (id) do nothing;

insert into public.canteen_items (canteen_id, name, price, category, emoji)
select '00000000-0000-0000-0000-000000000101', name, price, category, emoji
from (values
  ('Bánh Mì Pate Trứng Nóng Giòn', 15000, 'Ăn sáng', '🥪'),
  ('Xôi Xéo Ruốc Hành Phi Cô Lan', 12000, 'Ăn sáng', '🍚'),
  ('Trà Sữa Trân Châu Hoàng Kim', 18000, 'Đồ uống', '🧋'),
  ('Nước Cam Ép Nguyên Chất', 15000, 'Đồ uống', '🍊'),
  ('Xúc Xích Chiên Giòn', 10000, 'Ăn vặt', '🌭'),
  ('Bánh Tráng Trộn Cô Ba', 15000, 'Ăn vặt', '🌮'),
  ('Bút Bi Thiên Long', 5000, 'Dụng cụ học tập', '🖊️'),
  ('Vở Kẻ Ngang 96 Trang', 8000, 'Dụng cụ học tập', '📓')
) as seed(name, price, category, emoji)
where not exists (
  select 1 from public.canteen_items ci
  where ci.canteen_id = '00000000-0000-0000-0000-000000000101' and ci.name = seed.name
);
-- 012_friendships_unfriend.sql

create policy "friendships_delete_participant"
  on public.friendships for delete
  to authenticated
  using (user_a = auth.uid() or user_b = auth.uid());
-- 013_group_chat.sql

create table public.group_conversations (
  group_id uuid primary key references public.groups(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade
);
alter table public.group_conversations enable row level security;

create policy "group_conversations_select_member"
  on public.group_conversations for select
  to authenticated
  using (exists (
    select 1 from public.group_members gm
    where gm.group_id = group_conversations.group_id and gm.user_id = auth.uid()
  ));

-- Returns the group's conversation, creating it (and seeding membership
-- from the group's current members) on first use. Only a current group
-- member may call this.
create or replace function public.get_or_create_group_conversation(p_group_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_conversation_id uuid;
  v_group_name text;
  v_caller uuid := auth.uid();
begin
  if not exists (select 1 from public.group_members gm where gm.group_id = p_group_id and gm.user_id = v_caller) then
    raise exception 'Not a member of this group';
  end if;

  select conversation_id into v_conversation_id from public.group_conversations where group_id = p_group_id;
  if v_conversation_id is not null then
    return v_conversation_id;
  end if;

  select name into v_group_name from public.groups where id = p_group_id;

  insert into public.conversations (type, title, created_by)
  values ('group', v_group_name, v_caller)
  returning id into v_conversation_id;

  insert into public.group_conversations (group_id, conversation_id) values (p_group_id, v_conversation_id);

  insert into public.conversation_members (conversation_id, user_id, role)
  select v_conversation_id, gm.user_id, case when gm.role = 'owner' then 'owner' else 'member' end
  from public.group_members gm
  where gm.group_id = p_group_id
  on conflict do nothing;

  return v_conversation_id;
end;
$$;

-- Keep conversation membership in sync as people join/leave the group.
create or replace function public.sync_group_conversation_on_join()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_conversation_id uuid;
begin
  select conversation_id into v_conversation_id from public.group_conversations where group_id = new.group_id;
  if v_conversation_id is not null then
    insert into public.conversation_members (conversation_id, user_id, role)
    values (v_conversation_id, new.user_id, 'member')
    on conflict do nothing;
  end if;
  return new;
end;
$$;

create trigger group_members_sync_conversation_insert
  after insert on public.group_members
  for each row execute function public.sync_group_conversation_on_join();

create or replace function public.sync_group_conversation_on_leave()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_conversation_id uuid;
begin
  select conversation_id into v_conversation_id from public.group_conversations where group_id = old.group_id;
  if v_conversation_id is not null then
    delete from public.conversation_members
    where conversation_id = v_conversation_id and user_id = old.user_id;
  end if;
  return old;
end;
$$;

create trigger group_members_sync_conversation_delete
  after delete on public.group_members
  for each row execute function public.sync_group_conversation_on_leave();
-- 014_reel_comments.sql

create table public.reel_comments (
  id uuid primary key default gen_random_uuid(),
  reel_id uuid not null references public.reels(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);
alter table public.reel_comments enable row level security;
create index reel_comments_reel_id_idx on public.reel_comments(reel_id);

create policy "reel_comments_select_authenticated"
  on public.reel_comments for select to authenticated using (true);
create policy "reel_comments_insert_self"
  on public.reel_comments for insert to authenticated with check (author_id = auth.uid());
create policy "reel_comments_delete_own"
  on public.reel_comments for delete to authenticated using (author_id = auth.uid());
-- 015_secure_canteen_order.sql
-- SECURITY FIX: the original client flow inserted `orders.total_amount` and
-- each `order_items.unit_price` directly from client-computed values, and
-- separately debited the wallet by that same client-computed total. A
-- tampered client could submit an arbitrary (e.g. zero) price. This function
-- looks up the real price of every item server-side and is the only
-- supported way to place an order from now on.

create or replace function public.place_canteen_order(p_canteen_id uuid, p_items jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_total integer := 0;
  v_item record;
  v_qty integer;
  v_real_price integer;
begin
  if jsonb_array_length(p_items) = 0 then
    raise exception 'Order must contain at least one item';
  end if;

  insert into public.orders (buyer_id, canteen_id, total_amount)
  values (auth.uid(), p_canteen_id, 0)
  returning id into v_order_id;

  for v_item in select * from jsonb_to_recordset(p_items) as x(canteen_item_id uuid, quantity integer)
  loop
    v_qty := v_item.quantity;
    if v_qty is null or v_qty <= 0 then
      raise exception 'Invalid quantity for item %', v_item.canteen_item_id;
    end if;

    select price into v_real_price
    from public.canteen_items
    where id = v_item.canteen_item_id and canteen_id = p_canteen_id and is_available = true;

    if v_real_price is null then
      raise exception 'Item % is not available', v_item.canteen_item_id;
    end if;

    insert into public.order_items (order_id, canteen_item_id, quantity, unit_price)
    values (v_order_id, v_item.canteen_item_id, v_qty, v_real_price);

    v_total := v_total + v_real_price * v_qty;
  end loop;

  update public.orders set total_amount = v_total where id = v_order_id;

  perform public.ensure_wallet_account();

  update public.wallet_accounts
    set balance = balance - v_total
    where user_id = auth.uid() and balance >= v_total;

  if not found then
    raise exception 'Insufficient demo balance';
  end if;

  insert into public.wallet_transactions (user_id, amount, kind, related_order_id, note)
  values (auth.uid(), -v_total, 'canteen_order', v_order_id, 'Đặt món tại căng-tin');

  return v_order_id;
end;
$$;

-- The client no longer inserts orders/order_items directly (it now goes
-- through place_canteen_order above, which bypasses RLS as the function
-- owner), so revoke direct client INSERT on both — SELECT stays so a buyer
-- can still read their own past orders.
drop policy if exists "orders_insert_self" on public.orders;
drop policy if exists "order_items_insert_via_order" on public.order_items;
-- 016_rate_limiting.sql
-- Basic anti-spam: reject an insert if the same user has created too many
-- rows in the same table within a short rolling window. This is a coarse
-- safety net, not a replacement for a proper rate limiter, but it stops
-- naive spam scripts without needing an Edge Function.

create or replace function public.enforce_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_col text := TG_ARGV[0];
  v_max_count int := TG_ARGV[1]::int;
  v_window_seconds int := TG_ARGV[2]::int;
  v_user_id uuid := (to_jsonb(NEW) ->> v_user_col)::uuid;
  v_count int;
begin
  execute format(
    'select count(*) from public.%I where %I = $1 and created_at > now() - ($2 || '' seconds'')::interval',
    TG_TABLE_NAME, v_user_col
  ) using v_user_id, v_window_seconds into v_count;

  if v_count >= v_max_count then
    raise exception 'Bạn đang thao tác quá nhanh, vui lòng chậm lại một chút.';
  end if;

  return NEW;
end;
$$;

create trigger posts_rate_limit
  before insert on public.posts
  for each row execute function public.enforce_rate_limit('author_id', 8, 60);

create trigger comments_rate_limit
  before insert on public.comments
  for each row execute function public.enforce_rate_limit('author_id', 20, 60);

create trigger reel_comments_rate_limit
  before insert on public.reel_comments
  for each row execute function public.enforce_rate_limit('author_id', 20, 60);

create trigger messages_rate_limit
  before insert on public.messages
  for each row execute function public.enforce_rate_limit('sender_id', 40, 60);

create trigger friend_requests_rate_limit
  before insert on public.friend_requests
  for each row execute function public.enforce_rate_limit('sender_id', 15, 60);

create trigger reels_rate_limit
  before insert on public.reels
  for each row execute function public.enforce_rate_limit('author_id', 6, 60);

create trigger stories_rate_limit
  before insert on public.stories
  for each row execute function public.enforce_rate_limit('author_id', 10, 60);
-- 017_admin_moderation.sql

-- Admins (school_members.member_type = 'admin') can see and resolve reports.
create policy "reports_select_admins"
  on public.reports for select to authenticated
  using (exists (select 1 from public.school_members sm where sm.user_id = auth.uid() and sm.member_type = 'admin'));

create policy "reports_update_admins"
  on public.reports for update to authenticated
  using (exists (select 1 from public.school_members sm where sm.user_id = auth.uid() and sm.member_type = 'admin'))
  with check (exists (select 1 from public.school_members sm where sm.user_id = auth.uid() and sm.member_type = 'admin'));

-- Admins can change a post's/comment's moderation status (hide/remove/restore).
create policy "posts_update_admins"
  on public.posts for update to authenticated
  using (exists (select 1 from public.school_members sm where sm.user_id = auth.uid() and sm.member_type = 'admin'))
  with check (exists (select 1 from public.school_members sm where sm.user_id = auth.uid() and sm.member_type = 'admin'));

create policy "comments_update_admins"
  on public.comments for update to authenticated
  using (exists (select 1 from public.school_members sm where sm.user_id = auth.uid() and sm.member_type = 'admin'))
  with check (exists (select 1 from public.school_members sm where sm.user_id = auth.uid() and sm.member_type = 'admin'));

-- Helper the client calls to see whether the current user should even be
-- shown the moderation entry point (cheaper/simpler than the client trying
-- to infer it from a raw school_members select under RLS).
create or replace function public.am_i_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.school_members sm where sm.user_id = auth.uid() and sm.member_type = 'admin');
$$;

-- Resolves a report and, for post/comment reports, optionally hides or
-- removes the underlying content in the same call. Admin-only (re-checked
-- server-side, not just trusted from the client).
create or replace function public.resolve_report(p_report_id uuid, p_action text, p_content_action text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_report record;
begin
  if not public.am_i_admin() then
    raise exception 'Not authorized';
  end if;

  select * into v_report from public.reports where id = p_report_id;
  if v_report is null then
    raise exception 'Report not found';
  end if;

  if p_content_action in ('hide', 'remove') then
    if v_report.entity_type = 'post' then
      update public.posts set status = case p_content_action when 'hide' then 'hidden' else 'removed' end
        where id = v_report.entity_id;
    elsif v_report.entity_type = 'comment' then
      update public.comments set status = case p_content_action when 'hide' then 'hidden' else 'removed' end
        where id = v_report.entity_id;
    end if;
  end if;

  update public.reports set status = p_action, resolved_at = now() where id = p_report_id;

  insert into public.moderation_actions (report_id, moderator_id, entity_type, entity_id, action, notes)
  values (
    p_report_id,
    auth.uid(),
    v_report.entity_type,
    v_report.entity_id,
    coalesce(p_content_action, 'no_action'),
    'Resolved via admin moderation panel'
  );
end;
$$;
