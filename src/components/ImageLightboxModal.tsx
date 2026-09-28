import React, { useState } from 'react';
import { X, Heart, Download, Share2 } from 'lucide-react';
import { Person, UserProfile } from '../types';

interface ImageLightboxModalProps {
  isOpen: boolean;
  imgUrl?: string;
  gradient?: string;
  author: Person | UserProfile;
  caption?: string;
  liked?: boolean;
  onLike?: () => void;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  imgUrl,
  gradient,
  author,
  caption,
  liked = false,
  onLike,
  onClose
}) => {
  const [heartAnim, setHeartAnim] = useState(false);

  if (!isOpen) return null;

  const handleDoubleClick = () => {
    if (onLike) {
      onLike();
      setHeartAnim(true);
      setTimeout(() => setHeartAnim(false), 900);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[320] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      {/* Top Header */}
      <div
        className="flex items-center justify-between z-10 p-2 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold border border-white/40 shadow-sm"
            style={{ background: author.avatarGradient }}
          >
            {author.emoji}
          </div>
          <div>
            <h4 className="text-sm font-bold leading-tight font-display">{author.name}</h4>
            <p className="text-[11px] text-white/60 font-code">{author.handle}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close lightbox"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Central Visual Canvas */}
      <div
        className="flex-1 flex items-center justify-center relative my-auto max-h-[78vh] cursor-pointer"
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={handleDoubleClick}
      >
        <div className="relative max-w-2xl w-full h-full max-h-[70vh] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex items-center justify-center">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt="High-resolution post view"
              className="w-full h-full object-contain"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center p-8 text-center"
              style={{ background: gradient || 'linear-gradient(135deg, #7c6bff, #ff6bcb)' }}
            >
              <p className="font-display font-bold text-2xl sm:text-3xl text-white drop-shadow-md max-w-md">
                {caption || 'Aesthetic Visual Moment'}
              </p>
            </div>
          )}

          {/* Double tap animated heart */}
          {heartAnim && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <span className="text-8xl heart-pop-anim drop-shadow-2xl">💖</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar: Caption & Quick actions */}
      <div
        className="z-10 p-3 max-w-2xl mx-auto w-full glass rounded-2xl border border-white/15 flex items-center justify-between text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-xs sm:text-sm text-white/90 truncate font-clean">
            {caption || 'Khoảnh khắc từ trường Cẩm'}
          </p>
          <span className="text-[10px] text-white/40">Chạm đúp vào ảnh để thả tim 💖</span>
        </div>

        <div className="flex items-center gap-2">
          {onLike && (
            <button
              onClick={onLike}
              className={`p-2 rounded-full transition-all active:scale-90 cursor-pointer ${
                liked ? 'text-pink-400 bg-pink-500/20' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Thả tim"
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-pink-400' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
