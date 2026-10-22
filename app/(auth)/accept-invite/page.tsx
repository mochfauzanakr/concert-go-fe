"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { userService, type Invite } from "@/services/user.service";
import { passwordError } from "@/lib/password-validation";
import { useDemoReady, useDemoStore } from "@/lib/demo/store";
import { inviteStatus } from "@/lib/demo/model";
import { DemoNotice, Message, Button, inputClass } from "@/components/demo/ui";

function AcceptInviteForm() {
  const token = useSearchParams().get("token") || "";
  const [invite, setInvite] = useState<Invite | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    let active = true;
    setLoading(true);
    userService.validateInvite(token).then((data) => { if (active) setInvite(data); })
      .catch((err: unknown) => { if (active) setError(err instanceof Error ? err.message : "Undangan tidak valid."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const password = String(data.get("password") || "");
    const confirmPassword = String(data.get("confirmPassword") || "");
    const invalid = passwordError(password);
    if (invalid || password !== confirmPassword) { setError(invalid || "Konfirmasi kata sandi tidak cocok."); return; }
    setSaving(true);
    setError("");
    try { await userService.acceptInvite({ token, name, password, confirmPassword }); setDone(true); }
    catch (err) { setError(err instanceof Error ? err.message : "Aktivasi gagal."); }
    finally { setSaving(false); }
  }

  return <main className="flex min-h-screen items-center justify-center bg-theme-bg p-6 text-theme-text">
    <section className="w-full max-w-md space-y-5 rounded-3xl border border-theme-border bg-theme-card p-8">
      <h1 className="text-2xl font-bold">Aktivasi Akun ConcertGo</h1>
      {loading && <p role="status">Memeriksa undangan...</p>}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {done ? <><p>Akun berhasil diaktifkan. Silakan masuk.</p><Link href="/sign-in" className="inline-block underline">Masuk ke akun</Link></> : invite && <>
        <p className="text-sm">{invite.email} · {invite.role}</p>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm">Nama lengkap<input name="name" required minLength={2} maxLength={100} autoComplete="name" className="mt-1 w-full rounded-xl border p-3" /></label>
          <label className="block text-sm">Kata sandi<input name="password" type="password" required autoComplete="new-password" className="mt-1 w-full rounded-xl border p-3" /></label>
          <label className="block text-sm">Konfirmasi kata sandi<input name="confirmPassword" type="password" required autoComplete="new-password" className="mt-1 w-full rounded-xl border p-3" /></label>
          <button disabled={saving} className="w-full rounded-xl bg-[#d9691f] p-3 font-bold text-white disabled:opacity-50">{saving ? "Mengaktifkan..." : "Aktifkan akun"}</button>
        </form>
      </>}
    </section>
  </main>;
}

function DemoAcceptInvite({ token }: { token: string }) {
  const ready = useDemoReady(); const store = useDemoStore(); const [done, setDone] = useState(false); const [error, setError] = useState("");
  const invite = store.invites.find((item) => item.token === token);
  return <main className="flex min-h-screen items-center justify-center bg-theme-bg p-4 text-theme-text"><section className="demo-card w-full max-w-lg space-y-5 p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-widest text-theme-accent">ConcertGo · Selamat datang</p><h1 className="text-2xl font-bold">Terima undangan tim</h1><DemoNotice />{!ready ? <p>Memeriksa undangan...</p> : done ? <><Message message="Akun demo berhasil diaktifkan. Pengguna baru sudah muncul di daftar pengguna admin." /><Link href="/admin/dashboard/users" className="demo-button demo-button-primary w-full">Lihat akun demo</Link></> : !invite || inviteStatus(invite) !== "pending" ? <><Message error message="Undangan sudah kedaluwarsa, dibatalkan, atau telah diterima." /><Link href="/admin/dashboard/invitations" className="demo-button demo-button-secondary">Kembali ke undangan</Link></> : <><p className="text-sm leading-6 text-theme-text-muted">Kamu diundang sebagai <strong className="text-theme-text">{invite.role}</strong> menggunakan email <strong className="break-all text-theme-text">{invite.email}</strong>.</p><form className="space-y-4" onSubmit={(e) => { e.preventDefault(); const form = new FormData(e.currentTarget); const password = String(form.get("password")); const invalid = passwordError(password); if (invalid || password !== form.get("confirm")) { setError(invalid || "Konfirmasi kata sandi tidak cocok."); return; } try { store.acceptInvite(token, String(form.get("name"))); setDone(true); } catch (err) { setError(err instanceof Error ? err.message : "Aktivasi belum berhasil."); } }}><label className="demo-label">Nama lengkap<input name="name" required minLength={2} maxLength={100} autoComplete="name" className={inputClass} /></label><label className="demo-label">Kata sandi demo<input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputClass} /></label><label className="demo-label">Konfirmasi kata sandi<input name="confirm" type="password" required autoComplete="new-password" className={inputClass} /></label><p className="text-xs leading-5 text-theme-text-light">Gunakan kata sandi contoh. Kata sandi tidak disimpan oleh simulasi ini.</p><Message message={error} error /><Button type="submit" className="w-full">Aktifkan akun demo</Button></form></>}</section></main>;
}
function InviteEntry() { const token = useSearchParams().get("token") || ""; return token.startsWith("demo-") ? <DemoAcceptInvite token={token} /> : <AcceptInviteForm />; }
export default function AcceptInvitePage() {
  return <Suspense fallback={<p className="p-10">Memuat undangan...</p>}><InviteEntry /></Suspense>;
}
