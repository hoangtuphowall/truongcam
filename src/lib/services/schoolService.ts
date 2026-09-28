import { supabase } from '../supabase/client';

export const CAM_BINH_SCHOOL_ID = '00000000-0000-0000-0000-000000000001';

export interface DbClass {
  id: string;
  name: string;
  grade: string | null;
  academicYear: string | null;
}

export interface DbEnrollment {
  studentCode: string | null;
  status: string;
  className: string;
  classId: string;
}

export async function listClasses(schoolId: string = CAM_BINH_SCHOOL_ID): Promise<DbClass[]> {
  const { data, error } = await supabase
    .from('classes')
    .select('id, name, grade, academic_year')
    .eq('school_id', schoolId)
    .order('name');
  if (error) throw error;
  return (data ?? []).map((row) => ({ id: row.id, name: row.name, grade: row.grade, academicYear: row.academic_year }));
}

export async function getMyEnrollment(userId: string): Promise<DbEnrollment | null> {
  const { data: membership, error } = await supabase
    .from('school_members')
    .select('student_code, status')
    .eq('user_id', userId)
    .eq('school_id', CAM_BINH_SCHOOL_ID)
    .maybeSingle();
  if (error) throw error;
  if (!membership) return null;

  const { data: classMember, error: classErr } = await supabase
    .from('class_members')
    .select('class_id, classes(name)')
    .eq('user_id', userId)
    .maybeSingle();
  if (classErr) throw classErr;

  const className = classMember
    ? Array.isArray(classMember.classes)
      ? classMember.classes[0]?.name
      : (classMember.classes as any)?.name
    : null;

  return {
    studentCode: membership.student_code,
    status: membership.status,
    className: className ?? 'Chưa chọn lớp',
    classId: classMember?.class_id ?? ''
  };
}

export async function enroll(params: { userId: string; classId: string; studentCode: string }): Promise<void> {
  const { error: schoolErr } = await supabase.from('school_members').insert({
    school_id: CAM_BINH_SCHOOL_ID,
    user_id: params.userId,
    member_type: 'student',
    student_code: params.studentCode,
    status: 'active'
  });
  if (schoolErr) throw schoolErr;

  const { error: classErr } = await supabase.from('class_members').insert({
    class_id: params.classId,
    user_id: params.userId,
    role: 'student'
  });
  if (classErr) throw classErr;
}
