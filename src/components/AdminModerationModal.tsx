import React, { useEffect, useState } from 'react';
import { X, ShieldAlert, Loader2, EyeOff, Trash2, CheckCircle2 } from 'lucide-react';
import * as moderationService from '../lib/services/moderationService';
import type { DbReport } from '../lib/services/moderationService';

interface AdminModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ENTITY_LABEL: Record<string, string> = {
  post: 'Bài viết',
  comment: 'Bình luận',
  reel: 'Reel',
  message: 'Tin nhắn',
  profile: 'Hồ sơ',
  group: 'Nhóm'
};

export const AdminModerationModal: React.FC<AdminModerationModalProps> = ({ isOpen, onClose }) => {
  const [reports, setReports] = useState<DbReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    setIsLoading(true);
    moderationService
      .listOpenReports()
      .then(setReports)
      .catch((err) => console.error('Failed to load reports', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isOpen) load();
  }, [isOpen]);

  if (!isOpen) return null;

  const act = async (report: DbReport, action: 'resolved' | 'dismissed', contentAction?: 'hide' | 'remove') => {
    setBusyId(report.id);
    try {
      await moderationService.resolveReport(report.id, action, contentAction);
      setReports((prev) => prev.filter((r) => r.id !== report.id));
    } catch (err) {
      console.error('resolveReport failed', err);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg liquid-glass rounded-[32px] shadow-2xl border border-white/25 text-white flex flex-col overflow-hidden max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Duyệt báo cáo</h2>
              <p className="text-[11px] text-white/50">{reports.length} báo cáo đang chờ xử lý</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-3">
          {isLoading ? (
            <div className="py-16 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-white/60" />
            </div>
          ) : reports.length === 0 ? (
            <div className="py-16 text-center text-xs text-white/50 flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400/70" />
              Không có báo cáo nào đang chờ. Trường Cẩm sạch sẽ! 🌸
            </div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="liquid-glass-subtle rounded-2xl p-4 border border-white/10 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-[11px] text-white/50">
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold">
                    {ENTITY_LABEL[report.entityType] || report.entityType}
                  </span>
                  <span>{new Date(report.createdAt).toLocaleString('vi-VN')}</span>
                </div>
                <div className="text-xs">
                  <span className="text-white/50">Lý do: </span>
                  <span className="font-semibold text-white">{report.reason}</span>
                </div>
                {report.details && <p className="text-[11px] text-white/60 italic">"{report.details}"</p>}
                {report.contentPreview && (
                  <p className="text-[11px] text-white/70 bg-black/20 rounded-xl px-3 py-2 line-clamp-3">{report.contentPreview}</p>
                )}
                <p className="text-[10px] text-white/40">Người báo cáo: {report.reporterName}</p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {(report.entityType === 'post' || report.entityType === 'comment') && (
                    <>
                      <button
                        disabled={busyId === report.id}
                        onClick={() => act(report, 'resolved', 'hide')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 disabled:opacity-40"
                      >
                        <EyeOff className="w-3 h-3" /> Ẩn nội dung
                      </button>
                      <button
                        disabled={busyId === report.id}
                        onClick={() => act(report, 'resolved', 'remove')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 disabled:opacity-40"
                      >
                        <Trash2 className="w-3 h-3" /> Gỡ bỏ
                      </button>
                    </>
                  )}
                  <button
                    disabled={busyId === report.id}
                    onClick={() => act(report, 'dismissed')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-white/10 text-white/70 hover:bg-white/20 disabled:opacity-40"
                  >
                    {busyId === report.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                    Bỏ qua báo cáo
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
