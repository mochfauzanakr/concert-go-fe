"use client";
import { useSessionState } from "@/lib/session-state";
import DemoSettings from "@/components/demo/user/legacy-settings";
import AccountSettings from "@/components/account/AccountSettings";
import UserNavbar from "@/components/UserNavbar";
import SiteFooter from "@/components/SiteFooter";

export default function SettingsPage() {
  if (useSessionState((state) => state.demo)) return <DemoSettings />;
  return <><UserNavbar activePage="settings" /><main className="mx-auto w-full max-w-3xl px-4 py-8"><AccountSettings /></main><SiteFooter /></>;
}
