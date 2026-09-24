import React, { useState } from 'react';
import { Search, Bell, CheckCheck, SlidersHorizontal, Sparkles, Music } from 'lucide-react';
import { NotificationItem, Person } from '../types';

interface TopBarProps {
  onOpenSearch: () => void;
  notifications: NotificationItem[];
  people: Person[];
  onMarkNotificationsRead: () => void;
  onNavigateToScreen: (screen: any) => void;
  onOpenControlCenter?: () => void;
  onOpenMusic?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenSearch,
  notifications,
  people,
  onMarkNotificationsRead,
  onNavigateToScreen,
  onOpenControlCenter,
  onOpenMusic
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getPerson = (id: number) => people.find((p) => p.id === id);

  return (
    <header className="sticky top-0 z-30 px-3 sm:px-4 py-2.5 backdrop-blur-2xl bg-white/[0.07] border-b border-white/[0.14] flex items-center justify-between transition-colors shadow-sm">
      {/* Brand Zone */}
      <button
        onClick={() => onNavigateToScreen('home')}
        className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 rounded-2xl p-1"
        aria-label="Trường Cẩm Trang Chủ"
      >
        <div
          className="w-9 h-9 rounded-[24%] p-0.5 flex items-center justify-center text-white text-base font-bold shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #ff007f 0%, #7928ca 50%, #0070f3 100%)',
            boxShadow: '0 8px 20px -4px rgba(255, 0, 127, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.6)'
          }}
        >
          <img src="/images/brand/logo.svg" alt="Trường Cẩm Logo" className="w-full h-full object-cover rounded-[22%]" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base sm:text-lg text-white leading-tight flex items-center gap-1">
            Trường Cẩm
          </span>
          <span className="text-[10px] text-pink-300/80 tracking-wide font-medium mt-0.5">
            THPT Cẩm Bình · Hà Tĩnh
          </span>
        </div>
      </button>

      {/* Action Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 relative">
        {/* Control Center Button */}
        {onOpenControlCenter && (
          <button
            onClick={onOpenControlCenter}
            className="w-9 h-9 rounded-2xl liquid-glass-subtle flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 active:scale-95 transition-all border border-white/20 cursor-pointer"
            aria-label="Trung tâm điều khiển"
            title="Trung tâm điều khiển"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          </button>
        )}

        {/* CẩmMusic Mini Button */}
        {onOpenMusic && (
          <button
            onClick={onOpenMusic}
            className="w-9 h-9 rounded-2xl liquid-glass-subtle flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 active:scale-95 transition-all border border-white/20 cursor-pointer"
            aria-label="CẩmMusic"
            title="CẩmMusic - Nghe nhạc học tập"
          >
            <Music className="w-4 h-4 text-pink-400" />
          </button>
        )}

        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="w-9 h-9 rounded-2xl liquid-glass-subtle flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 active:scale-95 transition-all border border-white/20 cursor-pointer"
          aria-label="Tìm kiếm trên Trường Cẩm"
          title="Tìm bạn bè, bài viết, tài liệu trường..."
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-2xl liquid-glass-subtle flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 active:scale-95 transition-all border border-white/20 relative cursor-pointer"
            aria-label="Thông báo"
            title="Thông báo học đường"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-gradient-to-r from-pink-500 to-rose-500 text-[9.5px] font-black text-white rounded-full flex items-center justify-center border-2 border-[#150d26] animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl border border-white/25 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
              style={{
                background: 'rgba(20, 15, 35, 0.75)',
                backdropFilter: 'blur(36px) saturate(190%)',
                WebkitBackdropFilter: 'blur(36px) saturate(190%)'
              }}
            >
              <div className="p-3.5 border-b border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">Thông Báo Học Đường</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/30 text-pink-300 font-bold border border-pink-400/30">
                      {unreadCount} mới
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkNotificationsRead}
                    className="text-xs text-pink-300 hover:text-pink-200 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Đã đọc tất cả
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-white/10 no-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-white/50 text-xs">Hiện không có thông báo mới</div>
                ) : (
                  notifications.map((n) => {
                    const person = getPerson(n.personId);
                    return (
                      <div
                        key={n.id}
                        className={`p-3.5 flex items-start gap-3 hover:bg-white/10 transition-colors cursor-pointer ${
                          !n.read ? 'bg-pink-500/10' : ''
                        }`}
                        onClick={() => {
                          setShowNotifications(false);
                          if (n.type === 'friend') onNavigateToScreen('friends');
                          else if (n.type === 'like' || n.type === 'comment') onNavigateToScreen('home');
                        }}
                      >
                        <div
                          className="w-9 h-9 rounded-2xl flex items-center justify-center text-sm shrink-0 font-bold border border-white/20 shadow overflow-hidden"
                          style={{ background: person?.avatarGradient || 'linear-gradient(135deg, #7c6bff, #ff6bcb)' }}
                        >
                          {person?.avatarUrl ? (
                            <img src={person.avatarUrl} alt={person.name} className="w-full h-full object-cover" />
                          ) : (
                            person?.emoji || '✦'
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white/90 leading-relaxed">
                            <span className="font-bold text-white mr-1">{person?.name || 'Ai đó'}</span>
                            {n.action}
                          </p>
                          <span className="text-[10px] text-white/40 mt-1 block font-mono">{n.time}</span>
                        </div>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 shrink-0" />}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
