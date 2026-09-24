import React, { useState } from 'react';
import {
  Compass,
  Search,
  TrendingUp,
  Sparkles,
  Users,
  MessageCircle,
  Heart,
  Quote,
  Flame,
  Hash
} from 'lucide-react';
import { Post, Person, Group, UserProfile } from '../types';

interface ExploreViewProps {
  posts: Post[];
  people: Person[];
  groups: Group[];
  user: UserProfile;
  onSelectPerson: (personId: number) => void;
  onSelectHashtag: (tag: string) => void;
  onOpenLightbox: (imgUrl: string | undefined, grad: string | undefined, author: Person | UserProfile, caption: string, post: Post) => void;
  onToggleJoinGroup: (groupId: number) => void;
  onLikePost: (postId: number) => void;
  onOpenDirectChat: (personId: number) => void;
}

const TRENDING_TAGS = [
  { tag: 'HocTapCamBinh', count: '1.4k bài', hot: true },
  { tag: 'SanTruong', count: '890 bài', hot: true },
  { tag: 'CauLacBo', count: '640 bài', hot: false },
  { tag: 'MuaThiHocKy', count: '1.8k bài', hot: true },
  { tag: 'GiaiDieuTuoiTre', count: '412 bài', hot: false },
  { tag: 'KhoanhKhacLop', count: '750 bài', hot: false }
];

