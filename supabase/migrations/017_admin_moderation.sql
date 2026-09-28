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
