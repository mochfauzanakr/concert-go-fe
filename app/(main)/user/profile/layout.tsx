import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Saya",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
