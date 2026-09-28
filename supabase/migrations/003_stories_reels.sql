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
