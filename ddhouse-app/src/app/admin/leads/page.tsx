import { prisma } from '@/src/lib/prisma';

export default async function AdminLeads() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, include: { plan: true }});
  return (
    <div className="card overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead><tr className="text-left">
          <th className="p-2">เวลา</th>
          <th className="p-2">ชื่อ</th>
          <th className="p-2">เบอร์</th>
          <th className="p-2">อีเมล</th>
          <th className="p-2">ข้อความ</th>
          <th className="p-2">สนใจแบบ</th>
        </tr></thead>
        <tbody>
          {leads.map(l => (
            <tr key={l.id} className="border-t align-top">
              <td className="p-2 whitespace-nowrap">{new Date(l.createdAt).toLocaleString('th-TH')}</td>
              <td className="p-2">{l.name}</td>
              <td className="p-2">{l.phone}</td>
              <td className="p-2">{l.email}</td>
              <td className="p-2">{l.message}</td>
              <td className="p-2">{l.plan?.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
