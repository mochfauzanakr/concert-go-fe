"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserProfile } from "@/lib/userProfile";
import { User, Palette, Camera, Music } from "lucide-react";
import UserNavbar from "@/components/UserNavbar";
import SiteFooter from "@/components/SiteFooter";

import { ProfileHeroCard, StatsAndLoyaltyRow } from "@/components/profile/ProfileHero";
import { 
  AccountInfoTab, 
  BackgroundCustomizerTab, 
  AvatarCustomizerTab, 
  GenrePreferencesTab 
} from "@/components/profile/ProfileTabs";
import { LiveBerandaPreview, QuickActionCard } from "@/components/profile/ProfileSidebar";

export default function UserProfilePage() {
  const { profile, updateProfile, removeAvatar, removeBgCover } = useUserProfile();

  const [activeTab, setActiveTab] = useState<"info" | "background" | "avatar" | "genre">("info");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  return (
    <div className="min-h-screen bg-[#f6efe1] font-[var(--font-body,ui-sans-serif)] text-[#241608] selection:bg-[#d9691f] selection:text-white">
      {/* Header Pengguna Terpadu */}
      <UserNavbar activePage="profile" />

      <main className="pb-16">
        {/* Banner Cover & Header Profil Interaktif */}
        <ProfileHeroCard
          profile={profile}
          onUpdate={updateProfile}
          onRemoveAvatar={() => {
            removeAvatar();
            showToast("Foto profil berhasil dihapus (kembali ke inisial).");
          }}
          onRemoveBackground={() => {
            removeBgCover();
            showToast("Background tema berhasil dihapus (kembali ke default).");
          }}
          onSwitchTab={(tab) => setActiveTab(tab)}
        />

        <div className="mx-auto max-w-7xl px-6">
          {/* Kartu Statistik & Poin Loyalitas */}
          <StatsAndLoyaltyRow />

          {/* Navigasi Tab Profil */}
          <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-[#e6d9bf] pb-3 text-sm font-semibold">
            {[
              { id: "info", label: "Informasi Akun", icon: <User className="w-4 h-4" /> },
              { id: "background", label: "Tema & Background Beranda", icon: <Palette className="w-4 h-4" /> },
              { id: "avatar", label: "Ganti Foto Profil", icon: <Camera className="w-4 h-4" /> },
              { id: "genre", label: "Preferensi Musik & Kota", icon: <Music className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 transition-all ${
                  activeTab === tab.id
                    ? "bg-[#241608] text-[#f6efe1] shadow-md shadow-[#241608]/20"
                    : "bg-white/60 text-[#5a4a35] hover:bg-white hover:text-[#241608]"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Konten Tab */}
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
            {/* Bagian Utama Tab */}
            <div>
              {activeTab === "info" && (
                <AccountInfoTab
                  profile={profile}
                  onSave={(updates) => {
                    updateProfile(updates);
                    showToast("Informasi akun berhasil disimpan dan disinkronkan ke Beranda!");
                  }}
                />
              )}

              {activeTab === "background" && (
                <BackgroundCustomizerTab
                  profile={profile}
                  onSelectBg={(url) => {
                    updateProfile({ bgCover: url });
                    showToast("Background tema konser berhasil diterapkan ke Beranda!");
                  }}
                  onRemoveBg={() => {
                    removeBgCover();
                    showToast("Background tema dihapus. Beranda kembali ke tampilan standar.");
                  }}
                />
              )}

              {activeTab === "avatar" && (
                <AvatarCustomizerTab
                  profile={profile}
                  onSelectAvatar={(url) => {
                    updateProfile({ avatar: url });
                    showToast("Foto profil baru berhasil dipasang!");
                  }}
                  onRemoveAvatar={() => {
                    removeAvatar();
                    showToast("Foto profil dihapus.");
                  }}
                />
              )}

              {activeTab === "genre" && (
                <GenrePreferencesTab
                  profile={profile}
                  onSaveGenre={(genre, city) => {
                    updateProfile({ favoriteGenre: genre, city });
                    showToast("Preferensi konser berhasil diperbarui!");
                  }}
                />
              )}
            </div>

            {/* Sidebar Pratinjau Tampilan Beranda Real-time */}
            <div className="space-y-6">
              <LiveBerandaPreview profile={profile} />
              <QuickActionCard />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-[#cfe3c8] bg-[#eef6ea] px-5 py-3 text-sm font-semibold text-[#2f5c26] shadow-xl"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">
              ✓
            </span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}