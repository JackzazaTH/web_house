import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signAdminToken } from '@/src/lib/jwt';

async function loginAction(formData: FormData) {
  'use server';
  const password = String(formData.get('password') || '');
  const next = String(formData.get('next') || '/admin');
  const ok = password === (process.env.ADMIN_PASSWORD || 'admin123');
  if (!ok) {
    redirect('/admin/login?error=1');
  }
  const token = signAdminToken();
  cookies().set('token', token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
  redirect(next || '/admin');
}

export default function AdminLoginPage({ searchParams }: { searchParams: Record<string, string | undefined>}) {
  const error = searchParams?.error;
  const next = searchParams?.next || '/admin';
  return (
    <div className="container py-20 max-w-md">
      <form action={loginAction} className="card space-y-3">
        <div className="text-xl font-semibold">เข้าสู่ระบบหลังบ้าน</div>
        {error && <div className="text-sm text-red-600">รหัสผ่านไม่ถูกต้อง</div>}
        <input type="hidden" name="next" value={next}/>
        <div>
          <label className="label">รหัสผ่านผู้ดูแล</label>
          <input type="password" name="password" required className="input"/>
        </div>
        <button className="btn w-full" type="submit">เข้าสู่ระบบ</button>
      </form>
    </div>
  );
}
