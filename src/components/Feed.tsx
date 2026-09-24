import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Image as ImageIcon,
  Quote,
  Send,
  Sparkles,
  Check,
  Hash
} from 'lucide-react';
import { Post, Person, UserProfile } from '../types';

interface FeedProps {
  posts: Post[];
  people: Person[];
  user: UserProfile;
  onOpenComposer: (type: 'text' | 'image' | 'quote') => void;
  onLikePost: (postId: number) => void;
  onSavePost: (postId: number) => void;
  onAddComment: (postId: number, commentText: string) => void;
  onLikeComment: (postId: number, commentId: string) => void;
  onSharePost: (post: Post) => void;
  onDeletePost?: (postId: number) => void;
  onSelectPerson?: (personId: number) => void;
  onOpenLightbox?: (imgUrl: string | undefined, grad: string | undefined, author: Person | UserProfile, caption: string, post: Post) => void;
  onSelectHashtag?: (tag: string) => void;
  currentFilter?: 'all' | 'friends' | 'saved';
  onFilterChange?: (filter: 'all' | 'friends' | 'saved') => void;
  activeTagFilter?: string | null;
  onClearTagFilter?: () => void;
}

const FONT_INFO_MAP: Record<string, { name: string; fontClass: string; quoteClass: string }> = {
  clean: { name: 'Standard', fontClass: 'font-clean text-xs sm:text-sm text-white/90', quoteClass: 'font-clean text-sm sm:text-base font-medium' },
  display: { name: 'Apple UI', fontClass: 'font-display font-medium text-xs sm:text-sm text-white', quoteClass: 'font-display font-semibold text-base sm:text-lg tracking-tight' },
  editorial: { name: 'Editorial', fontClass: 'font-normal text-xs sm:text-sm leading-relaxed text-white/90', quoteClass: 'font-medium text-sm sm:text-base leading-snug' },
  grotesk: { name: 'Modern', fontClass: 'font-medium text-xs sm:text-sm text-white/90', quoteClass: 'font-semibold text-sm sm:text-base tracking-tight' },
  hand: { name: 'Handwrite', fontClass: 'font-hand font-medium text-base sm:text-lg leading-snug tracking-wide text-pink-100', quoteClass: 'font-hand font-semibold text-lg sm:text-xl leading-snug text-pink-50' },
  code: { name: 'Mono', fontClass: 'font-code text-xs sm:text-[12px] leading-relaxed bg-black/30 p-3 rounded-xl border border-white/10 text-emerald-300', quoteClass: 'font-code font-normal text-xs sm:text-sm tracking-normal text-cyan-200' },
};

