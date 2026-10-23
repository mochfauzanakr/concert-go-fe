import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lupa Kata Sandi",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
