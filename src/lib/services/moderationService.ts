import { supabase } from '../supabase/client';

export type ReportEntityType = 'post' | 'comment' | 'reel' | 'message' | 'profile' | 'group';

export interface DbReport {
  id: string;
  reporterId: string;
  reporterName: string;
  entityType: ReportEntityType;
  entityId: string;
  reason: string;
  details: string | null;
  status: 'open' | 'reviewing' | 'resolved' | 'dismissed';
  createdAt: string;
  contentPreview: string | null;
}

export async function reportContent(params: {
  reporterId: string;
  entityType: ReportEntityType;
  entityId: string;
  reason: string;
  details?: string;
}): Promise<void> {
  const { error } = await supabase.from('reports').insert({
    reporter_id: params.reporterId,
    entity_type: params.entityType,
    entity_id: params.entityId,
    reason: params.reason,
    details: params.details ?? null
  });
  if (error) throw error;
}

export async function amIAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc('am_i_admin');
  if (error) throw error;
  return Boolean(data);
}

export async function listOpenReports(): Promise<DbReport[]> {
  const { data, error } = await supabase
    .from('reports')
    .select('id, reporter_id, entity_type, entity_id, reason, details, status, created_at, reporter:profiles!reports_reporter_id_fkey(display_name)')
    .eq('status', 'open')
    .order('created_at', { ascending: false });
  if (error) throw error;

  const rows = (data ?? []) as any[];

  // Best-effort content preview for post/comment reports (admins reading
  // this should see what was actually flagged, not just an id).
  const postIds = rows.filter((r) => r.entity_type === 'post').map((r) => r.entity_id);
  const commentIds = rows.filter((r) => r.entity_type === 'comment').map((r) => r.entity_id);
  const [{ data: posts }, { data: comments }] = await Promise.all([
    postIds.length ? supabase.from('posts').select('id, content').in('id', postIds) : Promise.resolve({ data: [] as any[] }),
    commentIds.length ? supabase.from('comments').select('id, content').in('id', commentIds) : Promise.resolve({ data: [] as any[] })
  ]);
  const previewById = new Map<string, string>();
  (posts ?? []).forEach((p: any) => previewById.set(p.id, p.content));
  (comments ?? []).forEach((c: any) => previewById.set(c.id, c.content));

  return rows.map((r) => ({
    id: r.id,
    reporterId: r.reporter_id,
    reporterName: (Array.isArray(r.reporter) ? r.reporter[0]?.display_name : r.reporter?.display_name) || 'Người dùng',
    entityType: r.entity_type,
    entityId: r.entity_id,
    reason: r.reason,
    details: r.details,
    status: r.status,
    createdAt: r.created_at,
    contentPreview: previewById.get(r.entity_id) ?? null
  }));
}

export async function resolveReport(
  reportId: string,
  action: 'resolved' | 'dismissed',
  contentAction?: 'hide' | 'remove'
): Promise<void> {
  const { error } = await supabase.rpc('resolve_report', {
    p_report_id: reportId,
    p_action: action,
    p_content_action: contentAction ?? null
  });
  if (error) throw error;
}
