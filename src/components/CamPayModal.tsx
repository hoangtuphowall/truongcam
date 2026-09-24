import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Wallet,
  Coins
} from 'lucide-react';
import { UserProfile } from '../types';

interface CamPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const CamPayModal: React.FC<CamPayModalProps> = ({ isOpen, onClose, user }) => {
  const [balance, setBalance] = useState<number>(150000);
  const [showQR, setShowQR] = useState(false);
  const [showTransferSuccess, setShowTransferSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transactions, setTransactions] = useState([
    { id: 'tx-1', desc: 'Bánh mì pate Căng-tin THPT Cẩm Bình', amount: -15000, time: 'Hôm nay, 07:15', icon: '🥪' },
    { id: 'tx-2', desc: 'Mẹ nạp tiền ăn trưa', amount: 100000, time: 'Hôm qua, 18:30', icon: '💰' },
    { id: 'tx-3', desc: 'Trà sữa trân châu chia nhóm 12A1', amount: -18000, time: '2 ngày trước', icon: '🧋' }
  ]);

  if (!isOpen) return null;

  const handlePayClassFund = () => {
    if (balance < 30000) {
      setErrorMessage('Số dư ví không đủ 30.000đ để nộp quỹ lớp!');
      setTimeout(() => setErrorMessage(null), 3500);
      return;
    }
    setErrorMessage(null);
    setBalance((prev) => prev - 30000);
    const newTx = {
      id: `tx-${Date.now()}`,
      desc: 'Nộp quỹ lớp 12A1 (Tháng này)',
      amount: -30000,
      time: 'Vừa xong',
      icon: '🌸'
    };
    setTransactions((prev) => [newTx, ...prev]);
    setShowTransferSuccess('Đã nộp 30.000đ quỹ lớp 12A1 cho Lớp trưởng Linh thành công! 🎉');
    setTimeout(() => setShowTransferSuccess(null), 3500);
  };

  const handleDeposit = () => {
    setBalance((prev) => prev + 50000);
    const newTx = {
      id: `tx-${Date.now()}`,
      desc: 'Nạp tiền từ MoMo / MB Bank liên kết',
      amount: 50000,
      time: 'Vừa xong',
      icon: '⚡'
    };
    setTransactions((prev) => [newTx, ...prev]);
    setShowTransferSuccess('Đã nạp 50.000đ vào ví CẩmPay từ ngân hàng! 💳');
    setTimeout(() => setShowTransferSuccess(null), 3500);
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
            <div className="w-10 h-10 rounded-[22%] bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-white shadow-lg">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-white">Ví CẩmPay</h2>
              </div>
              <p className="text-[11px] text-white/60">Ví học sinh & Quỹ lớp THPT Cẩm Bình</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Alert */}
        {showTransferSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in zoom-in-95">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{showTransferSuccess}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-xs text-rose-300 flex items-center gap-2 animate-in fade-in zoom-in-95">
            <X className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Liquid Glass 3D Student Debit Card */}
        <div
          className="w-full h-48 rounded-[28px] p-5 flex flex-col justify-between relative overflow-hidden shadow-2xl border border-white/30 group transition-transform duration-300 hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, rgba(235, 64, 128, 0.75) 0%, rgba(124, 107, 255, 0.75) 60%, rgba(56, 230, 197, 0.5) 100%)',
            boxShadow: '0 20px 40px -10px rgba(235, 64, 128, 0.4), inset 0 1.5px 1px rgba(255, 255, 255, 0.7)'
          }}
        >
          {/* Top of card */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-white">
                THPT CẨM BÌNH · CẨMBANK
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-semibold">
                DEBIT
              </span>
            </div>
            {/* Holographic Chip */}
            <div className="w-9 h-7 rounded-lg bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-400 border border-amber-100/50 shadow-sm flex items-center justify-center opacity-90">
              <div className="w-6 h-4 border border-amber-600/40 rounded-sm" />
            </div>
          </div>

          {/* Balance */}
          <div>
            <div className="text-[11px] text-white/80 font-medium">Số dư khả dụng</div>
            <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white drop-shadow">
              {balance.toLocaleString('vi-VN')} <span className="text-sm font-normal">VNĐ</span>
            </div>
          </div>

          {/* Bottom Card Info */}
          <div className="flex items-center justify-between text-xs text-white/90 font-mono">
            <div>
              <div className="text-[9px] text-white/70 uppercase">Chủ thẻ</div>
              <div className="font-bold tracking-wider">{user.name.toUpperCase()}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-white/70 uppercase">Lớp 12A1</div>
              <div className="font-bold tracking-wider">**** 2026</div>
            </div>
          </div>

          {/* Glass glare effect */}
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={handlePayClassFund}
            className="p-3 rounded-2xl liquid-glass-subtle hover:bg-white/20 border border-white/20 flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow group-hover:scale-110 transition-transform">
              <Coins className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">Nộp quỹ lớp</span>
            <span className="text-[10px] text-pink-300">30.000đ</span>
          </button>

          <button
            onClick={() => setShowQR(!showQR)}
            className="p-3 rounded-2xl liquid-glass-subtle hover:bg-white/20 border border-white/20 flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow group-hover:scale-110 transition-transform">
              <QrCode className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">Quét VietQR</span>
            <span className="text-[10px] text-blue-300">{showQR ? 'Đóng' : 'Nhận tiền'}</span>
          </button>

          <button
            onClick={handleDeposit}
            className="p-3 rounded-2xl liquid-glass-subtle hover:bg-white/20 border border-white/20 flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow group-hover:scale-110 transition-transform">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">Nạp tiền</span>
            <span className="text-[10px] text-emerald-300">+50.000đ</span>
          </button>
        </div>

        {/* QR Code Viewer */}
        {showQR && (
          <div className="p-4 rounded-3xl liquid-glass-subtle border border-white/20 flex flex-col items-center gap-3 text-center animate-in fade-in zoom-in-95">
            <div className="w-40 h-40 bg-white p-3 rounded-2xl shadow-xl flex flex-col items-center justify-center">
              <div className="w-full h-full border-2 border-dashed border-gray-400 flex flex-col items-center justify-center text-black">
                <QrCode className="w-24 h-24 text-gray-900" />
                <span className="text-[9px] font-bold mt-1 text-gray-700">VIETQR · CẨMBANK</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white">Mã QR nhận tiền cá nhân</div>
              <div className="text-[11px] text-white/60">Học sinh: {user.name} - Lớp 12A1</div>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-bold text-white/70 px-1">
            <span>Lịch sử giao dịch gần đây</span>
            <span className="text-[10px] text-pink-300 cursor-pointer hover:underline">Xem tất cả</span>
          </div>

          <div className="flex flex-col gap-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-2xl liquid-glass-subtle border border-white/10 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl p-1.5 rounded-xl bg-white/10">{tx.icon}</span>
                  <div className="min-w-0">
                    <div className="font-bold text-white truncate">{tx.desc}</div>
                    <div className="text-[10px] text-white/50">{tx.time}</div>
                  </div>
                </div>
                <div
                  className={`font-mono font-bold text-right shrink-0 ${
                    tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {tx.amount > 0 ? `+${tx.amount.toLocaleString('vi-VN')}` : tx.amount.toLocaleString('vi-VN')} đ
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
