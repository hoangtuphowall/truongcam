import React, { useState } from 'react';
import {
  X,
  Flame,
  RotateCw,
  Check,
  Award,
  ChevronRight,
  BookOpen,
  Sparkles
} from 'lucide-react';

interface CamQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Flashcard {
  word: string;
  phonetic: string;
  type: string;
  meaning: string;
  example: string;
}

export const CamQuizModal: React.FC<CamQuizModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'flashcard' | 'quiz'>('flashcard');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});

  if (!isOpen) return null;

  const flashcards: Flashcard[] = [
    {
      word: 'Perseverance',
      phonetic: '/ˌpɜː.sɪˈvɪə.rəns/',
      type: 'noun',
      meaning: 'Sự kiên trì, bền chí vượt qua thử thách',
      example: 'Her perseverance paid off when she got into her dream university.'
    },
    {
      word: 'Comprehensive',
      phonetic: '/ˌkɒm.prɪˈhen.sɪv/',
      type: 'adjective',
      meaning: 'Toàn diện, bao quát mọi khía cạnh',
      example: 'The school provides comprehensive review sets for graduation exams.'
    },
    {
      word: 'Diligent',
      phonetic: '/ˈdɪl.ɪ.dʒənt/',
      type: 'adjective',
      meaning: 'Cần cù, chăm chỉ, siêng năng',
      example: 'Diligent students at Cam Binh High School always support each other.'
    },
    {
      word: 'Pivotal',
      phonetic: '/ˈpɪv.ə.təl/',
      type: 'adjective',
      meaning: 'Mang tính then chốt, mang tính quyết định',
      example: 'The 12th grade is a pivotal year for every Vietnamese student.'
    }
  ];

  const quizQuestions = [
    {
      id: 1,
      question: 'Từ nào đồng nghĩa với "Hard-working" trong đề thi THPT Quốc Gia?',
      options: ['Diligent', 'Reluctant', 'Careless', 'Passive'],
      correct: 0
    },
    {
      id: 2,
      question: 'Chọn câu điều kiện loại 2 đúng: "If I _____ you, I would take the mock exam."',
      options: ['am', 'were', 'have been', 'had been'],
      correct: 1
    },
    {
      id: 3,
      question: 'Trọng âm của từ "Perseverance" rơi vào âm tiết thứ mấy?',
      options: ['Thứ 1', 'Thứ 2', 'Thứ 3', 'Thứ 4'],
      correct: 2
    }
  ];

  const currentCard = flashcards[currentIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handleSelectQuiz = (qId: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleFinishQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct) {
        score += 1;
      }
    });
    setQuizScore(score);
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
            <div className="w-10 h-10 rounded-[22%] bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg text-xl">
              🦉
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-white">Cẩm Flashcard & Quiz</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/30 text-green-300 font-semibold border border-green-400/30">
                  Ôn luyện từ vựng
                </span>
              </div>
              <p className="text-[11px] text-white/60">Luyện 3000 từ vựng cốt lõi tiếng Anh THPT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Duolingo Streak Flame Banner */}
        <div className="liquid-glass-subtle rounded-3xl p-3.5 px-4 border border-amber-400/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5 fill-amber-400 animate-bounce" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                Chuỗi học tập: <span className="text-amber-400 font-mono">14 Ngày</span>
              </div>
              <div className="text-[10px] text-white/60">Bạn đang duy trì thói quen học rất tốt!</div>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-300/30">
            Top 5% Trường
          </span>
        </div>

        {/* Transparent Liquid Glass Tab Switch */}
        <div className="flex justify-center">
          <div className="ios-toggle-menu w-full">
            <button
              onClick={() => setActiveTab('flashcard')}
              className={`ios-toggle-item flex-1 justify-center ${activeTab === 'flashcard' ? 'ios-toggle-active' : ''}`}
            >
              Flashcard (Lật thẻ)
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`ios-toggle-item flex-1 justify-center ${activeTab === 'quiz' ? 'ios-toggle-active' : ''}`}
            >
              Trắc nghiệm nhanh
            </button>
          </div>
        </div>

        {/* Tab 1: Flashcard */}
        {activeTab === 'flashcard' && (
          <div className="flex flex-col items-center gap-4">
            {/* Interactive Flip Card */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full h-64 rounded-[32px] p-6 cursor-pointer select-none transition-all duration-300 flex flex-col items-center justify-center text-center relative border border-white/30 shadow-2xl group hover:scale-[1.02]"
              style={{
                background: isFlipped
                  ? 'linear-gradient(145deg, rgba(34, 197, 94, 0.4) 0%, rgba(13, 148, 136, 0.4) 100%)'
                  : 'linear-gradient(145deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(30px)'
              }}
            >
              {!isFlipped ? (
                /* Front of card */
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-green-300 bg-green-500/20 px-2 py-0.5 rounded-full uppercase">
                    {currentCard.type}
                  </span>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {currentCard.word}
                  </h3>
                  <p className="text-xs text-white/60 font-mono">{currentCard.phonetic}</p>
                  <p className="text-[10px] text-white/40 mt-4 flex items-center justify-center gap-1">
                    <RotateCw className="w-3 h-3 animate-spin" /> Chạm để xem nghĩa tiếng Việt
                  </p>
                </div>
              ) : (
                /* Back of card */
                <div className="space-y-3">
                  <span className="text-xs uppercase font-bold text-amber-300">Ý nghĩa cốt lõi:</span>
                  <h4 className="text-xl font-bold text-white">{currentCard.meaning}</h4>
                  <div className="p-3 rounded-2xl bg-black/30 border border-white/10 text-xs text-white/80 italic">
                    "{currentCard.example}"
                  </div>
                  <p className="text-[10px] text-emerald-300 font-semibold">
                    ✓ Thường gặp trong bài Đọc hiểu THPT QG
                  </p>
                </div>
              )}
            </div>

            {/* Card Controls */}
            <div className="w-full flex items-center justify-between text-xs text-white/60">
              <span>Thẻ {currentIndex + 1} / {flashcards.length}</span>
              <button
                onClick={handleNextCard}
                className="px-4 py-2 rounded-2xl bg-green-500 hover:bg-green-400 text-black font-bold flex items-center gap-1 cursor-pointer transition-transform active:scale-95 shadow"
              >
                <span>Thẻ tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Quick Quiz */}
        {activeTab === 'quiz' && (
          <div className="flex flex-col gap-4">
            {quizScore === null ? (
              <>
                {quizQuestions.map((q) => (
                  <div key={q.id} className="liquid-glass-subtle rounded-2xl p-3.5 border border-white/15 space-y-2">
                    <div className="text-xs font-bold text-white">
                      Câu {q.id}: {q.question}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selectedAnswers[q.id] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectQuiz(q.id, optIdx)}
                            className={`p-2 rounded-xl text-xs font-medium text-left transition-all border ${
                              isChosen
                                ? 'bg-green-500 text-black border-green-400 font-bold shadow'
                                : 'bg-white/10 text-white/80 border-white/10 hover:bg-white/20'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleFinishQuiz}
                  disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                  className="py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 disabled:opacity-40 text-black font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Nộp Bài Chấm Điểm Ngay</span>
                </button>
              </>
            ) : (
              <div className="liquid-glass-subtle rounded-3xl p-6 text-center space-y-3 border border-green-400/40 animate-in zoom-in-95">
                <div className="text-4xl">🎉</div>
                <h3 className="text-lg font-bold text-white">Kết Quả Bài Kiểm Tra</h3>
                <div className="text-3xl font-mono font-black text-green-300">
                  {quizScore} / {quizQuestions.length} Điểm
                </div>
                <p className="text-xs text-white/70">
                  {quizScore === 3 ? 'Tuyệt đỉnh! Bạn nắm rất vững kiến thức đề thi tốt nghiệp.' : 'Khá tốt! Hãy ôn lại một chút thẻ từ vựng nhé.'}
                </p>
                <button
                  onClick={() => {
                    setQuizScore(null);
                    setSelectedAnswers({});
                  }}
                  className="px-5 py-2 rounded-2xl bg-green-500 text-black font-bold text-xs shadow"
                >
                  Làm Lại Lần Nữa
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
