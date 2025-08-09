import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function signAdminToken() {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token?: string) {
  try {
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET) as { role: string };
  } catch (e) {
    return null;
  }
}

export function getAdmin() {
  const token = cookies().get('token')?.value;
  const payload = verifyToken(token);
  return payload?.role === 'admin' ? { role: 'admin' } : null;
}
