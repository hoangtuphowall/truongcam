import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../../lib/auth/AuthProvider';

export const AuthScreen: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [signupDone, setSignupDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        if (!username.trim() || !displayName.trim()) {
          setFormError('Vui lòng nhập đủ tên hiển thị và tên đăng nhập.');
          setIsSubmitting(false);
          return;
        }
        await signUp(email, password, username.trim(), displayName.trim());
        setSignupDone(true);
      }
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
          <h1 className="text-lg font-bold">Trường Cẩm</h1>
          <p className="text-xs text-white/60 text-center">THPT Cẩm Bình · Đăng nhập để tiếp tục</p>
        </div>

        <div className="flex p-1 rounded-2xl bg-black/30 border border-white/10 mb-5 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setFormError(null);
              setSignupDone(false);
            }}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
              mode === 'signin' ? 'bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] shadow' : 'text-white/60'
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setFormError(null);
              setSignupDone(false);
            }}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
              mode === 'signup' ? 'bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] shadow' : 'text-white/60'
            }`}
          >
            Đăng ký
          </button>
        </div>

        {signupDone ? (
          <div className="text-center text-sm text-white/80 space-y-3 py-4">
            <p>Tạo tài khoản thành công! 🎉</p>
            <p className="text-xs text-white/60">
              Nếu dự án Supabase của bạn yêu cầu xác nhận email, hãy kiểm tra hộp thư trước khi đăng nhập.
              Nếu không, bạn có thể đăng nhập ngay.
            </p>
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setSignupDone(false);
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold"
            >
              Đến trang đăng nhập
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === 'signup' && (
              <>
                <input
                  type="text"
                  placeholder="Tên hiển thị (VD: Nguyễn Hoàng Linh)"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="px-4 py-3 rounded-2xl liquid-glass-subtle border border-white/20 text-sm placeholder:text-white/40 focus:outline-none focus:border-[#7c6bff]/80"
                  required
                />
                <input
                  type="text"
                  placeholder="Tên đăng nhập (VD: linh_12a1)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.trim().toLowerCase().replace(/\s+/g, '_'))}
                  className="px-4 py-3 rounded-2xl liquid-glass-subtle border border-white/20 text-sm placeholder:text-white/40 focus:outline-none focus:border-[#7c6bff]/80"
                  required
                />
              </>
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-2xl liquid-glass-subtle border border-white/20 text-sm placeholder:text-white/40 focus:outline-none focus:border-[#7c6bff]/80"
              required
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              className="px-4 py-3 rounded-2xl liquid-glass-subtle border border-white/20 text-sm placeholder:text-white/40 focus:outline-none focus:border-[#7c6bff]/80"
              required
            />

            {formError && (
              <p className="text-xs text-rose-300 bg-rose-500/10 border border-rose-400/30 rounded-xl px-3 py-2">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] hover:opacity-90 disabled:opacity-50 font-semibold text-sm shadow-lg transition-all"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'signin' ? 'Đăng nhập' : 'Tạo tài khoản'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
