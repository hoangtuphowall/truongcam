import React, { useState } from 'react';
import { X, Film, Music, Upload, Sparkles } from 'lucide-react';
import { Reel, UserProfile } from '../types';

interface CreateReelModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onSubmitReel: (reelData: { text: string; soundTrack: string; grad: string; imgData?: string }) => void;
}

const SOUNDTRACKS = [
  'Neon Nights · Synthwave',
  'Coffee House Beats · Lo-Fi',
  'Late Night Study · Ambient Sound',
  'Cyberpunk Drive · Electronic',
  'Golden Hour · Chillhop Groove',
  'Campus Breeze · Acoustic Mood',
  'Tokyo Rain · City Pop'
];

const REEL_GRADIENTS = [
  'linear-gradient(175deg, #1b1030 0%, #3a0d36 50%, #150d26 100%)',
  'linear-gradient(175deg, #0d2830 0%, #173d61 50%, #0a1128 100%)',
  'linear-gradient(175deg, #2b1138 0%, #7c1a5b 50%, #1a0826 100%)',
  'linear-gradient(175deg, #3d2406 0%, #692a10 50%, #1a0f05 100%)',
  'linear-gradient(175deg, #082924 0%, #0d4a3e 50%, #031411 100%)'
];

export const CreateReelModal: React.FC<CreateReelModalProps> = ({
  isOpen,
  user,
  onClose,
  onSubmitReel
}) => {
  const [text, setText] = useState('');
  const [soundTrack, setSoundTrack] = useState(SOUNDTRACKS[0]);
  const [selectedGrad, setSelectedGrad] = useState(REEL_GRADIENTS[0]);
  const [imgData, setImgData] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImgData(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSubmitReel({
      text: text.trim(),
      soundTrack,
      grad: selectedGrad,
      imgData: imgData || undefined
    });

    setText('');
    setImgData(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[270] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md glass-strong rounded-3xl border border-white/25 shadow-2xl p-5 sm:p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-200"
        style={{ background: 'rgba(21, 13, 38, 0.95)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-pink-400" />
            <h2 className="text-sm font-bold text-white font-display">Tạo Video Ngắn Mới</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full glass flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Reel Preview */}
        <div
          className="relative w-full h-52 rounded-2xl overflow-hidden border border-white/20 flex flex-col justify-between p-4 select-none shadow-inner"
          style={{ background: selectedGrad }}
        >
          {imgData && (
            <img src={imgData} alt="Reel visual" className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />

          {/* Sound badge */}
          <div className="relative z-10 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[11px] text-white w-fit font-code">
            <Music className="w-3 h-3 text-pink-400" />
            <span className="truncate max-w-[180px]">{soundTrack}</span>
          </div>

          {/* Bottom user & caption */}
          <div className="relative z-10 space-y-1 text-white">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border border-white/40"
                style={{ background: user.avatarGradient }}
              >
                {user.emoji}
              </div>
              <span className="text-xs font-bold font-display">{user.name}</span>
            </div>
            <p className="text-xs text-white/90 leading-snug line-clamp-2 font-clean">
              {text || 'Nhập mô tả video hoặc hashtag bên dưới...'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Audio Soundtrack Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-white/70 mb-1 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-purple-400" />
              <span>Giai điệu / Nhạc nền:</span>
            </label>
            <select
              value={soundTrack}
              onChange={(e) => setSoundTrack(e.target.value)}
              className="w-full glass rounded-xl px-3 py-2 text-xs text-white border border-white/20 outline-none focus:border-pink-400 font-code"
              style={{ background: 'rgba(25, 15, 45, 0.95)' }}
            >
              {SOUNDTRACKS.map((t) => (
                <option key={t} value={t} className="bg-[#1b1030] text-white">
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Backdrop presets */}
          <div>
            <label className="block text-[11px] font-semibold text-white/70 mb-1.5">
              Không gian màu / Ảnh đại diện:
            </label>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {REEL_GRADIENTS.map((grad, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSelectedGrad(grad);
                    setImgData(null);
                  }}
                  className={`w-8 h-8 rounded-xl shrink-0 border-2 transition-all cursor-pointer ${
                    selectedGrad === grad && !imgData ? 'border-white scale-105 shadow' : 'border-transparent opacity-70'
                  }`}
                  style={{ background: grad }}
                />
              ))}

              <label className="w-8 h-8 rounded-xl shrink-0 glass border border-white/25 flex items-center justify-center text-white/70 hover:text-white cursor-pointer" title="Tải ảnh bìa">
                <Upload className="w-3.5 h-3.5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImageFile(f);
                  }}
                />
              </label>
            </div>
          </div>

          {/* Caption text */}
          <div>
            <label className="block text-[11px] font-semibold text-white/70 mb-1">
              Mô tả video & Hashtags:
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
              placeholder="Ví dụ: Giờ thể dục lớp 12A1 hôm nay ⚽ #THPTCamBinh #hocduong"
              className="w-full glass rounded-xl p-3 text-xs sm:text-sm text-white placeholder-white/40 border border-white/20 outline-none focus:border-pink-400 resize-none font-clean"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl glass text-xs font-semibold text-white/70 hover:text-white cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
            >
              Đăng video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
