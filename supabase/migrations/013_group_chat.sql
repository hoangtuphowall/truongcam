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
