import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Phone,
  Image as ImageIcon,
  Send,
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  CheckCheck
} from 'lucide-react';
import { Chat, Person, UserProfile } from '../types';

interface ChatConversationProps {
  chat: Chat;
  people: Person[];
  user: UserProfile;
  onBack: () => void;
  onSendMessage: (chatId: number | string, text?: string, imgData?: string) => void;
  onSimulateReply: (chatId: number | string) => void;
}

export const ChatConversation: React.FC<ChatConversationProps> = ({
  chat,
  people,
  user,
  onBack,
  onSendMessage,
  onSimulateReply
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isGroup = chat.isGroup;
  const person = !isGroup && chat.personId ? people.find((p) => p.id === chat.personId) : null;

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.msgs, isTyping]);

  // Voice call duration timer
  useEffect(() => {
    let interval: any;
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration((d) => d + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const messageText = inputText.trim();
    setInputText('');
    onSendMessage(chat.id, messageText);

    // Trigger simulated reply after 1.2s
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      onSimulateReply(chat.id);
    }, 1400);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onSendMessage(chat.id, undefined, dataUrl);

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        onSimulateReply(chat.id);
      }, 1500);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#150d26] text-white">
      {/* Conversation Top Header */}
      <header className="px-3.5 py-3 glass border-b border-white/15 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/80 hover:text-white border border-white/20 active:scale-95"
            aria-label="Back to chats"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white border border-white/20 shadow shrink-0"
            style={{
              background: isGroup
                ? 'linear-gradient(135deg, #38e6c5, #7c6bff)'
                : person?.avatarGradient || user.avatarGradient
            }}
          >
            {isGroup ? '👥' : person?.emoji || '✦'}
          </div>

          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              {isGroup ? chat.groupName : person?.name || 'Bạn học'}
            </h2>
            <div className="text-[11px] text-white/50 flex items-center gap-1.5">
              {isGroup ? (
                <span>Nhóm học tập & bạn bè</span>
              ) : person?.online ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-300 font-medium">Đang hoạt động</span>
                </>
              ) : (
                <span>Hoạt động gần đây</span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsInCall(true)}
          className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/80 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-400/40 border border-white/20 transition-all cursor-pointer"
          title="Bắt đầu cuộc gọi thoại"
          aria-label="Gọi thoại"
        >
          <Phone className="w-4 h-4 text-emerald-400" />
        </button>
      </header>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chat.msgs.map((msg) => {
          const isMe = msg.me;
          const senderPerson = !isMe && msg.personId ? people.find((p) => p.id === msg.personId) : person;

          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              {/* Group chat sender label */}
              {isGroup && !isMe && senderPerson && (
                <span className="text-[10px] font-bold text-white/50 ml-3 mb-1">
                  {senderPerson.name.split(' ')[0]}
                </span>
              )}

              <div
                className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-md ${
                  isMe
                    ? 'bg-gradient-to-tr from-[#7c6bff] to-[#ff6bcb] text-white rounded-br-xs'
                    : 'glass-strong text-white/95 rounded-bl-xs border border-white/20'
                }`}
              >
                {msg.text && <p className="whitespace-pre-wrap break-words">{msg.text}</p>}

                {msg.img && (
                  <div className="mt-1.5 rounded-xl overflow-hidden max-h-60 border border-white/20">
                    <img src={msg.img} alt="Attachment" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 mt-1 text-[10px] text-white/40 px-1">
                <span>{msg.time}</span>
                {isMe && <CheckCheck className="w-3 h-3 text-emerald-300" />}
              </div>
            </div>
          );
        })}

        {/* Real-time Typing Dots */}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="glass px-3.5 py-2.5 rounded-2xl rounded-bl-xs flex items-center gap-1.5 border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 typing-dot-1" />
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 typing-dot-2" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 typing-dot-3" />
            </div>
            <span className="text-[10px] text-white/40 italic">
              {isGroup ? 'Ai đó đang soạn tin...' : `${person?.name.split(' ')[0]} đang soạn tin...`}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Composer Bar */}
      <footer className="p-3 pb-[max(12px,env(safe-area-inset-bottom))] glass border-t border-white/15">
        <form onSubmit={handleSend} className="flex items-center gap-2 max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/80 hover:text-white border border-white/20 shrink-0 cursor-pointer"
            aria-label="Đính kèm ảnh"
            title="Đính kèm ảnh"
          >
            <ImageIcon className="w-4 h-4 text-emerald-400" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Nhắn tin cho ${isGroup ? 'nhóm học tập' : person?.name.split(' ')[0] || 'bạn bè'}...`}
            className="flex-1 glass rounded-full px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 border border-white/20 outline-none focus:border-purple-400 transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7c6bff] to-[#ff6bcb] disabled:opacity-40 text-white flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
            aria-label="Gửi tin nhắn"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </footer>

      {/* Simulated Active Voice Call Overlay */}
      {isInCall && (
        <div className="fixed inset-0 z-[400] bg-black/85 backdrop-blur-2xl flex flex-col justify-between items-center p-6 text-white animate-in zoom-in-95 duration-200">
          <div className="pt-8 text-center">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
              Phòng Thoại Học Tập · Mã Hóa Riêng Tư
            </span>
            <h3 className="text-xl font-bold font-display mt-2">
              {isGroup ? chat.groupName : person?.name}
            </h3>
            <p className="text-sm text-white/60 font-mono mt-1">{formatTime(callDuration)}</p>
          </div>

          {/* Central Avatar & Waveform Animation */}
          <div className="flex flex-col items-center gap-6 my-auto">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" />
              <div
                className="relative w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/40 shadow-2xl"
                style={{
                  background: isGroup
                    ? 'linear-gradient(135deg, #38e6c5, #7c6bff)'
                    : person?.avatarGradient || user.avatarGradient
                }}
              >
                {isGroup ? '👥' : person?.emoji || '✦'}
              </div>
            </div>

            {/* Audio visualization bars */}
            <div className="flex items-center gap-1.5 h-10">
              {[20, 45, 80, 50, 95, 30, 60, 90, 40, 70, 25].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-gradient-to-t from-emerald-400 to-purple-400 rounded-full"
                  style={{
                    height: `${h * 0.4}px`,
                    animation: 'pulse 0.8s infinite alternate ease-in-out',
                    animationDelay: `${i * 90}ms`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Call Controls Bar */}
          <div className="flex items-center gap-6 pb-8">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isMuted ? 'bg-amber-500 text-white' : 'glass text-white/80 hover:text-white'
              }`}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <button
              onClick={() => setIsInCall(false)}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
              aria-label="End call"
            >
              <PhoneOff className="w-7 h-7" />
            </button>

            <button
              className="w-14 h-14 rounded-full glass text-white/80 hover:text-white flex items-center justify-center"
              aria-label="Speaker"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
