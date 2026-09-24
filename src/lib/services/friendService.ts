import { supabase } from '../supabase/client';

// Same status as postService.ts: real, working Supabase calls, not yet
// wired into App.tsx (friendsAll is still local mock data — see report).

export async function sendFriendRequest(senderId: string, receiverId: string): Promise<void> {
  const { error } = await supabase.from('friend_requests').insert({ sender_id: senderId, receiver_id: receiverId });
  if (error) throw error;
}

export async function acceptFriendRequest(requestId: string): Promise<void> {
  const { error } = await supabase.rpc('accept_friend_request', { request_id: requestId });
  if (error) throw error;
}

export async function rejectFriendRequest(requestId: string): Promise<void> {
  const { error } = await supabase.from('friend_requests').update({ status: 'rejected', responded_at: new Date().toISOString() }).eq('id', requestId);
  if (error) throw error;
}

export async function listFriendships(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('friendships')
    .select('user_a, user_b')
    .or(`user_a.eq.${userId},user_b.eq.${userId}`);

  if (error) throw error;
  return (data ?? []).map((row) => (row.user_a === userId ? row.user_b : row.user_a));
}

export async function listIncomingRequests(userId: string) {
  const { data, error } = await supabase
    .from('friend_requests')
    .select('id, sender_id, created_at')
    .eq('receiver_id', userId)
    .eq('status', 'pending');

  if (error) throw error;
  return data ?? [];
}
