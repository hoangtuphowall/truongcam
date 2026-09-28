import { supabase } from '../supabase/client';

export interface DbGroup {
  id: string;
  name: string;
  description: string;
  category: 'School' | 'College' | 'Work' | 'Interest';
  memberCount: number;
  joinedByMe: boolean;
}

interface RawGroupRow {
  id: string;
  name: string;
  description: string;
  category: 'School' | 'College' | 'Work' | 'Interest';
  group_members: { user_id: string }[];
}

const GROUP_SELECT = 'id, name, description, category, group_members(user_id)';

function mapRow(row: RawGroupRow, currentUserId: string): DbGroup {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    memberCount: row.group_members?.length ?? 0,
    joinedByMe: (row.group_members ?? []).some((m) => m.user_id === currentUserId)
  };
}

/** Public groups plus any private group the user already belongs to. */
export async function listVisibleGroups(currentUserId: string): Promise<DbGroup[]> {
  const { data, error } = await supabase.from('groups').select(GROUP_SELECT).limit(100);
  if (error) throw error;
  return (data as unknown as RawGroupRow[]).map((row) => mapRow(row, currentUserId));
}

export async function createGroup(params: {
  createdBy: string;
  name: string;
  description: string;
  category: 'School' | 'College' | 'Work' | 'Interest';
}): Promise<DbGroup> {
  const { data: inserted, error } = await supabase
    .from('groups')
    .insert({ created_by: params.createdBy, name: params.name, description: params.description, category: params.category })
    .select('id')
    .single();
  if (error) throw error;

  const { error: memberErr } = await supabase
    .from('group_members')
    .insert({ group_id: inserted.id, user_id: params.createdBy, role: 'owner' });
  if (memberErr) throw memberErr;

  const { data, error: fetchErr } = await supabase.from('groups').select(GROUP_SELECT).eq('id', inserted.id).single();
  if (fetchErr) throw fetchErr;
  return mapRow(data as unknown as RawGroupRow, params.createdBy);
}

export async function joinGroup(groupId: string, userId: string): Promise<void> {
  const { error } = await supabase.from('group_members').insert({ group_id: groupId, user_id: userId, role: 'member' });
  if (error) throw error;
}

export async function leaveGroup(groupId: string, userId: string): Promise<void> {
  const { error } = await supabase.from('group_members').delete().eq('group_id', groupId).eq('user_id', userId);
  if (error) throw error;
}
