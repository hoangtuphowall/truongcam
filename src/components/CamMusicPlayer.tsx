import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Repeat,
  Shuffle,
  Music,
  ListMusic,
  Sparkles
} from 'lucide-react';
import { SongTrack } from '../types';
import { INITIAL_SONGS } from '../data/initialData';

interface CamMusicPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: SongTrack;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSelectSong: (song: SongTrack) => void;
  volume: number;
  onVolumeChange: (val: number) => void;
}

export const CamMusicPlayer: React.FC<CamMusicPlayerProps> = ({
  isOpen,
  onClose,
  currentSong,
  isPlaying,
  onTogglePlay,
  onSelectSong,
  volume,
  onVolumeChange
}) => {
  const [activeTab, setActiveTab] = useState<'player' | 'lyrics' | 'playlist'>('player');
  const [progress, setProgress] = useState(35);
  const [isLiked, setIsLiked] = useState(true);

  // Simulated progress timer while playing
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  if (!isOpen) return null;

  const handleNext = () => {
    const currentIndex = INITIAL_SONGS.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % INITIAL_SONGS.length;
    onSelectSong(INITIAL_SONGS[nextIndex]);
    setProgress(0);
  };

  const handlePrev = () => {
    const currentIndex = INITIAL_SONGS.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + INITIAL_SONGS.length) % INITIAL_SONGS.length;
    onSelectSong(INITIAL_SONGS[prevIndex]);
    setProgress(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200">
      <div
        className="w-full max-w-md liquid-glass rounded-[40px] shadow-2xl border border-white/35 text-white flex flex-col overflow-hidden p-6 gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-white/70">
              CẩmMusic
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Trình phát / Lời bài hát / Playlist */}
        <div className="flex items-center justify-center gap-1 p-1 rounded-2xl bg-black/30 border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('player')}
            className={`flex-1 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'player' ? 'bg-emerald-500 text-black shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            Trình phát
          </button>
          <button
            onClick={() => setActiveTab('lyrics')}
            className={`flex-1 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'lyrics' ? 'bg-emerald-500 text-black shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            Lời bài hát
          </button>
          <button
            onClick={() => setActiveTab('playlist')}
            className={`flex-1 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'playlist' ? 'bg-emerald-500 text-black shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            Danh sách ({INITIAL_SONGS.length})
          </button>
        </div>

        {/* Tab 1: Player View */}
        {activeTab === 'player' && (
          <div className="flex flex-col items-center gap-5 my-1">
            {/* Album Artwork Squircle */}
            <div
              className="w-52 h-52 sm:w-60 sm:h-60 rounded-[32px] p-1 shadow-2xl relative flex items-center justify-center transition-all duration-300 group"
              style={{
                background: currentSong.coverGradient,
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 2px 2px rgba(255, 255, 255, 0.5)'
              }}
            >
              <div className="w-full h-full rounded-[30px] flex flex-col items-center justify-center p-4 text-center">
                <Music className="w-16 h-16 text-white/90 drop-shadow-lg" />
                <span className="text-xs font-bold text-white/90 mt-2 tracking-wide font-display">
                  THPT CẨM BÌNH
                </span>
              </div>
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-t from-black/30 via-transparent to-white/25 pointer-events-none" />
            </div>

            {/* Song Meta */}
            <div className="w-full flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-white truncate">{currentSong.title}</h3>
                <p className="text-xs text-white/60 truncate mt-0.5">{currentSong.artist}</p>
              </div>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
                  isLiked ? 'text-pink-400' : 'text-white/40'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-pink-400' : ''}`} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full flex flex-col gap-1.5">
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newProg = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
                  setProgress(newProg);
                }}
                className="w-full h-2 bg-white/20 rounded-full cursor-pointer overflow-hidden relative"
              >
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-white/50">
                <span>01:15</span>
                <span>{currentSong.duration}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={handlePrev}
                className="text-white/70 hover:text-white p-2 transition-colors cursor-pointer"
              >
                <SkipBack className="w-6 h-6" />
              </button>
              <button
                onClick={onTogglePlay}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-300 hover:scale-105 active:scale-95 flex items-center justify-center text-black shadow-xl shadow-emerald-500/30 transition-all cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-black" />
                ) : (
                  <Play className="w-7 h-7 fill-black ml-1" />
                )}
              </button>
              <button
                onClick={handleNext}
                className="text-white/70 hover:text-white p-2 transition-colors cursor-pointer"
              >
                <SkipForward className="w-6 h-6" />
              </button>
            </div>

            {/* Volume */}
            <div className="w-full flex items-center gap-3 px-2 pt-1">
              <button onClick={() => onVolumeChange(volume === 0 ? 0.7 : 0)}>
                {volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Synchronized Lyrics */}
        {activeTab === 'lyrics' && (
          <div className="h-80 overflow-y-auto no-scrollbar flex flex-col gap-4 p-2">
            <div className="text-xs uppercase tracking-wider text-emerald-300 font-bold mb-1">
              Lời bài hát · {currentSong.title}
            </div>
            {currentSong.lyrics.map((line, idx) => (
              <p
                key={idx}
                className={`text-sm sm:text-base font-medium leading-relaxed transition-all ${
                  idx === 1
                    ? 'text-white font-bold text-lg scale-105 origin-left'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {line}
              </p>
            ))}
            <p className="text-[11px] text-white/30 italic mt-4">
              *Lời ca truyền cảm hứng ôn thi dành riêng cho học sinh THPT Cẩm Bình.
            </p>
          </div>
        )}

        {/* Tab 3: Playlist */}
        {activeTab === 'playlist' && (
          <div className="h-80 overflow-y-auto no-scrollbar flex flex-col gap-2 p-1">
            {INITIAL_SONGS.map((song) => {
              const isSelected = song.id === currentSong.id;
              return (
                <div
                  key={song.id}
                  onClick={() => onSelectSong(song)}
                  className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 border border-emerald-400/40 text-white'
                      : 'liquid-glass-subtle hover:bg-white/15 text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow"
                      style={{ background: song.coverGradient }}
                    >
                      <Music className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{song.title}</div>
                      <div className="text-[10px] text-white/60 truncate">{song.artist}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-white/50">{song.duration}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
