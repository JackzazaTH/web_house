import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl font-bold">หลังบ้าน</div>
        <nav className="flex gap-4 text-sm">
          <Link href="/admin">สรุป</Link>
          <Link href="/admin/plans">แบบบ้าน</Link>
          <Link href="/admin/categories">หมวดหมู่</Link>
          <Link href="/admin/banners">แบนเนอร์</Link>
          <Link href="/admin/leads">ลูกค้า</Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
