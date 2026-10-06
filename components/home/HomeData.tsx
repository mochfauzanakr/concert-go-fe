import type { JSX } from "react";
import { EVENTS, type Category } from "@/lib/eventsData";
import { 
  Sparkles, 
  VenetianMask, 
  Compass, 
  Sun, 
  Heart, 
  Palette, 
  Mic, 
  MapPin, 
  Music 
} from "lucide-react";

export const CATEGORIES: { label: Category; icon: JSX.Element }[] = [
  { label: "Festival Musik", icon: <Sparkles className="w-5 h-5" /> },
  { label: "Hiburan & Pertunjukan", icon: <VenetianMask className="w-5 h-5" /> },
  { label: "Wisata & Outdoor", icon: <Compass className="w-5 h-5" /> },
  { label: "Olahraga & E-Sport", icon: <Sun className="w-5 h-5" /> },
  { label: "Amal & Charity", icon: <Heart className="w-5 h-5" /> },
  { label: "Seni & Budaya", icon: <Palette className="w-5 h-5" /> },
  { label: "Stand-up Comedy", icon: <Mic className="w-5 h-5" /> },
  { label: "Atraksi & Wahana", icon: <MapPin className="w-5 h-5" /> },
  { label: "Musik & Konser", icon: <Music className="w-5 h-5" /> },
];

export const HERO_SLIDES = [
  {
    id: "hero-1",
    eventId: "senja-orchestra",
    title: "Senja Symphony & Orchestra Fest 2026",
    subtitle: "Harmoni 60 Musisi Orkestra & Kolaborasi Vokalis Pilihan Nusantara",
    artist: "Kala Senja feat. Jakarta City Strings",
    venue: "Istora Senayan, Jakarta",
    date: "12 Sep 2026",
    time: "19:00 WIB",
    tag: "PANGGUNG UTAMA · BEST SELLER",
    price: 250000,
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1600&auto=format&fit=crop",
    gradient: "from-[#3a1c0f]/90 via-[#241209]/80 to-[#120a05]/95",
  },
  {
    id: "hero-2",
    eventId: "ombak-festival",
    title: "Ombak Nusantara Beach Festival 2026",
    subtitle: "Tiga Hari Penuh Musik Indie, 4 Panggung Sunset Tepi Laut Bali",
    artist: "Deretan 24 Musisi Indie Pesisir",
    venue: "GWK Cultural Park & Pantai Karang, Bali",
    date: "20 - 22 Sep 2026",
    time: "15:00 WITA",
    tag: "FESTIVAL RESMI · EARLY BIRD",
    price: 180000,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
    gradient: "from-[#1b2d28]/90 via-[#0f1f1a]/85 to-[#0a1210]/95",
  },
  {
    id: "hero-3",
    eventId: "neon-dangdut",
    title: "Neon Koplo & Pop Carnival Vol. 4",
    subtitle: "Goyang Berkelas Tanpa Henti dengan Tata Cahaya Laser Spektakuler",
    artist: "Rafi & The Koplo Machine feat. Star Guests",
    venue: "Eldorado Dome, Bandung",
    date: "10 Okt 2026",
    time: "20:00 WIB",
    tag: "TRENDING #1 · HAMPIR HABIS",
    price: 100000,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop",
    gradient: "from-[#2f1938]/90 via-[#1e0f24]/85 to-[#0d0710]/95",
  },
];

export const GENRES = Array.from(new Set(EVENTS.map((e) => e.genre)));
export const CITIES = Array.from(new Set(EVENTS.map((e) => e.city)));

