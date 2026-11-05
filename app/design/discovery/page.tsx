import { Suspense } from "react";
import type { Metadata } from "next";
import DiscoveryPrototype from "@/components/design/DiscoveryPrototype";

export const metadata: Metadata = {
  title: "Review Desain Discovery — Tahap 3",
  robots: { index: false, follow: false },
};

export default function DesignReviewPage() {
  return <Suspense fallback={<p className="p-8">Memuat rancangan discovery...</p>}><DiscoveryPrototype /></Suspense>;
}
