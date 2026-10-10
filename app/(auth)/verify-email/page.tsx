"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!emailParam) {
      router.push("/sign-up");
    }
  }, [emailParam, router]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const verificationCode = code.join("");
    
    if (verificationCode.length < 6) {
      setError("Masukkan kode 6 digit");
      return;
    }

    if (!emailParam) return;

    setLoading(true);
    try {
      await authService.verifyEmail(emailParam, verificationCode);
      setSuccessMsg("Verifikasi berhasil! Mengalihkan...");
      setTimeout(() => {
        router.push("/user/homepage");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Kode verifikasi salah atau kadaluarsa");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!emailParam) return;
    setResending(true);
    setError("");
    setSuccessMsg("");
    try {
      await authService.resendVerification(emailParam);
      setSuccessMsg("Kode verifikasi baru telah dikirim ke email Anda.");
    } catch (err: any) {
      setError(err.message || "Gagal mengirim ulang kode");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-orange-50">
      <div className="w-full max-w-md bg-theme-card rounded-3xl p-8 shadow-xl border border-orange-100">
        <div className="text-center mb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl mb-4">
            ✉️
          </div>
          <h1 className="text-2xl font-bold text-theme-text font-[var(--font-display,serif)]">
            Verifikasi Email
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Masukkan kode 6 digit yang kami kirimkan ke <br/>
            <span className="font-semibold text-gray-700">{emailParam}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}
        
        {successMsg && (
          <div className="bg-green-50 text-green-600 text-sm p-3 rounded-xl mb-4 text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-6">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputsRef.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || code.some(d => !d)}
            className="w-full bg-[#d9691f] text-white py-3.5 rounded-xl font-semibold hover:bg-[#b05315] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Memverifikasi..." : "Verifikasi Sekarang"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Belum menerima kode?{" "}
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-[#d9691f] font-semibold hover:underline disabled:opacity-50"
            >
              {resending ? "Mengirim..." : "Kirim Ulang"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-orange-50 flex items-center justify-center">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
