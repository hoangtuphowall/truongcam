import React, { useState } from 'react';
import { Search, X, Users, MessageCircle, FileText, ArrowRight } from 'lucide-react';
import { Person, Group, Post } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  people: Person[];
  groups: Group[];
  posts: Post[];
  onSelectPerson: (personId: number) => void;
  onSelectGroup: (groupId: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  people,
  groups,
  posts,
  onSelectPerson,
  onSelectGroup
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'people' | 'groups' | 'posts'>('all');

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedPeople = q
    ? people.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.handle.toLowerCase().includes(q) ||
          p.school.toLowerCase().includes(q)
      )
    : people.slice(0, 4);

  const matchedGroups = q
    ? groups.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.desc.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q)
      )
    : groups.slice(0, 3);

  const matchedPosts = q
    ? posts.filter((p) => p.text.toLowerCase().includes(q))
    : [];

  return (
    <div
      className="fixed inset-0 z-[280] bg-black/70 backdrop-blur-md flex items-start justify-center p-4 pt-16 sm:pt-20 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl glass-strong rounded-3xl border border-white/25 shadow-2xl p-5 overflow-hidden animate-in zoom-in-95 duration-200"
        style={{ background: 'rgba(21, 13, 38, 0.95)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 pb-3 border-b border-white/10">
          <Search className="w-5 h-5 text-purple-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm bạn bè, chi đoàn, câu lạc bộ, bài viết..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-white/50 hover:text-white"
            >
              Xóa
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full glass flex items-center justify-center text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 py-3">
          {(
            [
              { id: 'all', label: 'Tất cả' },
              { id: 'people', label: 'Bạn bè' },
              { id: 'groups', label: 'Nhóm & CLB' },
              { id: 'posts', label: 'Bài viết' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-white shadow-sm'
                  : 'glass text-white/60 hover:text-white border border-white/15'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1 py-1">
          {/* People Section */}
          {(activeTab === 'all' || activeTab === 'people') && matchedPeople.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2 px-1">
                Thành viên & Bạn bè
              </div>
              <div className="space-y-1.5">
                {matchedPeople.map((person) => (
                  <div
                    key={person.id}
                    onClick={() => {
                      onSelectPerson(person.id);
                      onClose();
                    }}
                    className="glass rounded-2xl p-2.5 flex items-center justify-between gap-3 hover:bg-white/10 cursor-pointer border border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white border border-white/20 shrink-0"
                        style={{ background: person.avatarGradient }}
                      >
                        {person.emoji}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">
                          {person.name}
                        </span>
                        <span className="text-[11px] text-white/50 block truncate">
                          {person.handle} · {person.school}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/40 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Groups Section */}
          {(activeTab === 'all' || activeTab === 'groups') && matchedGroups.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2 px-1">
                Chi đoàn & Câu lạc bộ
              </div>
              <div className="space-y-1.5">
                {matchedGroups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => {
                      onSelectGroup(group.id);
                      onClose();
                    }}
                    className="glass rounded-2xl p-2.5 flex items-center justify-between gap-3 hover:bg-white/10 cursor-pointer border border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                        style={{ background: group.grad }}
                      >
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">
                          {group.name}
                        </span>
                        <span className="text-[11px] text-white/50 block truncate">
                          {group.members} thành viên · {group.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full glass font-semibold text-white/70">
                      {group.joined ? 'Đã tham gia' : 'Tham gia'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posts Section */}
          {(activeTab === 'all' || activeTab === 'posts') && matchedPosts.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2 px-1">
                Bài viết & Thảo luận
              </div>
              <div className="space-y-1.5">
                {matchedPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={onClose}
                    className="glass rounded-2xl p-3 hover:bg-white/10 cursor-pointer border border-white/10 transition-colors"
                  >
                    <p className="text-xs text-white/90 line-clamp-2 leading-relaxed">
                      {post.text}
                    </p>
                    <span className="text-[10px] text-purple-300 font-medium block mt-1.5">
                      {post.time} · {post.likes} lượt thích
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {q && matchedPeople.length === 0 && matchedGroups.length === 0 && matchedPosts.length === 0 && (
            <div className="p-8 text-center text-white/50 text-xs">
              Không tìm thấy kết quả phù hợp cho &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
