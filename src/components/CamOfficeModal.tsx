import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  FileText,
  FolderDown,
  CheckSquare,
  Square,
  Sparkles,
  Download,
  Plus
} from 'lucide-react';
import { GpaGrade } from '../types';
import { INITIAL_GPA_GRADES } from '../data/initialData';

interface CamOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CamOfficeModal: React.FC<CamOfficeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'excel' | 'notion' | 'drive'>('excel');
  const [grades, setGrades] = useState<GpaGrade[]>(INITIAL_GPA_GRADES);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [todos, setTodos] = useState([
    { id: 't1', text: 'Làm 50 câu trắc nghiệm Toán Oxyz đề Hà Tĩnh', done: true, tag: 'Toán' },
    { id: 't2', text: 'Học thuộc 20 từ vựng Unit 8 Tiếng Anh 12', done: true, tag: 'Anh' },
    { id: 't3', text: 'Viết mở bài và kết bài bài thơ Đất Nước', done: false, tag: 'Văn' },
    { id: 't4', text: 'Nộp bài thực hành Tin học Python cho thầy Tuấn', done: false, tag: 'Tin' }
  ]);
  const [newTodoText, setNewTodoText] = useState('');

  if (!isOpen) return null;

  // Calculate GPA
  const totalWeight = grades.reduce((acc, g) => acc + g.weight, 0);
  const weightedSum = grades.reduce((acc, g) => {
    const subjectAvg = (g.midterm + g.final * 2) / 3;
    return acc + subjectAvg * g.weight;
  }, 0);
  const gpa = totalWeight > 0 ? (weightedSum / totalWeight).toFixed(2) : '0.00';

  const handleGradeChange = (index: number, field: 'midterm' | 'final', value: string) => {
    const num = Math.min(10, Math.max(0, parseFloat(value) || 0));
    setGrades((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: num };
      return next;
    });
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    setTodos((prev) => [
      ...prev,
      { id: `todo-${Date.now()}`, text: newTodoText, done: false, tag: 'Ôn thi' }
    ]);
    setNewTodoText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl h-[90vh] max-h-[720px] liquid-glass rounded-[36px] shadow-2xl border border-white/35 text-white flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 px-5 border-b border-white/15 flex items-center justify-between liquid-glass-subtle shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[22%] bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-white">Cẩm Office & Kho Lưu Trữ</h2>
              </div>
              <p className="text-[11px] text-white/60">
                Tính điểm GPA, quản lý thời khóa biểu và tải đề thi thử THPT Cẩm Bình
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Transparent Liquid Glass Tab Switcher */}
        <div className="p-2.5 px-5 border-b border-white/10 flex justify-center shrink-0">
          <div className="ios-toggle-menu w-full max-w-lg">
            <button
              onClick={() => setActiveTab('excel')}
              className={`ios-toggle-item flex-1 justify-center ${activeTab === 'excel' ? 'ios-toggle-active' : ''}`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Tính GPA (Excel)</span>
            </button>
            <button
              onClick={() => setActiveTab('notion')}
              className={`ios-toggle-item flex-1 justify-center ${activeTab === 'notion' ? 'ios-toggle-active' : ''}`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Kế hoạch (Notion)</span>
            </button>
            <button
              onClick={() => setActiveTab('drive')}
              className={`ios-toggle-item flex-1 justify-center ${activeTab === 'drive' ? 'ios-toggle-active' : ''}`}
            >
              <FolderDown className="w-3.5 h-3.5" />
              <span>Kho Đề Thi (Drive)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: GPA Calculator (Excel / Sheets) */}
        {activeTab === 'excel' && (
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto flex flex-col gap-4 no-scrollbar">
            {/* GPA Summary Card */}
            <div className="liquid-glass-subtle rounded-3xl p-4 border border-emerald-400/40 flex items-center justify-between">
              <div>
                <div className="text-xs text-white/70">Điểm trung bình học kỳ dự kiến (GPA):</div>
                <div className="text-3xl font-black font-mono text-emerald-300 mt-0.5">
                  {gpa} <span className="text-xs font-bold text-white/70">/ 10</span>
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-400/30">
                  {parseFloat(gpa) >= 8.0 ? 'Học Lực: Giỏi 🌟' : 'Học Lực: Khá 👍'}
                </span>
                <div className="text-[10px] text-white/50 mt-1">Lớp 12A1 · Ban Tự Nhiên</div>
              </div>
            </div>

            {/* Editable Grades Table */}
            <div className="liquid-glass-subtle rounded-3xl border border-white/15 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/15 bg-white/10 text-white/70 font-bold">
                    <th className="p-3 pl-4">Môn học</th>
                    <th className="p-3 text-center">Giữa kỳ (hệ số 1)</th>
                    <th className="p-3 text-center">Cuối kỳ (hệ số 2)</th>
                    <th className="p-3 text-center pr-4">ĐTB Môn</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g, idx) => {
                    const avg = ((g.midterm + g.final * 2) / 3).toFixed(1);
                    return (
                      <tr key={g.subject} className="border-b border-white/10 hover:bg-white/5">
                        <td className="p-2.5 pl-4 font-bold text-white">{g.subject}</td>
                        <td className="p-2.5 text-center">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={g.midterm}
                            onChange={(e) => handleGradeChange(idx, 'midterm', e.target.value)}
                            className="w-14 text-center py-1 rounded-lg bg-black/40 border border-white/20 text-white font-mono font-bold focus:outline-none focus:border-emerald-400"
                          />
                        </td>
                        <td className="p-2.5 text-center">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={g.final}
                            onChange={(e) => handleGradeChange(idx, 'final', e.target.value)}
                            className="w-14 text-center py-1 rounded-lg bg-black/40 border border-white/20 text-white font-mono font-bold focus:outline-none focus:border-emerald-400"
                          />
                        </td>
                        <td className="p-2.5 text-center pr-4 font-mono font-bold text-emerald-300">
                          {avg}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Notion Study To-Do List */}
        {activeTab === 'notion' && (
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 no-scrollbar">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">To-Do List Ôn Thi THPT Quốc Gia</h3>
                <p className="text-[11px] text-white/50">Thời khóa biểu cá nhân phong cách Notion</p>
              </div>
              <span className="text-xs font-mono font-bold text-purple-300">
                {todos.filter((t) => t.done).length} / {todos.length} hoàn thành
              </span>
            </div>

            {/* Todo List */}
            <div className="flex flex-col gap-2">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  onClick={() => toggleTodo(todo.id)}
                  className={`p-3 rounded-2xl liquid-glass-subtle border cursor-pointer flex items-center justify-between gap-3 transition-all ${
                    todo.done ? 'border-purple-500/30 bg-purple-500/10 opacity-70' : 'border-white/15 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {todo.done ? (
                      <CheckSquare className="w-5 h-5 text-purple-400 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-white/40 shrink-0" />
                    )}
                    <span className={`text-xs font-medium truncate ${todo.done ? 'line-through text-white/50' : 'text-white'}`}>
                      {todo.text}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-purple-300 font-bold shrink-0">
                    {todo.tag}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Todo */}
            <form onSubmit={handleAddTodo} className="mt-auto flex gap-2">
              <input
                type="text"
                placeholder="Thêm mục tiêu ôn tập mới..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl liquid-glass border border-white/20 text-xs text-white placeholder:text-white/40 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Google Drive Kho Đề Thi */}
        {activeTab === 'drive' && (
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3 no-scrollbar">
            <div className="text-xs font-bold text-white/70 px-1">Kho tài liệu ôn thi THPT Quốc Gia · Cẩm Drive</div>

            {downloadNotice && (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-medium flex items-center justify-between animate-in fade-in">
                <span>{downloadNotice}</span>
                <button
                  onClick={() => setDownloadNotice(null)}
                  className="text-white/60 hover:text-white text-xs underline ml-2"
                >
                  Đóng
                </button>
              </div>
            )}

            {[
              { title: 'Đề thi thử Toán tỉnh Hà Tĩnh đợt 1 (Có đáp án chi tiết).pdf', size: '2.4 MB', date: 'Cập nhật hôm qua', by: 'Thầy Tuấn' },
              { title: 'Chuyên đề 50 bài văn nghị luận xã hội điểm 9+ ôn thi 2026.pdf', size: '4.8 MB', date: '3 ngày trước', by: 'Cô Linh' },
              { title: 'Tổng hợp 1000 câu trắc nghiệm Hóa este & lipit có lời giải.pdf', size: '3.1 MB', date: '1 tuần trước', by: 'Đặng Quang Huy' },
              { title: 'Slide bài giảng Lịch sử Việt Nam giai đoạn 1945 - 1975.pptx', size: '8.5 MB', date: '2 tuần trước', by: 'Tổ Sử - Địa' }
            ].map((file, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl liquid-glass-subtle border border-white/15 flex items-center justify-between gap-3 hover:border-blue-400/50 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                    PDF
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{file.title}</h4>
                    <div className="text-[10px] text-white/50 mt-0.5">
                      {file.size} · Đăng bởi {file.by} · {file.date}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setDownloadNotice(`Đang tải xuống "${file.title}" từ Cẩm Drive...`);
                    setTimeout(() => setDownloadNotice(null), 4000);
                  }}
                  className="p-2 rounded-xl bg-blue-500/30 hover:bg-blue-500/50 text-blue-300 border border-blue-400/40 text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tải về</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
