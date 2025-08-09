# DDHOUSE App (Next.js)

เว็บแอปตัวอย่างสำหรับธุรกิจรับสร้างบ้าน (แบรนด์: DDHOUSE):
- หน้าเว็บสาธารณะ: โฮม, ค้นหา/กรองแบบบ้าน, หน้ารายละเอียด, ติดต่อ
- หลังบ้าน: จัดการแบบบ้าน หมวดหมู่ แบนเนอร์ และดูลูกค้าที่ติดต่อ
- Auth ผู้ดูแล: ใช้รหัสผ่านเดียวจาก ENV + JWT cookie

## ใช้งานเร็ว

```bash
pnpm i # หรือ npm/yarn
cp .env.example .env
# (ปรับ JWT_SECRET และ ADMIN_PASSWORD ตามต้องการ)

npx prisma migrate dev --name init
npx ts-node prisma/seed.ts  # เติมข้อมูลตัวอย่าง
pnpm dev
```

เข้าใช้งาน:
- หน้าเว็บ: http://localhost:3000
- หลังบ้าน: http://localhost:3000/admin (รหัสผ่านเริ่มต้น: `admin123`)

## Deploy บน Vercel + Neon (Postgres) (แนะนำสำหรับโปรดักชัน)
1. สร้างโปรเจกต์บน Vercel
2. ใช้ฐานข้อมูล Postgres (เช่น Neon.io) แล้วตั้งค่า `DATABASE_URL=postgres://...`
3. กำหนด ENV บน Vercel:
   - `DATABASE_URL`
   - `JWT_SECRET` (อย่างน้อย 32 ตัวอักษร)
   - `ADMIN_PASSWORD`
4. รัน `npx prisma migrate deploy` บน Build Command หรือผ่าน Vercel UI
5. เปิดใช้งาน

> หมายเหตุ: โค้ดนี้ใช้ Server Actions และ Prisma JSON fields (SQLite/PG). สำหรับอัพโหลดรูปจริง แนะนำต่อกับ S3/Supabase และเพิ่มการยืนยันข้อมูลด้วย Zod ตามต้องการ

## โครงสร้างข้อมูล
- Category: ชื่อ/slug
- Plan: รายละเอียดบ้าน, แกลเลอรี่, ความสัมพันธ์กับ Category
- Lead: ฟอร์มติดต่อจากหน้า plan และ contact
- Banner: แบนเนอร์หน้าแรก

## สิทธิ์ผู้ดูแล
- `middleware.ts` ป้องกันทุกหน้า `/admin` ยกเว้น `/admin/login`
- ล็อกอินด้วย `ADMIN_PASSWORD` -> สร้าง JWT cookie (หมดอายุ 7 วัน)
- **ควร**เปลี่ยน `JWT_SECRET` และ `ADMIN_PASSWORD` ก่อนใช้งานจริง

## ปรับแต่งเพิ่ม
- เพิ่มฟิลด์/ฟอร์มในหลังบ้าน (เช่น โปรโมชัน, ทำเลก่อสร้าง, ไฟล์ PDF)
- เพิ่มอัปโหลดรูป (เช่น Supabase Storage) และ Image cropper
- เพิ่ม SEO (metadata, sitemap, robots) และ analytics
- ทำ role-based auth หลายผู้ใช้ (เช่น NextAuth + Prisma)
