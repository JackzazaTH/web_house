import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';

async function createBanner(formData: FormData) {
  'use server';
  const data = {
    title: String(formData.get('title') || ''),
    subtitle: String(formData.get('subtitle') || ''),
    imageUrl: String(formData.get('imageUrl') || ''),
    buttonText: String(formData.get('buttonText') || ''),
    buttonLink: String(formData.get('buttonLink') || '')
  };
  await prisma.banner.create({ data });
  revalidatePath('/admin/banners');
}

async function deleteBanner(formData: FormData) {
  'use server';
  const id = Number(formData.get('id') || 0);
  if (id) await prisma.banner.delete({ where: { id }});
  revalidatePath('/admin/banners');
}

export default async function AdminBanners() {
  const banners = await prisma.banner.findMany({ orderBy: { createdAt: 'desc' }});
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card">
        <div className="text-lg font-semibold mb-3">เพิ่มแบนเนอร์</div>
        <form action={createBanner} className="grid gap-3">
          <div><label className="label">หัวข้อ</label><input name="title" required className="input"/></div>
          <div><label className="label">รายละเอียด</label><input name="subtitle" className="input"/></div>
          <div><label className="label">รูป URL</label><input name="imageUrl" required className="input"/></div>
          <div><label className="label">ปุ่ม</label><input name="buttonText" className="input"/></div>
          <div><label className="label">ลิงก์ปุ่ม</label><input name="buttonLink" className="input"/></div>
          <button className="btn">บันทึก</button>
        </form>
      </div>
      <div className="card">
        <div className="text-lg font-semibold mb-3">รายการแบนเนอร์</div>
        <ul className="space-y-3">
          {banners.map(b => (
            <li key={b.id} className="border p-3 rounded-lg">
              <div className="font-medium">{b.title}</div>
              <div className="text-sm text-slate-600">{b.subtitle}</div>
              <form action={deleteBanner}>
                <input type="hidden" name="id" value={b.id}/>
                <button className="text-red-600 underline text-sm mt-2" type="submit">ลบ</button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
