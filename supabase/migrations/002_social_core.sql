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
