"use client"

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function VerifyEmailPage() {
  const [otpCode, setOtpCode] = useState("");
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<string | null>(null);
  const [pendingVerify, setPendingVerify] = useState(false);
  const [pendingResend, setPendingResend] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const router = useRouter();

  // Start the countdown for resend OTP
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const otpArray = otpCode.split("").concat(Array(6).fill("")).slice(0, 6);
    otpArray[index] = value;
    const newOtp = otpArray.join("").slice(0, 6);
    setOtpCode(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.length === 6) {
      handleVerify(newOtp);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      handleVerify(otpCode);
    }
  };

  // Handle OTP verification with backend
  const handleVerify = async (code: string) => {
    if (code.length < 6) {
      setVerifyStatus("Lengkapi semua angka OTP.");
      return;
    }

    setPendingVerify(true);
    try {
      const response = await fetch('/register/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp: code, email: 'user@example.com' }) // Ganti dengan email yang sesuai
      });

      const data = await response.json();
      if (response.ok) {
        router.push("/"); // Redirect ke halaman sukses
      } else {
        setVerifyStatus(data.message || "Verifikasi gagal. Coba cek kembali kodenya.");
      }
    } catch (err) {
      console.error(err);
      setVerifyStatus("Terjadi kesalahan. Coba lagi.");
    } finally {
      setPendingVerify(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (timeLeft > 0 || pendingResend) return;

    setPendingResend(true);
    try {
      const response = await fetch('/register/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'user@example.com' }) // Ganti dengan email yang sesuai
      });

      const data = await response.json();
      if (response.ok) {
        setResendStatus("Berhasil mengirim ulang email!");
        setTimeLeft(60);
      } else {
        setResendStatus(data.message || "Gagal mengirim ulang email.");
      }
    } catch (err) {
      console.error(err);
      setResendStatus("Terjadi kesalahan saat mengirim email.");
    } finally {
      setPendingResend(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center space-y-6 bg-gray-100 p-4 lg:p-8 overflow-hidden">
      <div className="flex w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
          <div className="w-full bg-white p-8 rounded-xl shadow-2xl border-2">
            <h1 className="text-2xl font-bold text-center mb-4">Verifikasi Email Kamu</h1>
            <p className="text-sm text-gray-600 text-center mb-4">
              Masukkan kode OTP yang dikirim ke email kamu.
            </p>

            <div className="flex space-x-2 mb-4 w-full max-w-[72rem]">
              {Array.from({ length: 6 }).map((_, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    if (el) inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otpCode[index] || ""}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-15 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ease-in-out transform hover:scale-110 focus:scale-110 hover:shadow-xl focus:shadow-xl"
                />
              ))}
            </div>

            <Button
              onClick={() => handleVerify(otpCode)}
              className="w-full max-w-[72rem] mb-4 bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 ease-in-out transform hover:scale-110 focus:scale-110 hover:shadow-xl focus:shadow-xl"
              disabled={pendingVerify}
            >
              {pendingVerify ? (
                <Loader className="animate-spin h-5 w-5 text-white" />
              ) : (
                "Verifikasi"
              )}
            </Button>

            {verifyStatus && <p className="text-sm text-red-500 text-center animate-pulse">{verifyStatus}</p>}

            <Button
              variant="outline"
              onClick={handleResend}
              className="w-full max-w-[72rem] mb-4 border-orange-500 text-orange-500 hover:bg-white hover:text-orange-500 transition-all duration-300 ease-in-out transform hover:scale-110 focus:scale-110 hover:shadow-xl focus:shadow-xl"
              disabled={pendingResend || timeLeft > 0}
            >
              {pendingResend ? (
                <Loader className="animate-spin h-5 w-5 text-orange-500" />
              ) : timeLeft > 0 ? (
                `Tunggu ${timeLeft}s`
              ) : (
                "Kirim Ulang Email"
              )}
            </Button>

            {resendStatus && <p className="text-sm text-center">{resendStatus}</p>}
          </div>
        </div>

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
