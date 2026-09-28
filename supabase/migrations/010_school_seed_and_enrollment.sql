-- 010_school_seed_and_enrollment.sql

-- Seed the one real school this app is for. Idempotent: safe to re-run.
insert into public.schools (id, name, slug, address, status)
values ('00000000-0000-0000-0000-000000000001', 'THPT Cẩm Bình', 'thpt-cam-binh', 'Cẩm Xuyên, Hà Tĩnh', 'active')
on conflict (id) do nothing;

insert into public.classes (school_id, name, grade, academic_year)
select '00000000-0000-0000-0000-000000000001', name, grade, '2024 - 2027'
from (values
  ('12A1', '12'), ('12A2', '12'), ('12A3', '12'), ('12A4', '12'),
  ('11A1', '11'), ('11A2', '11'), ('11A3', '11'),
  ('10A1', '10'), ('10A2', '10'), ('10A3', '10')
) as seed(name, grade)
where not exists (
  select 1 from public.classes c
  where c.school_id = '00000000-0000-0000-0000-000000000001' and c.name = seed.name
);

-- Self-enrollment: a student can add themselves to a class they claim to be
-- in (this is a claimed/self-declared enrollment, not school-admin-verified
-- — see the brief's own note not to overbuild verification in Phase 1).
create policy "class_members_insert_self"
  on public.class_members for insert
  to authenticated
  with check (user_id = auth.uid());
