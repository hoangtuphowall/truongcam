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
