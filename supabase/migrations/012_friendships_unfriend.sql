-- 012_friendships_unfriend.sql

create policy "friendships_delete_participant"
  on public.friendships for delete
  to authenticated
  using (user_a = auth.uid() or user_b = auth.uid());
