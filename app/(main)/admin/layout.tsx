import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Admin",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
