"use client";

/**
 * ConcertGo — Reset Password Page
 * Alur pemulihan kata sandi dengan 3 langkah aman:
 * 1. Masukkan Email Akun
 * 2. Verifikasi Kode OTP 6 Digit
 * 3. Pembuatan Kata Sandi Baru
 * Dilengkapi dengan visual panggung konser, indikator langkah, dan animasi Framer Motion.
 */

import type { FormEvent, JSX, KeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Toast Notification System                                          */
/* ------------------------------------------------------------------ */

type Toast = { id: number; kind: "success" | "error"; message: string };

function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  function push(kind: Toast["kind"], message: string) {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 4000);
  }

  function dismiss(id: number) {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }

  return { toasts, push, dismiss };
}

function ToastStack({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: number) => void }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-5 z-50 flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            role="status"
            className={`pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-xl backdrop-blur-md ${
              t.kind === "success"
                ? "border-emerald-200 bg-emerald-50/95 text-emerald-900"
                : "border-rose-200 bg-rose-50/95 text-rose-900"
            }`}
          >
            <span className="text-base">{t.kind === "success" ? "✓" : "⚠️"}</span>
            <span className="font-medium">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Tutup notifikasi"
              className="ml-auto opacity-60 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Reset Password Page Component                                  */
/* ------------------------------------------------------------------ */

