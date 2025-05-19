import api from "../axios";

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
  const token = localStorage.getItem("token"); // Ambil token dari localStorage
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

