import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Layers,
  GraduationCap,
  MessageCircle,
  Briefcase,
  Music,
  CreditCard,
  Palette,
  ArrowUpRight
} from 'lucide-react';
import { MiniAppInfo, MiniAppCategory } from '../types';
import { ALL_MINI_APPS } from '../data/initialData';

interface CamHubViewProps {
  onOpenMiniApp: (appId: string) => void;
}

export const CamHubView: React.FC<CamHubViewProps> = ({ onOpenMiniApp }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: Array<{ id: string; label: string; icon: React.ReactNode }> = [
    { id: 'all', label: 'Tất cả (35+ Apps)', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'social', label: 'Mạng xã hội & Chat', icon: <MessageCircle className="w-3.5 h-3.5" /> },
    { id: 'study_ai', label: 'Học tập & Cẩm AI', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'utilities', label: 'Tiện ích & Văn phòng', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'finance', label: 'Tài chính & Ví CẩmPay', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'entertainment', label: 'Giải trí & Thể thao', icon: <Music className="w-3.5 h-3.5" /> },
    { id: 'creative', label: 'Sáng tạo & Studio', icon: <Palette className="w-3.5 h-3.5" /> }
  ];

  const filteredApps = ALL_MINI_APPS.filter((app) => {
    const matchesCat = selectedCategory === 'all' || app.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      app.name.toLowerCase().includes(query) ||
      app.vietnameseName.toLowerCase().includes(query) ||
      app.description.toLowerCase().includes(query) ||
      app.inspiredBy.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 flex flex-col gap-5 pb-24">
      {/* Banner: THPT Cẩm Bình App Hub */}
      <div className="liquid-glass rounded-[32px] p-6 shadow-xl border border-white/20 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-pink-500/20 via-purple-500/15 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-white/60 font-medium mb-1">
              Trường THPT Cẩm Bình
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Trường Cẩm Hub
            </h1>
            <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-lg leading-relaxed">
              Các tiện ích học tập, mạng xã hội, trợ lý Cẩm AI, căng-tin và bản đồ trường dành cho học sinh Cẩm Bình.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <div className="liquid-glass-subtle rounded-2xl px-4 py-2.5 text-center border border-white/15">
              <div className="text-base font-bold text-white">35+</div>
              <div className="text-[10px] text-white/60 font-medium uppercase">Ứng dụng</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col gap-3">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Tìm kiếm ứng dụng, công cụ học tập..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl liquid-glass-subtle border border-white/20 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-pink-400/80 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-white/60 hover:text-white bg-white/10 px-2 py-0.5 rounded-full"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Categories Bar: Transparent iOS Liquid Glass Toggle Menu */}
        <div className="overflow-x-auto no-scrollbar py-1">
          <div className="ios-toggle-menu">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`ios-toggle-item ${isActive ? 'ios-toggle-active' : ''}`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            onClick={() => onOpenMiniApp(app.id)}
            className="group liquid-glass-subtle rounded-3xl p-3.5 border border-white/15 hover:border-pink-400/50 hover:bg-white/15 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-lg relative overflow-hidden"
          >
            {/* Top Row: Squircle App Icon & Badge */}
            <div className="flex items-start justify-between gap-2">
              <div
                className="w-12 h-12 rounded-[22%] p-0.5 shadow-xl flex items-center justify-center text-xl transition-transform group-hover:scale-110 relative"
                style={{
                  background: app.iconBg,
                  boxShadow: '0 8px 20px -4px rgba(0, 0, 0, 0.4), inset 0 1.5px 0.5px rgba(255, 255, 255, 0.6)'
                }}
              >
                <div className="w-full h-full rounded-[21%] flex items-center justify-center">
                  {app.iconEmoji}
                </div>
                {/* Specular gloss overlay */}
                <div className="absolute inset-0 rounded-[22%] bg-gradient-to-b from-white/30 via-transparent to-black/20 pointer-events-none" />
              </div>

              {app.badge ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/30 text-pink-300 border border-pink-400/40 shadow-sm shrink-0">
                  {app.badge}
                </span>
              ) : (
                <span className="text-[10px] text-white/40 group-hover:text-pink-300 font-code flex items-center gap-0.5">
                  Mở <ArrowUpRight className="w-2.5 h-2.5" />
                </span>
              )}
            </div>

            {/* App Details */}
            <div className="mt-3">
              <h3 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors truncate">
                {app.vietnameseName}
              </h3>
              <div className="text-[11px] font-semibold text-white/60 truncate mt-0.5">
                {app.name}
              </div>
              <p className="text-[11px] text-white/50 line-clamp-2 mt-1 leading-snug">
                {app.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredApps.length === 0 && (
        <div className="liquid-glass rounded-3xl p-10 text-center flex flex-col items-center justify-center text-white/60 gap-2 border border-white/15">
          <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />
          <p className="text-sm font-semibold text-white">Không tìm thấy ứng dụng phù hợp</p>
          <p className="text-xs text-white/50">Hãy thử tìm theo tên ứng dụng hoặc tính năng cần dùng.</p>
        </div>
      )}
    </div>
  );
};
