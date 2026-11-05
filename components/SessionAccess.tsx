"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSessionState } from "@/lib/session-state";
import { syncSessionProfile } from "@/lib/session";

/** UI guard only. Backend authorization remains authoritative for every API. */
export default function SessionAccess({ children, roles }: { children: ReactNode; roles: number[] }) {
  const { status, user, error, demo } = useSessionState();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if ((new URLSearchParams(window.location.search).get("preview") === "demo" || sessionStorage.getItem("concertgo_demo_preview") === "true") && !demo) {
      sessionStorage.setItem("concertgo_demo_preview", "true");
      useSessionState.setState({ demo: true });
      return;
    }
    const current = useSessionState.getState();
    if (current.status === "guest" && !current.demo) {
      router.replace(`/sign-in?returnTo=${encodeURIComponent(pathname + window.location.search)}`);
    }
  }, [status, demo, pathname, router]);

  if (demo) return <>
    <div role="status" className="border-b border-theme-border bg-theme-card p-3 text-center text-sm text-theme-text">
      Pratinjau demo — data operasional hanya tersimpan di browser, bukan akun backend.
      <button className="ml-3 underline" onClick={() => {
        sessionStorage.removeItem("concertgo_demo_preview");
        window.history.replaceState(null, "", "/");
        useSessionState.setState({ demo: false });
        router.replace("/");
      }}>Keluar dari demo</button>
    </div>
    {children}
  </>;
  if (status === "loading" || status === "guest") return <main className="p-10 text-center" role="status">Memeriksa sesi akun...</main>;
  if (status === "unavailable") return <main className="p-10 text-center">
    <h1 className="text-xl font-bold">Sesi belum dapat diperiksa</h1>
    <p role="alert" className="my-4">{error}</p>
    <button className="underline" onClick={() => void syncSessionProfile()}>Coba lagi</button>
    <Link className="ml-4 underline" href="/">Kembali ke beranda</Link>
  </main>;
  if (!user?.roleId || !roles.includes(user.roleId)) return <main className="p-10 text-center">
    <h1 className="text-xl font-bold">Akses tidak diizinkan</h1>
    <p className="my-4">Peran akun Anda tidak memiliki akses ke halaman ini.</p>
    <Link href="/account-access" className="underline">Lihat akses akun</Link>
  </main>;
  return children;
}
