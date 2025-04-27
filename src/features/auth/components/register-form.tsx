"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const { signUp, isLoaded } = useSignUp();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    dob: "",
    email: "",
    password: "",
  });
  const [show, setShow] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setPending(true);
    setError(null);

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
        unsafeMetadata: {
          name: form.name,
          dateOfBirth: form.dob
        }
      });

      router.push("/auth/verify-email");
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || "Terjadi kesalahan saat mendaftar");
    } finally {
      setPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-10 rounded-3xl shadow-md w-full max-w-md space-y-6"
    >
      <h1 className="text-2xl font-bold text-center">Daftar Akun</h1>
      <p className="text-sm text-gray-500 text-center">
        Daftar untuk mulai reservasi lapangan favoritmu!
      </p>

      {/* Nama Lengkap */}
      <div className="relative">
        <label className="absolute -top-2 left-3 px-1 text-sm bg-white text-gray-500 z-10">
          Nama Lengkap
        </label>
        <input
          type="text"
          placeholder="Masukkan nama lengkap"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400"
          required
        />
      </div>

      {/* Tanggal Lahir */}
      <div className="relative">
        <label className="absolute -top-2 left-3 px-1 text-sm bg-white text-gray-500 z-10">
          Tanggal Lahir
        </label>
        <input
          type="date"
          value={form.dob}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
          className={`w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            form.dob ? "text-gray-900" : "text-gray-400"
          }`}
          required
        />
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
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400"
          required
        />
      </div>

      {/* Password */}
      <div className="relative">
        <label className="absolute -top-2 left-3 px-1 text-sm bg-white text-gray-500 z-10">
          Kata Sandi
        </label>
        <input
          type={show ? "text" : "password"}
          placeholder="Buat kata sandi"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400"
          required
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        disabled={pending}
      >
        {pending ? "Mendaftarkan..." : "Daftar"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Sudah punya akun?{" "}
        <a
          href="/login"
          className="text-orange-500 font-medium hover:underline"
        >
          Masuk di sini
        </a>
      </p>
    </form>
  );
}
