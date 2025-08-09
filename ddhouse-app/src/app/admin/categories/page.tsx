import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';

async function createCategory(formData: FormData) {
  'use server';
  const name = String(formData.get('name') || '');
  const slug = String(formData.get('slug') || '');
  await prisma.category.create({ data: { name, slug }});
  revalidatePath('/admin/categories');
}

async function deleteCategory(formData: FormData) {
  'use server';
  const id = Number(formData.get('id') || 0);
  if (id) await prisma.category.delete({ where: { id }});
  revalidatePath('/admin/categories');
}

export default async function AdminCategories() {
  const cats = await prisma.category.findMany({ orderBy: { id: 'asc' }});
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card">
        <div className="text-lg font-semibold mb-3">เพิ่มหมวดหมู่</div>
        <form action={createCategory} className="grid gap-3">
          <div><label className="label">ชื่อ</label><input name="name" required className="input"/></div>
          <div><label className="label">Slug</label><input name="slug" required className="input"/></div>
          <button className="btn">บันทึก</button>
        </form>
      </div>
      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left"><th className="p-2">ชื่อ</th><th className="p-2">Slug</th><th className="p-2">ลบ</th></tr></thead>
          <tbody>
            {cats.map(c => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.slug}</td>
                <td className="p-2">
                  <form action={deleteCategory}>
                    <input type="hidden" name="id" value={c.id}/>
                    <button className="text-red-600 underline" type="submit">ลบ</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