export default function ResetPasswordPage() {
  const { toasts, push, dismiss } = useToasts();

  return (
    <div className="flex min-h-screen flex-col bg-[#f6efe1] font-[var(--font-body,ui-sans-serif)] text-[#241608]">
      <AuthHeader />
      <ToastStack toasts={toasts} dismiss={dismiss} />

      <main className="relative flex flex-1 items-center justify-center px-4 py-10 md:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#d9691f]/10 via-[#f6efe1] to-[#f1e6d0]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#d9691f]/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-[#241209]/15 blur-3xl"
        />

        <ResetPasswordCard onToast={push} />
      </main>

      <AuthFooter />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Auth Header (Clean Minimal Header)                                 */
/* ------------------------------------------------------------------ */

function AuthHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e6d9bf] bg-[#f6efe1]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-105">
          <img src="/image/Logo.png" alt="ConcertGo" className="h-8 w-auto" />
          <span className="font-[var(--font-display,serif)] text-xl font-bold tracking-tight text-[#241608]">
            <span>Concert</span>
            <span className="text-[#d9691f]">Go</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-[#5a4a35] sm:inline">Ingat kata sandi?</span>
          <Link
            href="/Sign-in"
            className="rounded-full border border-[#241608] px-4 py-1.5 text-xs font-semibold text-[#241608] transition-all hover:bg-[#241608] hover:text-[#f6efe1]"
          >
            Masuk ke Akun
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Reset Password Card (Split View Container)                         */
/* ------------------------------------------------------------------ */

type Step = "email" | "otp" | "newPassword" | "done";

function ResetPasswordCard({ onToast }: { onToast: (kind: Toast["kind"], msg: string) => void }) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");

  const stepNumber = step === "email" ? 1 : step === "otp" ? 2 : step === "newPassword" ? 3 : 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-[#e6d9bf] bg-white shadow-2xl md:grid md:grid-cols-12"
    >
      {/* Left Column: Visual Showcase & Guide (Hidden on Mobile) */}
      <div className="relative hidden md:col-span-5 md:flex md:flex-col md:justify-between p-8 text-[#f6efe1] overflow-hidden bg-[#241209]">
        <img
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop"
          alt="Concert stage atmosphere"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b0d05] via-[#241209]/80 to-transparent" />

        {/* Top Tag */}
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-[#d9a26a] backdrop-blur-md border border-white/10">
            <span className="h-2 w-2 rounded-full bg-[#d9691f] animate-pulse" />
            PUSAT PEMULIHAN AKUN
          </span>
        </div>

        {/* Middle Highlight & Steps Info */}
        <div className="relative z-10 my-auto py-8">
          <h2 className="font-[var(--font-display,serif)] text-2xl font-bold leading-snug">
            Pulihkan Akses Tiket Konsermu dengan Aman
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-[#c4b59d]">
            Keamanan akun ConcertGo Anda terlindungi dengan sistem verifikasi berlapis agar tiket resmi Anda tetap aman.
          </p>

          <div className="mt-6 space-y-3 text-xs">
            <div className={`flex items-center gap-3 rounded-xl p-2.5 transition-colors ${stepNumber >= 1 ? "bg-white/15 text-white" : "text-white/50"}`}>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${stepNumber >= 1 ? "bg-[#d9691f] text-white" : "bg-white/10"}`}>
                1
              </span>
              <span>Masukkan email akun terdaftar</span>
            </div>

            <div className={`flex items-center gap-3 rounded-xl p-2.5 transition-colors ${stepNumber >= 2 ? "bg-white/15 text-white" : "text-white/50"}`}>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${stepNumber >= 2 ? "bg-[#d9691f] text-white" : "bg-white/10"}`}>
                2
              </span>
              <span>Verifikasi kode OTP 6 digit</span>
            </div>

            <div className={`flex items-center gap-3 rounded-xl p-2.5 transition-colors ${stepNumber >= 3 ? "bg-white/15 text-white" : "text-white/50"}`}>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${stepNumber >= 3 ? "bg-[#d9691f] text-white" : "bg-white/10"}`}>
                3
              </span>
              <span>Buat & simpan kata sandi baru</span>
            </div>
          </div>
        </div>

        {/* Bottom Security Badge */}
        <div className="relative z-10 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/10 text-xs">
          <p className="text-white/90 font-medium leading-relaxed">
            Perlu bantuan darurat? Hubungi Customer Service kami 24/7.
          </p>
        </div>
      </div>

      {/* Right Column: Clean Form Container */}
      <div className="p-7 sm:p-10 md:col-span-7 flex flex-col justify-center bg-white">
        <AnimatePresence mode="wait">
          {step === "email" && (
            <motion.div
              key="step-email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <EmailStep
                email={email}
                setEmail={setEmail}
                onSent={() => setStep("otp")}
                onToast={onToast}
              />
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div
              key="step-otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <OTPVerificationStep
                email={email}
                onVerified={() => setStep("newPassword")}
                onBack={() => setStep("email")}
                onToast={onToast}
              />
            </motion.div>
          )}

          {step === "newPassword" && (
            <motion.div
              key="step-newPassword"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <NewPasswordStep
                onDone={() => setStep("done")}
                onToast={onToast}
              />
            </motion.div>
          )}

          {step === "done" && (
            <motion.div
              key="step-done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
            >
              <DoneStep email={email} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Langkah 1: Masukkan Alamat Email                                   */
/* ------------------------------------------------------------------ */

function EmailStep({
  email,
  setEmail,
  onSent,
  onToast,
}: {
  email: string;
  setEmail: (v: string) => void;
  onSent: () => void;
  onToast: (kind: Toast["kind"], msg: string) => void;
}) {
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setError("Alamat email wajib diisi.");
      return;
    }
    if (!emailPattern.test(email.trim())) {
      setError("Format email tidak valid (contoh: nama@email.com).");
      return;
    }

    setError(undefined);
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);

    onToast("success", `Kode verifikasi telah dikirim ke ${email.trim()}.`);
    onSent();
  }

  return (
    <>
      <div className="mb-6">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#efe4cf] text-[#d9691f]">
          <IconKey />
        </div>
        <h1 className="font-[var(--font-display,serif)] text-2xl font-bold text-[#241608]">
          Lupa Kata Sandi?
        </h1>
        <p className="mt-1 text-xs text-[#5a4a35]">
          Jangan cemas! Masukkan alamat email akun ConcertGo-mu untuk menerima kode verifikasi pemulihan sandi.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#4a3a26] mb-1.5">
            Alamat Email Akun
          </label>
          <div
            className={`relative flex items-center rounded-xl border transition-all ${
              error
                ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-200"
                : "border-[#e6d9bf] bg-[#fbf8f2] focus-within:border-[#d9691f] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#d9691f]/20"
            }`}
          >
            <span className="pl-3.5 text-[#8a7a63]">
              <IconEnvelope />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(undefined);
              }}
              placeholder="nama@email.com"
              autoComplete="email"
              className="w-full bg-transparent py-2.5 pl-3 pr-4 text-xs sm:text-sm text-[#241608] placeholder:text-[#a1917a] focus:outline-hidden"
            />
          </div>
          {error && <p className="mt-1 text-[11px] font-medium text-rose-600">{error}</p>}
        </div>

        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#241608] py-3 text-xs sm:text-sm font-semibold text-[#f6efe1] shadow-md transition-colors hover:bg-[#d9691f] disabled:opacity-70"
        >
          {loading && <IconSpinner />}
          {loading ? "Mengirim kode..." : "Kirim Kode Verifikasi"}
        </motion.button>
      </form>

      <div className="mt-8 border-t border-[#e6d9bf] pt-4 text-center text-xs text-[#5a4a35]">
        Sudah mengingat kata sandi?{" "}
        <Link href="/Sign-in" className="font-bold text-[#d9691f] hover:underline">
          Kembali ke halaman masuk
        </Link>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Langkah 2: Verifikasi Kode OTP 6 Digit                            */
/* ------------------------------------------------------------------ */

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

function OTPVerificationStep({
  email,
  onVerified,
  onBack,
  onToast,
}: {
  email: string;
  onVerified: () => void;
  onBack: () => void;
  onToast: (kind: Toast["kind"], msg: string) => void;
}) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | undefined>();
  const [verifying, setVerifying] = useState(false);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  function updateDigit(index: number, value: string) {
    const clean = value.replace(/[^0-9]/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = clean;
      return next;
    });
    setError(undefined);
    if (clean && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((d, i) => (next[i] = d));
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < OTP_LENGTH) {
      setError("Silakan masukkan lengkap 6 digit kode.");
      return;
    }

    setVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setVerifying(false);

    onToast("success", "Kode verifikasi valid! Silakan buat kata sandi baru.");
    onVerified();
  }

  function handleResend() {
    if (resendIn > 0) return;
    setResendIn(RESEND_SECONDS);
    setDigits(Array(OTP_LENGTH).fill(""));
    inputsRef.current[0]?.focus();
    onToast("success", `Kode verifikasi baru telah dikirim ke ${email.trim()}.`);
  }

  return (
    <>
      <div className="mb-6">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#efe4cf] text-[#d9691f]">
          <IconShieldCheck />
        </div>
        <h2 className="font-[var(--font-display,serif)] text-2xl font-bold text-[#241608]">
          Verifikasi Kode OTP
        </h2>
        <p className="mt-1 text-xs text-[#5a4a35]">
          Masukkan 6 digit kode keamanan yang kami kirimkan ke{" "}
          <strong className="text-[#241608] font-semibold">{email || "email Anda"}</strong>.
        </p>
      </div>

      <form onSubmit={handleVerify} noValidate>
        <div className="flex justify-center gap-2 sm:gap-3 my-5" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => updateDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={`h-12 w-11 sm:h-13 sm:w-12 rounded-xl border text-center text-lg font-bold text-[#241608] transition-all focus:outline-hidden ${
                error
                  ? "border-rose-400 bg-rose-50/50"
                  : "border-[#e6d9bf] bg-[#fbf8f2] focus:border-[#d9691f] focus:bg-white focus:ring-2 focus:ring-[#d9691f]/20"
              }`}
            />
          ))}
        </div>

        {error && <p className="text-center text-xs font-medium text-rose-600 mb-3">{error}</p>}

        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          type="submit"
          disabled={verifying}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#241608] py-3 text-xs sm:text-sm font-semibold text-[#f6efe1] shadow-md transition-colors hover:bg-[#d9691f] disabled:opacity-70"
        >
          {verifying && <IconSpinner />}
          {verifying ? "Memverifikasi..." : "Verifikasi & Lanjutkan"}
        </motion.button>

        <div className="mt-5 flex flex-col items-center gap-2 text-xs text-[#5a4a35]">
          {resendIn > 0 ? (
            <span>Kirim ulang kode dalam <strong className="text-[#241608]">{resendIn}s</strong></span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-bold text-[#d9691f] hover:underline"
            >
              Kirim Ulang Kode Sekarang
            </button>
          )}

          <button
            type="button"
            onClick={onBack}
            className="text-[#8a7a63] hover:text-[#241608] mt-1 transition-colors"
          >
            ← Ubah alamat email
          </button>
        </div>
      </form>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Langkah 3: Pembuatan Kata Sandi Baru                               */
/* ------------------------------------------------------------------ */

type NewPasswordErrors = { password?: string; confirmPassword?: string };

function NewPasswordStep({
  onDone,
  onToast,
}: {
  onDone: () => void;
  onToast: (kind: Toast["kind"], msg: string) => void;
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<NewPasswordErrors>({});
  const [saving, setSaving] = useState(false);

  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  function validate(): NewPasswordErrors {
    const next: NewPasswordErrors = {};

    if (!password) {
      next.password = "Kata sandi baru wajib diisi.";
    } else if (password.length < 8) {
      next.password = "Kata sandi minimal 8 karakter.";
    }

    if (!confirmPassword) {
      next.confirmPassword = "Ulangi kata sandi baru.";
    } else if (confirmPassword !== password) {
      next.confirmPassword = "Konfirmasi kata sandi tidak cocok.";
    }

    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      onToast("error", "Periksa kembali kata sandi baru Anda.");
      return;
    }

    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);

    onToast("success", "Kata sandi Anda berhasil diperbarui!");
    onDone();
  }

  return (
    <>
      <div className="mb-6">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#efe4cf] text-[#d9691f]">
          <IconLock />
        </div>
        <h2 className="font-[var(--font-display,serif)] text-2xl font-bold text-[#241608]">
          Atur Kata Sandi Baru
        </h2>
        <p className="mt-1 text-xs text-[#5a4a35]">
          Buat kata sandi baru yang kuat untuk melindungi akun dan tiket konser Anda.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#4a3a26] mb-1.5">
            Kata Sandi Baru
          </label>
          <div
            className={`relative flex items-center rounded-xl border transition-all ${
              errors.password
                ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-200"
                : "border-[#e6d9bf] bg-[#fbf8f2] focus-within:border-[#d9691f] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#d9691f]/20"
            }`}
          >
            <span className="pl-3.5 text-[#8a7a63]">
              <IconLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="Minimal 8 karakter"
              autoComplete="new-password"
              className="w-full bg-transparent py-2.5 pl-3 pr-10 text-xs sm:text-sm text-[#241608] placeholder:text-[#a1917a] focus:outline-hidden"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-[#8a7a63] hover:text-[#241608] transition-colors"
            >
              {showPassword ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.password}</p>
          )}
        </div>

        {/* Strength Bar */}
        {password && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-[#8a7a63]">
              <span>Kekuatan Sandi</span>
              <span className="font-semibold text-[#241608]">
                {passwordStrength <= 1 ? "Lemah" : passwordStrength <= 3 ? "Sedang" : "Sangat Kuat"}
              </span>
            </div>
            <div className="flex gap-1 h-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`flex-1 rounded-full ${
                    level <= passwordStrength
                      ? passwordStrength <= 1
                        ? "bg-rose-500"
                        : passwordStrength <= 3
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                      : "bg-[#e6d9bf]"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#4a3a26] mb-1.5">
            Konfirmasi Kata Sandi Baru
          </label>
          <div
            className={`relative flex items-center rounded-xl border transition-all ${
              errors.confirmPassword
                ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-200"
                : "border-[#e6d9bf] bg-[#fbf8f2] focus-within:border-[#d9691f] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#d9691f]/20"
            }`}
          >
            <span className="pl-3.5 text-[#8a7a63]">
              <IconLock />
            </span>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              placeholder="Ulangi kata sandi baru"
              autoComplete="new-password"
              className="w-full bg-transparent py-2.5 pl-3 pr-10 text-xs sm:text-sm text-[#241608] placeholder:text-[#a1917a] focus:outline-hidden"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 text-[#8a7a63] hover:text-[#241608] transition-colors"
            >
              {showConfirm ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.confirmPassword}</p>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          type="submit"
          disabled={saving}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#241608] py-3 text-xs sm:text-sm font-semibold text-[#f6efe1] shadow-md transition-colors hover:bg-[#d9691f] disabled:opacity-70"
        >
          {saving && <IconSpinner />}
          {saving ? "Menyimpan sandi baru..." : "Simpan Kata Sandi Baru"}
        </motion.button>
      </form>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Langkah 4: Selesai & Berhasil                                      */
/* ------------------------------------------------------------------ */

function DoneStep({ email }: { email: string }) {
  return (
    <div className="text-center py-4">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h2 className="font-[var(--font-display,serif)] text-2xl font-bold text-[#241608]">
        Kata Sandi Berhasil Diubah!
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-[#5a4a35] max-w-sm mx-auto">
        Kata sandi baru untuk akun <strong className="text-[#241608]">{email || "Anda"}</strong> telah aktif. Silakan masuk kembali untuk melanjutkan eksplorasi konser impianmu.
      </p>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-6">
        <Link
          href="/Sign-in"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#241608] py-3 text-xs sm:text-sm font-semibold text-[#f6efe1] shadow-md transition-colors hover:bg-[#d9691f]"
        >
          Masuk ke Akun Sekarang
        </Link>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Auth Footer                                                        */
/* ------------------------------------------------------------------ */

function AuthFooter() {
  return (
    <footer className="border-t border-[#e6d9bf] bg-[#f1e6d0] py-6 px-6">
      <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5a4a35]">
        <p>© 2026 ConcertGo Indonesia. Hak cipta dilindungi undang-undang.</p>
        <div className="flex gap-4 font-medium">
          <a href="#" className="hover:text-[#d9691f]">Pusat Bantuan</a>
          <a href="#" className="hover:text-[#d9691f]">Kebijakan Privasi</a>
          <a href="#" className="hover:text-[#d9691f]">Syarat & Ketentuan</a>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline SVG Icons                                                   */
/* ------------------------------------------------------------------ */

function IconKey() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="7.5" cy="15.5" r="4.5" strokeLinejoin="round" />
      <path d="m11 12 7-7M15 8l3 3M18 5l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconEnvelope() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </svg>
  );
}
function IconEye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconEyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path
        d="M10.6 5.2A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.6 4.5M6.2 6.9C3.6 8.7 2 12 2 12s3.6 7 10 7a10 10 0 0 0 4.1-.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" strokeLinecap="round" />
    </svg>
  );
}
function IconSpinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-spin" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
function IconShieldCheck() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}