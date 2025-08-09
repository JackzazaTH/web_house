import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function updatePlan(formData: FormData) {
  'use server';
  const id = Number(formData.get('id') || 0);
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
    gallery: (String(formData.get('gallery') || '').split('\n').filter(Boolean))
  } as any;
  await prisma.plan.update({ where: { id }, data });
  revalidatePath('/plans');
  redirect('/admin/plans');
}

export default async function EditPlanPage({ params }: { params: { id: string }}) {
  const id = Number(params.id);
  const plan = await prisma.plan.findUnique({ where: { id }});
  if (!plan) return <div>ไม่พบข้อมูล</div>;
  const cats = await prisma.category.findMany();
  const gallery = Array.isArray(plan.gallery) ? plan.gallery as string[] : [];

  return (
    <div className="max-w-3xl">
      <div className="text-xl font-semibold mb-4">แก้ไขแบบบ้าน</div>
      <form action={updatePlan} className="card grid gap-3">
        <input type="hidden" name="id" value={plan.id}/>
        <div><label className="label">ชื่อ</label><input name="title" defaultValue={plan.title} required className="input"/></div>
        <div><label className="label">Slug</label><input name="slug" defaultValue={plan.slug} required className="input"/></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">ราคา</label><input name="price" type="number" defaultValue={plan.price} className="input"/></div>
          <div><label className="label">พื้นที่ (ตร.ม.)</label><input name="areaSqm" type="number" defaultValue={plan.areaSqm} className="input"/></div>
          <div><label className="label">ห้องนอน</label><input name="beds" type="number" defaultValue={plan.beds} className="input"/></div>
          <div><label className="label">ห้องน้ำ</label><input name="baths" type="number" defaultValue={plan.baths} className="input"/></div>
          <div><label className="label">ชั้น</label><input name="floors" type="number" defaultValue={plan.floors} className="input"/></div>
        </div>
        <div><label className="label">หมวดหมู่</label>
          <select name="categoryId" className="input" defaultValue={plan.categoryId || ''}>
            <option value="">-</option>
            {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div><label className="label">รูปหน้าปก URL</label><input name="coverImage" defaultValue={plan.coverImage} className="input"/></div>
        <div><label className="label">แกลเลอรี่</label><textarea name="gallery" rows={3} className="input" defaultValue={gallery.join('\n')}/></div>
        <div><label className="label">รายละเอียด</label><textarea name="description" rows={5} className="input" defaultValue={plan.description || ''}/></div>
        <button className="btn w-full">บันทึก</button>
      </form>
    </div>
  );
}
