import React, { useState } from 'react';
import { Search, MessageCircle, UserPlus, Check, X, Users, Sparkles } from 'lucide-react';
import { Person, FriendRequest } from '../types';

interface FriendsViewProps {
  friendsAllIds: number[];
  friendRequests: FriendRequest[];
  friendSuggestions: Array<{ id: number; mutual: number }>;
  people: Person[];
  onAcceptRequest: (personId: number) => void;
  onDeclineRequest: (personId: number) => void;
  onAddSuggestion: (personId: number) => void;
  onOpenDirectChat: (personId: number) => void;
  onSelectPerson?: (personId: number) => void;
}

export const FriendsView: React.FC<FriendsViewProps> = ({
  friendsAllIds,
  friendRequests,
  friendSuggestions,
  people,
  onAcceptRequest,
  onDeclineRequest,
  onAddSuggestion,
  onOpenDirectChat,
  onSelectPerson
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'requests' | 'suggestions'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getPerson = (id: number) => people.find((p) => p.id === id);

  const friends = friendsAllIds
    .map(getPerson)
    .filter((p): p is Person => p !== undefined)
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.handle.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const requests = friendRequests
    .map((r) => ({ ...r, person: getPerson(r.id) }))
    .filter((r) => r.person !== undefined)
    .filter(
      (r) =>
        r.person!.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.person!.handle.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const suggestions = friendSuggestions
    .map((s) => ({ ...s, person: getPerson(s.id) }))
    .filter((s) => s.person !== undefined)
    .filter(
      (s) =>
        s.person!.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.person!.handle.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="flex flex-col gap-4 px-4 pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold font-display text-white">Bạn Bè & Kết Nối Cẩm Bình</h1>
        <p className="text-xs text-white/50">Danh sách bạn bè các lớp, chi đoàn và câu lạc bộ</p>
      </div>

      {/* Search Input */}
      <div className="glass rounded-full px-4 py-2.5 flex items-center gap-2.5 border border-white/20">
        <Search className="w-4 h-4 text-white/50" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm bạn theo tên hoặc tài khoản..."
          className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-white/40 outline-none"
        />
      </div>

      {/* Segmented Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl glass border border-white/15">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-white shadow'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Tất cả bạn bè ({friendsAllIds.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'requests'
              ? 'bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-white shadow'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <span>Lời mời kết bạn</span>
          {friendRequests.length > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-pink-500 text-white">
              {friendRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'suggestions'
              ? 'bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-white shadow'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Gợi ý ({friendSuggestions.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-2.5">
        {/* All Friends List */}
        {activeTab === 'all' && (
          <>
            {friends.length === 0 ? (
              <div className="glass-card rounded-3xl p-8 text-center text-white/50 text-xs">
                Không tìm thấy người bạn nào phù hợp với tìm kiếm.
              </div>
            ) : (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  className="glass-card rounded-2xl p-3.5 flex items-center justify-between gap-3 border border-white/15 hover:border-white/30 transition-all"
                >
                  <div
                    className="flex items-center gap-3 min-w-0 cursor-pointer group"
                    onClick={() => onSelectPerson && onSelectPerson(friend.id)}
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold text-white border border-white/20 shadow shrink-0 group-hover:scale-105 transition-transform"
                      style={{ background: friend.avatarGradient }}
                    >
                      {friend.emoji}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate leading-tight group-hover:underline">
                        {friend.name}
                      </h3>
                      <p className="text-[11px] text-white/50 truncate mt-0.5">
                        {friend.handle} · {friend.school}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenDirectChat(friend.id)}
                    className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/80 hover:text-white hover:bg-purple-500/20 hover:border-purple-400/40 border border-white/20 transition-all shrink-0 cursor-pointer"
                    title="Nhắn tin"
                    aria-label={`Nhắn tin cho ${friend.name}`}
                  >
                    <MessageCircle className="w-4 h-4 text-purple-300" />
                  </button>
                </div>
              ))
            )}
          </>
        )}

        {/* Pending Friend Requests */}
        {activeTab === 'requests' && (
          <>
            {requests.length === 0 ? (
              <div className="glass-card rounded-3xl p-8 text-center text-white/50 text-xs flex flex-col items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-pink-400/70" />
                <p className="font-semibold text-white">Không có lời mời nào đang chờ</p>
                <p>Bạn đã xử lý hết các lời mời kết bạn mới!</p>
              </div>
            ) : (
              requests.map(({ id, mutual, person }) => (
                <div
                  key={id}
                  className="glass-card rounded-2xl p-3.5 flex items-center justify-between gap-3 border border-white/15"
                >
                  <div
                    className="flex items-center gap-3 min-w-0 cursor-pointer group"
                    onClick={() => onSelectPerson && onSelectPerson(person!.id)}
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold text-white border border-white/20 shadow shrink-0 group-hover:scale-105 transition-transform"
                      style={{ background: person!.avatarGradient }}
                    >
                      {person!.emoji}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate leading-tight group-hover:underline">
                        {person!.name}
                      </h3>
                      <p className="text-[11px] text-white/50 truncate mt-0.5">
                        {mutual} bạn chung · {person!.school.split('·')[0]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onAcceptRequest(id)}
                      className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-xs font-bold text-white shadow active:scale-95 cursor-pointer"
                    >
                      Đồng ý
                    </button>
                    <button
                      onClick={() => onDeclineRequest(id)}
                      className="px-3 py-1.5 rounded-full glass text-xs font-semibold text-white/60 hover:text-white border border-white/15 cursor-pointer"
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* Friend Suggestions */}
        {activeTab === 'suggestions' && (
          <>
            {suggestions.length === 0 ? (
              <div className="glass-card rounded-3xl p-8 text-center text-white/50 text-xs">
                Chưa có gợi ý kết bạn mới lúc này.
              </div>
            ) : (
              suggestions.map(({ id, mutual, person }) => (
                <div
                  key={id}
                  className="glass-card rounded-2xl p-3.5 flex items-center justify-between gap-3 border border-white/15"
                >
                  <div
                    className="flex items-center gap-3 min-w-0 cursor-pointer group"
                    onClick={() => onSelectPerson && onSelectPerson(person!.id)}
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold text-white border border-white/20 shadow shrink-0 group-hover:scale-105 transition-transform"
                      style={{ background: person!.avatarGradient }}
                    >
                      {person!.emoji}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate leading-tight group-hover:underline">
                        {person!.name}
                      </h3>
                      <p className="text-[11px] text-white/50 truncate mt-0.5">
                        {mutual} bạn chung · {person!.school}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onAddSuggestion(id)}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-xs font-bold text-white shadow active:scale-95 cursor-pointer shrink-0"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Kết bạn</span>
                  </button>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};
