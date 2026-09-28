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
