import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const cat1 = await prisma.category.create({ data: { name: 'บ้านสองชั้น', slug: 'two-storey' }});
  const cat2 = await prisma.category.create({ data: { name: 'บ้านชั้นเดียว', slug: 'single-storey' }});
  await prisma.banner.create({
    data: {
      title: 'DDHOUSE - ออกแบบบ้านในฝันของคุณ',
      subtitle: 'เลือกแบบบ้าน คำนวนงบ และนัดคุยผู้เชี่ยวชาญ',
      imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600',
      buttonText: 'ดูแบบบ้าน',
      buttonLink: '/plans'
    }
  });

  const plans = [
    {
      title: 'บ้านโมเดิร์น 2 ชั้น',
      slug: 'modern-2f',
      price: 3200000,
      beds: 4,
      baths: 3,
      areaSqm: 240,
      floors: 2,
      coverImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200',
      gallery: [
        'https://images.unsplash.com/photo-1600585154154-1e04c5b8a9bd?q=80&w=1200',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200'
      ],
      description: 'แบบบ้านสไตล์โมเดิร์น ฟังก์ชันครบ เหมาะกับครอบครัวขนาดกลางถึงใหญ่',
      specs: { parking: 2, ceilingHeight: 2.8 }
    },
    {
      title: 'บ้านชั้นเดียวสไตล์ Cozy',
      slug: 'cozy-1f',
      price: 1800000,
      beds: 3,
      baths: 2,
      areaSqm: 140,
      floors: 1,
      coverImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200',
      gallery: [
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200'
      ],
      description: 'บ้านชั้นเดียวอุ่นใจ ดูแลง่าย เหมาะกับครอบครัวเริ่มต้นหรือผู้สูงอายุ',
      specs: { parking: 1, ceilingHeight: 2.7 }
    }
  ];

  for (const [i, base] of plans.entries()) {
    await prisma.plan.create({
      data: {
        ...base,
        categoryId: i === 0 ? cat1.id : cat2.id
      }
    });
  }
  console.log('Seeded!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => { await prisma.$disconnect(); });
