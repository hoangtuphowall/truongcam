import { supabase } from '../supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface DbNotification {
  id: string;
  actorId: string | null;
  type: 'like' | 'comment' | 'friend_request' | 'friend_accept' | 'group_invite' | 'message' | 'system';
  entityType: string | null;
  entityId: string | null;
  readAt: string | null;
  createdAt: string;
}

function mapRow(row: {
  id: string;
  actor_id: string | null;
  type: DbNotification['type'];
  entity_type: string | null;
  entity_id: string | null;
  read_at: string | null;
  created_at: string;
}): DbNotification {
  return {
    id: row.id,
    actorId: row.actor_id,
    type: row.type,
    entityType: row.entity_type,
    entityId: row.entity_id,
    readAt: row.read_at,
    createdAt: row.created_at
  };
}

export async function listNotifications(userId: string, limit = 50): Promise<DbNotification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('id, actor_id, type, entity_type, entity_id, read_at, created_at')
    .eq('recipient_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function markAllRead(): Promise<void> {
  const { error } = await supabase.rpc('mark_all_notifications_read');
  if (error) throw error;
}

export function subscribeToNotifications(userId: string, onInsert: (n: DbNotification) => void): () => void {
  const channel: RealtimeChannel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${userId}` },
      (payload) => onInsert(mapRow(payload.new as Parameters<typeof mapRow>[0]))
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
