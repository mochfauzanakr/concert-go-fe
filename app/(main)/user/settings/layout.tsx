import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengaturan Akun",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