export type CategoryMeta = {
  tag: string;
  title: string;
  subtitle: string;
  placeholder: string;
  unit: string;
};

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  "Festival Musik": {
    tag: "Festival Musik Spektakuler & Multi-Stage",
    title: "Cari Festival Musik Favoritmu.",
    subtitle:
      "Rasakan gemuruh panggung akbar, line-up musisi legendaris, sunset stage, dan nuansa festival tak terlupakan dengan tiket resmi.",
    placeholder: "Cari nama festival, line-up artis, panggung, atau kota (contoh: Synchronize, Bali, Senayan)...",
    unit: "festival musik",
  },
  "Hiburan & Pertunjukan": {
    tag: "Hiburan Panggung & Pertunjukan Megah",
    title: "Cari Hiburan & Pertunjukan Favoritmu.",
    subtitle:
      "Saksikan musikal berkelas, sirkus akrobatik cahaya internasional, dan pertunjukan ilusi spektakuler langsung dari kursi terbaik.",
    placeholder: "Cari judul musikal, atraksi sirkus, teater, gedung (contoh: Laskar Pelangi, ICE BSD, Teater Jakarta)...",
    unit: "pertunjukan",
  },
  "Wisata & Outdoor": {
    tag: "Petualangan Alam & Eksplorasi Outdoor",
    title: "Cari Wisata & Outdoor Favoritmu.",
    subtitle:
      "Temukan tiket open trip eksklusif, sunrise camp di pegunungan berkabut, festival alam bebas, dan eksplorasi alam nusantara.",
    placeholder: "Cari destinasi wisata, camping ground, gunung, atau kota (contoh: Bromo, Dieng, Rinjani)...",
    unit: "kegiatan wisata",
  },
  "Olahraga & E-Sport": {
    tag: "Laga Sengit Olahraga & Grand Final E-Sport",
    title: "Cari Olahraga & E-Sport Favoritmu.",
    subtitle:
      "Beli tiket resmi pertandingan sepak bola liga teratas, badminton super series, dan grand final turnamen e-sport bergengsi.",
    placeholder: "Cari tim favorit, game e-sport, turnamen, stadion (contoh: MPL, Persija, GBK, Senayan)...",
    unit: "tiket pertandingan",
  },
  "Amal & Charity": {
    tag: "Konser & Pagelaran Amal Kebaikan",
    title: "Cari Acara Amal & Charity.",
    subtitle:
      "Menikmati pertunjukan seni sambil berdonasi untuk kemanusiaan, anak pesisir, dan kelestarian alam nusantara dengan laporan transparan.",
    placeholder: "Cari konser amal, nama gerakan, yayasan, atau kota (contoh: Harmoni Peduli, Mangrove, Jakarta)...",
    unit: "acara amal",
  },
  "Seni & Budaya": {
    tag: "Mahakarya Seni & Tradisi Luhur Nusantara",
    title: "Cari Seni & Budaya Favoritmu.",
    subtitle:
      "Apresiasi pameran instalasi seni kontemporer, wayang orang megah berbalut aransemen modern, dan tarian kolosal bersejarah.",
    placeholder: "Cari pameran seni rupa, wayang, sendratari, galeri (contoh: Galeri Nasional, TIM, Solo, Jogja)...",
    unit: "pagelaran seni",
  },
  "Stand-up Comedy": {
    tag: "Tur Spesial & Panggung Stand-up Comedy",
    title: "Cari Stand-up Comedy Favoritmu.",
    subtitle:
      "Tawa lepas bersama tur solo spesial dan pertunjukan materi baru para komika terlucu tanah air dalam teater eksklusif.",
    placeholder: "Cari nama komika, judul tur spesial, gedung teater (contoh: Raditya Dika, Usmar Ismail, TIM)...",
    unit: "show komedi",
  },
  "Atraksi & Wahana": {
    tag: "Tiket Masuk Wahana & Taman Rekreasi Resmi",
    title: "Cari Atraksi & Wahana Favoritmu.",
    subtitle:
      "Akses cepat tanpa antre loket untuk theme park terbesar, waterpark tropis, dan wahana petualangan seru untuk liburan tak terlupakan.",
    placeholder: "Cari nama wahana, waterpark, theme park (contoh: Dufan Ancol, Waterbom Bali, Trans Studio)...",
    unit: "wahana rekreasi",
  },
  "Musik & Konser": {
    tag: "Katalog Tiket Terlengkap & Resmi",
    title: "Cari Konser Favoritmu.",
    subtitle:
      "Jelajahi konser artis favoritmu dan dapatkan tiket resmi dengan kemudahan pembayaran instan tanpa perlu antre tiket fisik.",
    placeholder: "Cari artis, venue, atau kota (contoh: Jakarta, Tulus, Senayan)...",
    unit: "konser",
  },
};

export const TESTIMONIALS = [
  {
    name: "Dinda Ayu",
    role: "Mahasiswi · Jakarta",
    quote:
      "Beli tiket cuma butuh dua menit, e-tiket resmi langsung masuk email. Nggak perlu cemas kena calo tiket palsu lagi!",
    rating: 5,
  },
  {
    name: "Reza Pratama",
    role: "Karyawan Swasta · Bandung",
    quote:
      "Waktu ada konser diundur jadwalnya, proses refund ditangani sigap dan uang kembali utuh dalam hitungan hari. Jempolan!",
    rating: 5,
  },
  {
    name: "Amel Santoso",
    role: "Content Creator · Bali",
    quote:
      "Suka banget sama fitur filter dan kurasi konsernya. Notifikasi pengingat sebelum hari H ngebantu banget pas jadwal padat.",
    rating: 5,
  },
  {
    name: "Bram Tantular",
    role: "Musisi Indie · Yogyakarta",
    quote:
      "Sebagai musisi, saya apresiasi sistem ticketing ConcertGo yang ramah fans. Harga transparan tanpa biaya tersembunyi.",
    rating: 5,
  },
  {
    name: "Naya Karisma",
    role: "Pecinta Konser · Solo",
    quote:
      "Desain aplikasinya estetik dan navigasinya mulus banget. Checkout tiket pas lagi di jalan pun tetap lancar jaya.",
    rating: 5,
  },
  {
    name: "Fajar Wicaksono",
    role: "Pengusaha · Surabaya",
    quote:
      "Beli tiket kategori VIP untuk festival besar selalu dapat posisi terbaik. Gampang ngecek layout panggungnya juga.",
    rating: 5,
  },
];

export function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

export function parseEventDate(dateStr: string): number {
  const parts = dateStr.split(" - ")[0].split(" ");
  if (parts.length < 3) return 0;
  const day = parseInt(parts[0], 10);
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, Mei: 4, Jun: 5, Jul: 6, Agu: 7, Sep: 8, Okt: 9, Nov: 10, Des: 11,
  };
  const month = months[parts[1]];
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day).getTime();
}
