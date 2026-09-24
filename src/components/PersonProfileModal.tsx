import React, { useState } from 'react';
import { X, MessageCircle, UserPlus, UserCheck, Share2, Sparkles, BookOpen, Compass } from 'lucide-react';
import { Person, Post, UserProfile } from '../types';

interface PersonProfileModalProps {
  person: Person | null;
  currentUser: UserProfile;
  posts: Post[];
  isFriend: boolean;
  onClose: () => void;
  onToggleFriend: (personId: number) => void;
  onOpenChat: (personId: number) => void;
  onLikePost: (postId: number) => void;
  onSavePost: (postId: number) => void;
}

export const PersonProfileModal: React.FC<PersonProfileModalProps> = ({
  person,
  currentUser,
  posts,
  isFriend,
  onClose,
  onToggleFriend,
  onOpenChat,
  onLikePost,
  onSavePost
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');

  if (!person) return null;

  const personPosts = posts.filter((p) => p.personId === person.id);

  return (
    <div
      className="fixed inset-0 z-[280] bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] glass-strong rounded-t-3xl sm:rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        style={{ background: 'rgba(21, 13, 38, 0.95)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with ambient gradient */}
        <div
          className="h-28 sm:h-32 w-full relative flex items-start justify-end p-3"
          style={{ background: person.avatarGradient }}
        >
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
            aria-label="Close profile"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="px-6 -mt-12 relative z-10">
          <div className="flex items-end justify-between">
            <div className="relative">
              <div
                className="w-22 h-22 rounded-full flex items-center justify-center text-4xl font-bold text-white border-4 border-[#150d26] shadow-xl overflow-hidden"
                style={{ background: person.avatarGradient }}
              >
                {person.avatarUrl ? (
                  <img src={person.avatarUrl} alt={person.name} className="w-full h-full object-cover" />
                ) : (
                  person.emoji
                )}
              </div>
              {person.online && (
                <span
                  className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#150d26] shadow-sm"
                  title="Online now"
                />
              )}
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2 pb-1">
              <button
                onClick={() => {
                  onToggleFriend(person.id);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isFriend
                    ? 'glass text-white/80 border border-white/20 hover:text-white'
                    : 'bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-white shadow-md'
                }`}
              >
                {isFriend ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Bạn bè</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Kết bạn</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  onOpenChat(person.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-pink-300" />
                <span>Nhắn tin</span>
              </button>
            </div>
          </div>

          {/* Name & Bio */}
          <div className="mt-3">
            <h2 className="text-xl font-bold font-display text-white">{person.name}</h2>
            <p className="text-xs text-white/60 mt-0.5 flex items-center gap-1.5">
              <span className="font-code text-pink-300">{person.handle}</span>
              <span>·</span>
              <span>{person.school}</span>
            </p>
            <p className="text-xs sm:text-sm text-white/85 mt-2.5 leading-relaxed font-clean">
              {person.bio}
            </p>
          </div>

          {/* Metrics bar */}
          <div className="grid grid-cols-3 gap-2 py-3 mt-4 border-y border-white/10 text-center">
            <div>
              <span className="block text-base font-bold text-white font-code tabular-nums">
                {personPosts.length}
              </span>
              <span className="text-[10.5px] text-white/50 font-medium">Bài viết</span>
            </div>
            <div>
              <span className="block text-base font-bold text-white font-code tabular-nums">
                {person.mutualCount}
              </span>
              <span className="text-[10.5px] text-white/50 font-medium">Bạn chung</span>
            </div>
            <div>
              <span className="block text-base font-bold text-emerald-400 font-code">
                {person.online ? 'Trực tuyến' : 'Ngoại tuyến'}
              </span>
              <span className="text-[10.5px] text-white/50 font-medium">Trạng thái</span>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-4 pt-3 border-b border-white/10 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-2 transition-colors cursor-pointer relative ${
                activeTab === 'posts' ? 'text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              <span>Bài viết đã đăng ({personPosts.length})</span>
              {activeTab === 'posts' && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-2 transition-colors cursor-pointer relative ${
                activeTab === 'about' ? 'text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              <span>Giới thiệu & Lớp học</span>
              {activeTab === 'about' && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400" />
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {activeTab === 'posts' && (
            <>
              {personPosts.length === 0 ? (
                <div className="text-center py-8 text-white/50 text-xs">
                  <Sparkles className="w-6 h-6 mx-auto mb-2 text-purple-400 opacity-60" />
                  Chưa có bài viết nào được đăng bởi {person.name.split(' ')[person.name.split(' ').length - 1]}.
                </div>
              ) : (
                personPosts.map((post) => (
                  <div
                    key={post.id}
                    className="glass rounded-2xl p-4 border border-white/15 hover:border-white/25 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-[11px] text-white/50">
                      <span className="font-code">{post.time}</span>
                      {post.fontChoice && (
                        <span className="font-code text-[10px] text-pink-300">
                          ✦ {post.fontChoice}
                        </span>
                      )}
                    </div>

                    {post.type === 'quote' ? (
                      <div
                        className="p-4 rounded-xl border border-white/20 text-center"
                        style={{
                          background:
                            post.grad ||
                            'linear-gradient(135deg, rgba(124, 107, 255, 0.4), rgba(255, 107, 203, 0.3))'
                        }}
                      >
                        <p className="font-editorial italic text-base text-white">
                          {post.text}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-white/90 leading-relaxed break-words font-clean">
                        {post.text}
                      </p>
                    )}

                    {post.imgData && (
                      <div className="rounded-xl overflow-hidden max-h-48 border border-white/15">
                        <img src={post.imgData} alt="Post media" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs font-code text-white/60 pt-1">
                      <span>💖 {post.likes} lượt thích</span>
                      <span>💬 {post.comments.length} bình luận</span>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4 text-xs text-white/80">
              <div className="glass rounded-2xl p-4 border border-white/15 space-y-2">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <BookOpen className="w-4 h-4 text-pink-400" />
                  <span>Trường lớp & Chi đoàn</span>
                </div>
                <p className="text-white/70 leading-relaxed font-clean">
                  {person.school}. Tích cực tham gia các hoạt động học tập, phong trào Đoàn trường và câu lạc bộ THPT Cẩm Bình.
                </p>
              </div>

              <div className="glass rounded-2xl p-4 border border-white/15 space-y-2">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <Compass className="w-4 h-4 text-purple-400" />
                  <span>Bạn chung & Vòng kết nối</span>
                </div>
                <p className="text-white/70 leading-relaxed font-clean">
                  Bạn và {person.name.split(' ')[person.name.split(' ').length - 1]} có <span className="text-pink-300 font-bold font-code">{person.mutualCount} bạn bè chung</span> tại trường THPT Cẩm Bình.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
