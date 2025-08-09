import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'DDHOUSE',
  description: 'เลือกแบบบ้านและติดต่อสร้างบ้านได้ทันที',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen flex flex-col">
        <header className="border-b border-red-600/20">
          <div className="container flex items-center justify-between h-14">
            <Link href="/" className="font-bold text-xl">DDHOUSE</Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/plans">แบบบ้าน</Link>
              <Link href="/contact">ติดต่อเรา</Link>
              <Link href="/admin" className="font-medium">หลังบ้าน</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t">
          <div className="container py-8 text-sm text-slate-500">
            © {new Date().getFullYear()} DDHOUSE. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
