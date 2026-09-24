import React from 'react';
import { Home, Compass, Film, MessageCircle, Users, UserPlus, User, LayoutGrid, Sparkles } from 'lucide-react';
import { ScreenType } from '../types';

interface NavigationProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  unreadChatsCount: number;
  friendRequestsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentScreen,
  onSelectScreen,
  unreadChatsCount,
  friendRequestsCount
}) => {
  const navItems: Array<{ id: ScreenType; label: string; shortLabel: string; icon: React.ReactNode; badge?: number | string }> = [
    {
      id: 'home',
      label: 'Bảng Tin',
      shortLabel: 'Bản tin',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'apps',
      label: 'Cẩm Hub',
      shortLabel: 'Cẩm Hub',
      icon: <LayoutGrid className="w-5 h-5" />,
      badge: '35+'
    },
    {
      id: 'reels',
      label: 'Cẩm Shorts',
      shortLabel: 'Shorts',
      icon: <Film className="w-5 h-5" />
    },
    {
      id: 'chats',
      label: 'Tin Nhắn',
      shortLabel: 'Nhắn tin',
      icon: <MessageCircle className="w-5 h-5" />,
      badge: unreadChatsCount > 0 ? unreadChatsCount : undefined
    },
    {
      id: 'groups',
      label: 'Chi Đoàn & CLB',
      shortLabel: 'Chi đoàn',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'friends',
      label: 'Bạn Bè Cẩm Bình',
      shortLabel: 'Bạn bè',
      icon: <UserPlus className="w-5 h-5" />,
      badge: friendRequestsCount > 0 ? friendRequestsCount : undefined
    },
    {
      id: 'profile',
      label: 'Hồ Sơ & Thẻ CẩmID',
      shortLabel: 'Hồ sơ',
      icon: <User className="w-5 h-5" />
    }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 p-4 shrink-0 liquid-glass border-r border-white/20 h-[calc(100vh-65px)] sticky top-[65px]">
        <div className="text-[11px] uppercase tracking-wider text-pink-300/80 font-bold px-3 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>THPT Cẩm Bình Hub</span>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectScreen(item.id)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-2xl font-semibold text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white/20 text-white shadow-sm border border-white/25 backdrop-blur-md'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.07] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${isActive ? 'text-white' : 'text-white/70'}`}>{item.icon}</div>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-pink-500/80 text-white shadow-sm border border-white/20">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* School Info Widget */}
        <div className="p-3.5 rounded-3xl liquid-glass-subtle border border-white/20 text-xs text-white/80 mt-auto">
          <div className="font-bold text-white mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Trường THPT Cẩm Bình
          </div>
          <p className="text-[11px] leading-relaxed text-white/60">
            Xã Cẩm Bình, huyện Cẩm Xuyên, Hà Tĩnh. Tự hào truyền thống dạy tốt, học tốt.
          </p>
        </div>
      </aside>

      {/* Mobile iOS Floating Bottom Dock */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-2 pb-[max(8px,env(safe-area-inset-bottom))] flex justify-center pointer-events-none"
        aria-label="Mobile Navigation"
      >
        <div
          className="pointer-events-auto w-full max-w-lg rounded-[30px] p-1.5 flex items-center justify-around border border-white/20"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(30px) saturate(190%)',
            WebkitBackdropFilter: 'blur(30px) saturate(190%)',
            boxShadow: '0 12px 36px -8px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.25)'
          }}
        >
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectScreen(item.id)}
                className={`relative min-w-[46px] min-h-[46px] px-1 py-1 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isActive ? 'text-white' : 'text-white/60 hover:text-white/90'
                }`}
                aria-label={item.label}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-white/20 backdrop-blur-md border border-white/25 shadow-sm" />
                )}
                <div className="relative z-10 flex flex-col items-center gap-0.5">
                  <div className={isActive ? 'text-white scale-105 transition-transform' : ''}>
                    {item.icon}
                  </div>
                  <span className="text-[9.5px] font-medium tracking-tight">{item.shortLabel}</span>
                </div>
                {item.badge && (
                  <span className="absolute top-0.5 right-1 min-w-[16px] h-[16px] px-1 bg-pink-500/90 text-[9px] font-bold text-white rounded-full flex items-center justify-center border border-white/20 shadow-sm">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
