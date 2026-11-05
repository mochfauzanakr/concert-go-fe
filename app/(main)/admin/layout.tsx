import type { Metadata } from "next";
import SessionAccess from "@/components/SessionAccess";

export const metadata: Metadata = {
  title: "Dashboard Admin",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <SessionAccess roles={[1, 2]}>{children}</SessionAccess>;
}
