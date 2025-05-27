// lib/auth/server-role.ts
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

export async function getServerUserRole(): Promise<string | null> {
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;

  try {
    const decoded = jwtDecode(token) as { role?: string };
    return decoded.role ?? null;
  } catch {
    return null;
  }
}