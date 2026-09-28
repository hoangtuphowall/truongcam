import React, { useState } from 'react';
import { X, Flag, Loader2, CheckCircle2 } from 'lucide-react';

const REASONS = ['Spam / quảng cáo', 'Nội dung không phù hợp', 'Quấy rối / bắt nạt', 'Thông tin sai sự thật', 'Khác'];

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => Promise<void>;
  title?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit, title = 'Báo cáo nội dung' }) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedReason) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(selectedReason, details);
      setDone(true);
      setTimeout(() => {
        onClose();
        setDone(false);
        setSelectedReason(null);
        setDetails('');
      }, 1500);
    } catch (err) {
      console.error('report submit failed', err);
      setError('Không gửi được báo cáo, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm liquid-glass rounded-[32px] shadow-2xl border border-white/25 text-white p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold">{title}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {done ? (
          <div className="py-6 flex flex-col items-center gap-2 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <p className="text-xs text-white/70">Đã gửi báo cáo. Cảm ơn bạn đã giúp Trường Cẩm an toàn hơn!</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              {REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={`text-left px-3.5 py-2.5 rounded-2xl text-xs font-medium border transition-all ${
                    selectedReason === reason
                      ? 'bg-gradient-to-r from-rose-600/40 to-amber-600/30 border-rose-400/50 text-white'
                      : 'liquid-glass-subtle border-white/15 text-white/70 hover:text-white'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Mô tả thêm (không bắt buộc)"
              rows={3}
              className="px-3.5 py-2.5 rounded-2xl liquid-glass-subtle border border-white/15 text-xs placeholder:text-white/40 focus:outline-none resize-none"
            />
            {error && <p className="text-xs text-rose-300">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={!selectedReason || isSubmitting}
              className="py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 disabled:opacity-40 font-bold text-xs flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Gửi báo cáo
            </button>
          </>
        )}
      </div>
    </div>
  );
};
