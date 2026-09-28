import React, { useState } from 'react';
import {
  X,
  Mail,
  Send,
  FileText,
  Inbox,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';

interface CamMailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const CamMailModal: React.FC<CamMailModalProps> = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');
  const [reason, setReason] = useState('Em bị cảm sốt và cần đi khám tại trạm y tế');
  const [leaveDate, setLeaveDate] = useState('Ngày mai (Thứ Năm)');
  const [sendSuccess, setSendSuccess] = useState(false);

  if (!isOpen) return null;

  const emails = [
    {
      id: 'e1',
      from: 'BCH Đoàn Trường THPT Cẩm Bình <doantruong@cambinh.edu.vn>',
      subject: 'Thông báo: Lịch sinh hoạt truyền thống và Đại hội Thể thao 26/3',
      date: '08:30 Hôm nay',
      unread: true,
      snippet: 'Kính gửi toàn thể đoàn viên thanh niên các chi đoàn khối 10, 11, 12...'
    },
    {
      id: 'e2',
      from: 'Ban Giám Hiệu THPT Cẩm Bình <bgh@cambinh.edu.vn>',
      subject: 'Kế hoạch kiểm tra định kỳ và ôn thi tốt nghiệp THPT năm 2026',
      date: 'Hôm qua',
      unread: false,
      snippet: 'Đề nghị giáo viên chủ nhiệm và ban cán sự lớp đôn đốc học sinh...'
    }
  ];

  const handleSendLeaveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSendSuccess(true);
    setTimeout(() => {
      setSendSuccess(false);
      setActiveTab('inbox');
    }, 2500);
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
            <div className="w-10 h-10 rounded-[22%] bg-gradient-to-tr from-red-500 to-rose-600 flex items-center justify-center text-white shadow-lg">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-white">Cẩm Mail</h2>
              </div>
              <p className="text-[11px] text-white/60">khang.vm@cambinh.edu.vn · Hòm thư học sinh</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Transparent Liquid Glass Tab switch */}
        <div className="p-2.5 px-5 border-b border-white/10 flex justify-center shrink-0">
          <div className="ios-toggle-menu w-full max-w-md">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`ios-toggle-item flex-1 justify-center ${activeTab === 'inbox' ? 'ios-toggle-active' : ''}`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Hộp thư đến ({emails.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('compose')}
              className={`ios-toggle-item flex-1 justify-center ${activeTab === 'compose' ? 'ios-toggle-active' : ''}`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Gửi Đơn Nghỉ Học</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'inbox' ? (
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto flex flex-col gap-3 no-scrollbar">
            {emails.map((email) => (
              <div
                key={email.id}
                className={`p-4 rounded-3xl liquid-glass-subtle border transition-all cursor-pointer ${
                  email.unread ? 'border-red-500/40 bg-red-500/10' : 'border-white/15 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white truncate max-w-[280px]">{email.from}</span>
                  <span className="text-[10px] text-white/50">{email.date}</span>
                </div>
                <h4 className="text-xs font-bold text-pink-300 mt-1">{email.subject}</h4>
                <p className="text-[11px] text-white/70 mt-1 line-clamp-2 leading-relaxed">{email.snippet}</p>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSendLeaveRequest} className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 no-scrollbar">
            {sendSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Đã gửi Đơn xin phép nghỉ học trực tuyến đến Cô chủ nhiệm 12A1 thành công! 📝</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-white/80">Kính gửi:</label>
              <input
                type="text"
                disabled
                value="Giáo viên chủ nhiệm Lớp 12A1 & Ban Giám hiệu THPT Cẩm Bình"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white/70"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-white/80">Học sinh làm đơn:</label>
              <input
                type="text"
                disabled
                value={`${user.name} - Lớp 12A1 (Trường THPT Cẩm Bình)`}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white/70"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-white/80">Thời gian xin nghỉ:</label>
              <input
                type="text"
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl liquid-glass border border-white/20 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-white/80">Lý do xin nghỉ phép:</label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl liquid-glass border border-white/20 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="mt-auto py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Gửi Đơn Xin Phép Kèm Chữ Ký Phụ Huynh</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
