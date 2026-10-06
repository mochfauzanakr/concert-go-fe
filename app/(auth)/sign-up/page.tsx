"use client";

/**
 * ConcertGo — Sign Up Page
 * Desain bersih, rapi, dan profesional dengan visual konser, tab switcher,
 * tombol social register, indikator kekuatan password, dan verifikasi OTP.
 */

import type { FormEvent, KeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "@/services/auth.service";

// Extracted Components
import { useToasts, ToastStack, type Toast } from "@/components/ui/Toast";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { IconGoogle, IconFacebook } from "@/components/icons/SocialIcons";

// Lucide Icons
import { User, Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";


/* ------------------------------------------------------------------ */
/*  Main Sign Up Page Component                                        */
/* ------------------------------------------------------------------ */

export default function SignUpPage() {
  const { toasts, push, dismiss } = useToasts();

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#f6efe1] font-[var(--font-body,ui-sans-serif)] text-[#241608]">
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

        <SignUpCard onToast={push} />
      </main>

      <AuthFooter />
    </div>
  );
}


/* ------------------------------------------------------------------ */
/*  Sign Up Card (Split View: Visual Showcase + Clean Form)            */
/* ------------------------------------------------------------------ */

type Step = "form" | "otp";
type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
};

function SignUpCard({ onToast }: { onToast: (kind: Toast["kind"], msg: string) => void }) {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  // Live password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      next.name = "Nama lengkap wajib diisi.";
    } else if (name.trim().length < 3) {
      next.name = "Nama minimal 3 karakter.";
    }

    if (!email.trim()) {
      next.email = "Alamat email wajib diisi.";
    } else if (!emailPattern.test(email.trim())) {
      next.email = "Format email tidak valid (contoh: nama@email.com).";
    }

    if (!password) {
      next.password = "Kata sandi wajib diisi.";
    } else if (password.length < 8) {
      next.password = "Kata sandi minimal 8 karakter.";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(password)) {
      next.password = "Sandi harus mengandung huruf besar, kecil, angka & simbol khusus.";
    }

    if (!confirmPassword) {
      next.confirmPassword = "Konfirmasi kata sandi wajib diisi.";
    } else if (confirmPassword !== password) {
      next.confirmPassword = "Konfirmasi kata sandi tidak cocok.";
    }

    if (!agreed) {
      next.terms = "Kamu harus menyetujui Syarat & Ketentuan.";
    }

    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      onToast("error", "Silakan lengkapi formulir pendaftaran dengan benar.");
      return;
    }

    setLoading(true);
    try {
      await authService.register({ name: name.trim(), email: email.trim(), password });
      onToast("success", "Pendaftaran berhasil! Mengalihkan ke beranda akun Anda...");
      setTimeout(() => {
        window.location.href = "/user/homepage";
      }, 1200);
    } catch (error: any) {
      onToast("error", error.message || "Pendaftaran gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  function handleSocial(provider: "Google" | "Facebook") {
    onToast("success", `Mendaftarkan dengan akun ${provider}...`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-[#e6d9bf] bg-white shadow-2xl md:grid md:grid-cols-12"
    >
      {/* Left Column: Visual Showcase & Perks (Hidden on Mobile) */}
      <div className="relative hidden md:col-span-5 md:flex md:flex-col md:justify-between p-8 text-[#f6efe1] overflow-hidden bg-[#241209]">
        <Image
          src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop"
          alt="Concert stage lights"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="absolute inset-0 object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b0d05] via-[#241209]/80 to-transparent" />

        {/* Top Tag */}
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-[#d9a26a] backdrop-blur-md border border-white/10">
            <span className="h-2 w-2 rounded-full bg-[#d9691f] animate-pulse" />
            GABUNG BERSAMA KAMI
          </span>
        </div>

        {/* Middle Highlight & Perks */}
        <div className="relative z-10 my-auto py-8">
          <h2 className="font-[var(--font-display,serif)] text-2xl font-bold leading-snug">
            Jadilah Bagian dari Komunitas Musik Terbesar
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-[#c4b59d]">
            Daftar akun gratis sekarang dan nikmati ragam keuntungan eksklusif untuk penikmat konser.
          </p>

          <ul className="mt-5 space-y-2.5 text-xs text-white/90">
            <li className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#d9691f] text-[10px] font-bold text-white">✓</span>
              <span>Akses presale & kuota tiket lebih awal</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#d9691f] text-[10px] font-bold text-white">✓</span>
              <span>E-tiket resmi bergaransi anti tiket palsu</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#d9691f] text-[10px] font-bold text-white">✓</span>
              <span>Notifikasi jadwal tur musisi idola di kotamu</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#d9691f] text-[10px] font-bold text-white">✓</span>
              <span>Jaminan perlindungan refund 100% transparan</span>
            </li>
          </ul>
        </div>

        {/* Bottom Social Proof */}
        <div className="relative z-10 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/10 text-xs">
          <p className="text-white/95 font-semibold leading-relaxed">
            Gratis, Cepat, dan Siap Digunakan Kapan Saja
          </p>
          <p className="mt-1 text-[11px] text-[#d9a26a]">Tidak ada biaya langganan bulanan</p>
        </div>
      </div>

      {/* Right Column: Clean Sign Up Form */}
      <div className="p-7 sm:p-10 md:col-span-7 flex flex-col justify-center bg-white">
        {step === "form" ? (
          <>
            {/* Top Switch Tabs (Masuk vs Daftar) */}
            <div className="relative flex items-center rounded-2xl bg-[#efe4cf]/60 p-1 mb-8">
              {/* Tab Indicator */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                className="absolute right-1 top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-white shadow-xs"
              />
              <Link
                href="/sign-in"
                className="relative z-10 flex-1 text-center py-2 rounded-xl text-xs font-semibold text-[#5a4a35] hover:text-[#241608] transition-colors"
              >
                Masuk
              </Link>
              <span className="relative z-10 flex-1 text-center py-2 rounded-xl text-xs font-bold text-[#241608]">
                Daftar Akun
              </span>
            </div>

            {/* Header Text */}
            <div className="mb-6">
              <h1 className="font-[var(--font-display,serif)] text-2xl font-bold text-[#241608]">
                Buat Akun ConcertGo
              </h1>
              <p className="mt-1 text-xs text-[#5a4a35]">
                Isi data diri singkat untuk mulai memesan tiket konser favoritmu.
              </p>
            </div>

            {/* Social Registration Buttons */}
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
                atau daftar dengan email
              </span>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4a3a26] mb-1.5">
                  Username
                </label>
                <div
                  className={`relative flex items-center rounded-xl border transition-all ${
                    errors.name
                      ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-200"
                      : "border-[#e6d9bf] bg-[#fbf8f2] focus-within:border-[#d9691f] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#d9691f]/20"
                  }`}
                >
                  <span className="pl-3.5 text-[#8a7a63]">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="Masukkan Username kamu"
                    autoComplete="name"
                    className="w-full bg-transparent py-2.5 pl-3 pr-4 text-xs sm:text-sm text-[#241608] placeholder:text-[#a1917a] focus:outline-hidden"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.name}</p>
                )}
              </div>

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
                    className="w-full bg-transparent py-2.5 pl-3 pr-4 text-xs sm:text-sm text-[#241608] placeholder:text-[#a1917a] focus:outline-hidden"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    <span className="pl-3 text-[#8a7a63]">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      placeholder="Min. 8 karakter (Cth: example928@)"
                      autoComplete="new-password"
                      className="w-full bg-transparent py-2.5 pl-2.5 pr-8 text-xs sm:text-sm text-[#241608] placeholder:text-[#a1917a] focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 text-[#8a7a63] hover:text-[#241608]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4a3a26] mb-1.5">
                    Ulangi Sandi
                  </label>
                  <div
                    className={`relative flex items-center rounded-xl border transition-all ${
                      errors.confirmPassword
                        ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-200"
                        : "border-[#e6d9bf] bg-[#fbf8f2] focus-within:border-[#d9691f] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#d9691f]/20"
                    }`}
                  >
                    <span className="pl-3 text-[#8a7a63]">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                      }}
                      placeholder="Ulangi sandi"
                      autoComplete="new-password"
                      className="w-full bg-transparent py-2.5 pl-2.5 pr-8 text-xs sm:text-sm text-[#241608] placeholder:text-[#a1917a] focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-2.5 text-[#8a7a63] hover:text-[#241608]"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-1 pt-1">
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

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-[#5a4a35] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }));
                    }}
                    className="mt-0.5 h-4 w-4 rounded-md border-[#c9b48b] text-[#d9691f] accent-[#d9691f] cursor-pointer"
                  />
                  <span className="leading-relaxed">
                    Saya menyetujui{" "}
                    <a href="#" className="font-semibold text-[#d9691f] hover:underline">
                      Syarat & Ketentuan
                    </a>{" "}
                    serta{" "}
                    <a href="#" className="font-semibold text-[#d9691f] hover:underline">
                      Kebijakan Privasi
                    </a>{" "}
                    ConcertGo.
                  </span>
                </label>
                {errors.terms && (
                  <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.terms}</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                type="submit"
                disabled={loading}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#241608] py-3 text-xs sm:text-sm font-semibold text-[#f6efe1] shadow-md transition-colors hover:bg-[#d9691f] disabled:opacity-70"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Mendaftarkan akun..." : "Buat Akun Sekarang"}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-xs text-[#5a4a35]">
              Sudah memiliki akun?{" "}
              <Link href="/sign-in" className="font-bold text-[#d9691f] hover:underline">
                Masuk di sini
              </Link>
            </p>
          </>
        ) : (
          <VerificationStep
            email={email}
            onBack={() => setStep("form")}
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

    onToast("success", "Pendaftaran berhasil! Mengalihkan ke beranda akun Anda...");
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
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#efe4cf] text-[#d9691f]">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="font-[var(--font-display,serif)] text-2xl font-bold text-[#241608]">
          Verifikasi Email Anda
        </h2>
        <p className="mt-1 text-xs text-[#5a4a35] max-w-sm mx-auto">
          Kami telah mengirimkan 6 digit kode verifikasi ke{" "}
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
          {verifying && <Loader2 className="h-4 w-4 animate-spin" />}
          {verifying ? "Memverifikasi..." : "Konfirmasi & Selesaikan"}
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
            ← Ubah data pendaftaran
          </button>
        </div>
      </form>
    </div>
  );
}
