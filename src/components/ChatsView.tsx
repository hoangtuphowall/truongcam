import React, { useState } from 'react';
import { Search, Users, Sparkles } from 'lucide-react';
import { Chat, Person } from '../types';

interface ChatsViewProps {
  chats: Chat[];
  people: Person[];
  onSelectChat: (chatId: number | string) => void;
}

export const ChatsView: React.FC<ChatsViewProps> = ({ chats, people, onSelectChat }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getPerson = (id?: number) => (id ? people.find((p) => p.id === id) : null);

  const filteredChats = chats.filter((c) => {
    if (c.isGroup) {
      return (c.groupName || '').toLowerCase().includes(searchQuery.toLowerCase());
    }
    const person = getPerson(c.personId);
    return person?.name.toLowerCase().includes(searchQuery.toLowerCase()) || false;
  });

  return (
    <div className="flex flex-col gap-4 px-4 pb-24 max-w-2xl mx-auto">
      {/* Header & Search */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-display text-white">Tin Nhắn Trực Tiếp & Lớp Học</h1>
          <span className="text-xs text-white/50">{chats.length} cuộc trò chuyện</span>
        </div>

        <div className="glass rounded-full px-4 py-2.5 flex items-center gap-2.5 border border-white/20">
          <Search className="w-4 h-4 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm cuộc trò chuyện hoặc bạn bè..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-white/40 outline-none"
          />
        </div>
      </div>

      {/* Chats List */}
      <div className="space-y-2">
        {filteredChats.length === 0 ? (
          <div className="glass-card rounded-3xl p-8 text-center text-white/50 text-xs">
            Không tìm thấy cuộc trò chuyện phù hợp &ldquo;{searchQuery}&rdquo;
          </div>
        ) : (
          filteredChats.map((chat) => {
            const isGroup = chat.isGroup;
            const person = getPerson(chat.personId);
            const lastMsg = chat.msgs[chat.msgs.length - 1];

            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className="glass-card rounded-2xl p-3.5 flex items-center gap-3.5 cursor-pointer hover:border-white/35 active:scale-[0.99] transition-all border border-white/15"
              >
                {/* Avatar with status indicator */}
                <div className="relative shrink-0">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow border border-white/25"
                    style={{
                      background: isGroup
                        ? 'linear-gradient(135deg, #38e6c5, #7c6bff)'
                        : person?.avatarGradient || 'linear-gradient(135deg, #ff6bcb, #7c6bff)'
                    }}
                  >
                    {isGroup ? <Users className="w-5 h-5 text-white" /> : person?.emoji || '✦'}
                  </div>

                  {!isGroup && person?.online && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#150d26] shadow-sm" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className="text-sm font-bold text-white truncate leading-tight">
                      {isGroup ? chat.groupName : person?.name}
                    </h3>
                    <span className="text-[11px] text-white/40 shrink-0">
                      {lastMsg?.time || 'Recently'}
                    </span>
                  </div>

                  <p className="text-xs text-white/60 truncate leading-relaxed">
                    {lastMsg ? (
                      <>
                        {lastMsg.me ? (
                          <span className="text-purple-300 font-medium mr-1">You:</span>
                        ) : isGroup && lastMsg.personId ? (
                          <span className="text-pink-300 font-medium mr-1">
                            {getPerson(lastMsg.personId)?.name.split(' ')[0]}:
                          </span>
                        ) : null}
                        {lastMsg.img ? '📷 Photo attachment' : lastMsg.text}
                      </>
                    ) : (
                      'No messages yet'
                    )}
                  </p>
                </div>

                {/* Unread badge */}
                {chat.unread > 0 && (
                  <span className="min-w-[20px] h-[20px] px-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-[11px] font-bold text-white flex items-center justify-center shadow shrink-0">
                    {chat.unread}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
