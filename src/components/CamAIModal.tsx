import React, { useState } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  Brain,
  Zap,
  BookOpen,
  CheckCircle2,
  Copy,
  RotateCcw
} from 'lucide-react';

interface CamAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  model: 'Cẩm GPT' | 'Cẩm Gemini' | 'Cẩm Claude';
  time: string;
}

export const CamAIModal: React.FC<CamAIModalProps> = ({ isOpen, onClose, initialPrompt }) => {
  const [selectedModel, setSelectedModel] = useState<'Cẩm GPT' | 'Cẩm Gemini' | 'Cẩm Claude'>('Cẩm GPT');
  const [inputText, setInputText] = useState(initialPrompt || '');
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'm-init',
      sender: 'ai',
      text: 'Chào bạn! Mình là Trợ lý Học Tập AI của THPT Cẩm Bình. Bạn cần giải bài tập Toán, Văn, Lý, Hóa hay ôn thi môn nào hôm nay?',
      model: 'Cẩm GPT',
      time: 'Bây giờ'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: '📐 Giải Toán Oxyz', prompt: 'Hướng dẫn giải bài toán tìm tọa độ hình chiếu của điểm M lên mặt phẳng (P) trong không gian Oxyz.' },
    { label: '✍️ Dàn ý bài thơ Tây Tiến', prompt: 'Lập dàn ý chi tiết phân tích vẻ đẹp bi tráng của người lính trong bài thơ Tây Tiến của Quang Dũng.' },
    { label: '⚗️ Cân bằng Hóa Este', prompt: 'Tóm tắt lý thuyết phản ứng xà phòng hóa este no đơn chức mạch hở và công thức giải nhanh bài tập.' },
    { label: '🇬🇧 Ngữ pháp thi THPT QG', prompt: 'Tổng hợp 10 cấu trúc câu đảo ngữ và câu điều kiện hỗn hợp hay xuất hiện nhất trong đề thi tốt nghiệp THPT.' }
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: AIMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      model: selectedModel,
      time: 'Vừa xong'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Generate tailored, high-value educational response for THPT Cẩm Bình students
    setTimeout(() => {
      let replyText = '';
      const lower = query.toLowerCase();

      if (lower.includes('toán') || lower.includes('oxyz') || lower.includes('tọa độ')) {
        replyText = `### 📐 Hướng dẫn giải phương pháp Tọa độ Oxyz (Ôn thi THPT Quốc Gia - THPT Cẩm Bình)

1. **Phương pháp tổng quát:**
   - Cho mặt phẳng $(P): Ax + By + Cz + D = 0$ có VTPT $\\vec{n} = (A, B, C)$.
   - Điểm $M(x_0, y_0, z_0)$. Gọi $H$ là hình chiếu vuông góc của $M$ lên $(P)$.
   - Đường thẳng $\\Delta$ đi qua $M$ và vuông góc với $(P)$ có VTCP $\\vec{u} = \\vec{n} = (A, B, C)$.

2. **Phương trình tham số của $\\Delta$:**
   $$\\begin{cases} x = x_0 + At \\\\ y = y_0 + Bt \\\\ z = z_0 + Ct \\end{cases}$$

3. **Tìm tọa độ điểm $H$:**
   Thay tọa độ $(x, y, z)$ theo tham số $t$ vào phương trình mặt phẳng $(P)$, giải phương trình bậc nhất tìm $t_0$.
   Từ đó suy ra tọa độ hình chiếu $H(x_0 + At_0, y_0 + Bt_0, z_0 + Ct_0)$.

💡 **Mẹo trắc nghiệm:** Công thức tính nhanh tham số $t_0$:
$$t_0 = -\\frac{A x_0 + B y_0 + C z_0 + D}{A^2 + B^2 + C^2}$$`;
      } else if (lower.includes('tây tiến') || lower.includes('văn') || lower.includes('quang dũng')) {
        replyText = `### ✍️ Dàn ý trọng tâm: Vẻ đẹp bi tráng của hình tượng người lính Tây Tiến (Quang Dũng)

**I. Mở bài:**
- Giới thiệu tác giả Quang Dũng - người nghệ sĩ đa tài, mang hồn thơ phóng khoáng, lãng mạn.
- Hoàn cảnh sáng tác bài thơ *Tây Tiến* (1948 tại Phù Lưu Chanh) khi nhà thơ nhớ về đơn vị cũ.
- Nêu vấn đề: Vẻ đẹp vừa hào hùng, lãng mạn vừa thấm đẫm chất bi tráng của người lính Tây Tiến.

**II. Thân bài:**
1. *Vẻ đẹp hào hoa, lãng mạn trên nền thiên nhiên Tây Bắc hiểm trở:*
   - Vượt qua dốc Sài Khao, Mường Lát sương lấp: "Súng ngửi trời", tâm hồn trẻ trung thách thức gian khổ.
   - Những đêm liên hoan rực rỡ men say tình quân dân: "Kìa em xiêm áo tự bao giờ", tiếng khèn điệu nhạc e ấp.
2. *Chất bi tráng độc đáo, không hề bi lụy:*
   - Ngoại hình kỳ dị vì sốt rét rừng: "Đoàn binh không mọc tóc / Quân xanh màu lá dữ oai hùm".
   - Khát vọng lý tưởng dâng hiến thanh xuân: "Chiến trường đi chẳng tiếc đời xanh".
   - Sự hy sinh thanh thản hóa thành bất tử: "Áo bào thay chiếu anh về đất / Sông Mã gầm lên khúc độc hành".

**III. Kết bài:**
- Khẳng định tượng đài bất tử về người lính vệ quốc thời kỳ đầu kháng chiến chống Pháp.
- Cảm xúc tự hào của học sinh THPT Cẩm Bình trước truyền thống yêu nước của cha anh.`;
      } else if (lower.includes('hóa') || lower.includes('este') || lower.includes('xà phòng')) {
        replyText = `### ⚗️ Tóm tắt công thức trọng tâm Este no đơn chức mạch hở:

1. **Công thức phân tử:** $C_n H_{2n} O_2$ ($n \\ge 2$).
2. **Phản ứng xà phòng hóa với NaOH:**
   $$RCOOR' + NaOH \\xrightarrow{t^o} RCOONa + R'OH$$
   - Định luật bảo toàn khối lượng: $m_{\\text{este}} + m_{\\text{NaOH}} = m_{\\text{muối}} + m_{\\text{ancol}}$.
   - $n_{\\text{este}} = n_{\\text{NaOH}} = n_{\\text{muối}} = n_{\\text{ancol}}$ (đối với este đơn chức thường).
3. **Lưu ý đặc biệt este của phenol ($RCOOC_6H_4R'$):**
   - Phản ứng với NaOH theo tỉ lệ $1:2$, sinh ra 2 muối và $H_2O$ (không sinh ra ancol).`;
      } else {
        replyText = `Tuyệt vời! Dưới đây là giải đáp chi tiết theo chương trình chuẩn giáo dục THPT Cẩm Bình:

✅ **Nội dung cốt lõi:**
${query}

📌 **Phân tích & Hướng dẫn từng bước:**
1. Xác định giả thiết và yêu cầu bài toán/câu hỏi.
2. Áp dụng định lý hoặc lý thuyết trọng tâm bám sát cấu trúc đề thi tốt nghiệp THPT năm 2026.
3. Rút ra kết luận và ghi chú các lỗi sai thường gặp khi làm bài thi trắc nghiệm.

*Chúc bạn ôn tập hiệu quả cùng Trường Cẩm! Nếu cần làm rõ câu hỏi nào, hãy tiếp tục gửi cho mình nhé.*`;
      }

      const aiMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        model: selectedModel,
        time: 'Vừa xong'
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-2xl animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl h-[90vh] max-h-[720px] liquid-glass rounded-[36px] shadow-2xl border border-white/30 text-white flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-4 px-5 border-b border-white/15 flex items-center justify-between liquid-glass-subtle shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[22%] bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white leading-none">Cẩm AI Trợ Lý</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-semibold border border-emerald-400/30">
                  THPT Cẩm Bình
                </span>
              </div>
              <p className="text-[11px] text-white/60 mt-0.5">
                Trợ lý giải bài tập và hướng dẫn ôn thi THPT Quốc Gia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Model Switcher */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-2xl bg-black/40 border border-white/10 text-xs">
              {(['Cẩm GPT', 'Cẩm Gemini', 'Cẩm Claude'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedModel(m)}
                  className={`px-2.5 py-1 rounded-xl font-medium transition-all ${
                    selectedModel === m
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-2.5 px-4 bg-white/5 border-b border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-semibold text-white whitespace-nowrap transition-all hover:scale-105 active:scale-95"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Conversation Message List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 no-scrollbar">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-xs shrink-0 shadow-md">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`rounded-3xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed relative group ${
                    isUser
                      ? 'bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-white shadow-lg'
                      : 'liquid-glass-subtle border border-white/20 text-white/95 shadow-md'
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center justify-between mb-2 text-[10px] text-white/50 border-b border-white/10 pb-1.5">
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> {msg.model}
                      </span>
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="hover:text-white flex items-center gap-1 transition-colors"
                        title="Sao chép câu trả lời"
                      >
                        {copiedId === msg.id ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === msg.id ? 'Đã chép' : 'Sao chép'}</span>
                      </button>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap font-clean">{msg.text}</div>

                  <div className="text-[9.5px] text-white/40 text-right mt-1.5 font-mono">
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-white/60 pl-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/50 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="animate-pulse">{selectedModel} đang suy nghĩ và giải đề...</span>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-3 sm:p-4 liquid-glass-subtle border-t border-white/15 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Nhập câu hỏi bài tập hoặc chủ đề cần ôn (${selectedModel})...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl liquid-glass border border-white/20 text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-400/80 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="w-12 h-11 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 flex items-center justify-center text-white shadow-lg transition-all cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
