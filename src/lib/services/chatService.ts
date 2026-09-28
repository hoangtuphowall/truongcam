import { supabase } from '../supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface DbAuthorLite {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface DbMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  createdAt: string;
}

export interface DbConversationSummary {
  conversationId: string;
  otherUser: DbAuthorLite | null;
  lastMessage: { content: string | null; createdAt: string } | null;
}

function firstOf<T>(value: T | T[]): T {
  return Array.isArray(value) ? value[0] : value;
}

/** All the direct conversations the current user belongs to, each with the
 * other participant's profile and a last-message preview (for a chat list). */
export async function listMyDirectConversations(userId: string): Promise<DbConversationSummary[]> {
  const { data: myMemberships, error } = await supabase
    .from('conversation_members')
    .select('conversation_id, conversations!inner(type)')
    .eq('user_id', userId);

  if (error) throw error;

  const directIds = (myMemberships ?? [])
    .filter((row) => firstOf(row.conversations as { type: string } | { type: string }[]).type === 'direct')
    .map((row) => row.conversation_id as string);

  if (directIds.length === 0) return [];

  const [{ data: otherMembers, error: otherErr }, { data: lastMessages, error: msgErr }] = await Promise.all([
    supabase
      .from('conversation_members')
      .select('conversation_id, user:profiles!conversation_members_user_id_fkey(id, username, display_name, avatar_url)')
      .in('conversation_id', directIds)
      .neq('user_id', userId),
    supabase
      .from('messages')
      .select('conversation_id, content, created_at')
      .in('conversation_id', directIds)
      .order('created_at', { ascending: false })
  ]);

  if (otherErr) throw otherErr;
  if (msgErr) throw msgErr;

  const otherByConversation = new Map<string, DbAuthorLite>();
  (otherMembers ?? []).forEach((row) => {
    const u = firstOf(row.user as any);
    if (u) {
      otherByConversation.set(row.conversation_id as string, {
        id: u.id,
        username: u.username,
        displayName: u.display_name,
        avatarUrl: u.avatar_url
      });
    }
  });

  const lastMessageByConversation = new Map<string, { content: string | null; createdAt: string }>();
  (lastMessages ?? []).forEach((row) => {
    // Rows arrive newest-first; keep only the first (= latest) per conversation.
    if (!lastMessageByConversation.has(row.conversation_id as string)) {
      lastMessageByConversation.set(row.conversation_id as string, { content: row.content, createdAt: row.created_at });
    }
  });

  return directIds.map((id) => ({
    conversationId: id,
    otherUser: otherByConversation.get(id) ?? null,
    lastMessage: lastMessageByConversation.get(id) ?? null
  }));
}

/** Finds the existing direct conversation between two users, or creates one. */
export async function getOrCreateDirectConversation(myId: string, otherId: string): Promise<string> {
  const { data: mine, error: mineErr } = await supabase
    .from('conversation_members')
    .select('conversation_id, conversations!inner(type)')
    .eq('user_id', myId);
  if (mineErr) throw mineErr;

  const myDirectIds = (mine ?? [])
    .filter((row) => firstOf(row.conversations as any).type === 'direct')
    .map((row) => row.conversation_id as string);

  if (myDirectIds.length > 0) {
    const { data: shared, error: sharedErr } = await supabase
      .from('conversation_members')
      .select('conversation_id')
      .eq('user_id', otherId)
      .in('conversation_id', myDirectIds);
    if (sharedErr) throw sharedErr;
    if (shared && shared.length > 0) return shared[0].conversation_id as string;
  }

  const { data: conv, error: convErr } = await supabase
    .from('conversations')
    .insert({ type: 'direct', created_by: myId })
    .select('id')
    .single();
  if (convErr) throw convErr;

  const { error: membersErr } = await supabase.from('conversation_members').insert([
    { conversation_id: conv.id, user_id: myId },
    { conversation_id: conv.id, user_id: otherId }
  ]);
  if (membersErr) throw membersErr;

  return conv.id as string;
}

export async function getOrCreateGroupConversation(groupId: string): Promise<string> {
  const { data, error } = await supabase.rpc('get_or_create_group_conversation', { p_group_id: groupId });
  if (error) throw error;
  return data as string;
}

export async function getMessages(conversationId: string): Promise<DbMessage[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('id, conversation_id, sender_id, content, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    content: row.content,
    createdAt: row.created_at
  }));
}

export async function sendMessage(conversationId: string, senderId: string, content: string): Promise<void> {
  const { error } = await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: senderId, content });
  if (error) throw error;
}

/** Realtime: streams new messages in this conversation to `onInsert`.
 * Call the returned function to unsubscribe (e.g. when the chat is closed). */
export function subscribeToMessages(conversationId: string, onInsert: (message: DbMessage) => void): () => void {
  const channel: RealtimeChannel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
      (payload) => {
        const row = payload.new as { id: string; conversation_id: string; sender_id: string; content: string | null; created_at: string };
        onInsert({ id: row.id, conversationId: row.conversation_id, senderId: row.sender_id, content: row.content, createdAt: row.created_at });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
