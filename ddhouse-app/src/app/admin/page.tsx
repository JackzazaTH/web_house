import { prisma } from '@/src/lib/prisma';

export default async function AdminHome() {
  const [plans, leads, cats] = await Promise.all([
    prisma.plan.count(),
    prisma.lead.count(),
    prisma.category.count()
  ]);
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="card"><div className="text-sm text-slate-500">แบบบ้าน</div><div className="text-2xl font-bold">{plans}</div></div>
      <div className="card"><div className="text-sm text-slate-500">ลูกค้าติดต่อ</div><div className="text-2xl font-bold">{leads}</div></div>
      <div className="card"><div className="text-sm text-slate-500">หมวดหมู่</div><div className="text-2xl font-bold">{cats}</div></div>
    </div>
  );
}
