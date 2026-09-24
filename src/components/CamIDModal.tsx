import React from 'react';
import {
  X,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  GraduationCap,
  Award,
  BookOpen
} from 'lucide-react';
import { INITIAL_STUDENT_ID } from '../data/initialData';
import { UserProfile } from '../types';

interface CamIDModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const CamIDModal: React.FC<CamIDModalProps> = ({ isOpen, onClose, user }) => {
  const [attendanceNotice, setAttendanceNotice] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const idInfo = INITIAL_STUDENT_ID;

  const handleAttendance = () => {
    setAttendanceNotice('Đã quét mã CẩmID điểm danh vào trường THPT Cẩm Bình lúc 06:45 sáng thành công!');
    setTimeout(() => {
      setAttendanceNotice(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200">
      <div
        className="w-full max-w-md liquid-glass rounded-[40px] shadow-2xl border border-white/35 text-white flex flex-col overflow-hidden p-6 gap-5 max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-[22%] bg-gradient-to-tr from-red-600 to-amber-600 flex items-center justify-center text-white shadow-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-white">Thẻ Học Sinh Số (CẩmID)</h2>
              </div>
              <p className="text-[11px] text-white/60">Thẻ định danh điện tử Trường THPT Cẩm Bình</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Digital ID Card with Liquid Glass Vietnam Emblem styling */}
        <div
          className="w-full rounded-[30px] p-5 flex flex-col gap-4 relative overflow-hidden shadow-2xl border border-white/35"
          style={{
            background: 'linear-gradient(145deg, rgba(196, 30, 36, 0.85) 0%, rgba(139, 0, 0, 0.85) 60%, rgba(30, 20, 50, 0.9) 100%)',
            boxShadow: '0 20px 40px -10px rgba(196, 30, 36, 0.4), inset 0 1.5px 1px rgba(255, 255, 255, 0.6)'
          }}
        >
          {/* Card Top Title */}
          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-400 text-red-800 flex items-center justify-center text-base font-black shadow">
                ⭐
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                  SỞ GIÁO DỤC & ĐÀO TẠO HÀ TĨNH
                </div>
                <div className="text-xs font-black tracking-wide text-white">
                  TRƯỜNG THPT CẨM BÌNH
                </div>
              </div>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-400/30">
              HỢP LỆ
            </span>
          </div>

          {/* Student Info and Photo */}
          <div className="flex items-center gap-4">
            {/* Student Photo */}
            <div
              className="w-24 h-28 rounded-2xl p-0.5 shadow-xl flex flex-col items-center justify-center text-4xl shrink-0 relative border border-white/30"
              style={{ background: user.avatarGradient }}
            >
              <span>{user.emoji}</span>
              <div className="absolute bottom-1 text-[8px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white">
                CB-2026
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0 space-y-1 text-xs">
              <div className="text-sm font-black text-white uppercase tracking-wide truncate">
                {idInfo.fullName}
              </div>
              <div className="text-[11px] text-amber-200/90 font-mono font-bold">
                Mã: {idInfo.studentCode}
              </div>
              <div className="text-[11px] text-white/80">
                Lớp: <span className="font-bold text-white">{idInfo.className}</span>
              </div>
              <div className="text-[11px] text-white/80">
                Niên khóa: <span className="font-bold text-white">{idInfo.academicYear}</span>
              </div>
              <div className="text-[11px] text-white/80">
                Đoàn viên: <span className="font-bold text-emerald-300">Đã kết nạp 🇻🇳</span>
              </div>
            </div>
          </div>

          {/* QR Code and Barcode */}
          <div className="pt-2 border-t border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-white p-1 rounded-xl shadow">
                <QrCode className="w-full h-full text-black" />
              </div>
              <div className="text-[10px] text-white/70">
                <div className="font-bold text-white">QR Điểm danh trường</div>
                <div>Quét tại cổng bảo vệ</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[9px] text-white/50 uppercase font-mono">Điểm rèn luyện</div>
              <div className="text-base font-black text-amber-300 font-mono">
                {idInfo.conductScore} / 100
              </div>
            </div>
          </div>

          {/* Reflective gloss layer */}
          <div className="absolute inset-0 rounded-[30px] bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
        </div>

        {/* Benefits & Actions */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="liquid-glass-subtle rounded-2xl p-3 flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-white">Thẻ Thư Viện</div>
              <div className="text-[10px] text-white/50">Mượn tối đa 5 cuốn</div>
            </div>
          </div>

          <div className="liquid-glass-subtle rounded-2xl p-3 flex items-center gap-2.5">
            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-white">Học Lực Học Kỳ</div>
              <div className="text-[10px] text-emerald-300 font-bold">Xuất Sắc (9.05)</div>
            </div>
          </div>
        </div>

        {attendanceNotice && (
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{attendanceNotice}</span>
          </div>
        )}

        {/* Attendance Verification Button */}
        <button
          onClick={handleAttendance}
          className="py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:scale-[1.02] active:scale-95 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <QrCode className="w-4 h-4" />
          <span>Điểm Danh Vào Cổng Trường Cẩm Bình</span>
        </button>
      </div>
    </div>
  );
};
