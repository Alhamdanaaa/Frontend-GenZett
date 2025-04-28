"use client";

import { useSignUp } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const { signUp, isLoaded } = useSignUp();
  const router = useRouter();
  const [otpCode, setOtpCode] = useState("");
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<string | null>(null);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const otpArray = otpCode.split("").concat(Array(6).fill("")).slice(0, 6);
    otpArray[index] = value;
    const newOtp = otpArray.join("").slice(0, 6);
    setOtpCode(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;
    if (otpCode.length < 6) {
      setVerifyStatus("Lengkapi semua angka OTP.");
      return;
    }

    try {
      const result = await signUp.attemptEmailAddressVerification({ code: otpCode });
      if (result.status === "complete") {
        router.push("/");
      } else {
        setVerifyStatus("Verifikasi gagal. Coba cek kembali kodenya.");
      }
    } catch (err) {
      console.error(err);
      setVerifyStatus("Kode salah atau expired. Coba lagi.");
    }
  };

  const handleResend = async () => {
    if (!isLoaded) return;
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setResendStatus("Berhasil mengirim ulang email!");
    } catch (err) {
      console.error(err);
      setResendStatus("Gagal mengirim ulang email.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center space-y-6">
      <h1 className="text-2xl font-bold">Verifikasi Email Kamu</h1>
      <p className="text-gray-600 text-center">
        Masukkan kode OTP yang dikirim ke email kamu.
      </p>

      {/* 6 kotak OTP */}
      <div className="flex space-x-2">
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
            className="w-12 h-12 text-center text-xl"
          />
        ))}
      </div>

      {/* Tombol Verifikasi */}
      <Button onClick={handleVerify} className="w-64">
        Verifikasi
      </Button>

      {verifyStatus && <p className="text-sm text-red-500">{verifyStatus}</p>}

      {/* Tombol Kirim Ulang */}
      <Button variant="outline" onClick={handleResend} className="w-64">
        Kirim Ulang Email
      </Button>

      {resendStatus && <p className="text-sm">{resendStatus}</p>}
    </div>
  );
}