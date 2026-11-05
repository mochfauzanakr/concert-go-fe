import InviteUserForm from "@/components/InviteUserForm";
import Link from "next/link";

export default function InviteUserPage() {
  return <main className="min-h-screen bg-theme-bg p-6 text-theme-text">
    <div className="mx-auto max-w-2xl space-y-6 py-10">
      <Link href="/user/homepage" className="text-sm underline">Kembali ke beranda</Link>
      <InviteUserForm />
    </div>
  </main>;
}
