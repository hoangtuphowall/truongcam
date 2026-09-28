import React, { useState } from 'react';
import { X, Image as ImageIcon, Quote, Type, Upload, Sparkles } from 'lucide-react';
import { UserProfile, AestheticFont } from '../types';

interface CreatePostModalProps {
  isOpen: boolean;
  initialType?: 'text' | 'image' | 'quote';
  user: UserProfile;
  onClose: () => void;
  onSubmit: (postData: {
    type: 'text' | 'image' | 'quote';
    text: string;
    imgData?: string;
    grad?: string;
    fontChoice?: AestheticFont;
  }) => void;
}

const GRADIENT_PRESETS = [
  'linear-gradient(160deg, #7c6bff, #ff6bcb)',
  'linear-gradient(160deg, #38e6c5, #7c6bff)',
  'linear-gradient(160deg, #ffb84d, #ff6bcb)',
  'linear-gradient(160deg, #ff6bcb, #38e6c5)',
  'linear-gradient(160deg, #7c6bff, #38e6c5)',
  'linear-gradient(160deg, #ffb84d, #7c6bff)'
];

export const AESTHETIC_FONTS: {
  id: AestheticFont;
  label: string;
  name: string;
  cssClass: string;
  previewClass: string;
  tag: string;
}[] = [
  { id: 'clean', label: 'Clean', name: 'Plus Jakarta', cssClass: 'font-clean text-sm', previewClass: 'font-clean', tag: 'Modern' },
  { id: 'display', label: 'Avant', name: 'Syne', cssClass: 'font-display tracking-tight font-bold text-sm', previewClass: 'font-display font-bold', tag: 'Bold' },
  { id: 'editorial', label: 'Editorial', name: 'Fraunces', cssClass: 'font-editorial italic font-normal text-base', previewClass: 'font-editorial italic font-semibold', tag: 'Serif' },
  { id: 'grotesk', label: 'Grotesk', name: 'Space Grotesk', cssClass: 'font-grotesk tracking-tight font-medium text-sm', previewClass: 'font-grotesk font-semibold', tag: 'Tech' },
  { id: 'hand', label: 'Script', name: 'Caveat', cssClass: 'font-hand text-xl font-bold leading-snug', previewClass: 'font-hand font-bold text-base', tag: 'Hand' },
  { id: 'code', label: 'Terminal', name: 'JetBrains Mono', cssClass: 'font-code text-xs font-mono tracking-tight text-emerald-300', previewClass: 'font-code text-xs', tag: 'Code' }
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  initialType = 'text',
  user,
  onClose,
  onSubmit
}) => {
  const [postType, setPostType] = useState<'text' | 'image' | 'quote'>(initialType);
  const [text, setText] = useState('');
  const [imgData, setImgData] = useState<string | null>(null);
  const [selectedGrad, setSelectedGrad] = useState(GRADIENT_PRESETS[0]);
  const [selectedFont, setSelectedFont] = useState<AestheticFont>(initialType === 'quote' ? 'editorial' : 'clean');
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImgData(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPostType = (type: 'text' | 'image' | 'quote') => {
    setPostType(type);
    if (type === 'quote' && selectedFont === 'clean') {
      setSelectedFont('editorial');
    }
  };

  const currentFontObj = AESTHETIC_FONTS.find((f) => f.id === selectedFont) || AESTHETIC_FONTS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !imgData) return;

    onSubmit({
      type: postType,
      text: postType === 'quote' ? `"${text.trim()}"` : text.trim(),
      imgData: postType === 'image' && imgData ? imgData : undefined,
      grad: postType === 'image' && !imgData ? selectedGrad : postType === 'quote' ? selectedGrad : undefined,
      fontChoice: selectedFont
    });

    setText('');
    setImgData(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg glass-strong sm:rounded-3xl rounded-t-3xl border border-white/25 shadow-2xl p-5 overflow-hidden animate-in slide-in-from-bottom-6 duration-200"
        style={{ background: 'rgba(21, 13, 38, 0.95)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow"
              style={{ background: user.avatarGradient }}
            >
              {user.emoji}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">Tạo Bài Viết Mới</h2>
              <p className="text-[11px] text-white/50">{user.name} · Chia sẻ cùng trường Cẩm Bình</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full glass flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 py-3">
          <button
            type="button"
            onClick={() => handleSelectPostType('text')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              postType === 'text'
                ? 'bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-white shadow-sm'
                : 'glass text-white/70 hover:text-white border border-white/15'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Bài viết chữ</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectPostType('image')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              postType === 'image'
                ? 'bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-white shadow-sm'
                : 'glass text-white/70 hover:text-white border border-white/15'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Hình ảnh</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectPostType('quote')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              postType === 'quote'
                ? 'bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-white shadow-sm'
                : 'glass text-white/70 hover:text-white border border-white/15'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
            <span>Trích dẫn hay</span>
          </button>
        </div>

        {/* Aesthetic Font Selector */}
        <div className="pb-3 pt-1 border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-white/70 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Kiểu chữ:</span>
              <span className="text-pink-300 font-semibold">{currentFontObj.name} ({currentFontObj.tag})</span>
            </span>
            <span className="text-[10px] text-white/40">Chọn phong cách hiển thị</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {AESTHETIC_FONTS.map((font) => {
              const isSelected = selectedFont === font.id;
              return (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => setSelectedFont(font.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-white/20 border-white/60 text-white shadow-sm ring-1 ring-white/50 scale-102'
                      : 'glass border-white/15 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  title={`${font.name} - ${font.tag}`}
                >
                  <span className={`${font.previewClass} text-xs sm:text-sm`}>{font.label}</span>
                  <span className="text-[9.5px] text-white/40">· {font.tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-3">
          {/* Main textarea styled with chosen aesthetic font */}
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={postType === 'quote' ? 3 : 4}
              placeholder={
                postType === 'quote'
                  ? 'Nhập trích dẫn, danh ngôn hoặc châm ngôn sống...'
                  : "Chia sẻ câu chuyện, tin tức hoặc cảm nghĩ của bạn..."
              }
              className={`w-full glass rounded-2xl p-3.5 text-white placeholder-white/40 border border-white/20 outline-none focus:border-purple-400 transition-all resize-none leading-relaxed ${currentFontObj.cssClass}`}
              autoFocus
            />
            {postType === 'quote' && (
              <div className="absolute right-3 bottom-3 pointer-events-none text-white/20 font-serif text-3xl leading-none">
                ”
              </div>
            )}
          </div>

          {/* Photo Mode Attachment & Gradient selector */}
          {postType === 'image' && (
            <div className="space-y-3">
              {imgData ? (
                <div className="relative rounded-2xl overflow-hidden max-h-56 border border-white/25">
                  <img src={imgData} alt="Upload preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImgData(null)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files[0]) handleImageFile(e.dataTransfer.files[0]);
                  }}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                    isDragging ? 'border-pink-400 bg-pink-500/10' : 'border-white/20 hover:border-white/40'
                  }`}
                  onClick={() => document.getElementById('post-image-file-input')?.click()}
                >
                  <Upload className="w-6 h-6 text-white/50" />
                  <span className="text-xs text-white/80 font-medium">
                    Chọn ảnh hoặc kéo thả tệp vào đây
                  </span>
                  <span className="text-[10px] text-white/40">Hỗ trợ PNG, JPG, WEBP tối đa 10MB</span>
                  <input
                    id="post-image-file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleImageFile(e.target.files[0]);
                    }}
                  />
                </div>
              )}

              {/* Gradient card style presets if no image uploaded */}
              {!imgData && (
                <div>
                  <label className="text-[11px] font-semibold text-white/60 mb-1.5 block">
                    Hoặc chọn nền màu chuyển sắc:
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {GRADIENT_PRESETS.map((grad, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedGrad(grad)}
                        className={`w-9 h-9 rounded-xl shrink-0 transition-transform ${
                          selectedGrad === grad
                            ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#150d26]'
                            : 'hover:scale-105 opacity-80'
                        }`}
                        style={{ background: grad }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quote Mode Ambient Gradient Selector */}
          {postType === 'quote' && (
            <div>
              <label className="text-[11px] font-semibold text-white/60 mb-1.5 block">
                Tông màu thẻ trích dẫn:
              </label>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {GRADIENT_PRESETS.map((grad, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedGrad(grad)}
                    className={`w-9 h-9 rounded-xl shrink-0 transition-transform ${
                      selectedGrad === grad
                        ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#150d26]'
                        : 'hover:scale-105 opacity-80'
                    }`}
                    style={{ background: grad }}
                  />
                ))}
              </div>
            </div>
          )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full glass text-xs font-semibold text-white/70 hover:text-white"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={!text.trim() && !imgData}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] disabled:opacity-40 text-xs font-bold text-white shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                Đăng bài viết
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};
