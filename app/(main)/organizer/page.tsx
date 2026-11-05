import Link from "next/link";
import SessionAccess from "@/components/SessionAccess";

export default function OrganizerPage() {
  return <SessionAccess roles={[3]}>
    <main className="mx-auto max-w-2xl p-8 text-theme-text">
      <h1 className="text-2xl font-bold">Akun organizer</h1>
      <p className="my-4">Anda masuk sebagai organizer. Workspace pengelolaan acara akan tersedia setelah integrasi API organizer siap.</p>
      <Link href="/user/profile" className="underline">Lihat profil akun</Link>
      <Link href="/invite-user" className="ml-4 underline">Undang staff</Link>
      <Link href="/" className="ml-4 underline">Kembali ke beranda</Link>
    </main>
  </SessionAccess>;
}
