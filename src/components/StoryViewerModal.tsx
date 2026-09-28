import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Heart, Pause, Play } from 'lucide-react';
import { Story, Person, UserProfile } from '../types';

interface StoryViewerModalProps {
  story: Story | null;
  people: Person[];
  user: UserProfile;
  onClose: () => void;
  onNextStory: () => void;
  onPrevStory: () => void;
  onReplyToStory: (personId: number, message: string) => void;
}

const SLIDE_DURATION = 4200; // ms

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  story,
  people,
  user,
  onClose,
  onNextStory,
  onPrevStory,
  onReplyToStory
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [likedSlide, setLikedSlide] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const elapsedBeforePauseRef = useRef<number>(0);

  const person = story
    ? story.personId === 0
      ? user
      : people.find((p) => p.id === story.personId) || user
    : null;
  const currentSlide = story?.slides[currentSlideIndex];

  // Reset when story changes
  useEffect(() => {
    setCurrentSlideIndex(0);
    setProgress(0);
    setLikedSlide(false);
    elapsedBeforePauseRef.current = 0;
    startTimeRef.current = null;
  }, [story?.id]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Progress animation loop
  useEffect(() => {
    if (!story || isPaused) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const start = performance.now() - elapsedBeforePauseRef.current;
    startTimeRef.current = start;

    const tick = (now: number) => {
      const elapsed = now - start;
      elapsedBeforePauseRef.current = elapsed;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(pct);

      if (elapsed >= SLIDE_DURATION) {
        handleNext();
      } else {
        animationFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [story?.id, currentSlideIndex, isPaused]);

  if (!story || !person || !currentSlide) return null;

  const handleNext = () => {
    if (currentSlideIndex < story.slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
      setLikedSlide(false);
    } else {
      onNextStory();
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
      setLikedSlide(false);
    } else {
      onPrevStory();
    }
  };

  const handleSendReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim()) return;
    onReplyToStory(story.personId, `Replying to your story: "${replyText.trim()}"`);
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-0 sm:p-4 select-none">
      {/* Slide Container */}
      <div className="relative w-full max-w-md h-full sm:h-[86vh] sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-white/20">
        {/* Background Visual */}
        <div
          className="absolute inset-0 z-0 transition-all duration-300"
          style={{
            background: currentSlide.grad || 'linear-gradient(160deg, #1b1030, #2a0f3a)'
          }}
        >
          {currentSlide.imgData && (
            <img
              src={currentSlide.imgData}
              alt="Story"
              className="w-full h-full object-cover"
            />
          )}
          {/* Ambient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        </div>

        {/* Top Header & Progress Bars */}
        <div className="relative z-20 p-4 pt-[max(1rem,env(safe-area-inset-top))]">
          {/* Progress row */}
          <div className="flex items-center gap-1.5 mb-3">
            {story.slides.map((_, idx) => {
              let fillWidth = '0%';
              if (idx < currentSlideIndex) fillWidth = '100%';
              else if (idx === currentSlideIndex) fillWidth = `${progress}%`;

              return (
                <div
                  key={idx}
                  className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden"
                >
                  <div
                    className="h-full bg-white transition-all ease-linear"
                    style={{
                      width: fillWidth,
                      transitionDuration: idx === currentSlideIndex ? '50ms' : '0ms'
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* User profile & controls */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white/60 shadow"
                style={{ background: person.avatarGradient }}
              >
                {person.emoji}
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">{person.name}</p>
                <p className="text-[10px] text-white/60">2h ago · {person.school.split('·')[0]}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsPaused((p) => !p)}
                className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label={isPaused ? 'Play' : 'Pause'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 fill-white" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close story"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Central Content */}
        <div className="relative z-10 flex-1 px-8 flex items-center justify-center text-center">
          <div className="max-w-xs animate-in zoom-in-95 duration-200">
            {currentSlide.type === 'quote' ? (
              <div className="space-y-2">
                <span className="text-4xl text-white/40 font-serif leading-none block select-none">“</span>
                <blockquote className="text-2xl sm:text-3xl font-editorial italic font-normal text-white leading-snug drop-shadow-lg">
                  {currentSlide.text.replace(/^["“”]/, '').replace(/["“”]$/, '')}
                </blockquote>
                <span className="text-3xl text-white/40 font-serif leading-none block select-none">”</span>
              </div>
            ) : (
              <p className="text-xl sm:text-2xl font-hand font-bold text-white leading-relaxed drop-shadow-lg bg-black/40 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/20">
                {currentSlide.text}
              </p>
            )}
          </div>
        </div>

        {/* Interactive Tap Zones */}
        <div
          className="absolute inset-y-16 left-0 w-2/5 z-10 cursor-pointer"
          onClick={handlePrev}
          title="Previous slide"
        />
        <div
          className="absolute inset-y-16 right-0 w-2/5 z-10 cursor-pointer"
          onClick={handleNext}
          title="Next slide"
        />

        {/* Bottom Reply Bar */}
        <div className="relative z-20 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              placeholder={`Nhắn tin cho ${person.name.split(' ')[person.name.split(' ').length - 1]}...`}
              className="flex-1 glass-strong rounded-full px-4 py-2.5 text-xs text-white placeholder-white/50 border border-white/20 outline-none focus:border-purple-400/80 transition-colors"
            />
            <button
              type="button"
              onClick={() => {
                setLikedSlide(!likedSlide);
                if (!likedSlide) {
                  onReplyToStory(story.personId, 'Đã thả tim tin của bạn 💖');
                }
              }}
              className={`w-10 h-10 rounded-full glass flex items-center justify-center border border-white/20 transition-transform active:scale-90 cursor-pointer ${
                likedSlide ? 'text-pink-400 bg-pink-500/20 border-pink-400/40' : 'text-white'
              }`}
              aria-label="Thả tim tin"
            >
              <Heart className={`w-4 h-4 ${likedSlide ? 'fill-pink-400' : ''}`} />
            </button>
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7c6bff] to-[#ff6bcb] disabled:opacity-40 text-white flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
              aria-label="Gửi phản hồi"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
