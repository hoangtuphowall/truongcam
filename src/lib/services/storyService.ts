import { supabase } from '../supabase/client';

export interface DbAuthorLite {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface DbStorySlide {
  id: string;
  mediaType: 'photo' | 'quote';
  publicUrl: string | null;
  text: string | null;
  background: string | null;
  sortOrder: number;
}

export interface DbStory {
  id: string;
  author: DbAuthorLite;
  expiresAt: string;
  slides: DbStorySlide[];
}

const STORY_MEDIA_BUCKET = 'story-media';

function publicUrlFor(storagePath: string | null): string | null {
  if (!storagePath) return null;
  return supabase.storage.from(STORY_MEDIA_BUCKET).getPublicUrl(storagePath).data.publicUrl;
}

interface RawSlideRow {
  id: string;
  media_type: 'photo' | 'quote';
  storage_path: string | null;
  text_content: string | null;
  background: string | null;
  sort_order: number;
}

interface RawStoryRow {
  id: string;
  expires_at: string;
  author: DbAuthorLite | DbAuthorLite[];
  story_media: RawSlideRow[];
}

function firstOf<T>(v: T | T[]): T {
  return Array.isArray(v) ? v[0] : v;
}

const STORY_SELECT =
  'id, expires_at, author:profiles!stories_author_id_fkey(id, username, display_name, avatar_url), ' +
  'story_media(id, media_type, storage_path, text_content, background, sort_order)';

function mapStory(row: RawStoryRow): DbStory {
  const author = firstOf(row.author);
  return {
    id: row.id,
    author: { id: author.id, username: (author as any).username, displayName: (author as any).display_name, avatarUrl: (author as any).avatar_url },
    expiresAt: row.expires_at,
    slides: (row.story_media ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => ({
        id: s.id,
        mediaType: s.media_type,
        publicUrl: publicUrlFor(s.storage_path),
        text: s.text_content,
        background: s.background,
        sortOrder: s.sort_order
      }))
  };
}

/** All currently-active stories (any author), for the stories bar. */
export async function listActiveStories(): Promise<DbStory[]> {
  const { data, error } = await supabase
    .from('stories')
    .select(STORY_SELECT)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as unknown as RawStoryRow[]).map(mapStory);
}

/** Returns the current user's still-active story id, creating one if needed. */
export async function getOrCreateMyActiveStory(userId: string): Promise<string> {
  const { data: existing, error: findErr } = await supabase
    .from('stories')
    .select('id')
    .eq('author_id', userId)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (findErr) throw findErr;
  if (existing) return existing.id;

  const { data: created, error: createErr } = await supabase
    .from('stories')
    .insert({ author_id: userId })
    .select('id')
    .single();
  if (createErr) throw createErr;
  return created.id;
}

export async function recordView(storyId: string, viewerId: string): Promise<void> {
  const { error } = await supabase.from('story_views').insert({ story_id: storyId, viewer_id: viewerId });
  // Ignore duplicate-view conflicts (already viewed) — anything else, rethrow.
  if (error && error.code !== '23505') throw error;
}
export async function addSlide(
  storyId: string,
  slide: { mediaType: 'photo' | 'quote'; storagePath?: string | null; text?: string | null; background?: string | null },
  sortOrder: number
): Promise<DbStorySlide> {
  const { data, error } = await supabase
    .from('story_media')
    .insert({
      story_id: storyId,
      media_type: slide.mediaType,
      storage_path: slide.storagePath ?? null,
      text_content: slide.text ?? null,
      background: slide.background ?? null,
      sort_order: sortOrder
    })
    .select('id, media_type, storage_path, text_content, background, sort_order')
    .single();
  if (error) throw error;

  return {
    id: data.id,
    mediaType: data.media_type,
    publicUrl: publicUrlFor(data.storage_path),
    text: data.text_content,
    background: data.background,
    sortOrder: data.sort_order
  };
}
