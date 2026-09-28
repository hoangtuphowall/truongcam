import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../lib/auth/AuthProvider';

export const ResetPasswordScreen: React.FC = () => {
  const { completePasswordReset } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setFormError('Mật khẩu nhập lại không khớp.');
      return;
    }
    setFormError(null);
    setIsSubmitting(true);
    try {
      await completePasswordReset(password);
      setDone(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Đã xảy ra lỗi, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-sm liquid-glass rounded-[32px] shadow-2xl border border-white/25 text-white p-6 sm:p-8">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-14 h-14 rounded-[22%] bg-gradient-to-tr from-[#7c6bff] to-[#ff6bcb] flex items-center justify-center shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-lg font-bold">Đặt lại mật khẩu</h1>
          <p className="text-xs text-white/60 text-center">Trường Cẩm · THPT Cẩm Bình</p>
        </div>

        {done ? (
          <div className="text-center text-sm text-white/80 space-y-3 py-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <p>Đã đổi mật khẩu thành công! Bạn có thể dùng app bình thường ngay bây giờ.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              className="px-4 py-3 rounded-2xl liquid-glass-subtle border border-white/20 text-sm placeholder:text-white/40 focus:outline-none focus:border-[#7c6bff]/80"
              required
            />
            <input
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              className="px-4 py-3 rounded-2xl liquid-glass-subtle border border-white/20 text-sm placeholder:text-white/40 focus:outline-none focus:border-[#7c6bff]/80"
              required
            />
            {formError && (
              <p className="text-xs text-rose-300 bg-rose-500/10 border border-rose-400/30 rounded-xl px-3 py-2">{formError}</p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] hover:opacity-90 disabled:opacity-50 font-semibold text-sm shadow-lg transition-all"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Đổi mật khẩu
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
