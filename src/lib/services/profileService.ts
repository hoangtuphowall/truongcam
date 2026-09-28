import { supabase } from '../supabase/client';

export interface DbProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export async function listOtherProfiles(currentUserId: string, limit = 100): Promise<DbProfile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url')
    .neq('id', currentUserId)
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url
  }));
}
