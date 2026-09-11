"use client";

/**
 * ConcertGo — Sign In Page
 * Desain bersih, rapi, dan profesional dengan visual konser, tab switcher,
 * tombol social login, validasi responsif, dan verifikasi OTP.
 */

import type { FormEvent, JSX, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
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
/*  Main Sign In Page Component                                        */
/* ------------------------------------------------------------------ */

export default function SignInPage() {
  const { toasts, push, dismiss } = useToasts();

  return (
    <div className="flex min-h-screen flex-col bg-[#f6efe1] font-[var(--font-body,ui-sans-serif)] text-[#241608]">
      <AuthHeader />
      <ToastStack toasts={toasts} dismiss={dismiss} />

      <main className="relative flex flex-1 items-center justify-center px-4 py-10 md:py-16">
        {/* Soft Background Accents */}
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

        <SignInCard onToast={push} />
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
          <span className="hidden text-xs text-[#5a4a35] sm:inline">Belum punya akun?</span>
          <Link
            href="/Sign-up"
            className="rounded-full border border-[#241608] px-4 py-1.5 text-xs font-semibold text-[#241608] transition-all hover:bg-[#241608] hover:text-[#f6efe1]"
          >
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Sign In Card (Split View: Visual Showcase + Clean Form)            */
/* ------------------------------------------------------------------ */

type Step = "credentials" | "otp";
type FieldErrors = { email?: string; password?: string };

function SignInCard({ onToast }: { onToast: (kind: Toast["kind"], msg: string) => void }) {
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      next.email = "Alamat email wajib diisi.";
    } else if (!emailPattern.test(email.trim())) {
      next.email = "Format email tidak valid (contoh: nama@email.com).";
    }

    if (!password) {
      next.password = "Kata sandi wajib diisi.";
    } else if (password.length < 8) {
      next.password = "Kata sandi minimal 8 karakter.";
    }

    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      onToast("error", "Silakan lengkapi data yang belum sesuai.");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);

    onToast("success", `Kode verifikasi telah dikirim ke ${email.trim()}.`);
    setStep("otp");
  }

  function handleSocial(provider: "Google" | "Facebook") {
    onToast("success", `Menghubungkan dengan akun ${provider}...`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-[#e6d9bf] bg-white shadow-2xl md:grid md:grid-cols-12"
    >
      {/* Left Column: Visual Concert Banner Showcase (Hidden on Mobile) */}
      <div className="relative hidden md:col-span-5 md:flex md:flex-col md:justify-between p-8 text-[#f6efe1] overflow-hidden bg-[#241209]">
        <img
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop"
          alt="Concert stage crowd"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b0d05] via-[#241209]/80 to-transparent" />

        {/* Top Tag */}
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-[#d9a26a] backdrop-blur-md border border-white/10">
            <span className="h-2 w-2 rounded-full bg-[#d9691f] animate-pulse" />
            TIKET RESMI 100%
          </span>
        </div>

        {/* Middle Highlight */}
        <div className="relative z-10 my-auto py-8">
          <h2 className="font-[var(--font-display,serif)] text-2xl font-bold leading-snug">
            Amankan Kursi Konser Idola Tanpa Ribet
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-[#c4b59d]">
            Satu akun untuk ribuan pertunjukan musik, festival akbar, dan tur musisi favorit di seluruh Indonesia.
          </p>
        </div>

        {/* Bottom Social Proof */}
        <div className="relative z-10 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/10 text-xs">
          <div className="flex text-amber-400 gap-1 text-xs mb-1">★★★★★</div>
          <p className="text-white/90 font-medium leading-relaxed">
            &ldquo;Checkout tiket tercepat, barcode resmi langsung masuk email tanpa antrean calo.&rdquo;
          </p>
          <p className="mt-2 text-[11px] text-[#d9a26a] font-semibold">500.000+ Penggemar Terdaftar</p>
        </div>
      </div>

      {/* Right Column: Clean Form Container */}
      <div className="p-7 sm:p-10 md:col-span-7 flex flex-col justify-center bg-white">
        {step === "credentials" ? (
          <>
            {/* Top Switch Tabs (Masuk vs Daftar) */}
            <div className="flex items-center rounded-2xl bg-[#efe4cf]/60 p-1 mb-8">
              <span className="flex-1 text-center py-2 rounded-xl text-xs font-bold bg-white text-[#241608] shadow-xs">
                Masuk
              </span>
              <Link
                href="/Sign-up"
                className="flex-1 text-center py-2 rounded-xl text-xs font-semibold text-[#5a4a35] hover:text-[#241608] transition-colors"
              >
                Daftar Akun
              </Link>
            </div>

            {/* Header Text */}
            <div className="mb-6">
              <h1 className="font-[var(--font-display,serif)] text-2xl font-bold text-[#241608]">
                Selamat Datang Kembali
              </h1>
              <p className="mt-1 text-xs text-[#5a4a35]">
                Masukkan alamat email dan kata sandi untuk mengakses akunmu.
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => handleSocial("Google")}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#e6d9bf] bg-[#fbf8f2] py-2.5 px-3 text-xs font-semibold text-[#241608] transition-all hover:bg-white hover:border-[#d9691f]/50 hover:shadow-xs"
              >
                <IconGoogle />
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocial("Facebook")}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#e6d9bf] bg-[#fbf8f2] py-2.5 px-3 text-xs font-semibold text-[#241608] transition-all hover:bg-white hover:border-[#1877F2]/50 hover:shadow-xs"
              >
                <IconFacebook />
                <span>Facebook</span>
              </button>
            </div>

            <div className="relative mb-6 flex items-center justify-center">
              <span className="absolute inset-x-0 h-px bg-[#e6d9bf]" />
              <span className="relative bg-white px-3 text-[11px] font-medium uppercase tracking-wider text-[#8a7a63]">
                atau dengan email
              </span>
            </div>

            {/* Credential Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4a3a26] mb-1.5">
                  Alamat Email
                </label>
                <div
                  className={`relative flex items-center rounded-xl border transition-all ${
                    errors.email
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
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="nama@email.com"
                    autoComplete="email"
                    className="w-full bg-transparent py-2.5 pl-3 pr-4 text-xs sm:text-sm text-[#241608] placeholder:text-[#a1917a] focus:outline-hidden"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4a3a26] mb-1.5">
                  Kata Sandi
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
                    autoComplete="current-password"
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

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-[#5a4a35] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded-md border-[#c9b48b] text-[#d9691f] accent-[#d9691f] cursor-pointer"
                  />
                  <span>Ingat saya di perangkat ini</span>
                </label>
                <Link
                  href="/reset-password"
                  className="font-medium text-[#d9691f] hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#241608] py-3 text-xs sm:text-sm font-semibold text-[#f6efe1] shadow-md transition-colors hover:bg-[#d9691f] disabled:opacity-70"
              >
                {loading && <IconSpinner />}
                {loading ? "Memverifikasi data..." : "Masuk ke Akun"}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-xs text-[#5a4a35]">
              Belum punya akun ConcertGo?{" "}
              <Link href="/Sign-up" className="font-bold text-[#d9691f] hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </>
        ) : (
          <VerificationStep
            email={email}
            onBack={() => setStep("credentials")}
            onToast={onToast}
          />
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Verification OTP Step                                             */
/* ------------------------------------------------------------------ */

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

function VerificationStep({
  email,
  onBack,
  onToast,
}: {
  email: string;
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
      setError("Silakan lengkapi 6 digit kode verifikasi.");
      return;
    }

    setVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setVerifying(false);

    onToast("success", "Verifikasi berhasil! Mengalihkan ke halaman utama...");
    setTimeout(() => {
      window.location.href = "/User/Homepage";
    }, 1200);
  }

  function handleResend() {
    if (resendIn > 0) return;
    setResendIn(RESEND_SECONDS);
    setDigits(Array(OTP_LENGTH).fill(""));
    inputsRef.current[0]?.focus();
    onToast("success", `Kode verifikasi baru telah dikirim ke ${email.trim()}.`);
  }

  return (
    <div className="py-2">
      <div className="text-center mb-6">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#efe4cf] text-[#d9691f]">
          <IconShieldCheck />
        </div>
        <h2 className="font-[var(--font-display,serif)] text-2xl font-bold text-[#241608]">
          Masukkan Kode Verifikasi
        </h2>
        <p className="mt-1 text-xs text-[#5a4a35] max-w-sm mx-auto">
          Kami telah mengirimkan 6 digit kode keamanan ke{" "}
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
          {verifying ? "Memverifikasi..." : "Konfirmasi & Masuk"}
        </motion.button>

        <div className="mt-4 flex flex-col items-center gap-2 text-xs text-[#5a4a35]">
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
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.1-4 1.1-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.3 7.4 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.4 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.4A12 12 0 0 0 0 12c0 1.9.5 3.8 1.4 5.4l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z"
      />
    </svg>
  );
}
function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.07C24 5.4 18.6 0 12 0S0 5.4 0 12.07C0 18.1 4.4 23.1 10.1 24v-8.44H7.1v-3.49h3v-2.66c0-2.97 1.79-4.61 4.5-4.61 1.3 0 2.66.23 2.66.23v2.92h-1.5c-1.48 0-1.94.92-1.94 1.86v2.26h3.3l-.53 3.49h-2.77V24C19.6 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}