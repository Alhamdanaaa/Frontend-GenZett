"use client";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { register } from "@/lib/api/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const [show, setShow] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<{ [key: string]: string[] }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError({});

    if (form.password !== form.password_confirmation) {
      setError({ password_confirmation: ["Konfirmasi password tidak cocok."] });
      setPending(false);
      return;
    }

    try {
      await register(form);
      router.push("/login");
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 422) {
        setError(error.response.data.errors);
      } else {
        setError({ general: ["Terjadi kesalahan saat mendaftar."] });
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-[300px] flex flex-col justify-center items-center bg-gray-50 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Form Kiri */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
          <div className="w-full bg-white p-8 rounded-xl">
            <h1 className="text-2xl font-bold text-center mb-4">Daftar Akun</h1>
            <p className="text-sm text-gray-500 text-center mb-4">
              Daftar untuk mulai reservasi lapangan favoritmu!
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
              {/* Nama */}
              <div className="relative">
                <label className="absolute -top-2 left-3 px-1 text-sm bg-white text-gray-500 z-10">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    setError({});
                  }}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105"
                />
                {error?.name && (
                  <p className="text-red-500 text-xs mt-1">{error.name[0]}</p>
                )}
              </div>

              {/* Nomor HP */}
              <div className="relative">
                <label className="absolute -top-2 left-3 px-1 text-sm bg-white text-gray-500 z-10">
                  Nomor HP
                </label>
                <input
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  value={form.phone}
                  onChange={(e) => {
                    setForm({ ...form, phone: e.target.value });
                    setError({});
                  }}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105"
                />
                {error?.phone && (
                  <p className="text-red-500 text-xs mt-1">{error.phone[0]}</p>
                )}
              </div>

              {/* Email */}
              <div className="relative">
                <label className="absolute -top-2 left-3 px-1 text-sm bg-white text-gray-500 z-10">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Masukkan email aktif"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    setError({});
                  }}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105"
                />
                {error?.email && (
                  <p className="text-red-500 text-xs mt-1">{error.email[0]}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label className="absolute -top-2 left-3 px-1 text-sm bg-white text-gray-500 z-10">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Buat password"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    setError({});
                  }}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105"
                />
                {error?.password && (
                  <p className="text-red-500 text-xs mt-1">{error.password[0]}</p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Konfirmasi Password */}
              <div className="relative">
                <label className="absolute -top-2 left-3 px-1 text-sm bg-white text-gray-500 z-10">
                  Konfirmasi password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ulangi password"
                  value={form.password_confirmation}
                  onChange={(e) =>
                    setForm({ ...form, password_confirmation: e.target.value })
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {error?.password && (
                  <p className="text-red-500 text-xs mt-1">{error.password[0]}</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-sm text-center animate-pulse">
                  {error.general || error.password_confirmation}
                </p>
              )}

              {/* CAPTCHA */}
              <div id="clerk-captcha" />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 ease-in-out transform hover:scale-105"
                disabled={pending}
              >
                {pending ? (
                  <div className="flex justify-center items-center space-x-2">
                    <Loader className="animate-spin h-5 w-5" />
                    <span>Mendaftarkan...</span>
                  </div>
                ) : (
                  "Daftar"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-orange-500 font-medium hover:underline transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Gambar - Kanan */}
        <div className="hidden lg:block w-1/2">
          <img
            src="/images/login-image.png"
            alt="Login Illustration"
            className="h-[650px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
