import api from "../axios";
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";
type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  message: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    phone: string;
    created_at: string;
    locationId?: number;
  };
  token: string;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const formData = new FormData();
  formData.append("email", payload.email);
  formData.append("password", payload.password);

  const res = await api.post("/login", formData);
  return res.data;
}

export type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
};

export async function register(payload: RegisterPayload) {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("email", payload.email);
  formData.append("phone", payload.phone);
  formData.append("password", payload.password);
  formData.append("password_confirmation", payload.password_confirmation);

  const res = await api.post("/register", formData);
  return res.data;
}

export async function logout() {
  const token = Cookies.get('token');
  const res = await api.post(
    "/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export const useLogout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    // Clear all auth-related storage
    Cookies.remove('token');
    Cookies.remove('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; Max-Age=-99999999;';
    document.cookie = 'role=; Max-Age=0; path=/;';
    router.push('/');
  };

  return {
    handleLogout
  };
};

export function getUserRole(): string | null {
  if (typeof document === 'undefined') return null;

  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];

  if (!token) return null;

  try {
    const decoded = jwtDecode<{ role?: string }>(token);
    return decoded.role || null;
  } catch {
    return null;
  }
}
export function getUser(): LoginResponse["user"] | null {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");
  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export async function editProfile(name: string, phone: string) {
  const token = localStorage.getItem('token')
  if (!token) return

  const user = getUser()
  if (!user) return

  const data: Record<string, string> = {}
  if (name) data.name = name
  if (phone) data.phone = phone

    const response = await api.put(`/editAdminProfile/${user.id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

  // ✅ Update localStorage setelah berhasil
  const updatedUser = {
    ...user,
    ...data,
  }

  localStorage.setItem('user', JSON.stringify(updatedUser))

    return response
}

export async function changePassword(oldPassword: string, newPassword: string) {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('Token tidak ditemukan')

  const res = await api.post(
    '/change-password',
    { oldPassword, newPassword }, // ini adalah `data`
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return res.data
}
