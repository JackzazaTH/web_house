import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';

async function createLead(formData: FormData) {
  'use server';
  const name = String(formData.get('name') || '');
  const phone = String(formData.get('phone') || '');
  const email = String(formData.get('email') || '');
  const message = String(formData.get('message') || '');
  await prisma.lead.create({ data: { name, phone, email, message } });
  revalidatePath('/admin/leads');
}

export default function ContactPage() {
  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">ติดต่อเรา</h1>
      <form action={createLead} className="card space-y-3">
        <div><label className="label">ชื่อ</label><input name="name" required className="input"/></div>
        <div><label className="label">เบอร์โทร</label><input name="phone" required className="input"/></div>
        <div><label className="label">อีเมล</label><input type="email" name="email" className="input"/></div>
        <div><label className="label">ข้อความ</label><textarea name="message" rows={4} className="input"/></div>
        <button className="btn">ส่งข้อความ</button>
      </form>
    </div>
  );
}
