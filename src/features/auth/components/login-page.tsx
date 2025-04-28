"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useSignIn } from "@clerk/nextjs"; // Tambahkan ini
import { useRouter } from "next/navigation"; // Untuk redirect setelah login sukses

export default function LoginPage({ stars }: { stars: number }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, isLoaded } = useSignIn(); // Pakai Clerk signIn
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isLoaded) return; // pastikan Clerk SDK sudah siap

    try {
      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      if (result.status === "complete") {
        router.push("/");
      } else {
        console.log(result);
        setError("Gagal login. Coba lagi.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || "Gagal login. Coba cek email/password.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-3xl shadow-md w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">Masuk Akun</h1>
        <p className="text-sm text-gray-500 text-center">
          Silakan login untuk melanjutkan ke akunmu.
        </p>

        {/* Email */}
        <div className="relative">
          <label className="absolute -top-2 left-3 px-1 text-sm bg-white text-gray-500 z-10">
            Email
          </label>
          <input
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label className="absolute -top-2 left-3 px-1 text-sm bg-white text-gray-500 z-10">
            Kata Sandi
          </label>
          <input
            type={show ? "text" : "password"}
            placeholder="Masukkan kata sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400"
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
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="text-right text-sm text-gray-500">
          <a href="#" className="hover:underline">
            Lupa kata sandi?
          </a>
        </div>

        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          Masuk
        </Button>

        <p className="text-center text-sm text-gray-500">
          Belum punya akun?{" "}
          <a
            href="/register"
            className="text-orange-500 font-medium hover:underline"
          >
            Daftar sekarang
          </a>
        </p>
      </form>
    </div>
  );
}
