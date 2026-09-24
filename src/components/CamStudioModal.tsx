import React, { useState } from 'react';
import {
  X,
  Palette,
  Sparkles,
  Download,
  Share2,
  Smile,
  Type,
  CheckCircle2
} from 'lucide-react';

interface CamStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CamStudioModal: React.FC<CamStudioModalProps> = ({ isOpen, onClose }) => {
  const [topText, setTopText] = useState('Khi thầy bảo: "Đề thi năm nay dễ lắm các em"');
  const [bottomText, setBottomText] = useState('Câu 1: Cho không gian 5 chiều...');
  const [memeTheme, setMemeTheme] = useState('gradient1');
  const [savedAlert, setSavedAlert] = useState(false);

  if (!isOpen) return null;

  const themes: { [key: string]: string } = {
    gradient1: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
    gradient2: 'linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%)',
    gradient3: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
    gradient4: 'linear-gradient(135deg, #182848 0%, #4b6cb7 100%)'
  };

  const handleSaveMeme = () => {
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200">
      <div
        className="w-full max-w-md liquid-glass rounded-[40px] shadow-2xl border border-white/35 text-white flex flex-col overflow-hidden p-6 gap-5 max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-[22%] bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-white">Cẩm Studio</h2>
              </div>
              <p className="text-[11px] text-white/60">Chế meme học đường & Khung ảnh kỷ yếu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {savedAlert && (
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Đã lưu ảnh meme Cẩm Bình vào thư viện ảnh máy! 📸</span>
          </div>
        )}

        {/* Live Meme Canvas */}
        <div
          className="w-full h-64 rounded-3xl p-5 flex flex-col justify-between items-center text-center shadow-2xl border border-white/30 relative overflow-hidden"
          style={{ background: themes[memeTheme] }}
        >
          {/* Top text */}
          <div className="text-sm sm:text-base font-bold uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
            {topText || 'CHỮ TRÊN'}
          </div>

          {/* Meme Center Avatar */}
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner border border-white/40">
            🤣
          </div>

          {/* Bottom text */}
          <div className="text-sm sm:text-base font-bold uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
            {bottomText || 'CHỮ DƯỚI'}
          </div>

          <div className="absolute bottom-1 right-2 text-[9px] text-white/40 font-mono">
            #TruongCam #THPTCamBinh
          </div>
        </div>

        {/* Color Palette Selector */}
        <div className="flex items-center gap-2 justify-center">
          {Object.entries(themes).map(([key, grad]) => (
            <button
              key={key}
              onClick={() => setMemeTheme(key)}
              className={`w-8 h-8 rounded-full transition-transform ${
                memeTheme === key ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
              }`}
              style={{ background: grad }}
            />
          ))}
        </div>

        {/* Text inputs */}
        <div className="space-y-2 text-xs">
          <div>
            <label className="text-white/70 font-semibold mb-1 block">Tiêu đề trên:</label>
            <input
              type="text"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-white/20 text-white text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="text-white/70 font-semibold mb-1 block">Nội dung dưới:</label>
            <input
              type="text"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-white/20 text-white text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSaveMeme}
          className="py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Lưu Ảnh Meme Về Máy & Chia Sẻ Lên Bảng Tin</span>
        </button>
      </div>
    </div>
  );
};
