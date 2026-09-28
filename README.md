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
   Các file SQL nằm ở `supabase/migrations/001_...` → `017_...`, chạy **theo đúng thứ tự**
   trong SQL Editor của Supabase Dashboard (Project → SQL Editor → dán từng file → Run),
   hoặc dùng Supabase CLI nếu đã cài:
   ```bash
   npx supabase link --project-ref qkkfdoufbuxxrqymzsmg
   npx supabase db push
   ```
   👉 Chạy phần bạn còn thiếu theo thứ tự: `009` (thông báo tự động) → `010` (trường/lớp
   cho Cẩm ID) → `011` (menu căng-tin) → `012` (huỷ kết bạn thật) → `013` (chat nhóm thật)
   → `014` (bình luận reel thật) → **`015` (QUAN TRỌNG — vá lỗi bảo mật giá tiền Canteen,
   xem mục Production-readiness bên dưới)**.

## 🔒 Production-Readiness — Đã Rà & Vá

Trong lượt rà soát bảo mật cuối, mình phát hiện và vá các vấn đề sau:

1. **[Đã vá — `015`] Lỗ hổng giá tiền Canteen**: trước đây client tự tính tổng tiền đơn
   hàng rồi gửi lên — một client bị sửa đổi (hack) có thể đặt món với giá 0đ. Giờ giá được
   tính **hoàn toàn phía server** (hàm `place_canteen_order`), client chỉ được gửi
   "muốn mua gì, số lượng bao nhiêu", không được tự khai giá.
2. **Quên mật khẩu**: đã thêm luồng đầy đủ (gửi email → đặt mật khẩu mới) — trước đó hoàn
   toàn không có, học sinh quên mật khẩu sẽ bị khoá tài khoản vĩnh viễn.
3. **Error Boundary**: lỗi runtime JS giờ hiện màn hình "có lỗi xảy ra, tải lại trang" thay
   vì màn hình trắng hoàn toàn không rõ nguyên nhân.
4. **Báo cáo nội dung (moderation)**: bảng `reports` từng tồn tại nhưng không có UI — giờ
   mỗi bài viết (không phải của mình) có nút "Báo cáo bài viết" thật, ghi vào DB. Đây là yêu
   cầu an toàn bắt buộc cho một ứng dụng dành cho học sinh.
5. **Huỷ kết bạn, trạng thái nút "đã gửi lời mời"**: đã vá ở lượt trước.

### Đã rà nhưng CHƯA vá (cần bạn quyết định trước khi cho học sinh thật dùng hàng loạt):
- **Xác nhận email khi đăng ký**: mặc định Supabase có thể bật/tắt — nếu bật, học sinh phải
  bấm link trong email mới đăng nhập được (an toàn hơn nhưng phiền hơn). Xem phần Supabase
  Dashboard → Authentication → Providers → Email.
- Vẫn chưa build/chạy thử được bất kỳ dòng code nào ở phía mình (không có mạng) — bạn là
  người kiểm chứng cuối cùng trước khi công khai cho học sinh dùng thật.

## ✅ Đã bổ sung thêm (lượt sau)

6. **Rate limiting (`016`)**: chặn spam đăng bài/bình luận/tin nhắn/kết bạn bằng trigger
   database (VD: tối đa 8 bài đăng / 60 giây, 40 tin nhắn / 60 giây). Không cần Edge
   Function — xử lý thuần bằng SQL.
7. **Bảng quản trị duyệt báo cáo (`017`)**: mục "Duyệt báo cáo" trong Hồ sơ (chỉ hiện với
   tài khoản có `school_members.member_type = 'admin'`) — xem danh sách báo cáo, **Ẩn/Gỡ
   nội dung** hoặc **Bỏ qua**, có ghi log vào `moderation_actions`.

### Cách cấp quyền admin cho một tài khoản (làm thủ công qua SQL, không có UI tự cấp —
đây là chủ đích, không ai được tự phong admin cho chính mình):
```sql
update public.school_members
set member_type = 'admin'
where user_id = '<UUID của tài khoản>' and school_id = '00000000-0000-0000-0000-000000000001';
```
(Lấy UUID ở Supabase Dashboard → Authentication → Users, hoặc từ bảng `profiles`.)
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
