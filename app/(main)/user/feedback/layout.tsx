import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bantuan & Masukan",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