export const ExploreView: React.FC<ExploreViewProps> = ({
  posts,
  people,
  groups,
  user,
  onSelectPerson,
  onSelectHashtag,
  onOpenLightbox,
  onToggleJoinGroup,
  onLikePost,
  onOpenDirectChat
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'visuals' | 'quotes' | 'code'>('all');

  const getPerson = (id: number) => people.find((p) => p.id === id) || user;

  // Filter posts based on category and search
  const filteredPosts = posts.filter((p) => {
    if (activeCategory === 'visuals' && p.type !== 'image') return false;
    if (activeCategory === 'quotes' && p.type !== 'quote') return false;
    if (activeCategory === 'code' && p.fontChoice !== 'code') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const author = getPerson(p.personId);
      return (
        p.text.toLowerCase().includes(q) ||
        author.name.toLowerCase().includes(q) ||
        author.handle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-5 px-4 pb-24 max-w-3xl mx-auto animate-in fade-in duration-200">
      {/* Search Header */}
      <div className="relative w-full">
        <div className="flex items-center gap-3 glass rounded-2xl px-4 py-3 border border-white/20 shadow-lg focus-within:border-pink-400 transition-colors">
          <Search className="w-4 h-4 text-white/50 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Khám phá bài viết, bạn bè, hashtag hoặc chủ đề..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-white/40 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-white/50 hover:text-white"
            >
              Xóa
            </button>
          )}
        </div>
      </div>

      {/* Trending Topics Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-white/60 font-semibold px-1">
          <span className="flex items-center gap-1.5 text-white">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Chủ đề nổi bật tại trường</span>
          </span>
          <span className="text-[11px] text-white/40">Chạm hashtag để lọc</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {TRENDING_TAGS.map((item) => (
            <button
              key={item.tag}
              onClick={() => onSelectHashtag(item.tag)}
              className="px-3 py-1.5 rounded-xl glass border border-white/15 hover:border-white/30 text-white/80 hover:text-white transition-all flex items-center gap-1.5 shrink-0 cursor-pointer group"
            >
              <Hash className="w-3 h-3 text-pink-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold">{item.tag}</span>
              <span className="text-[10px] text-white/40 font-code">{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Spotlight Creators Row */}
      <div className="glass-card rounded-3xl p-4 border border-white/15 shadow-lg space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-white px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Thành Viên Tiêu Biểu</span>
          </div>
          <span className="text-[11px] text-white/40 font-medium">Hoạt động sôi nổi</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {people.slice(0, 4).map((person) => (
            <div
              key={person.id}
              className="glass rounded-2xl p-3 border border-white/10 hover:border-white/25 flex flex-col items-center text-center transition-all group"
            >
              <div
                onClick={() => onSelectPerson(person.id)}
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white border-2 border-white/40 shadow-sm cursor-pointer group-hover:scale-105 transition-transform"
                style={{ background: person.avatarGradient }}
              >
                {person.emoji}
              </div>
              <h4
                onClick={() => onSelectPerson(person.id)}
                className="text-xs font-bold text-white mt-2 truncate w-full font-display cursor-pointer hover:underline"
              >
                {person.name}
              </h4>
              <p className="text-[10px] text-white/50 truncate w-full">{person.school.split('·')[0]}</p>
              <button
                onClick={() => onOpenDirectChat(person.id)}
                className="mt-2.5 w-full py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[10.5px] font-semibold text-white border border-white/15 transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <MessageCircle className="w-3 h-3 text-pink-300" />
                <span>Nhắn tin</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl glass border border-white/15 text-xs font-semibold">
        {(
          [
            { id: 'all', label: 'Tất cả' },
            { id: 'visuals', label: 'Hình ảnh' },
            { id: 'quotes', label: 'Danh ngôn & Châm ngôn' },
            { id: 'code', label: 'Học tập & Mã nguồn' }
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeCategory === tab.id
                ? 'bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-white shadow'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Discovery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredPosts.map((post) => {
          const author = getPerson(post.personId);

          if (post.type === 'quote') {
            return (
              <div
                key={post.id}
                className="p-5 sm:p-6 rounded-3xl border border-white/20 flex flex-col justify-between shadow-lg relative overflow-hidden transition-all hover:scale-[1.01]"
                style={{
                  background:
                    post.grad ||
                    'linear-gradient(135deg, rgba(124, 107, 255, 0.4), rgba(255, 107, 203, 0.3))'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    onClick={() => onSelectPerson(author.id)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white border border-white/30"
                      style={{ background: author.avatarGradient }}
                    >
                      {author.emoji}
                    </div>
                    <span className="text-xs font-bold text-white font-display">{author.name}</span>
                  </div>
                  <Quote className="w-4 h-4 text-white/40" />
                </div>

                <p
                  className={`my-3 text-white leading-relaxed ${
                    post.fontChoice === 'editorial'
                      ? 'font-editorial italic text-lg'
                      : post.fontChoice === 'hand'
                      ? 'font-hand text-2xl font-bold'
                      : 'font-display font-semibold text-base'
                  }`}
                >
                  {post.text}
                </p>

                <div className="flex items-center justify-between pt-2 text-xs font-code text-white/60">
                  <button
                    onClick={() => onLikePost(post.id)}
                    className="flex items-center gap-1 hover:text-pink-300 transition-colors cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${post.liked ? 'fill-pink-400 text-pink-400' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  <span className="text-[10px] uppercase tracking-wider text-white/40">
                    {post.fontChoice || 'quote'}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={post.id}
              className="glass-card rounded-3xl overflow-hidden border border-white/20 shadow-lg flex flex-col justify-between hover:border-white/35 transition-all"
            >
              {/* Image banner if present */}
              {post.type === 'image' && (
                <div
                  onClick={() => onOpenLightbox(post.imgData, post.grad, author, post.text, post)}
                  className="h-44 w-full relative overflow-hidden cursor-pointer group"
                  style={{
                    background: post.imgData
                      ? undefined
                      : post.grad || 'linear-gradient(160deg, #7c6bff, #ff6bcb)'
                  }}
                >
                  {post.imgData ? (
                    <img
                      src={post.imgData}
                      alt="Ảnh bài viết"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4 text-center">
                      <span className="text-xs text-white/80 font-medium">Khoảnh khắc ✦</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] text-white/80 font-code">
                    Xem ảnh
                  </div>
                </div>
              )}

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      onClick={() => onSelectPerson(author.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white border border-white/20 cursor-pointer"
                      style={{ background: author.avatarGradient }}
                    >
                      {author.emoji}
                    </div>
                    <div>
                      <h4
                        onClick={() => onSelectPerson(author.id)}
                        className="text-xs font-bold text-white font-display cursor-pointer hover:underline leading-none"
                      >
                        {author.name}
                      </h4>
                      <span className="text-[10px] text-white/50">{post.time}</span>
                    </div>
                  </div>

                  <p
                    className={`text-xs sm:text-sm text-white/90 leading-relaxed ${
                      post.fontChoice === 'code'
                        ? 'font-code bg-black/40 p-2.5 rounded-xl border border-white/10 text-emerald-300 text-xs'
                        : post.fontChoice === 'hand'
                        ? 'font-hand text-lg font-bold text-pink-100'
                        : 'font-clean'
                    }`}
                  >
                    {post.text}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-code text-white/60">
                  <button
                    onClick={() => onLikePost(post.id)}
                    className="flex items-center gap-1 hover:text-pink-300 transition-colors cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${post.liked ? 'fill-pink-400 text-pink-400' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  <span>💬 {post.comments.length}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
