import { supabase } from '../supabase/client';

// Phase 3 (P1 social) service layer: components/hooks call these, never
// `supabase.from(...)` directly. Wired into App.tsx's feed as of this pass —
// see mapSupabasePost.ts for how a row here becomes an app-shaped Post.

export interface DbAuthor {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface DbComment {
  id: string;
  content: string;
  createdAt: string;
  author: DbAuthor;
}

export interface DbPost {
  id: string;
  author: DbAuthor;
  content: string;
  postType: 'text' | 'image' | 'quote';
  visibility: 'school' | 'class' | 'friends' | 'public' | 'private';
  createdAt: string;
  likeCount: number;
  likedByMe: boolean;
  savedByMe: boolean;
  comments: DbComment[];
}

interface RawAuthorRow {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
}

interface RawCommentRow {
  id: string;
  content: string;
  created_at: string;
  author: RawAuthorRow | RawAuthorRow[];
}

interface RawPostRow {
  id: string;
  content: string;
  post_type: 'text' | 'image' | 'quote';
  visibility: 'school' | 'class' | 'friends' | 'public' | 'private';
  created_at: string;
  author: RawAuthorRow | RawAuthorRow[];
  post_likes: { user_id: string }[];
  post_saves: { user_id: string }[];
  comments: RawCommentRow[];
}

// Supabase's JS client types a to-one embed as an array in some overloads;
// normalize it to a single object either way.
function firstOf<T>(value: T | T[]): T {
  return Array.isArray(value) ? value[0] : value;
}

function mapAuthor(row: RawAuthorRow): DbAuthor {
  return { id: row.id, username: row.username, displayName: row.display_name, avatarUrl: row.avatar_url };
}

const POST_SELECT =
  'id, content, post_type, visibility, created_at, ' +
  'author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url), ' +
  'post_likes(user_id), post_saves(user_id), ' +
  'comments(id, content, created_at, author:profiles!comments_author_id_fkey(id, username, display_name, avatar_url))';

function mapRow(row: RawPostRow, currentUserId: string): DbPost {
  return {
    id: row.id,
    author: mapAuthor(firstOf(row.author)),
    content: row.content,
    postType: row.post_type,
    visibility: row.visibility,
    createdAt: row.created_at,
    likeCount: row.post_likes?.length ?? 0,
    likedByMe: (row.post_likes ?? []).some((l) => l.user_id === currentUserId),
    savedByMe: (row.post_saves ?? []).some((s) => s.user_id === currentUserId),
    comments: (row.comments ?? [])
      .map((c) => ({ id: c.id, content: c.content, createdAt: c.created_at, author: mapAuthor(firstOf(c.author)) }))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  };
}

export async function getFeed(currentUserId: string, limit = 30): Promise<DbPost[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as unknown as RawPostRow[]).map((row) => mapRow(row, currentUserId));
}

export async function createPost(params: {
  authorId: string;
  content: string;
  postType?: 'text' | 'image' | 'quote';
  visibility?: 'school' | 'class' | 'friends' | 'public' | 'private';
}): Promise<DbPost> {
  const { data: inserted, error } = await supabase
    .from('posts')
    .insert({
      author_id: params.authorId,
      content: params.content,
      post_type: params.postType ?? 'text',
      visibility: params.visibility ?? 'school'
    })
    .select('id')
    .single();

  if (error) throw error;

  const { data, error: fetchError } = await supabase.from('posts').select(POST_SELECT).eq('id', inserted.id).single();

  if (fetchError) throw fetchError;
  return mapRow(data as unknown as RawPostRow, params.authorId);
}

export async function deletePost(postId: string): Promise<void> {
  const { error } = await supabase.from('posts').delete().eq('id', postId);
  if (error) throw error;
}

export async function toggleLike(postId: string, userId: string, currentlyLiked: boolean): Promise<void> {
  if (currentlyLiked) {
    const { error } = await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', userId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('post_likes').insert({ post_id: postId, user_id: userId });
    if (error) throw error;
  }
}

export async function toggleSave(postId: string, userId: string, currentlySaved: boolean): Promise<void> {
  if (currentlySaved) {
    const { error } = await supabase.from('post_saves').delete().eq('post_id', postId).eq('user_id', userId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('post_saves').insert({ post_id: postId, user_id: userId });
    if (error) throw error;
  }
}

export async function addComment(postId: string, authorId: string, content: string): Promise<DbComment> {
  const { data: inserted, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, author_id: authorId, content })
    .select('id')
    .single();

  if (error) throw error;

  const { data, error: fetchError } = await supabase
    .from('comments')
    .select('id, content, created_at, author:profiles!comments_author_id_fkey(id, username, display_name, avatar_url)')
    .eq('id', inserted.id)
    .single();

  if (fetchError) throw fetchError;
  const raw = data as unknown as RawCommentRow;
  return { id: raw.id, content: raw.content, createdAt: raw.created_at, author: mapAuthor(firstOf(raw.author)) };
}
