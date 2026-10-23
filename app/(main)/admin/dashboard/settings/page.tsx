"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { authService } from "@/services/auth.service";
import { useAdminProfile } from "@/lib/adminProfile";
import { passwordError } from "@/lib/password-validation";

type Feedback = { kind: "success" | "error"; text: string } | null;

export default function PengaturanAdminPage() {
  const { profile, ownerId } = useAdminProfile();
  const [activeTab, setActiveTab] = useState<"account" | "security">("account");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const currentPassword = String(fields.get("currentPassword") ?? "");
    const newPassword = String(fields.get("newPassword") ?? "");
    const confirmNewPassword = String(fields.get("confirmNewPassword") ?? "");

    setFeedback(null);
    const invalid = passwordError(newPassword);
    if (invalid) { setFeedback({ kind: "error", text: invalid }); return; }
    if (newPassword !== confirmNewPassword) {
      setFeedback({ kind: "error", text: "Konfirmasi kata sandi tidak sama dengan kata sandi baru." });
      return;
    }
    if (newPassword === currentPassword) {
      setFeedback({ kind: "error", text: "Kata sandi baru harus berbeda dari kata sandi saat ini." });
      return;
    }

    setSaving(true);
    try {
      await authService.changePassword(currentPassword, newPassword, confirmNewPassword);
      form.reset();
      setFeedback({ kind: "success", text: "Kata sandi berhasil diperbarui. Gunakan kata sandi baru pada login berikutnya." });
    } catch (err) {
      setFeedback({ kind: "error", text: err instanceof Error ? err.message : "Gagal mengubah kata sandi." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex justify-between items-center bg-theme-card-hover p-6 rounded-2xl shadow-sm border border-theme-border"
      >
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display,serif)] text-theme-text">Pengaturan Keamanan Akun</h2>
          <p className="text-sm text-theme-text-light mt-1">Kelola informasi akun, kata sandi, tema antarmuka, dan bahasa untuk akun {profile.role}.</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex gap-4 border-b border-theme-border pb-4"
      >
        <button
          onClick={() => setActiveTab("account")}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === "account"
              ? "bg-theme-button text-[#f6efe1] shadow-md"
              : "bg-theme-card/60 text-theme-text-muted hover:bg-theme-card hover:text-theme-text"
          }`}
        >
          Akun
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === "security"
              ? "bg-theme-button text-[#f6efe1] shadow-md"
              : "bg-theme-card/60 text-theme-text-muted hover:bg-theme-card hover:text-theme-text"
          }`}
        >
          Keamanan & Sandi
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="bg-theme-card rounded-2xl shadow-sm border border-theme-border p-6 sm:p-8"
      >
        {activeTab === "account" ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-theme-text">Informasi Akun Admin</h3>
              <p className="text-sm text-theme-text-light mt-1">
                Data ini dibaca langsung dari akun yang sedang login melalui <span className="font-semibold">GET /auth/me</span>, bukan data contoh.
              </p>
            </div>

            <dl className="divide-y divide-theme-border overflow-hidden rounded-xl border border-theme-border">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-theme-card-hover px-4 py-3">
                <dt className="text-xs font-bold uppercase tracking-wider text-theme-text-light">Nama</dt>
                <dd className="text-sm font-semibold text-theme-text">{profile.name}</dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 bg-theme-card-hover px-4 py-3">
                <dt className="text-xs font-bold uppercase tracking-wider text-theme-text-light">Email</dt>
                <dd className="text-sm font-semibold text-theme-text break-all">{profile.email || "—"}</dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 bg-theme-card-hover px-4 py-3">
                <dt className="text-xs font-bold uppercase tracking-wider text-theme-text-light">Peran</dt>
                <dd>
                  <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-bold text-[#d9691f]">
                    {profile.role}
                  </span>
                </dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 bg-theme-card-hover px-4 py-3">
                <dt className="text-xs font-bold uppercase tracking-wider text-theme-text-light">ID Akun</dt>
                <dd className="text-xs font-mono text-theme-text-light break-all">{ownerId || "—"}</dd>
              </div>
            </dl>

            <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Nama dan email dikelola backend. Untuk mengubahnya, perlu endpoint profil di backend
              (saat ini belum tersedia). Kata sandi bisa Anda ubah di tab <span className="font-semibold">Keamanan &amp; Sandi</span>.
            </div>

            <div className="flex flex-wrap gap-3 pt-2 border-t border-theme-border">
              <button
                type="button"
                onClick={() => setActiveTab("security")}
                className="rounded-xl bg-[#d9691f] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#c45c16]"
              >
                Ubah Kata Sandi
              </button>
              <Link
                href="/admin/dashboard/profile"
                className="rounded-xl border border-theme-border px-5 py-2.5 text-sm font-semibold text-theme-text transition-colors hover:bg-theme-card-hover"
              >
                Buka Halaman Profil
              </Link>
            </div>
          </motion.div>
        ) : activeTab === "security" ? (
          <motion.form onSubmit={changePassword} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-theme-text">Ubah Kata Sandi</h3>
              <p className="text-sm text-theme-text-light mt-1">Pastikan akun Anda menggunakan kata sandi yang kuat dan unik.</p>
            </div>

            {/* Identitas akun aktif — tersinkron dari backend */}
            <div className="rounded-xl border border-theme-border bg-theme-card-hover px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-theme-text-light">Akun yang sedang login</p>
              <p className="mt-1 text-sm font-semibold text-theme-text">{profile.email || "—"}</p>
              <p className="text-xs text-theme-text-light">Peran: {profile.role}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-theme-text-light uppercase tracking-wider">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  placeholder="Masukkan kata sandi lama"
                  name="currentPassword" required autoComplete="current-password"
                  className="w-full bg-theme-card-hover border border-theme-border rounded-xl px-4 py-2.5 text-sm font-semibold text-theme-text focus:outline-hidden focus:border-[#d9691f]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-theme-text-light uppercase tracking-wider">Kata Sandi Baru</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi baru"
                    name="newPassword" required minLength={8} autoComplete="new-password"
                    className="w-full bg-theme-card-hover border border-theme-border rounded-xl px-4 py-2.5 pr-16 text-sm font-semibold text-theme-text focus:outline-hidden focus:border-[#d9691f]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-3 my-auto h-6 text-[11px] font-bold uppercase tracking-wider text-theme-text-light hover:text-[#d9691f]"
                  >
                    {showPassword ? "Sembunyi" : "Lihat"}
                  </button>
                </div>
                <p className="text-[11px] text-theme-text-light">
                  Minimal 8 karakter, wajib mengandung huruf besar, huruf kecil, angka, dan simbol (mis. <span className="font-semibold">Amane0978!</span>).
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-theme-text-light uppercase tracking-wider">Konfirmasi Kata Sandi Baru</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ulangi kata sandi baru"
                  name="confirmNewPassword" required minLength={8} autoComplete="new-password"
                  className="w-full bg-theme-card-hover border border-theme-border rounded-xl px-4 py-2.5 text-sm font-semibold text-theme-text focus:outline-hidden focus:border-[#d9691f]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-theme-border">
              {feedback && (
                <p
                  role="status"
                  className={`mb-3 rounded-xl border px-3 py-2 text-sm font-semibold ${
                    feedback.kind === "success"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-red-300 bg-red-50 text-red-700"
                  }`}
                >
                  {feedback.text}
                </p>
              )}
              <button disabled={saving} className="px-6 py-2.5 rounded-xl font-semibold text-white bg-[#d9691f] shadow-md hover:bg-[#c45c16] transition-colors text-sm disabled:opacity-50">
                {saving ? "Menyimpan..." : "Perbarui Kata Sandi"}
              </button>
            </div>
          </motion.form>
        ) : null}
      </motion.div>
    </div>
  );
}
