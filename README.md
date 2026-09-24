# Trường Cẩm (THPT Cẩm Bình)

Nền tảng mạng xã hội và tiện ích trường học dành cho học sinh Trường THPT Cẩm Bình (Cẩm Xuyên, Hà Tĩnh).

## 🌟 Tính Năng Chính

- **Mạng xã hội Trường Cẩm:** Bảng tin bài viết, Stories, Cẩm Shorts, Thả tim, Bình luận, Tìm kiếm bạn bè.
- **Nhắn tin Chat:** Trò chuyện riêng tư hoặc nhóm lớp.
- **Cẩm AI:** Trợ lý học tập giải bài tập Toán, Lý, Hóa, Văn, Anh bám sát chương trình THPT.
- **Căng-tin & Cẩm Ride:** Đặt trước đồ ăn giờ ra chơi, xe đưa đón học sinh.
- **Thẻ Học Sinh Số (CẩmID):** Điểm danh QR code, thẻ thư viện điện tử.
- **Bản Đồ Số Trường Học:** Định vị các dãy nhà A, B, C, sân bóng đá, thư viện, căng-tin.
- **Cẩm Music Player:** Trình phát nhạc học tập, giai điệu truyền thống THPT Cẩm Bình.
- **Cẩm Study Room:** Phòng học nhóm online bấm giờ Pomodoro 25 phút.
- **Trung Tâm Điều Khiển:** Bật tắt nhanh chế độ tập trung ôn thi, chỉnh âm lượng.

## 📁 Cấu Trúc Hình Ảnh (/public/)

Tất cả hình ảnh mặc định được quản lý tại thư mục `/public/` để dễ dàng bảo trì và thay thế:
- `/public/favicon.svg`: Icon nhận diện ứng dụng
- `/public/images/brand/`: Logo và biểu trưng Trường Cẩm
- `/public/images/avatars/`: Ảnh đại diện của học sinh và thầy cô
- `/public/images/posts/`: Ảnh các bài đăng sự kiện trường, đoàn trường, kỷ yếu
- `/public/images/canteen/`: Hình ảnh món ăn, đồ uống căng-tin
- `/public/images/campus/`: Hình ảnh khuôn viên và sơ đồ trường THPT Cẩm Bình

## 🗄️ Backend (Supabase) — Bắt Buộc Trước Khi Chạy

Dự án đã được chuyển từ `localStorage` giả sang backend thật bằng **Supabase**
(Auth + Postgres + Storage + Realtime). Trước khi `npm run dev`, cần:

1. **Áp dụng migrations vào project Supabase của bạn.**
   Các file SQL nằm ở `supabase/migrations/001_...` → `008_...`, chạy **theo đúng thứ tự**
   trong SQL Editor của Supabase Dashboard (Project → SQL Editor → dán từng file → Run),
   hoặc dùng Supabase CLI nếu đã cài:
   ```bash
   npx supabase link --project-ref qkkfdoufbuxxrqymzsmg
   npx supabase db push
   ```
2. **Kiểm tra file `.env.local`** (đã có sẵn key bạn cung cấp — không commit file này lên Git,
   `.gitignore` đã chặn sẵn):
   ```
   VITE_SUPABASE_URL="https://qkkfdoufbuxxrqymzsmg.supabase.co"
   VITE_SUPABASE_ANON_KEY="sb_publishable_..."
   ```
3. **Bật/tắt xác nhận email** cho việc đăng ký thử nhanh: Supabase Dashboard →
   Authentication → Providers → Email → tắt "Confirm email" nếu muốn đăng ký xong
   đăng nhập ngay không cần xác nhận qua mail (chỉ nên tắt lúc phát triển/demo).

> Cẩm AI, Cẩm Pay và phần lớn các mini-app khác (Canteen thật, Chat realtime, Bạn bè
> quan hệ thật...) **chưa được nối vào giao diện** ở bước này — bảng dữ liệu đã có sẵn
> trong Postgres (xem `supabase/migrations/`) và service layer mẫu đã có ở
> `src/lib/services/`, nhưng UI (`App.tsx`) vẫn đang dùng dữ liệu mẫu cục bộ cho các phần
> đó. Đây là quyết định có chủ đích để tránh đổi vỡ giao diện hàng loạt trong một lần —
> xem báo cáo audit để biết thứ tự các bước tiếp theo.

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

```bash
# 1. Cài đặt các gói phụ thuộc (đã thêm @supabase/supabase-js vào package.json)
npm install

# 2. Chạy môi trường phát triển (Dev)
npm run dev

# 3. Kiểm tra kiểu dữ liệu TypeScript
npm run lint

# 4. Build sản phẩm (Production)
npm run build
```

## 📤 Hướng Dẫn Push Lên Git (GitHub / GitLab)

```bash
git init
git add .
git commit -m "feat: khoi tao du an Truong Cam (THPT Cam Binh)"
git branch -M main
git remote add origin <URL_REPO_CUA_BAN>
git push -u origin main
```
