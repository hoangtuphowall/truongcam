import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Volume2,
  VolumeX,
  Music,
  ChevronUp,
  ChevronDown,
  Send,
  X,
  Plus
} from 'lucide-react';
import { Reel, Person } from '../types';

interface ReelsViewProps {
  reels: Reel[];
  people: Person[];
  onLikeReel: (reelId: number) => void;
  onShareReel: (reel: Reel) => void;
  onSendReelComment: (reelId: number, comment: string) => void;
  onOpenCreateReel?: () => void;
  onSelectPerson?: (personId: number) => void;
}

export const ReelsView: React.FC<ReelsViewProps> = ({
  reels,
  people,
  onLikeReel,
  onShareReel,
  onSendReelComment,
  onOpenCreateReel,
  onSelectPerson
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [openCommentsReelId, setOpenCommentsReelId] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [reelComments, setReelComments] = useState<{
    [reelId: number]: Array<{ name: string; text: string; time: string }>;
  }>({
    1: [
      { name: 'Maya', text: 'I felt that sprint in my soul 💨', time: '1h ago' },
      { name: 'Diego', text: 'Sub 4 minutes is varsity pace!', time: '30m ago' }
    ],
    2: [
      { name: 'Chloe', text: 'That 7th chord at the end is magical ✨', time: '2h ago' },
      { name: 'Sam', text: 'Export the stems, let me mix this!', time: '1h ago' }
    ]
  });

  const getPerson = (id: number) => people.find((p) => p.id === id);

  const handleNext = () => {
    if (currentIndex < reels.length - 1) setCurrentIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const currentReel = reels[currentIndex];
  const author = currentReel ? getPerson(currentReel.personId) : null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !openCommentsReelId) return;

    setReelComments((prev) => ({
      ...prev,
      [openCommentsReelId]: [
        ...(prev[openCommentsReelId] || []),
        { name: 'You', text: commentInput.trim(), time: 'Just now' }
      ]
    }));

    onSendReelComment(openCommentsReelId, commentInput.trim());
    setCommentInput('');
  };

  if (!currentReel || !author) return null;

  return (
    <div className="relative w-full h-[calc(100vh-140px)] sm:h-[calc(100vh-100px)] max-w-md mx-auto flex items-center justify-center p-2 sm:p-4 select-none">
      {/* Reel Card Container */}
      <div
        className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-white/20"
        style={{ background: currentReel.grad }}
      >
        {/* Top Sound & Controls */}
        <div className="relative z-10 p-4 pt-5 flex items-center justify-between text-white bg-gradient-to-b from-black/50 via-transparent to-transparent">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/15 text-xs">
            <Music className="w-3.5 h-3.5 text-pink-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="truncate max-w-[140px] font-code text-[11px] font-medium tracking-wide">{currentReel.soundTrack}</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenCreateReel && (
              <button
                onClick={onOpenCreateReel}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-xs font-bold text-white shadow hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                title="Create a Reel"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Đăng video</span>
              </button>
            )}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center border border-white/15 text-white hover:bg-black/50 transition-colors cursor-pointer"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
            </button>
          </div>
        </div>

        {/* Dynamic Simulated Audio Waveform Bar */}
        <div className="absolute inset-x-8 top-16 flex items-center justify-center gap-1 opacity-60 pointer-events-none">
          {[12, 28, 44, 20, 36, 52, 18, 40, 24, 48, 16, 32, 22].map((h, i) => (
            <span
              key={i}
              className="w-1 bg-white/70 rounded-full"
              style={{
                height: `${h}px`,
                animation: 'pulse 1s infinite alternate ease-in-out',
                animationDelay: `${i * 80}ms`
              }}
            />
          ))}
        </div>

        {/* Desktop Carousel Arrows */}
        <div className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col gap-2 z-20">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 disabled:opacity-30 text-white flex items-center justify-center transition-all border border-white/20"
            aria-label="Previous reel"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === reels.length - 1}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 disabled:opacity-30 text-white flex items-center justify-center transition-all border border-white/20"
            aria-label="Next reel"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Side Action Rail */}
        <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => onLikeReel(currentReel.id)}
              className={`w-11 h-11 rounded-full glass-strong flex items-center justify-center border border-white/25 active:scale-90 transition-all ${
                currentReel.liked ? 'text-pink-400 bg-pink-500/25 border-pink-400/50' : 'text-white'
              }`}
              aria-label="Like reel"
            >
              <Heart className={`w-5 h-5 ${currentReel.liked ? 'fill-pink-400' : ''}`} />
            </button>
            <span className="text-[11px] font-bold text-white drop-shadow font-code tabular-nums">{currentReel.likes}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => setOpenCommentsReelId(currentReel.id)}
              className="w-11 h-11 rounded-full glass-strong flex items-center justify-center border border-white/25 text-white active:scale-90 transition-all"
              aria-label="View reel comments"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            <span className="text-[11px] font-bold text-white drop-shadow font-code tabular-nums">
              {(reelComments[currentReel.id]?.length || 0) + currentReel.commentsCount}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => onShareReel(currentReel)}
              className="w-11 h-11 rounded-full glass-strong flex items-center justify-center border border-white/25 text-white active:scale-90 transition-all"
              aria-label="Share reel"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <span className="text-[11px] font-bold text-white drop-shadow font-code">Chia sẻ</span>
          </div>
        </div>

        {/* Bottom Metadata & Caption */}
        <div className="relative z-10 p-5 pb-6 text-white bg-gradient-to-t from-black/85 via-black/40 to-transparent">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div
              onClick={() => onSelectPerson && onSelectPerson(author.id)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white/60 shadow cursor-pointer hover:scale-105 transition-transform"
              style={{ background: author.avatarGradient }}
            >
              {author.emoji}
            </div>
            <div>
              <p
                onClick={() => onSelectPerson && onSelectPerson(author.id)}
                className="text-sm font-bold font-display leading-tight cursor-pointer hover:underline"
              >
                {author.name}
              </p>
              <p className="text-[11px] text-white/70">
                <span className="font-code text-pink-300">{author.handle}</span> · {author.school.split('·')[0]}
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-white/95 leading-relaxed max-w-[80%] drop-shadow font-clean">
            {currentReel.text}
          </p>
        </div>

        {/* Comments Drawer Overlay */}
        {openCommentsReelId === currentReel.id && (
          <div
            className="absolute inset-x-0 bottom-0 top-1/3 z-30 glass-strong rounded-t-3xl border-t border-white/25 p-4 flex flex-col justify-between shadow-2xl animate-in slide-in-from-bottom duration-200"
            style={{ background: 'rgba(21, 13, 38, 0.95)' }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-white">Bình Luận Video</span>
              <button
                onClick={() => setOpenCommentsReelId(null)}
                className="w-7 h-7 rounded-full glass flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2.5 space-y-2.5 text-xs">
              {(reelComments[currentReel.id] || []).map((c, i) => (
                <div key={i} className="glass p-2.5 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{c.name}</span>
                    <span className="text-[10px] text-white/40">{c.time}</span>
                  </div>
                  <p className="text-white/80">{c.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2 border-t border-white/10">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Viết bình luận cho video này..."
                className="flex-1 glass rounded-full px-3.5 py-2 text-xs text-white placeholder-white/40 border border-white/15 outline-none focus:border-purple-400"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] disabled:opacity-40 text-white flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
