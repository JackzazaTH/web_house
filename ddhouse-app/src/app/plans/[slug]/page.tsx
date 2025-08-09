import { prisma } from '@/src/lib/prisma';
import Image from 'next/image';
import { revalidatePath } from 'next/cache';

async function createLead(formData: FormData) {
  'use server';
  const name = String(formData.get('name') || '');
  const phone = String(formData.get('phone') || '');
  const email = String(formData.get('email') || '');
  const message = String(formData.get('message') || '');
  const planId = Number(formData.get('planId') || 0);
  await prisma.lead.create({ data: { name, phone, email, message, planId: planId || undefined } });
  revalidatePath('/admin/leads');
}

export default async function PlanDetail({ params }: { params: { slug: string }}) {
  const plan = await prisma.plan.findFirst({ where: { slug: params.slug }, include: { category: true }});
  if (!plan) return <div className="container py-8">ไม่พบแบบบ้าน</div>;
  const gallery = Array.isArray(plan.gallery) ? plan.gallery as string[] : [];

  return (
    <div className="container py-8 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="aspect-[4/3] relative rounded-2xl overflow-hidden border">
          <Image src={plan.coverImage} alt={plan.title} fill className="object-cover" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {gallery.map((g, i) => (
            <div key={i} className="aspect-[4/3] relative rounded-lg overflow-hidden border">
              <Image src={g} alt={'gallery '+i} fill className="object-cover" />
            </div>
          ))}
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">รายละเอียด</h2>
          <p className="text-slate-700">{plan.description}</p>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="card">
          <div className="text-xl font-semibold">{plan.title}</div>
          <div className="text-slate-600 text-sm mb-2">{plan.category?.name}</div>
          <div className="text-slate-700">{plan.beds} นอน · {plan.baths} น้ำ · {plan.areaSqm} ตร.ม. · {plan.floors} ชั้น</div>
          <div className="mt-2 text-slate-500">เริ่ม {plan.price.toLocaleString()} บาท</div>
        </div>
        <form action={createLead} className="card space-y-3">
          <div className="text-lg font-semibold">สนใจแบบนี้?</div>
          <input type="hidden" name="planId" value={plan.id} />
          <div><label className="label">ชื่อ</label><input name="name" required className="input"/></div>
          <div><label className="label">เบอร์โทร</label><input name="phone" required className="input"/></div>
          <div><label className="label">อีเมล</label><input type="email" name="email" className="input"/></div>
          <div><label className="label">ข้อความ</label><textarea name="message" rows={3} className="input"/></div>
          <button className="btn w-full">ส่งข้อมูล</button>
          <div className="text-xs text-slate-500">เราจะติดต่อกลับภายใน 24 ชม.</div>
        </form>
      </aside>
    </div>
  );
}
