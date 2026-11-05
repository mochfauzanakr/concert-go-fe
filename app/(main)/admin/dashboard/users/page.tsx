"use client";
import { UsersView } from "@/components/demo/admin/users";
import UsersManagement from "@/components/account/UsersManagement";
import { useSessionState } from "@/lib/session-state";
export default function Page() { return useSessionState((state) => state.demo) ? <UsersView /> : <UsersManagement />; }
