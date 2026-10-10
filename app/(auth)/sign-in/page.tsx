"use client";

/**
 * ConcertGo — Sign In Page
 * Desain bersih, rapi, dan profesional dengan visual konser, tab switcher,
 * tombol social login, validasi responsif, dan verifikasi OTP.
 */

import type { FormEvent, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { authService } from "@/services/auth.service";

// Extracted Components
import { useToasts, ToastStack, type Toast } from "@/components/ui/Toast";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { IconGoogle, IconFacebook } from "@/components/icons/SocialIcons";

// Lucide Icons
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Main Sign In Page Component                                        */
/* ------------------------------------------------------------------ */

export default function SignInPage() {
  const { toasts, push, dismiss } = useToasts();

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-theme-bg font-[var(--font-body,ui-sans-serif)] text-theme-text">
      <AuthHeader />
      <ToastStack toasts={toasts} dismiss={dismiss} />

      <main className="relative flex flex-1 items-center justify-center px-4 py-10 md:py-16">
        {/* Soft Background Accents */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#d9691f]/10 via-theme-bg to-theme-card-hover"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#d9691f]/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-theme-dark/15 blur-3xl"
        />

        <SignInCard onToast={push} />
      </main>

      <AuthFooter />
    </div>
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
    try {
      await authService.login({ email: email.trim(), password });
      onToast("success", "Login berhasil! Mengalihkan ke halaman utama...");
      setTimeout(() => {
        window.location.href = "/user/homepage";
      }, 1200);
    } catch (error: any) {
      onToast("error", error.message || "Email atau kata sandi salah.");
    } finally {
      setLoading(false);
    }
  }

  function handleSocial(provider: "Google" | "Facebook") {
    onToast("success", `Menghubungkan dengan akun ${provider}...`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-theme-border bg-theme-card shadow-2xl md:grid md:grid-cols-12"
    >
      {/* Left Column: Visual Concert Banner Showcase (Hidden on Mobile) */}
      <div className="relative hidden md:col-span-5 md:flex md:flex-col md:justify-between p-8 text-[#f6efe1] overflow-hidden bg-theme-dark">
        <Image
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop"
          alt="Concert stage crowd"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="absolute inset-0 object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b0d05] via-[#241209]/80 to-transparent" />

        {/* Top Tag */}
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-theme-card/15 px-3 py-1 text-xs font-semibold text-[#d9a26a] backdrop-blur-md border border-theme-card/10">
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
        <div className="relative z-10 rounded-2xl bg-theme-card/10 p-3.5 backdrop-blur-md border border-theme-card/10 text-xs">
          <div className="flex text-amber-400 gap-1 text-xs mb-1">★★★★★</div>
          <p className="text-white/90 font-medium leading-relaxed">
            &ldquo;Checkout tiket tercepat, barcode resmi langsung masuk email tanpa antrean calo.&rdquo;
          </p>
          <p className="mt-2 text-[11px] text-[#d9a26a] font-semibold">500.000+ Penggemar Terdaftar</p>
        </div>
      </div>

      {/* Right Column: Clean Form Container */}
      <div className="p-7 sm:p-10 md:col-span-7 flex flex-col justify-center bg-theme-card">
        {step === "credentials" ? (
          <>
            {/* Top Switch Tabs (Masuk vs Daftar) */}
            <div className="relative flex items-center rounded-2xl bg-theme-card-hover/60 p-1 mb-8">
              {/* Tab Indicator */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                className="absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-theme-card shadow-xs"
              />
              <span className="relative z-10 flex-1 text-center py-2 rounded-xl text-xs font-bold text-theme-text">
                Masuk
              </span>
              <Link
                href="/sign-up"
                className="relative z-10 flex-1 text-center py-2 rounded-xl text-xs font-semibold text-theme-text-muted hover:text-theme-text transition-colors"
              >
                Daftar Akun
              </Link>
            </div>

            {/* Header Text */}
            <div className="mb-6">
              <h1 className="font-[var(--font-display,serif)] text-2xl font-bold text-theme-text">
                Selamat Datang Kembali
              </h1>
              <p className="mt-1 text-xs text-theme-text-muted">
                Masukkan alamat email dan kata sandi untuk mengakses akunmu.
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => handleSocial("Google")}
                className="flex items-center justify-center gap-2 rounded-xl border border-theme-border bg-[#fbf8f2] py-2.5 px-3 text-xs font-semibold text-theme-text transition-all hover:bg-theme-card hover:border-[#d9691f]/50 hover:shadow-xs"
              >
                <IconGoogle />
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocial("Facebook")}
                className="flex items-center justify-center gap-2 rounded-xl border border-theme-border bg-[#fbf8f2] py-2.5 px-3 text-xs font-semibold text-theme-text transition-all hover:bg-theme-card hover:border-[#1877F2]/50 hover:shadow-xs"
              >
                <IconFacebook />
                <span>Facebook</span>
              </button>
            </div>

            <div className="relative mb-6 flex items-center justify-center">
              <span className="absolute inset-x-0 h-px bg-theme-border" />
              <span className="relative bg-theme-card px-3 text-[11px] font-medium uppercase tracking-wider text-theme-text-light">
                atau dengan email
              </span>
            </div>

            {/* Credential Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-theme-text-muted mb-1.5">
                  Alamat Email
                </label>
                <div
                  className={`relative flex items-center rounded-xl border transition-all ${
                    errors.email
                      ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-200"
                      : "border-theme-border bg-[#fbf8f2] focus-within:border-[#d9691f] focus-within:bg-theme-card focus-within:ring-2 focus-within:ring-[#d9691f]/20"
                  }`}
                >
                  <span className="pl-3.5 text-theme-text-light">
                    <Mail className="h-4 w-4" />
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
                    className="w-full bg-transparent py-2.5 pl-3 pr-4 text-xs sm:text-sm text-theme-text placeholder:text-[#a1917a] focus:outline-hidden"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-theme-text-muted mb-1.5">
                  Kata Sandi
                </label>
                <div
                  className={`relative flex items-center rounded-xl border transition-all ${
                    errors.password
                      ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-200"
                      : "border-theme-border bg-[#fbf8f2] focus-within:border-[#d9691f] focus-within:bg-theme-card focus-within:ring-2 focus-within:ring-[#d9691f]/20"
                  }`}
                >
                  <span className="pl-3.5 text-theme-text-light">
                    <Lock className="h-4 w-4" />
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
                    className="w-full bg-transparent py-2.5 pl-3 pr-10 text-xs sm:text-sm text-theme-text placeholder:text-[#a1917a] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-theme-text-light hover:text-theme-text transition-colors flex items-center"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-theme-text-muted cursor-pointer select-none">
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
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-theme-button py-3 text-xs sm:text-sm font-semibold text-[#f6efe1] shadow-md transition-colors hover:bg-[#d9691f] disabled:opacity-70"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Memverifikasi data..." : "Masuk ke Akun"}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-xs text-theme-text-muted">
              Belum punya akun ConcertGo?{" "}
              <Link href="/sign-up" className="font-bold text-[#d9691f] hover:underline">
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
      window.location.href = "/user/homepage";
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
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-theme-card-hover text-[#d9691f]">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="font-[var(--font-display,serif)] text-2xl font-bold text-theme-text">
          Masukkan Kode Verifikasi
        </h2>
        <p className="mt-1 text-xs text-theme-text-muted max-w-sm mx-auto">
          Kami telah mengirimkan 6 digit kode keamanan ke{" "}
          <strong className="text-theme-text font-semibold">{email || "email Anda"}</strong>.
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
              className={`h-12 w-11 sm:h-13 sm:w-12 rounded-xl border text-center text-lg font-bold text-theme-text transition-all focus:outline-hidden ${
                error
                  ? "border-rose-400 bg-rose-50/50"
                  : "border-theme-border bg-[#fbf8f2] focus:border-[#d9691f] focus:bg-theme-card focus:ring-2 focus:ring-[#d9691f]/20"
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
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-theme-button py-3 text-xs sm:text-sm font-semibold text-[#f6efe1] shadow-md transition-colors hover:bg-[#d9691f] disabled:opacity-70"
        >
          {verifying && <Loader2 className="h-4 w-4 animate-spin" />}
          {verifying ? "Memverifikasi..." : "Konfirmasi & Masuk"}
        </motion.button>

        <div className="mt-4 flex flex-col items-center gap-2 text-xs text-theme-text-muted">
          {resendIn > 0 ? (
            <span>Kirim ulang kode dalam <strong className="text-theme-text">{resendIn}s</strong></span>
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
            className="text-theme-text-light hover:text-theme-text mt-1 transition-colors"
          >
            ← Ubah alamat email
          </button>
        </div>
      </form>
    </div>
  );
}