import { prisma } from '@/src/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';

function toInt(v: string | null) { return v ? parseInt(v, 10) : undefined; }

export default async function PlansPage({ searchParams }: { searchParams: Record<string, string | undefined>}) {
  const { q, category, minPrice, maxPrice, minArea, maxArea, beds, baths } = searchParams || {};
  const where: any = {};
  if (q) where.title = { contains: q };
  if (category) where.category = { is: { slug: category }};
  if (beds) where.beds = { gte: +beds };
  if (baths) where.baths = { gte: +baths };
  if (minPrice || maxPrice) where.price = { gte: toInt(minPrice) || 0, lte: toInt(maxPrice) || 1e9 };
  if (minArea || maxArea) where.areaSqm = { gte: toInt(minArea) || 0, lte: toInt(maxArea) || 1e9 };

  const [plans, cats] = await Promise.all([
    prisma.plan.findMany({ where, orderBy: { createdAt: 'desc' } }),
    prisma.category.findMany()
  ]);

  return (
    <div className="container py-8">
      <form className="card mb-6 grid gap-3 sm:grid-cols-6">
        <input className="input sm:col-span-2" type="search" name="q" placeholder="ค้นหาแบบบ้าน..." defaultValue={q}/>
        <select className="input" name="category" defaultValue={category}>
          <option value="">หมวดหมู่</option>
          {cats.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <input className="input" type="number" name="minPrice" placeholder="ราคาเริ่มต้น" defaultValue={minPrice}/>
        <input className="input" type="number" name="maxPrice" placeholder="ราคาสูงสุด" defaultValue={maxPrice}/>
        <input className="input" type="number" name="beds" placeholder="ขั้นต่ำ ห้องนอน" defaultValue={beds}/>
        <input className="input" type="number" name="baths" placeholder="ขั้นต่ำ ห้องน้ำ" defaultValue={baths}/>
        <input className="input" type="number" name="minArea" placeholder="พื้นที่ต่ำสุด (ตร.ม.)" defaultValue={minArea}/>
        <input className="input" type="number" name="maxArea" placeholder="พื้นที่สูงสุด (ตร.ม.)" defaultValue={maxArea}/>
        <button className="btn sm:col-span-6" type="submit">ค้นหา</button>
      </form>

      <div className="grid-cards">
        {plans.map(p => (
          <Link key={p.id} href={`/plans/${p.slug}`} className="card hover:shadow-md">
            <div className="aspect-[4/3] relative rounded-lg overflow-hidden border mb-3">
              <Image src={p.coverImage} alt={p.title} fill className="object-cover" />
            </div>
            <div className="font-semibold">{p.title}</div>
            <div className="text-sm text-slate-600">
              {p.beds} นอน · {p.baths} น้ำ · {p.areaSqm} ตร.ม.
            </div>
            <div className="text-sm text-slate-500 mt-1">เริ่ม {p.price.toLocaleString()} บาท</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
