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
