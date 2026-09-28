-- 011_canteen_seed.sql

insert into public.canteens (id, school_id, name)
values ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Căng-tin THPT Cẩm Bình')
on conflict (id) do nothing;

insert into public.canteen_items (canteen_id, name, price, category, emoji)
select '00000000-0000-0000-0000-000000000101', name, price, category, emoji
from (values
  ('Bánh Mì Pate Trứng Nóng Giòn', 15000, 'Ăn sáng', '🥪'),
  ('Xôi Xéo Ruốc Hành Phi Cô Lan', 12000, 'Ăn sáng', '🍚'),
  ('Trà Sữa Trân Châu Hoàng Kim', 18000, 'Đồ uống', '🧋'),
  ('Nước Cam Ép Nguyên Chất', 15000, 'Đồ uống', '🍊'),
  ('Xúc Xích Chiên Giòn', 10000, 'Ăn vặt', '🌭'),
  ('Bánh Tráng Trộn Cô Ba', 15000, 'Ăn vặt', '🌮'),
  ('Bút Bi Thiên Long', 5000, 'Dụng cụ học tập', '🖊️'),
  ('Vở Kẻ Ngang 96 Trang', 8000, 'Dụng cụ học tập', '📓')
) as seed(name, price, category, emoji)
where not exists (
  select 1 from public.canteen_items ci
  where ci.canteen_id = '00000000-0000-0000-0000-000000000101' and ci.name = seed.name
);
