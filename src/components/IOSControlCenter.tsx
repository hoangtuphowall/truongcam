import React, { useState } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Wifi,
  Radio,
  BookOpen,
  QrCode,
  Sparkles,
  CreditCard,
  MapPin,
  Flame,
  Music
} from 'lucide-react';

interface IOSControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  volume: number;
  onVolumeChange: (val: number) => void;
  focusMode: boolean;
  onToggleFocusMode: () => void;
  onOpenApp: (appId: string) => void;
}

export const IOSControlCenter: React.FC<IOSControlCenterProps> = ({
  isOpen,
  onClose,
  volume,
  onVolumeChange,
  focusMode,
  onToggleFocusMode,
  onOpenApp
}) => {
  const [wifiActive, setWifiActive] = useState(true);
  const [bluetoothActive, setBluetoothActive] = useState(true);
  const [lowPowerMode, setLowPowerMode] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-14 bg-black/40 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-[38px] p-5 border border-white/20 text-white flex flex-col gap-4 animate-in slide-in-from-top-6 duration-200"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(40px) saturate(190%)',
          WebkitBackdropFilter: 'blur(40px) saturate(190%)',
          boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-white/70 font-semibold">Trung Tâm Điều Khiển</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/90 font-medium border border-white/15">
              Trường Cẩm
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top 2x2 Connectivity & Media Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Connectivity Box */}
          <div className="rounded-3xl p-3.5 flex flex-col gap-3 bg-white/[0.06] backdrop-blur-xl border border-white/[0.12]">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setWifiActive(!wifiActive)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                  wifiActive ? 'bg-blue-500/90 text-white shadow-md border border-white/20' : 'bg-white/10 text-white/40 border border-transparent'
                }`}
                title="Wifi THPT Cẩm Bình"
              >
                <Wifi className="w-5 h-5" />
              </button>
              <button
                onClick={() => setBluetoothActive(!bluetoothActive)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                  bluetoothActive ? 'bg-indigo-500/90 text-white shadow-md border border-white/20' : 'bg-white/10 text-white/40 border border-transparent'
                }`}
                title="Bluetooth Tai nghe"
              >
                <Radio className="w-5 h-5" />
              </button>
            </div>
            <div className="text-[11px] font-medium text-white/80">
              <div className="font-semibold text-white truncate">Wifi: CB-HighSchool-5G</div>
              <div className="text-emerald-400 text-[10px]">Tốc độ: 150 Mbps</div>
            </div>
          </div>

          {/* Focus Mode Box */}
          <button
            onClick={onToggleFocusMode}
            className={`rounded-3xl p-3.5 flex flex-col justify-between text-left transition-all border ${
              focusMode
                ? 'bg-white/25 border-white/35 shadow-md backdrop-blur-md'
                : 'bg-white/[0.06] backdrop-blur-xl border-white/[0.12] hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${focusMode ? 'bg-purple-400/90 text-black' : 'bg-white/15 text-white'}`}>
                <BookOpen className="w-5 h-5" />
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${focusMode ? 'bg-white/30 text-white border border-white/40' : 'bg-white/10 text-white/50'}`}>
                {focusMode ? 'BẬT' : 'TẮT'}
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Chế độ Ôn thi THPT</div>
              <div className="text-[10px] text-white/60">Tắt thông báo gây xao nhãng</div>
            </div>
          </button>
        </div>

        {/* Volume & Brightness Sliders */}
        <div className="grid grid-cols-2 gap-3">
          {/* Sound Slider */}
          <div className="rounded-3xl p-3.5 flex flex-col gap-2 bg-white/[0.06] backdrop-blur-xl border border-white/[0.12]">
            <div className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-1.5 text-white/80">
                {volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                <span>Âm lượng Lofi</span>
              </div>
              <span className="font-mono text-[11px] text-white/60">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          {/* Quick Battery Mode */}
          <button
            onClick={() => setLowPowerMode(!lowPowerMode)}
            className={`rounded-3xl p-3.5 flex flex-col justify-between text-left transition-all border ${
              lowPowerMode ? 'border-amber-400/50 bg-amber-500/20' : 'bg-white/[0.06] backdrop-blur-xl border-white/[0.12]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-amber-300 font-semibold text-xs">Pin Học Sinh</div>
              <span className="text-xs font-mono font-bold">89%</span>
            </div>
            <div className="text-[11px] text-white/70">
              {lowPowerMode ? 'Tiết kiệm pin đang bật' : 'Chế độ pin tiêu chuẩn'}
            </div>
          </button>
        </div>

        {/* Quick Launch Icons row */}
        <div className="rounded-3xl p-3 flex flex-col gap-2 bg-white/[0.06] backdrop-blur-xl border border-white/[0.12]">
          <div className="text-[11px] font-semibold text-white/50 uppercase tracking-wider px-1">Lối tắt học sinh Trường Cẩm</div>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => {
                onOpenApp('chatgpt');
                onClose();
              }}
              className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/80 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-white/80">Cẩm AI</span>
            </button>

            <button
              onClick={() => {
                onOpenApp('momo');
                onClose();
              }}
              className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-pink-600/80 flex items-center justify-center text-white shadow-md">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-white/80">CẩmPay</span>
            </button>

            <button
              onClick={() => {
                onOpenApp('vneid');
                onClose();
              }}
              className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-red-600/80 flex items-center justify-center text-white shadow-md">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-white/80">Thẻ CẩmID</span>
            </button>

            <button
              onClick={() => {
                onOpenApp('google_maps');
                onClose();
              }}
              className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-600/80 flex items-center justify-center text-white shadow-md">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-white/80">Bản đồ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
