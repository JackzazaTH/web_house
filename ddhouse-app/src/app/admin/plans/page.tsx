import { prisma } from '@/src/lib/prisma';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

async function deletePlan(formData: FormData) {
  'use server';
  const id = Number(formData.get('id') || 0);
  if (id) {
    await prisma.plan.delete({ where: { id }});
  }
  revalidatePath('/admin/plans');
}

export default async function AdminPlans() {
  const plans = await prisma.plan.findMany({ orderBy: { createdAt: 'desc' }, include: { category: true }});
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="text-xl font-semibold">แบบบ้านทั้งหมด</div>
        <Link className="btn" href="/admin/plans/new">+ เพิ่มแบบบ้าน</Link>
      </div>
      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left">
            <th className="p-2">ชื่อ</th><th className="p-2">หมวด</th><th className="p-2">ราคา</th><th className="p-2">พื้นที่</th><th className="p-2">แก้ไข</th>
          </tr></thead>
          <tbody>
          {plans.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.title}</td>
              <td className="p-2">{p.category?.name}</td>
              <td className="p-2">{p.price.toLocaleString()}</td>
              <td className="p-2">{p.areaSqm} ตร.ม.</td>
              <td className="p-2">
                <Link href={`/admin/plans/${p.id}`} className="underline mr-3">แก้ไข</Link>
                <form action={deletePlan} className="inline">
                  <input type="hidden" name="id" value={p.id}/>
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
