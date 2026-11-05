"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSessionState } from "@/lib/session-state";
import { landingPathForRole } from "@/lib/session";
import { authService } from "@/services/auth.service";

export default function AccountAccessPage() {
  const router = useRouter();
  const { status, user } = useSessionState();
  const destination = landingPathForRole(user?.roleId);
  return <main className="mx-auto max-w-xl p-10 text-theme-text">
    <h1 className="text-2xl font-bold">Akses akun</h1>
    <p className="my-4" role="status">{status === "loading" ? "Memeriksa sesi..." : user ? `Anda masuk sebagai ${user.name}.` : "Silakan masuk untuk mengakses akun."}</p>
    {user && destination !== "/account-access" && <Link className="mr-4 underline" href={destination}>Buka workspace akun</Link>}
    {user && destination === "/account-access" && <p className="mb-4">Peran akun belum dikenali. Hubungi administrator.</p>}
    {user ? <button className="underline" onClick={async () => { await authService.logout(); router.replace("/sign-in"); }}>Keluar</button> : <Link href="/sign-in" className="underline">Masuk</Link>}
    <Link href="/" className="ml-4 underline">Beranda</Link>
  </main>;
}
