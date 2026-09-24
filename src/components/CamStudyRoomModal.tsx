import React, { useState } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Users,
  MessageSquare,
  Sparkles,
  Volume2,
  Clock,
  Send
} from 'lucide-react';
import { Person, UserProfile } from '../types';

interface CamStudyRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  people: Person[];
  pomodoroMinutes: number;
  pomodoroSeconds: number;
  isPomodoroActive: boolean;
  onTogglePomodoro: () => void;
  onResetPomodoro: () => void;
}

export const CamStudyRoomModal: React.FC<CamStudyRoomModalProps> = ({
  isOpen,
  onClose,
  user,
  people,
  pomodoroMinutes,
  pomodoroSeconds,
  isPomodoroActive,
  onTogglePomodoro,
  onResetPomodoro
}) => {
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(false);
  const [ambientSound, setAmbientSound] = useState<'rain' | 'cafe' | 'breeze' | 'none'>('rain');
  const [activeTab, setActiveTab] = useState<'video' | 'chat'>('video');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Nguyễn Hoàng Linh', text: 'Chào mọi người, 12A1 bắt đầu phiên ôn thi 25 phút nha!', time: '19:30' },
    { sender: 'Đặng Quang Huy', text: 'Mình đang làm đề thi thử Bách Khoa, ai thắc mắc cứ nhắn nhé.', time: '19:32' }
  ]);

  if (!isOpen) return null;

  const studyParticipants = [
    { name: user.name, emoji: user.emoji, grad: user.avatarGradient, status: 'Đang tập trung' },
    { name: people[0]?.name || 'Linh', emoji: people[0]?.emoji || '🌸', grad: people[0]?.avatarGradient, status: 'Giải đề Toán' },
    { name: people[1]?.name || 'Nam', emoji: people[1]?.emoji || '🎸', grad: people[1]?.avatarGradient, status: 'Học từ vựng' },
    { name: people[4]?.name || 'Huy', emoji: people[4]?.emoji || '💻', grad: people[4]?.avatarGradient, status: 'Luyện đề Lý' }
  ];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: user.name, text: chatInput, time: 'Vừa xong' }
    ]);
    setChatInput('');
  };

  const formatTimer = (min: number, sec: number) => {
    const m = min.toString().padStart(2, '0');
    const s = sec.toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl h-[90vh] max-h-[720px] liquid-glass rounded-[36px] shadow-2xl border border-white/35 text-white flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 px-5 border-b border-white/15 flex items-center justify-between liquid-glass-subtle shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[22%] bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Phòng Học Nhóm 12A1</h2>
              </div>
              <p className="text-[11px] text-white/60 mt-0.5">
                4 học sinh đang học tập chung · Phương pháp Pomodoro 25/5
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="ios-toggle-menu">
              <button
                onClick={() => setActiveTab('video')}
                className={`ios-toggle-item !py-1 !px-2.5 !text-[11px] ${
                  activeTab === 'video' ? 'ios-toggle-active' : ''
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Camera</span>
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`ios-toggle-item !py-1 !px-2.5 !text-[11px] ${
                  activeTab === 'chat' ? 'ios-toggle-active' : ''
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top Pomodoro Timer Banner */}
        <div className="p-3.5 px-5 bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-indigo-500/15 border-b border-white/15 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-amber-200/80 font-medium">Đồng hồ Pomodoro (Tập trung sâu)</div>
              <div className="text-lg font-mono font-bold text-amber-300">
                {formatTimer(pomodoroMinutes, pomodoroSeconds)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePomodoro}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isPomodoroActive
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/30'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
            >
              {isPomodoroActive ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isPomodoroActive ? 'Tạm dừng' : 'Bắt đầu'}</span>
            </button>
            <button
              onClick={onResetPomodoro}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70"
              title="Đặt lại 25 phút"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content: Video Grid or Chat */}
        {activeTab === 'video' ? (
          <div className="flex-1 p-4 overflow-y-auto grid grid-cols-2 gap-3.5 no-scrollbar">
            {studyParticipants.map((p, idx) => (
              <div
                key={idx}
                className="liquid-glass-subtle rounded-3xl p-3 flex flex-col justify-between border border-white/20 relative overflow-hidden min-h-[140px] shadow-lg group"
              >
                {/* Simulated webcam video glass */}
                <div
                  className="w-full h-24 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-inner relative"
                  style={{ background: p.grad }}
                >
                  <span>{p.emoji}</span>
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white">
                    {idx === 0 ? 'Bạn (12A1)' : p.name}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1 text-[11px]">
                  <span className="text-white/70 flex items-center gap-1 truncate font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    {p.status}
                  </span>
                  <div className="flex items-center gap-1 text-white/50">
                    <Mic className="w-3 h-3 text-rose-400" />
                    <Video className="w-3 h-3 text-emerald-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 no-scrollbar">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="p-3 rounded-2xl liquid-glass-subtle border border-white/15 text-xs">
                  <div className="flex items-center justify-between text-white/50 mb-1">
                    <span className="font-bold text-pink-300">{msg.sender}</span>
                    <span className="font-mono text-[10px]">{msg.time}</span>
                  </div>
                  <div className="text-white/90">{msg.text}</div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendChat} className="p-3 border-t border-white/15 flex gap-2">
              <input
                type="text"
                placeholder="Trao đổi bài tập với nhóm..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl liquid-glass border border-white/20 text-xs text-white placeholder:text-white/40 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Bottom Control Bar */}
        <div className="p-3 px-5 liquid-glass-subtle border-t border-white/15 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Ambient Sound Selector: Transparent iOS Toggle Menu */}
          <div className="flex items-center gap-1.5 text-xs">
            <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-white/60 text-[11px] shrink-0">Âm nền:</span>
            <div className="ios-toggle-menu">
              {[
                { id: 'rain', label: '🌧️ Mưa' },
                { id: 'cafe', label: '☕ Cà phê' },
                { id: 'breeze', label: '🌿 Gió phượng' },
                { id: 'none', label: '🔇 Tắt' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setAmbientSound(s.id as any)}
                  className={`ios-toggle-item !py-1 !px-2.5 !text-[10px] ${
                    ambientSound === s.id ? 'ios-toggle-active' : ''
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cam & Mic buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVideoOn(!videoOn)}
              className={`p-2.5 rounded-2xl transition-all ${
                videoOn ? 'bg-white/15 text-white' : 'bg-rose-500/30 text-rose-300 border border-rose-400/40'
              }`}
              title={videoOn ? 'Tắt camera' : 'Bật camera'}
            >
              {videoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-2.5 rounded-2xl transition-all ${
                micOn ? 'bg-white/15 text-white' : 'bg-rose-500/30 text-rose-300 border border-rose-400/40'
              }`}
              title={micOn ? 'Tắt micro' : 'Bật micro'}
            >
              {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
