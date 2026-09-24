import React, { useState } from 'react';
import {
  X,
  Newspaper,
  Flame,
  Activity,
  Trophy,
  CloudSun,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface CamNewsFitnessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CamNewsFitnessModal: React.FC<CamNewsFitnessModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'news' | 'strava'>('news');
  const [userSteps, setUserSteps] = useState(6450);

  if (!isOpen) return null;

  const newsItems = [
    {
      id: 'n1',
      title: 'Học sinh THPT Cẩm Bình giành giải Nhì cuộc thi Khoa học Kỹ thuật cấp Tỉnh Hà Tĩnh',
      time: '2 giờ trước',
      source: 'Bản Tin Cẩm Bình',
      snippet: 'Dự án "Thiết bị số hỗ trợ học tập cho học sinh nông thôn" được ban giám khảo đánh giá cao về tính thực tiễn.'
    },
    {
      id: 'n2',
      title: 'Bộ GD&ĐT công bố đề minh họa kỳ thi tốt nghiệp THPT năm 2026 với cấu trúc định hướng năng lực',
      time: '5 giờ trước',
      source: 'VnExpress Giáo Dục',
      snippet: 'Đề thi bám sát chương trình GDPT 2018, tăng cường câu hỏi thực tiễn và tư duy phân tích.'
    },
    {
      id: 'n3',
      title: 'Thời tiết Cẩm Xuyên hôm nay: Nắng nhẹ, nhiệt độ 26°C - Rất thuận lợi cho hội thao 26/3',
      time: 'Sáng nay',
      source: 'Thời Tiết Hà Tĩnh',
      snippet: 'Độ ẩm 65%, trời quang đãng suốt buổi sáng và chiều.'
    }
  ];

  const stravaLeaderboard = [
    { rank: 1, name: 'Trần Đức Nam (11A3)', km: '14.2 km', steps: 18500, emoji: '🥇' },
    { rank: 2, name: 'Hà Minh Tú (11A1)', km: '12.8 km', steps: 16400, emoji: '🥈' },
    { rank: 3, name: 'Vũ Minh Khang (12A1 - Bạn)', km: '6.5 km', steps: userSteps, emoji: '🥉' },
    { rank: 4, name: 'Lê Bảo Trâm (12A2)', km: '5.2 km', steps: 7200, emoji: '🏃' }
  ];

  const handleAddWalk = () => {
    setUserSteps((prev) => prev + 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl h-[90vh] max-h-[720px] liquid-glass rounded-[36px] shadow-2xl border border-white/35 text-white flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 px-5 border-b border-white/15 flex items-center justify-between liquid-glass-subtle shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[22%] bg-gradient-to-tr from-orange-600 to-rose-600 flex items-center justify-center text-white shadow-lg">
              {activeTab === 'news' ? <Newspaper className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-white">
                  {activeTab === 'news' ? 'Cẩm News' : 'Cẩm Runners'}
                </h2>
              </div>
              <p className="text-[11px] text-white/60">
                {activeTab === 'news' ? 'Điểm tin học đường Cẩm Bình & Giáo dục Hà Tĩnh' : 'CLB Rèn luyện thể lực & Đi bộ quanh sân trường'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Transparent Liquid Glass Tab Switch */}
        <div className="p-2.5 px-5 border-b border-white/10 flex justify-center shrink-0">
          <div className="ios-toggle-menu w-full">
            <button
              onClick={() => setActiveTab('news')}
              className={`ios-toggle-item flex-1 justify-center ${activeTab === 'news' ? 'ios-toggle-active' : ''}`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>Tin Tức Học Đường</span>
            </button>
            <button
              onClick={() => setActiveTab('strava')}
              className={`ios-toggle-item flex-1 justify-center ${activeTab === 'strava' ? 'ios-toggle-active' : ''}`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Rèn Luyện Thể Lực</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'news' ? (
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto flex flex-col gap-3 no-scrollbar">
            {newsItems.map((news) => (
              <div
                key={news.id}
                className="p-4 rounded-3xl liquid-glass-subtle border border-white/15 hover:border-orange-400/40 transition-all flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between text-[11px] text-orange-300 font-bold">
                  <span>{news.source}</span>
                  <span className="text-white/40 font-normal">{news.time}</span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">{news.title}</h3>
                <p className="text-[11px] text-white/70 leading-relaxed">{news.snippet}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 no-scrollbar">
            {/* Step Counter Card */}
            <div className="liquid-glass-subtle rounded-3xl p-5 border border-orange-400/40 flex items-center justify-between">
              <div>
                <div className="text-xs text-white/70">Số bước chân hôm nay:</div>
                <div className="text-3xl font-black font-mono text-orange-300 mt-1">
                  {userSteps.toLocaleString('vi-VN')} <span className="text-xs font-bold text-white/70">bước</span>
                </div>
                <div className="text-[10px] text-emerald-300 mt-1 font-semibold">
                  Đạt 65% mục tiêu 10.000 bước mỗi ngày
                </div>
              </div>

              <button
                onClick={handleAddWalk}
                className="px-4 py-2 rounded-2xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs shadow cursor-pointer transition-transform active:scale-95"
              >
                +500 bước
              </button>
            </div>

            {/* Leaderboard */}
            <div className="flex flex-col gap-2">
              <div className="text-xs font-bold text-white/70 px-1 flex items-center justify-between">
                <span>Bảng xếp hạng thể lực học sinh Cẩm Bình</span>
                <span className="text-[10px] text-orange-300">Tuần này</span>
              </div>

              <div className="flex flex-col gap-2">
                {stravaLeaderboard.map((user) => (
                  <div
                    key={user.rank}
                    className={`p-3.5 rounded-2xl liquid-glass-subtle border flex items-center justify-between gap-3 text-xs ${
                      user.rank === 3 ? 'border-orange-400/60 bg-orange-500/20 text-white font-bold' : 'border-white/10 text-white/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{user.emoji}</span>
                      <div>
                        <div className="font-bold">{user.name}</div>
                        <div className="text-[10px] text-white/50">{user.km}</div>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-orange-300">{user.steps.toLocaleString()} bước</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
