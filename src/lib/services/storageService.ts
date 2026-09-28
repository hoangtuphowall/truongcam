import { supabase } from '../supabase/client';

/** Uploads a data: URL (what the existing camera/gallery UI already
 * produces) to `bucket/path` and returns its public URL. `path` must start
 * with the current user's id (e.g. `${userId}/story-123.jpg`) to satisfy
 * the storage RLS policies from 008_storage_buckets.sql. */
export async function uploadDataUrl(bucket: string, path: string, dataUrl: string): Promise<string> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();

  const { error } = await supabase.storage.from(bucket).upload(path, blob, {
    contentType: blob.type || 'image/jpeg',
    upsert: true
  });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
