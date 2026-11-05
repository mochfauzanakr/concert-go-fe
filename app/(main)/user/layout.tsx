import SessionAccess from "@/components/SessionAccess";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <SessionAccess roles={[1, 2, 3, 4, 5]}>{children}</SessionAccess>;
}
