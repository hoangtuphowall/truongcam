import React, { useState } from 'react';
import {
  Edit3,
  Shield,
  Bookmark,
  Activity,
  RotateCcw,
  X,
  Check,
  Sparkles
} from 'lucide-react';
import { UserProfile, Post } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  posts: Post[];
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onResetData: () => void;
  onViewSavedPosts: () => void;
  onSignOut?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  posts,
  onUpdateUser,
  onResetData,
  onViewSavedPosts,
  onSignOut
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Edit form state
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [school, setSchool] = useState(user.school);
  const [emoji, setEmoji] = useState(user.emoji);

  const userPostsCount = posts.filter((p) => p.personId === 0).length;
  const savedPostsCount = posts.filter((p) => p.saved).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: name.trim() || user.name,
      bio: bio.trim() || user.bio,
      school: school.trim() || user.school,
      emoji: emoji.trim() || user.emoji
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 px-4 pb-24 max-w-2xl mx-auto">
      {/* Profile Hero Card */}
      <div className="glass-card rounded-3xl p-6 text-center relative border border-white/20 shadow-xl overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-r from-[#7c6bff]/30 via-[#ff6bcb]/25 to-[#ffb84d]/20 -z-10" />

        {/* Big Avatar */}
        <div className="relative mx-auto mt-2 w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#7c6bff] via-[#ff6bcb] to-[#38e6c5] shadow-xl">
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-4xl font-bold text-white border-4 border-[#150d26] overflow-hidden"
            style={{ background: user.avatarGradient }}
          >
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.emoji
            )}
          </div>
        </div>

        {/* Details */}
        <h1 className="text-xl font-bold font-display text-white mt-3">{user.name}</h1>
        <p className="text-xs text-white/50 mt-1">
          <span className="font-code text-[11.5px] text-pink-300/90">{user.handle}</span> · {user.school}
        </p>

        <p className="text-xs sm:text-sm text-white/85 mt-3 max-w-md mx-auto leading-relaxed">
          {user.bio}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2 py-4 mt-3 border-y border-white/10 max-w-sm mx-auto">
          <div>
            <span className="block text-base font-bold text-white font-code tabular-nums">{user.friendsCount}</span>
            <span className="text-[10px] text-white/50 font-medium">Bạn bè</span>
          </div>
          <div>
            <span className="block text-base font-bold text-white font-code tabular-nums">{userPostsCount}</span>
            <span className="text-[10px] text-white/50 font-medium">Bài viết</span>
          </div>
          <div>
            <span className="block text-base font-bold text-white font-code tabular-nums">{user.groupsCount}</span>
            <span className="text-[10px] text-white/50 font-medium">Nhóm</span>
          </div>
          <div onClick={onViewSavedPosts} className="cursor-pointer group">
            <span className="block text-base font-bold text-pink-400 group-hover:scale-105 transition-transform font-code tabular-nums">
              {savedPostsCount}
            </span>
            <span className="text-[10px] text-pink-300 font-medium">Đã lưu</span>
          </div>
        </div>

        <button
          onClick={() => {
            setName(user.name);
            setBio(user.bio);
            setSchool(user.school);
            setEmoji(user.emoji);
            setIsEditModalOpen(true);
          }}
          className="mt-4 px-5 py-2 rounded-full bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-xs font-bold text-white shadow-md active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Chỉnh sửa hồ sơ</span>
        </button>
      </div>

      {/* Your Moments Gallery */}
      <div>
        <h2 className="text-sm font-bold text-white mb-2.5 px-1">Khoảnh Khắc & Kỷ Niệm</h2>
        <div className="grid grid-cols-3 gap-2 rounded-3xl overflow-hidden p-1 glass-card border border-white/15">
          {user.photos.map((photoGrad, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhoto(photoGrad)}
              className="aspect-square rounded-2xl cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-inner relative group flex items-center justify-center"
              style={{ background: photoGrad }}
            >
              <span className="text-xs text-white/60 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                Xem
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings List */}
      <div>
        <h2 className="text-sm font-bold text-white mb-2.5 px-1">Cài Đặt & Tiện Ích</h2>
        <div className="glass-card rounded-3xl overflow-hidden border border-white/15 divide-y divide-white/10">
          {/* Saved Posts Shortcut */}
          <div
            onClick={onViewSavedPosts}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 text-white flex items-center justify-center">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Bài viết đã lưu</span>
                <span className="text-[11px] text-white/50">{savedPostsCount} mục đã đánh dấu</span>
              </div>
            </div>
            <span className="text-xs text-white/40">Xem →</span>
          </div>

          {/* Privacy & Safety */}
          <div
            onClick={() => setIsPrivacyModalOpen(true)}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-indigo-500 text-white flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Quyền riêng tư & Bảo mật</span>
                <span className="text-[11px] text-white/50">Kiểm soát phạm vi hiển thị thông tin cá nhân</span>
              </div>
            </div>
            <span className="text-xs text-white/40">Quản lý →</span>
          </div>

          {/* Activity Log */}
          <div
            onClick={() => setIsActivityModalOpen(true)}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Nhật ký hoạt động</span>
                <span className="text-[11px] text-white/50">Lịch sử tương tác và bài viết</span>
              </div>
            </div>
            <span className="text-xs text-white/40">Mở →</span>
          </div>

          {/* Reset Demo Data */}
          <div
            onClick={onResetData}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-red-500/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-500/30 text-rose-300 flex items-center justify-center">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-300 block">Đặt lại dữ liệu mẫu</span>
                <span className="text-[11px] text-white/40">Khôi phục bài viết và tin nhắn ban đầu</span>
              </div>
            </div>
            <span className="text-xs text-rose-400/80">Khôi phục</span>
          </div>

          {/* Sign Out */}
          {onSignOut && (
            <div
              onClick={onSignOut}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-red-500/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-rose-500/30 text-rose-300 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-rose-300 block">Đăng xuất</span>
                  <span className="text-[11px] text-white/40">Thoát khỏi tài khoản Trường Cẩm</span>
                </div>
              </div>
              <span className="text-xs text-rose-400/80">Đăng xuất</span>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="w-full max-w-md glass-strong rounded-3xl border border-white/25 shadow-2xl p-5"
            style={{ background: 'rgba(21, 13, 38, 0.95)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white">Chỉnh Sửa Hồ Sơ</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-7 h-7 rounded-full glass flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-white/70 block mb-1">Tên hiển thị</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass rounded-xl px-3.5 py-2 text-xs text-white border border-white/20 outline-none focus:border-purple-400"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/70 block mb-1">Biểu tượng / Emoji đại diện</label>
                <input
                  type="text"
                  value={emoji}
                  maxLength={2}
                  onChange={(e) => setEmoji(e.target.value)}
                  className="w-16 glass rounded-xl px-3.5 py-2 text-center text-base text-white border border-white/20 outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/70 block mb-1">Lớp / Đơn vị / Trường học</label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full glass rounded-xl px-3.5 py-2 text-xs text-white border border-white/20 outline-none focus:border-purple-400"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/70 block mb-1">Tiểu sử</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full glass rounded-xl p-3 text-xs text-white border border-white/20 outline-none focus:border-purple-400 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-full glass text-xs font-semibold text-white/70"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-xs font-bold text-white shadow-md active:scale-95"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {isPrivacyModalOpen && (
        <div
          className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsPrivacyModalOpen(false)}
        >
          <div
            className="w-full max-w-md glass-strong rounded-3xl border border-white/25 shadow-2xl p-5"
            style={{ background: 'rgba(21, 13, 38, 0.95)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <h3 className="text-base font-bold text-white">Quyền Riêng Tư & An Toàn</h3>
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="w-7 h-7 rounded-full glass flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-white/80">
              <div className="p-3 glass rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Hiển thị nội bộ trường</span>
                  <span className="text-[11px] text-white/50">Chỉ học sinh và giáo viên trong trường có thể xem bài viết</span>
                </div>
                <span className="text-emerald-400 font-bold">Đã bật</span>
              </div>
              <div className="p-3 glass rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Trạng thái hoạt động</span>
                  <span className="text-[11px] text-white/50">Hiển thị chấm xanh khi đang trực tuyến</span>
                </div>
                <span className="text-emerald-400 font-bold">Hiển thị</span>
              </div>
              <div className="p-3 glass rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Cho phép nhắn tin</span>
                  <span className="text-[11px] text-white/50">Cho phép các bạn cùng trường gửi tin nhắn trực tiếp</span>
                </div>
                <span className="text-emerald-400 font-bold">Cho phép</span>
              </div>
            </div>

            <button
              onClick={() => setIsPrivacyModalOpen(false)}
              className="mt-4 w-full py-2.5 rounded-full bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] text-xs font-bold text-white shadow"
            >
              Hoàn tất
            </button>
          </div>
        </div>
      )}

      {/* Activity Modal */}
      {isActivityModalOpen && (
        <div
          className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsActivityModalOpen(false)}
        >
          <div
            className="w-full max-w-md glass-strong rounded-3xl border border-white/25 shadow-2xl p-5"
            style={{ background: 'rgba(21, 13, 38, 0.95)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <h3 className="text-base font-bold text-white">Nhật Ký Hoạt Động Gần Đây</h3>
              <button
                onClick={() => setIsActivityModalOpen(false)}
                className="w-7 h-7 rounded-full glass flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs max-h-72 overflow-y-auto pr-1">
              {[
                { action: 'Đã thích bài viết của Nguyễn Văn An "Bình minh trên sân trường Cẩm Bình"', time: '1 giờ trước' },
                { action: 'Đã tham gia nhóm "CLB Tiếng Anh Cẩm Bình"', time: '3 giờ trước' },
                { action: 'Đã lưu trích dẫn truyền cảm hứng', time: '5 giờ trước' },
                { action: 'Đã gửi tin nhắn trong nhóm "Chi Đoàn 12A1"', time: 'Hôm qua' },
                { action: 'Đã kết nối với Trần Thị Mai', time: '2 ngày trước' }
              ].map((item, i) => (
                <div key={i} className="p-3 glass rounded-2xl border border-white/10">
                  <p className="text-white/90">{item.action}</p>
                  <span className="text-[10px] text-white/40 block mt-1">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-sm w-full aspect-square rounded-3xl shadow-2xl overflow-hidden border border-white/30" style={{ background: selectedPhoto }}>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
