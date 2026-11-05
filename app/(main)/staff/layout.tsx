import SessionAccess from "@/components/SessionAccess";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <SessionAccess roles={[5]}>{children}</SessionAccess>;
}
