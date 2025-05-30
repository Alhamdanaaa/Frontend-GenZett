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

type DecodedToken = {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string;
  locationId?: number;
  created_at?: string;
};

export async function getUserFromServer(): Promise<DecodedToken | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}