"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { authService } from "@/services/auth.service";
import { applySessionUser, safeReturnPath } from "@/lib/session";

export default function GoogleCallbackPage() {
  const started = useRef(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ name: string; destination: string } | null>(null);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const params = new URLSearchParams(window.location.search);
    window.history.replaceState(null, "", window.location.pathname);
    if (params.get("error")) {
      setError(params.get("error") === "access_denied" ? "Login Google dibatalkan. Anda dapat mencoba lagi atau masuk dengan email." : "Google belum dapat menyelesaikan login. Silakan coba lagi.");
      return;
    }
    if (!params.get("code") || !params.get("state")) {
      setError("Login Google tidak menghasilkan sesi. Silakan masuk kembali.");
      return;
    }
    authService.completeGoogleLogin(params.toString())
      .then((user) => {
        applySessionUser(user);
        const returnTo = sessionStorage.getItem("concertgo_auth_return");
        sessionStorage.removeItem("concertgo_auth_return");
        setResult({ name: user.name, destination: safeReturnPath(returnTo, user.roleId) });
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Login gagal."));
  }, []);
  return <main className="flex min-h-screen items-center justify-center bg-theme-bg p-6 text-theme-text">
    <section className="demo-card w-full max-w-md space-y-5 p-8">
      <h1 className="text-2xl font-bold">{result ? "Login Google berhasil" : error ? "Login belum berhasil" : "Menyelesaikan login Google"}</h1>
      {result ? <><p role="status">Selamat datang, <strong>{result.name}</strong>. Akun Anda sudah masuk.</p><Link href={result.destination} className="demo-button demo-button-primary w-full">Lanjutkan ke akun</Link></> : error ? <><p role="alert">{error}</p><Link href="/sign-in" className="demo-button demo-button-secondary w-full">Kembali ke halaman masuk</Link></> : <p role="status">Memeriksa respons Google dan menyiapkan sesi akun Anda...</p>}
    </section>
  </main>;
}
