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
