"use client";
import { Button } from "@/components/ui/button";
import { useSignUp } from "@clerk/nextjs";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage({ stars }: { stars: number }) {
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
          dateOfBirth: form.dob,
        },
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      router.push("/register/verify-email");
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || "Terjadi kesalahan saat mendaftar");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-[300px] flex flex-col justify-center items-center bg-gray-50 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Form - Kiri */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
          <div className="w-full bg-white p-8 rounded-xl shadow-2xl border-2">
            <h1 className="text-2xl font-bold text-center mb-4">Daftar Akun</h1>
            <p className="text-sm text-gray-500 text-center mb-4">
              Daftar untuk mulai reservasi lapangan favoritmu!
            </p>
  
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              {/* Nama Lengkap */}
              <div className="relative">
                <label className="absolute -top-2 left-3 px-1 text-sm bg-white text-gray-500 z-10 transition-all ease-in-out duration-300 transform hover:scale-105">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105"
                  required
                />
              </div>
  
              {/* Tanggal Lahir */}
              <div className="relative">
                <label className="absolute -top-2 left-3 px-1 text-sm bg-white text-gray-500 z-10 transition-all ease-in-out duration-300 transform hover:scale-105">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className={`w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    form.dob ? "text-gray-900" : "text-gray-400"
                  } transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105`}
                  required
                />
              </div>
  
              {/* Email */}
              <div className="relative">
                <label className="absolute -top-2 left-3 px-1 text-sm bg-white text-gray-500 z-10 transition-all ease-in-out duration-300 transform hover:scale-105">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Masukkan email aktif"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105"
                  required
                />
              </div>
  
              {/* Password */}
              <div className="relative">
                <label className="absolute -top-2 left-3 px-1 text-sm bg-white text-gray-500 z-10 transition-all ease-in-out duration-300 transform hover:scale-105">
                  Kata Sandi
                </label>
                <input
                  type={show ? "text" : "password"}
                  placeholder="Buat kata sandi"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105"
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
                <p className="text-red-500 text-sm text-center animate-pulse">{error}</p>
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