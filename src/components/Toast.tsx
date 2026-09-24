import React from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-5 left-1/2 -translate-x-1/2 z-[500] px-5 py-3 rounded-full text-sm font-semibold glass-strong border border-white/30 text-white shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-none"
      style={{
        background: 'rgba(23, 15, 38, 0.88)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.25)'
      }}
    >
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      <span>{message}</span>
    </div>
  );
};