export const Feed: React.FC<FeedProps> = ({
  posts,
  people,
  user,
  onOpenComposer,
  onLikePost,
  onSavePost,
  onAddComment,
  onLikeComment,
  onSharePost,
  onDeletePost,
  onSelectPerson,
  onOpenLightbox,
  onSelectHashtag,
  currentFilter,
  onFilterChange,
  activeTagFilter,
  onClearTagFilter
}) => {
  const [internalFilter, setInternalFilter] = useState<'all' | 'friends' | 'saved'>('all');
  const filter = currentFilter !== undefined ? currentFilter : internalFilter;
  const setFilter = onFilterChange || setInternalFilter;

  const [activeMenuPostId, setActiveMenuPostId] = useState<number | null>(null);
  const [heartPops, setHeartPops] = useState<{ [postId: number]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [postId: number]: string }>({});

  const getPerson = (id: number): Person | UserProfile => {
    if (id === 0) return user;
    return people.find((p) => p.id === id) || user;
  };

  const filteredPosts = posts.filter((p) => {
    if (activeTagFilter) {
      const tagLower = activeTagFilter.toLowerCase();
      const hasTag = p.text.toLowerCase().includes(`#${tagLower}`) || p.text.toLowerCase().includes(tagLower);
      if (!hasTag) return false;
    }
    if (filter === 'saved') return p.saved;
    if (filter === 'friends') return p.personId !== 0;
    return true;
  });

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(#[a-zA-Z0-9_]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        const tag = part.slice(1);
        return (
          <span
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectHashtag) onSelectHashtag(tag);
            }}
            className="text-pink-400 hover:text-pink-300 font-semibold cursor-pointer underline-offset-2 hover:underline"
            title={`Filter by #${tag}`}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const triggerDoubleTapHeart = (postId: number) => {
    onLikePost(postId);
    setHeartPops((prev) => ({ ...prev, [postId]: true }));
    setTimeout(() => {
      setHeartPops((prev) => ({ ...prev, [postId]: false }));
    }, 750);
  };

  const handleCommentSubmit = (postId: number, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="flex flex-col gap-4 px-4 pb-24">
      {/* Quick Composer Box */}
      <div
        onClick={() => onOpenComposer('text')}
        className="glass-card rounded-3xl p-3.5 flex items-center gap-3 cursor-pointer hover:border-white/40 transition-all border border-white/20 shadow-md group"
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white shrink-0 border border-white/30 group-hover:scale-105 transition-transform overflow-hidden"
          style={{ background: user.avatarGradient }}
        >
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user.emoji
          )}
        </div>
        <div className="flex-1 bg-white/10 hover:bg-white/15 text-white/60 text-xs sm:text-sm px-4 py-2.5 rounded-full border border-white/15 transition-colors truncate">
          Bạn đang nghĩ gì thế?...
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenComposer('image');
            }}
            className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 border border-white/20 transition-all"
            title="Thêm ảnh"
            aria-label="Tạo bài viết ảnh"
          >
            <ImageIcon className="w-4 h-4 text-emerald-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenComposer('quote');
            }}
            className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 border border-white/20 transition-all"
            title="Trích dẫn hay"
            aria-label="Tạo bài viết trích dẫn"
          >
            <Quote className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>

      {/* Transparent Liquid Glass iOS Segmented Control / Toggle Menu */}
      <div className="flex items-center py-1">
        <div className="ios-toggle-menu">
          {(['all', 'friends', 'saved'] as const).map((tab) => {
            const isActive = filter === tab;
            const label = tab === 'all' ? 'Tất cả bài viết' : tab === 'friends' ? 'Bạn bè' : 'Đã lưu';
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`ios-toggle-item ${isActive ? 'ios-toggle-active' : ''}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Hashtag Filter Banner */}
      {activeTagFilter && (
        <div className="glass-strong rounded-2xl p-3 px-4 border border-pink-500/30 flex items-center justify-between text-xs text-white shadow-lg animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-pink-400 shrink-0" />
            <span>Đang lọc bài viết theo thẻ <strong className="text-pink-300 font-code">#{activeTagFilter}</strong></span>
          </div>
          {onClearTagFilter && (
            <button
              onClick={onClearTagFilter}
              className="text-[11px] text-pink-300 hover:text-white underline cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-3 text-white/60">
          <Sparkles className="w-8 h-8 text-pink-400/80" />
          <p className="text-sm font-semibold text-white">Chưa có bài viết nào trong mục này</p>
          <p className="text-xs text-white/50 max-w-xs">
            {filter === 'saved'
              ? 'Lưu lại những bài viết hay bằng biểu tượng bookmark để xem lại bất cứ lúc nào.'
              : 'Hãy là người đầu tiên chia sẻ bài viết cùng các bạn!'}
          </p>
          {filter === 'saved' ? (
            <button
              onClick={() => setFilter('all')}
              className="mt-2 px-4 py-2 rounded-full glass text-xs font-semibold text-white hover:bg-white/20"
            >
              Xem tất cả bài viết
            </button>
          ) : (
            <button
              onClick={() => onOpenComposer('text')}
              className="mt-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-xs font-semibold text-white shadow-md hover:opacity-95"
            >
              Đăng bài viết mới
            </button>
          )}
        </div>
      ) : (
        filteredPosts.map((post) => {
          const author = getPerson(post.personId);
          const isUserPost = post.personId === 0;

          return (
            <article
              key={post.id}
              className="glass-card rounded-3xl overflow-hidden border border-white/20 shadow-lg transition-all hover:border-white/30"
            >
              {/* Post Header */}
              <div className="p-4 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => onSelectPerson && onSelectPerson(author.id)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white border border-white/20 shadow-sm shrink-0 cursor-pointer hover:scale-105 transition-transform overflow-hidden"
                    style={{ background: author.avatarGradient }}
                  >
                    {author.avatarUrl ? (
                      <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
                    ) : (
                      author.emoji
                    )}
                  </div>
                  <div>
                    <h3
                      onClick={() => onSelectPerson && onSelectPerson(author.id)}
                      className="text-sm font-bold text-white flex items-center gap-1.5 leading-tight cursor-pointer hover:underline"
                    >
                      <span>{author.name}</span>
                      {isUserPost && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/30 text-purple-300 font-semibold border border-purple-400/30">
                          Bạn
                        </span>
                      )}
                    </h3>
                    <p className="text-[11.5px] text-white/50 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span className="font-code text-[11px] text-white/60">{post.time}</span>
                      <span>·</span>
                      <span>{author.school}</span>
                      {post.fontChoice && post.fontChoice !== 'clean' && (
                        <>
                          <span className="text-white/30">·</span>
                          <span className="text-[10px] text-pink-300 font-medium px-1.5 py-0.2 rounded bg-pink-500/15 border border-pink-400/20">
                            {FONT_INFO_MAP[post.fontChoice]?.name}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id)}
                    className="w-8 h-8 rounded-full glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-all border border-white/15"
                    aria-label="Tùy chọn bài viết"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {/* Options Dropdown */}
                  {activeMenuPostId === post.id && (
                    <div
                      className="absolute right-0 top-10 w-44 rounded-2xl glass-strong border border-white/25 shadow-xl py-1.5 z-20 text-xs animate-in fade-in zoom-in-95 duration-100"
                      style={{ background: 'rgba(21, 13, 38, 0.95)' }}
                    >
                      <button
                        onClick={() => {
                          onSavePost(post.id);
                          setActiveMenuPostId(null);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-white/10 text-white/90 flex items-center gap-2"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        {post.saved ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}
                      </button>
                      <button
                        onClick={() => {
                          onSharePost(post);
                          setActiveMenuPostId(null);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-white/10 text-white/90 flex items-center gap-2"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        Chia sẻ bài viết
                      </button>
                      {isUserPost && onDeletePost && (
                        <button
                          onClick={() => {
                            onDeletePost(post.id);
                            setActiveMenuPostId(null);
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-red-500/20 text-red-400 flex items-center gap-2"
                        >
                          Xóa bài viết
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Post Text Description */}
              {post.type !== 'quote' && post.text && (
                <div className="px-4 pb-3">
                  <div className={`leading-relaxed break-words whitespace-pre-wrap ${
                    FONT_INFO_MAP[post.fontChoice || 'clean']?.fontClass || 'font-clean text-xs sm:text-sm text-white/90'
                  }`}>
                    {renderFormattedText(post.text)}
                  </div>
                </div>
              )}

              {/* Post Visual Media */}
              {post.type === 'image' && (
                <div
                  onClick={() => onOpenLightbox && onOpenLightbox(post.imgData, post.grad, author, post.text, post)}
                  onDoubleClick={() => triggerDoubleTapHeart(post.id)}
                  className="relative w-full h-72 sm:h-80 overflow-hidden cursor-pointer select-none group"
                  style={{
                    background: post.imgData
                      ? undefined
                      : post.grad || 'linear-gradient(160deg, #7c6bff, #ff6bcb)'
                  }}
                >
                  {post.imgData ? (
                    <img
                      src={post.imgData}
                      alt="Post visual"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col justify-end p-4 text-white bg-gradient-to-t from-black/60 via-transparent to-transparent">
                      <span className="text-xs text-white/70 font-medium">Nhấn đúp để thả tim 💖</span>
                    </div>
                  )}

                  {/* Animated Heart pop on double click */}
                  {heartPops[post.id] && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <span className="text-7xl heart-pop-anim drop-shadow-2xl">💖</span>
                    </div>
                  )}
                </div>
              )}

              {/* Quote Post Card */}
              {post.type === 'quote' && (
                <div className="px-4 pb-3">
                  <div
                    className="p-6 sm:p-7 rounded-2xl border border-white/25 text-center relative overflow-hidden shadow-inner flex flex-col items-center justify-center"
                    style={{
                      background:
                        post.grad ||
                        'linear-gradient(135deg, rgba(124, 107, 255, 0.45), rgba(255, 107, 203, 0.35))'
                    }}
                  >
                    <span className="text-4xl text-white/35 font-serif leading-none block mb-1 select-none">“</span>
                    <p className={`${
                      FONT_INFO_MAP[post.fontChoice || 'editorial']?.quoteClass || 'font-editorial italic font-normal text-xl sm:text-2xl leading-snug'
                    } text-white drop-shadow-sm max-w-md`}>
                      {post.text.replace(/^["“”]/, '').replace(/["“”]$/, '')}
                    </p>
                    <span className="text-3xl text-white/35 font-serif leading-none block mt-1 select-none">”</span>
                    {post.fontChoice && (
                      <span className="mt-2 text-[10px] text-white/40 tracking-wider font-code uppercase">
                        ✦ {FONT_INFO_MAP[post.fontChoice]?.name}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Bar */}
              <div className="px-3 py-2 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-white/70">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all active:scale-90 cursor-pointer ${
                      post.liked
                        ? 'text-pink-400 bg-pink-500/15'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    aria-label={post.liked ? 'Unlike post' : 'Like post'}
                  >
                    <Heart className={`w-4 h-4 ${post.liked ? 'fill-pink-400' : ''}`} />
                    <span>{post.likes}</span>
                  </button>

                  <button
                    onClick={() => {
                      const updatedPosts = posts.map((p) =>
                        p.id === post.id ? { ...p, commentsOpen: !p.commentsOpen } : p
                      );
                      // Handled through comment drawer toggle
                      post.commentsOpen = !post.commentsOpen;
                      onLikeComment(post.id, ''); // triggers reactive refresh
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Toggle comments"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments.length}</span>
                  </button>

                  <button
                    onClick={() => onSharePost(post)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Chia sẻ bài viết"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Chia sẻ</span>
                  </button>
                </div>

                <button
                  onClick={() => onSavePost(post.id)}
                  className={`p-2 rounded-full transition-all active:scale-90 cursor-pointer ${
                    post.saved
                      ? 'text-amber-300 bg-amber-400/15'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  aria-label={post.saved ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}
                >
                  <Bookmark className={`w-4 h-4 ${post.saved ? 'fill-amber-300' : ''}`} />
                </button>
              </div>

              {/* Comments Section */}
              {post.commentsOpen && (
                <div className="p-4 pt-2 border-t border-white/10 bg-black/15">
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {post.comments.length === 0 ? (
                      <p className="text-center text-[11.5px] text-white/40 py-2">
                        Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                      </p>
                    ) : (
                      post.comments.map((comment) => {
                        const commenter = getPerson(comment.personId);
                        return (
                          <div key={comment.id} className="flex items-start gap-2.5 text-xs group">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 mt-0.5 overflow-hidden"
                              style={{ background: commenter.avatarGradient }}
                            >
                              {commenter.avatarUrl ? (
                                <img src={commenter.avatarUrl} alt={commenter.name} className="w-full h-full object-cover" />
                              ) : (
                                commenter.emoji
                              )}
                            </div>
                            <div className="flex-1 glass rounded-2xl px-3 py-2 border border-white/10">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="font-bold text-white text-[11.5px]">
                                  {commenter.name.split(' ')[0]}
                                </span>
                                <span className="text-[10px] text-white/40">{comment.time}</span>
                              </div>
                              <p className="text-white/80 leading-relaxed text-[11.5px]">{comment.text}</p>
                            </div>
                            <button
                              onClick={() => onLikeComment(post.id, comment.id)}
                              className={`p-1 mt-1 rounded-full transition-transform active:scale-90 ${
                                comment.liked ? 'text-pink-400' : 'text-white/30 hover:text-white/70'
                              }`}
                              title="Like comment"
                            >
                              <Heart className={`w-3 h-3 ${comment.liked ? 'fill-pink-400' : ''}`} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Add Comment Input */}
                  <form
                    onSubmit={(e) => handleCommentSubmit(post.id, e)}
                    className="flex items-center gap-2 mt-3"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 overflow-hidden"
                      style={{ background: user.avatarGradient }}
                    >
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.emoji
                      )}
                    </div>
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      placeholder="Viết bình luận của bạn..."
                      className="flex-1 glass rounded-full px-3.5 py-1.5 text-xs text-white placeholder-white/40 border border-white/15 outline-none focus:border-purple-400 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!commentInputs[post.id]?.trim()}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}
            </article>
          );
        })
      )}
    </div>
  );
};
