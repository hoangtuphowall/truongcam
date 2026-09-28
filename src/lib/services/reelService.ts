import { supabase } from '../supabase/client';

export interface DbAuthorLite {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface DbReel {
  id: string;
  author: DbAuthorLite;
  caption: string;
  soundTrack: string | null;
  mediaUrl: string | null;
  createdAt: string;
  likeCount: number;
  likedByMe: boolean;
  savedByMe: boolean;
}

const REEL_MEDIA_BUCKET = 'reel-media';

function firstOf<T>(v: T | T[]): T {
  return Array.isArray(v) ? v[0] : v;
}

interface RawReelRow {
  id: string;
  caption: string;
  sound_track: string | null;
  created_at: string;
  author: DbAuthorLite | DbAuthorLite[];
  reel_media: { storage_path: string }[];
  reel_likes: { user_id: string }[];
  reel_saves: { user_id: string }[];
}

const REEL_SELECT =
  'id, caption, sound_track, created_at, ' +
  'author:profiles!reels_author_id_fkey(id, username, display_name, avatar_url), ' +
  'reel_media(storage_path), reel_likes(user_id), reel_saves(user_id)';

function mapRow(row: RawReelRow, currentUserId: string): DbReel {
  const author = firstOf(row.author) as any;
  const firstMedia = row.reel_media?.[0]?.storage_path ?? null;
  return {
    id: row.id,
    author: { id: author.id, username: author.username, displayName: author.display_name, avatarUrl: author.avatar_url },
    caption: row.caption,
    soundTrack: row.sound_track,
    mediaUrl: firstMedia ? supabase.storage.from(REEL_MEDIA_BUCKET).getPublicUrl(firstMedia).data.publicUrl : null,
    createdAt: row.created_at,
    likeCount: row.reel_likes?.length ?? 0,
    likedByMe: (row.reel_likes ?? []).some((l) => l.user_id === currentUserId),
    savedByMe: (row.reel_saves ?? []).some((s) => s.user_id === currentUserId)
  };
}

export async function listReels(currentUserId: string, limit = 30): Promise<DbReel[]> {
  const { data, error } = await supabase.from('reels').select(REEL_SELECT).order('created_at', { ascending: false }).limit(limit);
  if (error) throw error;
  return (data as unknown as RawReelRow[]).map((row) => mapRow(row, currentUserId));
}

export async function createReel(params: {
  authorId: string;
  caption: string;
  soundTrack: string;
  storagePath: string | null;
}): Promise<DbReel> {
  const { data: inserted, error } = await supabase
    .from('reels')
    .insert({ author_id: params.authorId, caption: params.caption, sound_track: params.soundTrack })
    .select('id')
    .single();
  if (error) throw error;

  if (params.storagePath) {
    const { error: mediaErr } = await supabase.from('reel_media').insert({ reel_id: inserted.id, storage_path: params.storagePath });
    if (mediaErr) throw mediaErr;
  }

  const { data, error: fetchErr } = await supabase.from('reels').select(REEL_SELECT).eq('id', inserted.id).single();
  if (fetchErr) throw fetchErr;
  return mapRow(data as unknown as RawReelRow, params.authorId);
}

export async function toggleLike(reelId: string, userId: string, currentlyLiked: boolean): Promise<void> {
  if (currentlyLiked) {
    const { error } = await supabase.from('reel_likes').delete().eq('reel_id', reelId).eq('user_id', userId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('reel_likes').insert({ reel_id: reelId, user_id: userId });
    if (error) throw error;
  }
}

export async function addComment(reelId: string, authorId: string, content: string): Promise<void> {
  const { error } = await supabase.from('reel_comments').insert({ reel_id: reelId, author_id: authorId, content });
  if (error) throw error;
}
