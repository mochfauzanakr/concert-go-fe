"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { authService } from "@/services/auth.service";
import { passwordError } from "@/lib/password-validation";
import { Button, Message, inputClass } from "@/components/demo/ui";

export default function AccountSettings() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const current = String(fields.get("currentPassword") || "");
    const next = String(fields.get("newPassword") || "");
    const confirm = String(fields.get("confirmPassword") || "");
    setSuccess(""); setError("");
    const invalid = passwordError(next);
    if (invalid || next !== confirm) { setError(invalid || "Konfirmasi kata sandi tidak cocok."); return; }
    busy.current = true; setSaving(true);
    try { await authService.changePassword(current, next, confirm); form.reset(); setSuccess("Kata sandi berhasil diperbarui di server."); }
    catch (err) { setError(err instanceof Error ? err.message : "Kata sandi belum dapat diperbarui."); }
    finally { busy.current = false; setSaving(false); }
  }
  return <section className="demo-card space-y-5 p-5 sm:p-8">
    <h1 className="text-2xl font-bold">Pengaturan akun</h1>
    <p className="text-sm text-theme-text-muted">Informasi profil dikelola melalui <Link href="/user/profile" className="underline">halaman profil</Link>. Akun Google tanpa kata sandi lokal mengikuti kebijakan autentikasi backend.</p>
    <h2 className="text-lg font-bold">Ubah kata sandi</h2>
    <Message error message={error} /><Message message={success} />
    <form onSubmit={submit}>
      <fieldset disabled={saving} className="space-y-4">
        <label className="demo-label">Kata sandi saat ini<input name="currentPassword" type="password" required autoComplete="current-password" className={inputClass} /></label>
        <label className="demo-label">Kata sandi baru<input name="newPassword" type="password" required minLength={8} maxLength={128} autoComplete="new-password" className={inputClass} /></label>
        <label className="demo-label">Konfirmasi kata sandi baru<input name="confirmPassword" type="password" required minLength={8} maxLength={128} autoComplete="new-password" className={inputClass} /></label>
        <Button type="submit" disabled={saving}>{saving ? "Menyimpan..." : "Perbarui kata sandi"}</Button>
      </fieldset>
    </form>
  </section>;
}
