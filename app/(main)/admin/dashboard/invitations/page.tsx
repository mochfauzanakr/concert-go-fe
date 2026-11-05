"use client";
import { InvitationsView } from "@/components/demo/admin/invitations";
import InvitationsForm from "@/components/account/InvitationsForm";
import { useSessionState } from "@/lib/session-state";
export default function Page() { return useSessionState((state) => state.demo) ? <InvitationsView /> : <InvitationsForm />; }
