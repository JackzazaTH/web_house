import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function createPlan(formData: FormData) {
  'use server';
  const data = {
    title: String(formData.get('title') || ''),
    slug: String(formData.get('slug') || ''),
    price: Number(formData.get('price') || 0),
    beds: Number(formData.get('beds') || 0),
    baths: Number(formData.get('baths') || 0),
    areaSqm: Number(formData.get('areaSqm') || 0),
    floors: Number(formData.get('floors') || 1),
    coverImage: String(formData.get('coverImage') || ''),
    description: String(formData.get('description') || ''),
    categoryId: Number(formData.get('categoryId') || 0) || null,
    gallery: (String(formData.get('gallery') || '').split('\n').filter(Boolean)),
    specs: {}
  } as any;
  await prisma.plan.create({ data });
  revalidatePath('/plans');
  redirect('/admin/plans');
}

export default async function NewPlanPage() {
  const cats = await prisma.category.findMany();
  return (
    <div className="max-w-3xl">
      <div className="text-xl font-semibold mb-4">เพิ่มแบบบ้าน</div>
      <form action={createPlan} className="card grid gap-3">
        <div><label className="label">ชื่อ</label><input name="title" required className="input"/></div>
        <div><label className="label">Slug (ลิงก์)</label><input name="slug" required className="input"/></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">ราคา (บาท)</label><input name="price" type="number" required className="input"/></div>
          <div><label className="label">พื้นที่ (ตร.ม.)</label><input name="areaSqm" type="number" required className="input"/></div>
          <div><label className="label">ห้องนอน</label><input name="beds" type="number" required className="input"/></div>
          <div><label className="label">ห้องน้ำ</label><input name="baths" type="number" required className="input"/></div>
          <div><label className="label">ชั้น</label><input name="floors" type="number" required className="input"/></div>
        </div>
        <div><label className="label">หมวดหมู่</label>
          <select name="categoryId" className="input">
            <option value="">-</option>
            {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div><label className="label">รูปหน้าปก URL</label><input name="coverImage" required className="input"/></div>
        <div><label className="label">แกลเลอรี่ (ใส่ทีละบรรทัด)</label><textarea name="gallery" rows={3} className="input"/></div>
        <div><label className="label">รายละเอียด</label><textarea name="description" rows={5} className="input"/></div>
        <button className="btn w-full">บันทึก</button>
      </form>
    </div>
  );
}
