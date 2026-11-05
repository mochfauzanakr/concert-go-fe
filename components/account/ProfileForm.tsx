"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { userService } from "@/services/user.service";
import { useSessionState } from "@/lib/session-state";
import { applySessionUser } from "@/lib/session";
import { ApiError } from "@/services/api-client";
import { Button, Message, inputClass } from "@/components/demo/ui";
import { useDemoProfiles } from "@/lib/demo/profiles";
import { compressImageFile } from "@/lib/userProfile";

export default function ProfileForm({ admin = false }: { admin?: boolean }) {
  const sessionUser = useSessionState((state) => state.user);
  const demo = useSessionState((state) => state.demo);
  const demoUser = useDemoProfiles((state) => admin ? state.admin : state.user);
  const user = demo ? demoUser : sessionUser;
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState<File>();
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(true);
  const fileInput = useRef<HTMLInputElement>(null);
  const busy = useRef(false);
  useEffect(() => { setName(user?.name || ""); setAvatar(undefined); }, [user?.id, user?.name]);
  useEffect(() => {
    if (!avatar) { setPreview(""); return; }
    const url = URL.createObjectURL(avatar);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatar]);

  function chooseAvatar(file?: File) {
    setError(""); setSuccess(""); setAvatar(undefined);
    if (!file) return;
    if (!/\.(jpe?g|png|webp)$/i.test(file.name) || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Gunakan foto JPG, PNG, atau WebP."); return;
    }
    if (file.size > 2 * 1024 * 1024) { setError("Ukuran foto maksimal 2 MB."); return; }
    setAvatar(file);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || !user) return;
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 100) { setError("Nama harus 2–100 karakter."); return; }
    busy.current = true; setSaving(true); setError(""); setSuccess("");
    const owner = user.id;
    try {
      if (demo) {
        const avatarUrl = avatar ? await compressImageFile(avatar, { maxWidth: 360, maxHeight: 360, quality: 0.85 }) : user.avatarUrl;
        useDemoProfiles.getState().update(admin ? "admin" : "user", { name: trimmed, avatarUrl });
        setAvatar(undefined);
        setSuccess("Profil demo berhasil disimpan di browser ini.");
        return;
      }
      await userService.updateProfile(trimmed, avatar);
      if (useSessionState.getState().user?.id !== owner) return;
      setConfirmed(false);
      const refreshed = await userService.getProfile();
      if (useSessionState.getState().user?.id !== owner) return;
      applySessionUser(refreshed);
      setConfirmed(true); setAvatar(undefined);
      if (fileInput.current) fileInput.current.value = "";
      setSuccess("Profil berhasil disimpan ke server dan diverifikasi ulang.");
    } catch (err) {
      setError(err instanceof ApiError && err.reqId ? `${err.message} (ID: ${err.reqId})` : err instanceof Error ? err.message : "Profil belum dapat disimpan.");
    } finally { busy.current = false; setSaving(false); }
  }

  return <section className="demo-card p-5 sm:p-8">
    <h1 className="text-2xl font-bold">Profil akun</h1>
    <p className="mt-2 text-sm text-theme-text-muted">{demo ? "Pratinjau demo. Nama dan foto profil hanya tersimpan di browser ini." : "Nama dan foto profil tersimpan di akun Anda pada server."}</p>
    <Message message={error} error /><Message message={success} />
    {!confirmed && <p role="status" className="mt-3 text-sm">Penyimpanan telah diterima, tetapi pembacaan ulang belum berhasil. Muat ulang halaman untuk memeriksa data terbaru.</p>}
    <form onSubmit={save} className="mt-6 space-y-5">
      <fieldset disabled={saving} className="space-y-5 disabled:opacity-60">
        <div className="flex flex-wrap items-center gap-5">
          {preview || user?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview || user?.avatarUrl || ""} alt="Foto profil" width={88} height={88} className="h-22 w-22 rounded-full object-cover" />
          ) : <span className="flex h-22 w-22 items-center justify-center rounded-full bg-theme-card-hover text-3xl font-bold" aria-label="Inisial profil">{user?.name.charAt(0).toUpperCase()}</span>}
          <label className="demo-label">Foto profil
            <input aria-label="Foto profil" ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { chooseAvatar(event.target.files?.[0]); event.target.value = ""; }} className="max-w-full text-sm" />
            <span className="text-xs font-normal text-theme-text-muted">JPG, PNG, atau WebP. Maksimal 2 MB.</span>
          </label>
          {avatar && <Button tone="secondary" onClick={() => setAvatar(undefined)}>Batalkan foto baru</Button>}
        </div>
        <label className="demo-label">Nama lengkap<input className={inputClass} value={name} onChange={(event) => { setName(event.target.value); setSuccess(""); }} required minLength={2} maxLength={100} autoComplete="name" /></label>
        <label className="demo-label">Email akun<input className={inputClass} value={user?.email || ""} readOnly type="email" autoComplete="email" /></label>
        <p className="text-sm text-theme-text-muted">{demo ? "Email dan role demo hanya untuk pratinjau. Formulir ini mengikuti kemampuan profil akun nyata." : "Email dan role dikelola melalui sistem akun. Nomor telepon, bio, preferensi musik, dan penghapusan foto belum tersedia melalui API profil."}</p>
        <Button type="submit" disabled={saving}>{saving ? "Menyimpan profil..." : "Simpan profil"}</Button>
      </fieldset>
    </form>
    <Link href={admin ? "/admin/dashboard/settings" : "/user/settings?tab=password"} className="mt-5 inline-block text-sm underline">Pengaturan kata sandi</Link>
  </section>;
}
