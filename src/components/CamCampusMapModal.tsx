import React, { useState } from 'react';
import {
  X,
  MapPin,
  Navigation,
  Compass,
  Building,
  Info,
  Layers,
  ChevronRight
} from 'lucide-react';
import { CAMPUS_LOCATIONS } from '../data/initialData';

interface CamCampusMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CamCampusMapModal: React.FC<CamCampusMapModalProps> = ({ isOpen, onClose }) => {
  const [selectedLoc, setSelectedLoc] = useState(CAMPUS_LOCATIONS[0]);
  const [mapViewType, setMapViewType] = useState<'campus' | 'satellite'>('campus');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl h-[90vh] max-h-[720px] liquid-glass rounded-[36px] shadow-2xl border border-white/35 text-white flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 px-5 border-b border-white/15 flex items-center justify-between liquid-glass-subtle shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[22%] bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center text-white shadow-lg">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-white">Bản Đồ Số THPT Cẩm Bình</h2>
              </div>
              <p className="text-[11px] text-white/60">
                Xã Cẩm Bình, huyện Cẩm Xuyên, tỉnh Hà Tĩnh · Định vị khuôn viên trường
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMapViewType(mapViewType === 'campus' ? 'satellite' : 'campus')}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1 text-white/80"
            >
              <Layers className="w-3.5 h-3.5 text-blue-300" />
              <span>{mapViewType === 'campus' ? 'Vệ tinh' : 'Bản đồ'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Map Canvas Representation */}
        <div className="h-64 sm:h-72 w-full bg-gradient-to-br from-[#0b1a30] via-[#092928] to-[#121c3b] relative border-b border-white/15 flex items-center justify-center overflow-hidden shrink-0">
          {/* Grid lines styling */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* School Grass Courtyard */}
          <div className="w-4/5 h-4/5 rounded-3xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-sm relative flex items-center justify-center">
            <span className="text-xs uppercase tracking-widest text-emerald-300/40 font-bold">
              Sân Trường THPT Cẩm Bình
            </span>

            {/* Interactive Location Markers on Campus */}
            <div
              onClick={() => setSelectedLoc(CAMPUS_LOCATIONS[0])}
              className={`absolute top-4 left-6 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-lg border ${
                selectedLoc.id === 'loc_1'
                  ? 'bg-blue-500 text-white border-white scale-110 ring-4 ring-blue-500/30'
                  : 'bg-black/60 text-white/80 border-white/20 hover:bg-black/80'
              }`}
            >
              <span>🏛️</span>
              <span className="text-[10px] font-bold">Dãy Nhà A</span>
            </div>

            <div
              onClick={() => setSelectedLoc(CAMPUS_LOCATIONS[1])}
              className={`absolute top-4 right-6 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-lg border ${
                selectedLoc.id === 'loc_2'
                  ? 'bg-blue-500 text-white border-white scale-110 ring-4 ring-blue-500/30'
                  : 'bg-black/60 text-white/80 border-white/20 hover:bg-black/80'
              }`}
            >
              <span>🏢</span>
              <span className="text-[10px] font-bold">Dãy Nhà B</span>
            </div>

            <div
              onClick={() => setSelectedLoc(CAMPUS_LOCATIONS[2])}
              className={`absolute center px-2.5 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-lg border ${
                selectedLoc.id === 'loc_3'
                  ? 'bg-blue-500 text-white border-white scale-110 ring-4 ring-blue-500/30'
                  : 'bg-black/60 text-white/80 border-white/20 hover:bg-black/80'
              }`}
            >
              <span>📚</span>
              <span className="text-[10px] font-bold">Thư Viện & Tin Học</span>
            </div>

            <div
              onClick={() => setSelectedLoc(CAMPUS_LOCATIONS[3])}
              className={`absolute bottom-4 right-6 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-lg border ${
                selectedLoc.id === 'loc_4'
                  ? 'bg-blue-500 text-white border-white scale-110 ring-4 ring-blue-500/30'
                  : 'bg-black/60 text-white/80 border-white/20 hover:bg-black/80'
              }`}
            >
              <span>⚽</span>
              <span className="text-[10px] font-bold">Sân Bóng & Đa Năng</span>
            </div>

            <div
              onClick={() => setSelectedLoc(CAMPUS_LOCATIONS[4])}
              className={`absolute bottom-4 left-6 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-lg border ${
                selectedLoc.id === 'loc_5'
                  ? 'bg-blue-500 text-white border-white scale-110 ring-4 ring-blue-500/30'
                  : 'bg-black/60 text-white/80 border-white/20 hover:bg-black/80'
              }`}
            >
              <span>🧋</span>
              <span className="text-[10px] font-bold">Căng-tin & Nhà Xe</span>
            </div>
          </div>
        </div>

        {/* Selected Location Card & All Locations List */}
        <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 no-scrollbar">
          {/* Active Location Info */}
          <div className="liquid-glass-subtle rounded-3xl p-4 border border-blue-400/40 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedLoc.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedLoc.name}</h3>
                  <div className="text-[11px] text-blue-300 font-medium">{selectedLoc.coords}</div>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-400/30">
                {selectedLoc.status}
              </span>
            </div>
            {selectedLoc.imageUrl && (
              <div className="w-full h-36 rounded-2xl overflow-hidden border border-white/20 shadow-inner">
                <img src={selectedLoc.imageUrl} alt={selectedLoc.name} className="w-full h-full object-cover" />
              </div>
            )}
            <p className="text-xs text-white/70 leading-relaxed">{selectedLoc.desc}</p>
          </div>

          {/* All Campus Locations Grid */}
          <div className="flex flex-col gap-2">
            <div className="text-xs font-bold text-white/70 px-1">Danh mục địa điểm trường</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CAMPUS_LOCATIONS.map((loc) => {
                const isCurrent = loc.id === selectedLoc.id;
                return (
                  <div
                    key={loc.id}
                    onClick={() => setSelectedLoc(loc)}
                    className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all border ${
                      isCurrent
                        ? 'bg-white/20 border-blue-400/60 text-white shadow-md'
                        : 'liquid-glass-subtle border-white/10 hover:bg-white/15 text-white/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg">{loc.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{loc.name}</div>
                        <div className="text-[10px] text-white/50 truncate">{loc.coords}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/40 shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
