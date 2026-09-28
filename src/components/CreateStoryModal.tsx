import React, { useState } from 'react';
import { X, Image as ImageIcon, Quote, Upload, Sparkles } from 'lucide-react';
import { UserProfile, AestheticFont, StorySlide } from '../types';

interface CreateStoryModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onSubmitStory: (slide: StorySlide) => void;
}

const STORY_GRADIENTS = [
  'linear-gradient(160deg, #7c6bff, #ff6bcb)',
  'linear-gradient(160deg, #ff6bcb, #38e6c5)',
  'linear-gradient(160deg, #ffb84d, #ff6bcb)',
  'linear-gradient(160deg, #38e6c5, #7c6bff)',
  'linear-gradient(160deg, #1b1030, #ff6bcb)',
  'linear-gradient(160deg, #0d1b2a, #415a77)'
];

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  isOpen,
  user,
  onClose,
  onSubmitStory
}) => {
  const [slideType, setSlideType] = useState<'photo' | 'quote'>('quote');
  const [text, setText] = useState('');
  const [selectedGrad, setSelectedGrad] = useState(STORY_GRADIENTS[0]);
  const [imgData, setImgData] = useState<string | null>(null);
  const [fontChoice, setFontChoice] = useState<AestheticFont>('editorial');

  if (!isOpen) return null;

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImgData(e.target?.result as string);
      setSlideType('photo');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !imgData) return;

    const newSlide: StorySlide = {
      type: slideType,
      text: text.trim(),
      grad: selectedGrad,
      imgData: imgData || undefined
    };

    onSubmitStory(newSlide);
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
        className="w-full max-w-md glass-strong rounded-3xl border border-white/25 shadow-2xl p-5 sm:p-6 overflow-hidden flex flex-col gap-4 animate-in zoom-in-95 duration-200"
        style={{ background: 'rgba(21, 13, 38, 0.95)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <h2 className="text-sm font-bold text-white font-display">Tạo Tin 24h</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full glass flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Slide Type Switcher */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSlideType('quote');
              setFontChoice('editorial');
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              slideType === 'quote'
                ? 'bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-white shadow'
                : 'glass text-white/70 hover:text-white'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
            <span>Trích dẫn hay</span>
          </button>
          <button
            type="button"
            onClick={() => setSlideType('photo')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              slideType === 'photo'
                ? 'bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-white shadow'
                : 'glass text-white/70 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Khoảnh khắc ảnh</span>
          </button>
        </div>

        {/* Live Story Preview Canvas */}
        <div
          className="relative w-full h-56 rounded-2xl overflow-hidden border border-white/25 flex flex-col justify-between p-4 shadow-inner text-center select-none"
          style={{ background: selectedGrad }}
        >
          {imgData && (
            <img src={imgData} alt="Story upload" className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

          {/* Simulated top progress */}
          <div className="relative z-10 w-full h-1 rounded-full bg-white/40 overflow-hidden">
            <div className="h-full w-2/3 bg-white" />
          </div>

          {/* User badge */}
          <div className="relative z-10 flex items-center gap-2 text-left">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border border-white/60 text-white"
              style={{ background: user.avatarGradient }}
            >
              {user.emoji}
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-none">{user.name}</p>
              <p className="text-[10px] text-white/60">Bản tin của bạn</p>
            </div>
          </div>

          {/* Preview Text */}
          <div className="relative z-10 flex-1 flex items-center justify-center px-4">
            {slideType === 'quote' ? (
              <p className={`text-white leading-snug drop-shadow-md ${
                fontChoice === 'editorial' ? 'font-editorial italic text-lg' : 'font-hand text-xl font-bold'
              }`}>
                {text ? `“${text}”` : '“Nhập trích dẫn hay châm ngôn của bạn...”'}
              </p>
            ) : (
              <p className="text-sm font-hand font-bold text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 drop-shadow">
                {text || 'Nhãn dán chú thích...'}
              </p>
            )}
          </div>
        </div>

        {/* Background Gradients Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-white/70 mb-1.5">
            Màu nền hoặc tải ảnh lên:
          </label>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {STORY_GRADIENTS.map((grad, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setSelectedGrad(grad);
                  setImgData(null);
                }}
                className={`w-9 h-9 rounded-xl shrink-0 border-2 transition-all cursor-pointer ${
                  selectedGrad === grad && !imgData ? 'border-white scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                style={{ background: grad }}
              />
            ))}

            {/* Photo Upload Option */}
            <label className="w-9 h-9 rounded-xl shrink-0 glass border border-white/25 flex items-center justify-center text-white/70 hover:text-white cursor-pointer transition-colors" title="Tải ảnh lên">
              <Upload className="w-4 h-4" />
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

        {/* Text Input */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-white/70 mb-1">
              {slideType === 'quote' ? 'Nội dung trích dẫn:' : 'Ghi chú / Chú thích ảnh:'}
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                slideType === 'quote'
                  ? 'Ví dụ: Cố gắng mỗi ngày, tương lai sẽ mỉm cười.'
                  : 'Ví dụ: Sân trường sáng sớm hôm nay ☕'
              }
              className="w-full glass rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 border border-white/20 outline-none focus:border-pink-400"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl glass text-xs font-semibold text-white/70 hover:text-white cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!text.trim() && !imgData}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
            >
              Đăng tin 24h
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
