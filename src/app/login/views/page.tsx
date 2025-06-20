"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { login } from "@/lib/api/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);

    try {
      const data = await login({ email, password });
      Cookies.set("token", data.token);
      Cookies.set("role", data.user.role);
      Cookies.set("userId", data.user.id.toString());
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Gagal login. Coba periksa email dan password.";
      setError(msg);
    } finally {
      setPending(false);
    }
  };


  useEffect(() => {
    if (!pending && Cookies.get("token")) {
      router.push("/");
    }
  }, [pending]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
          <form
            onSubmit={handleLogin}
            className="bg-white p-10 rounded-3xl w-full max-w-md space-y-6"
          >
            <h1 className="text-2xl font-bold text-center">Masuk Akun</h1>
            <p className="text-sm text-gray-500 text-center">
              Silakan login untuk melanjutkan ke akunmu.
            </p>

            {/* Email */}
            <div className="relative">
              <label className="absolute -top-2 left-3 px-1 text-sm bg-white text-gray-500 z-10 transition-all ease-in-out duration-300 transform hover:scale-105">
                Email
              </label>
              <input
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="absolute -top-2 left-3 px-1 text-sm bg-white text-gray-500 z-10 transition-all ease-in-out duration-300 transform hover:scale-105">
                Password
              </label>
              <input
                type={show ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105 focus:scale-105"
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

            {/* <div className="text-right text-sm text-gray-500">
              <a href="#" className="hover:underline">
                Lupa kata sandi?
              </a>
            </div> */}

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 ease-in-out transform hover:scale-110 focus:scale-110 hover:shadow-xl focus:shadow-xl"
              disabled={pending}
            >
              {pending ? (
                <div className="flex justify-center items-center space-x-2">
                  <Loader className="animate-spin h-5 w-5" />
                  <span>Login...</span>
                </div>
              ) : (
                "Login"
              )}
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

        {/* Gambar - Kanan */}
        <div className="hidden lg:block w-1/2">
          <img
            src="/images/login-image.png"
            alt="Verifikasi Email Illustration"
            className="h-[600px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
