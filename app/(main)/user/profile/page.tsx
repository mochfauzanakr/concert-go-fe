"use client";
import ProfileForm from "@/components/account/ProfileForm";
import UserNavbar from "@/components/UserNavbar";
import SiteFooter from "@/components/SiteFooter";

export default function ProfilePage() {
  return <><UserNavbar activePage="profile" /><main className="mx-auto w-full max-w-3xl px-4 py-8"><ProfileForm /></main><SiteFooter /></>;
}
