"use client";

import { useRef, useState, type FormEvent } from "react";
import { userService, type Invite } from "@/services/user.service";
import { useSessionState } from "@/lib/session-state";
import { inviteRoles } from "@/lib/user-permissions";
import { ApiError } from "@/services/api-client";
import { Button, Heading, Message, inputClass } from "@/components/demo/ui";

export default function InvitationsForm() {
  const actor = useSessionState((state) => state.user);
  const allowedRoles = inviteRoles(actor?.roleId);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(allowedRoles[0] || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState<Invite | null>(null);
  const busy = useRef(false);
  const effectiveRole = allowedRoles.includes(role) ? role : allowedRoles[0] || "";
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || !allowedRoles.includes(effectiveRole)) return;
    busy.current = true; setSaving(true); setError(""); setSent(null);
    try { setSent(await userService.invite(email.trim().toLowerCase(), effectiveRole)); setEmail(""); }
    catch (err) { setError(err instanceof ApiError && err.reqId ? `${err.message} (ID: ${err.reqId})` : err instanceof Error ? err.message : "Undangan belum dapat dikirim."); }
    finally { busy.current = false; setSaving(false); }
  }
  return <div className="space-y-6">
    <Heading title="Undangan pengguna" description="Kirim tautan aktivasi melalui email. Peran penerima dibatasi sesuai hak akses akun Anda." />
    <section className="demo-card space-y-5 p-5 sm:p-7">
      <p className="text-sm">Pengundang: <strong>{actor?.name}</strong> · {actor?.email}</p>
      <Message message={error} error />
      {sent && <div role="status" className="space-y-2 rounded-xl border border-emerald-500/30 p-4 text-sm">
        <p className="font-bold">Undangan berhasil dikirim melalui email.</p>
        <p>{sent.email} · {sent.role}</p>
        <p>Berlaku sampai {new Date(sent.expiresAt).toLocaleString("id-ID")}. Penerima membuka tautan dalam email untuk mengaktifkan akun.</p>
      </div>}
      {allowedRoles.length === 0 ? <p role="alert">Peran akun Anda tidak dapat mengundang pengguna.</p> : <form onSubmit={submit}>
        <fieldset disabled={saving} className="space-y-4">
          <label className="demo-label">Email penerima<input className={inputClass} value={email} onChange={(event) => { setEmail(event.target.value); setSent(null); }} type="email" required maxLength={100} autoComplete="email" /></label>
          <label className="demo-label">Role penerima<select aria-label="Role penerima" className={inputClass} value={effectiveRole} onChange={(event) => setRole(event.target.value)}>{allowedRoles.map((item) => <option key={item}>{item}</option>)}</select></label>
          <Button type="submit" disabled={saving}>{saving ? "Mengirim undangan..." : "Kirim undangan"}</Button>
        </fieldset>
      </form>}
      <p className="text-xs leading-5 text-theme-text-muted">Tautan berlaku 24 jam dan hanya dapat diterima sekali. Daftar riwayat, kirim ulang, dan pembatalan undangan belum tersedia melalui API. Tautan aktivasi dikirim ke penerima, bukan ditampilkan di sini.</p>
    </section>
  </div>;
}
