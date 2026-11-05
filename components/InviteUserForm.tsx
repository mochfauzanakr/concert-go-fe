"use client";
import { InvitationsView } from "@/components/demo/admin/invitations";
import InvitationsForm from "@/components/account/InvitationsForm";
import { useSessionState } from "@/lib/session-state";
import SessionAccess from "@/components/SessionAccess";
export default function InviteUserForm() {
  const demo = useSessionState((state) => state.demo);
  return <SessionAccess roles={[1, 2, 3]}>{demo ? <InvitationsView /> : <InvitationsForm />}</SessionAccess>;
}
