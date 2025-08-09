import { prisma } from '@/src/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';

export default async function HomePage() {
  const [banner] = await prisma.banner.findMany({ take: 1, orderBy: { createdAt: 'desc' }});
  const plans = await prisma.plan.findMany({ take: 6, orderBy: { createdAt: 'desc' }});
  const cats = await prisma.category.findMany();

  return (
    <div>
      <section className="relative">
        {banner && (
          <div className="container grid lg:grid-cols-2 items-center gap-6 py-10">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold">{banner.title}</h1>
              {banner.subtitle && <p className="text-slate-600">{banner.subtitle}</p>}
              <div className="flex gap-3">
                <Link className="btn" href={banner.buttonLink || '/plans'}>{banner.buttonText || 'เริ่มต้น'}</Link>
                <Link className="btn bg-white text-red-600 border border-red-600 hover:bg-red-50" href="/contact">นัดหมายปรึกษา</Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="aspect-video relative rounded-2xl overflow-hidden border">
                <Image src={banner.imageUrl} alt="banner" fill className="object-cover" />
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="container py-8">
        <h2 className="text-xl font-semibold mb-4">หมวดหมู่ยอดนิยม</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {cats.map(c => (
            <Link key={c.id} href={`/plans?category=${c.slug}`} className="card hover:shadow-md">
              <div className="font-medium">{c.name}</div>
              <div className="text-sm text-slate-500">{c.slug}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">แบบบ้านมาใหม่</h2>
          <Link href="/plans" className="text-sm">ดูทั้งหมด</Link>
        </div>
        <div className="grid-cards">
          {plans.map(p => (
            <Link key={p.id} href={`/plans/${p.slug}`} className="card hover:shadow-md">
              <div className="aspect-[4/3] relative rounded-lg overflow-hidden border mb-3">
                <Image src={p.coverImage} alt={p.title} fill className="object-cover" />
              </div>
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-slate-600">
                {p.beds} ห้องนอน · {p.baths} ห้องน้ำ · {p.areaSqm} ตร.ม.
              </div>
              <div className="text-sm text-slate-500 mt-1">เริ่ม {p.price.toLocaleString()} บาท</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
