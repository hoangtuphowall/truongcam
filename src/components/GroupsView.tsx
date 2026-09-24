import React, { useState } from 'react';
import { Users, Plus, Check, Search, X, Sparkles, Compass } from 'lucide-react';
import { Group } from '../types';

interface GroupsViewProps {
  groups: Group[];
  onToggleJoin: (groupId: number) => void;
  onCreateGroup: (group: Omit<Group, 'id' | 'joined'>) => void;
}

export const GroupsView: React.FC<GroupsViewProps> = ({
  groups,
  onToggleJoin,
  onCreateGroup
}) => {
  const [tab, setTab] = useState<'joined' | 'discover'>('joined');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeGroupModal, setActiveGroupModal] = useState<Group | null>(null);

  // New group form state
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState<'School' | 'College' | 'Work' | 'Interest'>('Interest');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupAbout, setNewGroupAbout] = useState('');

  const categories = ['All', 'School', 'College', 'Work', 'Interest'];

  const filteredGroups = groups.filter((g) => {
    if (tab === 'joined' && !g.joined) return false;
    if (tab === 'discover' && g.joined) return false;
    if (selectedCategory !== 'All' && g.category !== selectedCategory) return false;
    if (
      searchQuery &&
      !g.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !g.desc.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !newGroupDesc.trim()) return;

    const gradients = [
      'linear-gradient(120deg, #7c6bff, #ff6bcb)',
      'linear-gradient(120deg, #38e6c5, #7c6bff)',
      'linear-gradient(120deg, #ffb84d, #ff6bcb)',
      'linear-gradient(120deg, #ff6bcb, #38e6c5)'
    ];

    onCreateGroup({
      name: newGroupName.trim(),
      desc: newGroupDesc.trim(),
      about: newGroupAbout.trim() || newGroupDesc.trim(),
      category: newGroupCategory,
      members: 1,
      grad: gradients[Math.floor(Math.random() * gradients.length)]
    });

    setNewGroupName('');
    setNewGroupDesc('');
    setNewGroupAbout('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 px-4 pb-24 max-w-2xl mx-auto">
      {/* Header & Create button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-display text-white">Nhóm & Câu Lạc Bộ Cẩm Bình</h1>
          <p className="text-xs text-white/50">Không gian học tập, hoạt động phong trào và sở thích</p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-xs font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tạo nhóm mới</span>
        </button>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-2xl glass border border-white/15">
        <button
          onClick={() => setTab('joined')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'joined'
              ? 'bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-white shadow'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Nhóm của tôi ({groups.filter((g) => g.joined).length})
        </button>
        <button
          onClick={() => setTab('discover')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'discover'
              ? 'bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-white shadow'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Khám phá nhóm ({groups.filter((g) => !g.joined).length})
        </button>
      </div>

      {/* Search & Category Pills */}
      <div className="flex flex-col gap-2.5">
        <div className="glass rounded-full px-4 py-2.5 flex items-center gap-2.5 border border-white/20">
          <Search className="w-4 h-4 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm nhóm hoặc câu lạc bộ..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-white/40 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const catNames: Record<string, string> = {
              All: 'Tất cả',
              School: 'Khối lớp & Trường',
              College: 'Đoàn trường',
              Work: 'Ban cán sự',
              Interest: 'Câu lạc bộ'
            };
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-[#150d26] font-bold shadow'
                    : 'glass text-white/70 hover:text-white border border-white/15'
                }`}
              >
                {catNames[cat] || cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Circles Grid */}
      <div className="space-y-3">
        {filteredGroups.length === 0 ? (
          <div className="glass-card rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-2 text-white/50 text-xs">
            <Compass className="w-8 h-8 text-purple-400/80 mb-1" />
            <p className="font-semibold text-white">Không tìm thấy nhóm phù hợp</p>
            <p>
              {tab === 'joined'
                ? "Bạn chưa tham gia nhóm nào trong mục này. Chuyển sang Khám phá để tham gia thêm nhé!"
                : 'Hãy thử tìm kiếm với từ khóa khác hoặc tạo một nhóm mới cho lớp của bạn.'}
            </p>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <div
              key={group.id}
              onClick={() => setActiveGroupModal(group)}
              className="glass-card rounded-3xl overflow-hidden border border-white/20 hover:border-white/35 transition-all shadow-md cursor-pointer group"
            >
              {/* Banner with gradient */}
              <div
                className="h-20 sm:h-24 w-full relative p-3.5 flex items-end justify-between"
                style={{ background: group.grad }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-md">
                  {group.category}
                </span>
                <span className="text-[11px] font-semibold text-white/90 bg-black/30 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                  {group.members} thành viên
                </span>
              </div>

              {/* Body */}
              <div className="p-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-pink-300 transition-colors">
                    {group.name}
                  </h3>
                  <p className="text-xs text-white/60 mt-1 line-clamp-2 leading-relaxed">
                    {group.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleJoin(group.id);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    group.joined
                      ? 'glass text-white/80 hover:text-rose-400 hover:border-rose-400/40 border border-white/20'
                      : 'bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-white shadow-md active:scale-95'
                  }`}
                >
                  {group.joined ? 'Đã tham gia ✓' : 'Tham gia'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Circle Info & Discussion Modal */}
      {activeGroupModal && (
        <div
          className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setActiveGroupModal(null)}
        >
          <div
            className="w-full max-w-md glass-strong rounded-3xl border border-white/25 shadow-2xl overflow-hidden"
            style={{ background: 'rgba(21, 13, 38, 0.95)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-28 relative p-4 flex items-end" style={{ background: activeGroupModal.grad }}>
              <button
                onClick={() => setActiveGroupModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-lg font-bold text-white drop-shadow">{activeGroupModal.name}</h3>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Nhóm {activeGroupModal.category}</span>
                <span>{activeGroupModal.members} thành viên</span>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-white/50 tracking-wider mb-1">Giới thiệu</h4>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  {activeGroupModal.about || activeGroupModal.desc}
                </p>
              </div>

              <div className="p-3 rounded-2xl glass border border-white/10 text-xs">
                <span className="font-bold text-pink-300 block mb-0.5">Nội quy nhóm:</span>
                <p className="text-white/60">
                  Giao lưu văn minh, hỗ trợ nhau trong học tập, chia sẻ thông tin hữu ích và tôn trọng lẫn nhau.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    onToggleJoin(activeGroupModal.id);
                    setActiveGroupModal((prev) => (prev ? { ...prev, joined: !prev.joined } : null));
                  }}
                  className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all ${
                    activeGroupModal.joined
                      ? 'glass text-white/80 hover:text-rose-400 border border-white/20'
                      : 'bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-white shadow-lg'
                  }`}
                >
                  {activeGroupModal.joined ? 'Rời nhóm' : 'Tham gia nhóm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Circle Modal */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="w-full max-w-md glass-strong rounded-3xl border border-white/25 shadow-2xl p-5"
            style={{ background: 'rgba(21, 13, 38, 0.95)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white">Tạo Nhóm / Câu Lạc Bộ Mới</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-7 h-7 rounded-full glass flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-white/70 block mb-1">Tên Nhóm / CLB</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Ví dụ: CLB Sách & Văn Học Cẩm Bình"
                  className="w-full glass rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 border border-white/20 outline-none focus:border-purple-400"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/70 block mb-1">Phân loại</label>
                <select
                  value={newGroupCategory}
                  onChange={(e) => setNewGroupCategory(e.target.value as any)}
                  className="w-full glass rounded-xl px-3.5 py-2 text-xs text-white border border-white/20 outline-none focus:border-purple-400"
                  style={{ background: '#1c1330' }}
                >
                  <option value="School">Khối lớp & Trường</option>
                  <option value="College">Đoàn thanh niên</option>
                  <option value="Work">Ban cán sự</option>
                  <option value="Interest">Câu lạc bộ sở thích</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/70 block mb-1">Mô tả ngắn</label>
                <input
                  type="text"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="Mục đích hoặc hoạt động chính của nhóm là gì?"
                  className="w-full glass rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 border border-white/20 outline-none focus:border-purple-400"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/70 block mb-1">Nội dung chi tiết (không bắt buộc)</label>
                <textarea
                  value={newGroupAbout}
                  onChange={(e) => setNewGroupAbout(e.target.value)}
                  rows={2}
                  placeholder="Lịch sinh hoạt, dự án sắp tới hoặc cách thức tham gia..."
                  className="w-full glass rounded-xl p-3 text-xs text-white placeholder-white/40 border border-white/20 outline-none focus:border-purple-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-full glass text-xs font-semibold text-white/70 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!newGroupName.trim() || !newGroupDesc.trim()}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] disabled:opacity-40 text-xs font-bold text-white shadow-md active:scale-95"
                >
                  Tạo nhóm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
