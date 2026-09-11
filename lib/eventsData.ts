export type Category =
  | "Festival Musik"
  | "Hiburan & Pertunjukan"
  | "Wisata & Outdoor"
  | "Olahraga & E-Sport"
  | "Amal & Charity"
  | "Seni & Budaya"
  | "Stand-up Comedy"
  | "Atraksi & Wahana"
  | "Musik & Konser";

export type TicketTier = {
  name: string;
  price: number;
  perks: string[];
  status: "Tersedia" | "Sisa Sedikit" | "Habis";
};

export type EventItem = {
  id: string;
  title: string;
  category: Category;
  artist: string;
  venue: string;
  address: string;
  city: string;
  date: string;
  dayMonth: { day: string; month: string };
  time: string;
  genre: string;
  priceFrom: number;
  blurb: string;
  tone: "espresso" | "clay" | "olive";
  badge?: string;
  image: string;
  interestedCount: string;
  soldPercentage: number;
  promoter: string;
  lineup: string[];
  ticketTiers: TicketTier[];
  rundown: { time: string; act: string }[];
};

// Seed dataset for generating 20 high-quality unique events per category
const CATEGORY_SEEDS: Record<
  Category,
  {
    titles: string[];
    artists: string[];
    venues: { name: string; city: string; addr: string }[];
    genres: string[];
    images: string[];
    tones: ("espresso" | "clay" | "olive")[];
    badges: string[];
    priceBase: number;
    priceStep: number;
    promoters: string[];
  }
> = {
  "Musik & Konser": {
    titles: [
      "Senja Symphony Orchestra",
      "Kota Tua Jazz & Soul Night",
      "Neon Dangdut Koplo Party",
      "Malam Metal Raya 2026",
      "Akustik di Senyap — Intimate",
      "Jogja Retro Soul & Groove",
      "Medan Sound Explosion",
      "Surabaya Rock Revival",
      "Jakarta Philharmonic Evening",
      "Bandung Indie Soundscape",
      "Harmoni Senja Pantai Losari",
      "Semarang Pop & Acoustic Fest",
      "Solo Keroncong Modern Night",
      "Nusantara Brass Band Showcase",
      "Bali Sunset Chill & Soul",
      "Batam Electric Music Groove",
      "Rooftop Blues & Jazz Soiree",
      "Palembang Melodic Fest",
      "Malang Vintage Pop Gathering",
      "Grand Finale Symphonic Pop",
    ],
    artists: [
      "Kala Senja & String Ensemble",
      "Ardan Quartet feat. Nadia Ayu",
      "Rafi & The Koplo Machine",
      "Serigala Baja & Bintang Tamu",
      "Larasati & Sahabat",
      "The Vintage Soul Project",
      "Rockstar Sumatera Union",
      "Surabaya Rockers Community",
      "Jakarta Philharmonic Orchestra",
      "Bandung Indie Collective",
      "Losari Breeze Project",
      "Duo Nada Samudera",
      "Keroncong Muda Solo",
      "Royal Brass Band Indonesia",
      "Sunset Sound Bali",
      "Batam Island Beats",
      "Midnight Blues Society",
      "Sriwijaya Strings",
      "Malang Pop Collective",
      "All-Stars Symphonic Chorus",
    ],
    venues: [
      { name: "Istora Senayan", city: "Jakarta", addr: "Jl. Pintu Satu Senayan, Jakarta Pusat" },
      { name: "Taman Fatahillah", city: "Jakarta", addr: "Kawasan Kota Tua, Jakarta Barat" },
      { name: "GOR C-Tra Arena", city: "Bandung", addr: "Jl. Cikutra No. 278, Bandung" },
      { name: "Eldorado Dome", city: "Bandung", addr: "Jl. Dr. Setiabudi No. 438, Bandung" },
      { name: "Rooftop Kopi Manja", city: "Yogyakarta", addr: "Jl. Kaliurang KM 5.5, Sleman" },
      { name: "Jogja Expo Center (JEC)", city: "Yogyakarta", addr: "Jl. Raya Janti, Banguntapan" },
      { name: "Lapangan Benteng", city: "Medan", addr: "Jl. Pengadilan, Petisah Tengah" },
      { name: "Grand City Convention", city: "Surabaya", addr: "Jl. Walikota Mustajab No.1" },
      { name: "Teater Jakarta TIM", city: "Jakarta", addr: "Jl. Cikini Raya No.73, Menteng" },
      { name: "Sabuga ITB", city: "Bandung", addr: "Jl. Tamansari No.73, Bandung" },
    ],
    genres: ["Orkestra", "Jazz", "Dangdut & Koplo", "Rock & Metal", "Folk & Akustik", "Pop"],
    images: [
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    ],
    tones: ["espresso", "clay", "olive"],
    badges: ["Terlaris", "Intimate", "Hot", "Headbang", "Spesial", "Favorit"],
    priceBase: 100000,
    priceStep: 15000,
    promoters: ["Kala Harmony Live", "Heritage Jazz Movement", "Koplo Rave ID", "Distorsi Hitam Prod."],
  },
  "Festival Musik": {
    titles: [
      "Ombak Nusantara Festival 2026",
      "Bianglala Mega Pop Fest",
      "Synchronize Soundscape Indonesia",
      "Surabaya Indie Wave Fest",
      "Bandung Highland Music Fest",
      "Pesta Keroncong & Jazz Pesisir",
      "Borneo Sunset Beats Festival",
      "Jogja Folk & Heritage Festival",
      "Semarang Sound Explosion Fest",
      "Sunset Glow Beach Fest Bali",
      "Sumatera Rockers Carnival",
      "Jakarta Soundwave Weekend",
      "Festival Musik Lentera Alam",
      "Nusantara World Music Gathering",
      "Panggung Gembira Pemuda Fest",
      "Tropical Rave Echo 2026",
      "Parade Akustik Senja Nusantara",
      "Malang Youth Culture Fest",
      "Festival Musik Tepi Danau Toba",
      "Grand Festival Lintas Suara",
    ],
    artists: [
      "24 Musisi Indie Pesisir",
      "5 Headliner Pop Nasional",
      "50+ Musisi Lintas Generasi",
      "Kuartet Malam & Musisi Lokal",
      "Highland Sound Collective",
      "Pesisir Brass Ensemble",
      "Borneo Wave Makers",
      "Jogja Indie Union",
      "Semarang Sound Collective",
      "Sunset Glow International",
      "Sumatera Rock Movement",
      "Jakarta Wave All-Stars",
      "Musisi Lentera Sahabat",
      "World Music Collective",
      "Pentas Pemuda Nusantara",
      "Tropical Beat DJs",
      "Parade Akustik Senja",
      "Malang Youth Collective",
      "Danau Toba All-Stars",
      "Parade Bintang Lintas Suara",
    ],
    venues: [
      { name: "Pantai Karang Beach Club", city: "Bali", addr: "Jl. Pantai Karang No. 88, Sanur" },
      { name: "Stadion Madya Senayan", city: "Jakarta", addr: "GBK Complex, Senayan, Jakarta Pusat" },
      { name: "Gambir Expo Kemayoran", city: "Jakarta", addr: "JIExpo Kemayoran, Jakarta Utara" },
      { name: "Grand City Convention", city: "Surabaya", addr: "Jl. Walikota Mustajab No.1" },
      { name: "Taman Hutan Raya Djuanda", city: "Bandung", addr: "Jl. Ir. H. Juanda No.99" },
      { name: "Kawasan GWK Cultural Park", city: "Bali", addr: "Jl. Raya Uluwatu, Ungasan" },
      { name: "Stadion Kridosono", city: "Yogyakarta", addr: "Kotabaru, Gondokusuman, Yogyakarta" },
      { name: "Marina Convention Center", city: "Semarang", addr: "Jl. Villa Marina No.1, Semarang" },
    ],
    genres: ["Indie & Alternative", "Pop", "Multi-Genre", "Rock", "Electronic & Rave"],
    images: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop",
    ],
    tones: ["clay", "olive", "espresso"],
    badges: ["Promo", "Headliner", "Favorit", "Trending", "Multi-Stage", "Eksklusif"],
    priceBase: 150000,
    priceStep: 20000,
    promoters: ["Pesisir Soundwave", "Nusantara Pop Live", "Soundscape Co.", "East Wave Organizer"],
  },
  "Hiburan & Pertunjukan": {
    titles: [
      "Cirque de Lumière: Akrobatik Cahaya",
      "Teater Musikal Kolosal 'Laskar Pelangi'",
      "The Grand Illusionist: Reality Bending",
      "Magic & Illusion Night of Wonder",
      "Sirkus Udara Spektakuler Nusantara",
      "Musikal Broadway: Melodi Batavia",
      "Dunia Fantasi Teater Boneka Raksasa",
      "Simfoni Laser & Drama Air Mancur",
      "Teater Musikal Malin Kundang Modern",
      "Akrobatik Udara & Api Shanghai Circus",
      "Drama Teaterikal Gajah Mada",
      "Illusion Master Solo Tour 2026",
      "Musikal Cerita Rakyat Nusantara",
      "The Mystery Box: Escape Panggung",
      "Pertunjukan Hologram Maestro Musik",
      "Teater Musikal Sampek Engtay",
      "Illusionist Midnight Showcase",
      "Pentas Teaterikal Bunga Bangsa",
      "Sirkus Cahaya Lentera Spektakuler",
      "Grand Stage Theatrical Spectacular",
    ],
    artists: [
      "Lumière International Performers",
      "Teater Musikal Nusantara",
      "Romy Rafael & Master Illusionists",
      "The Magic Alliance",
      "Nusantara Aerial Acrobats",
      "Batavia Musical Players",
      "Teater Raksasa Indonesia",
      "Fontaine Laser Team",
      "Sumatera Musical Troupe",
      "Oriental Circus Troupe",
      "Majapahit Theatre Guild",
      "Master Demian & Guest Stars",
      "Sanggar Nusa Kencana",
      "Mystery Illusion Group",
      "Holographic Art Indonesia",
      "Teater Koma Ensembles",
      "Midnight Illusion Team",
      "Teater Bunga Bangsa",
      "Lentera Sirkus Kreasi",
      "The Grand Theatre Co.",
    ],
    venues: [
      { name: "Nusantara Hall ICE BSD", city: "Tangerang", addr: "Jl. BSD Grand Boulevard No.1" },
      { name: "Teater Besar Taman Ismail Marzuki", city: "Jakarta", addr: "Jl. Cikini Raya No.73" },
      { name: "Ciputra Artpreneur Theatre", city: "Jakarta", addr: "Ciputra World 1, Satrio Kuningan" },
      { name: "Gedung Kesenian Jakarta", city: "Jakarta", addr: "Jl. Gedung Kesenian No.1" },
      { name: "Balai Budaya Surabaya", city: "Surabaya", addr: "Jl. Gubernur Suryo No.15" },
    ],
    genres: ["Sirkus & Akrobatik", "Drama Musikal", "Sulap & Ilusi", "Teater Modern"],
    images: [
      "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1469488865564-c2de10f69f96?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop",
    ],
    tones: ["espresso", "clay", "olive"],
    badges: ["Spektakuler", "Keluarga", "Mind-Blowing", "Terbatas", "Pilihan", "Megah"],
    priceBase: 180000,
    priceStep: 15000,
    promoters: ["World Stage Entertainment", "Miles Art Works", "Miracle Stage Asia", "Teater Koma"],
  },
  "Wisata & Outdoor": {
    titles: [
      "Bromo Sunrise & Stargazing Camp Expedition",
      "Dieng Cultural & Highland Camp 2026",
      "Gema Rimba Folk & Nature Festival",
      "Rinjani Eco-Trek & Summit Gathering",
      "Ijen Blue Fire Adventure & Camping",
      "Glamping Eksklusif Hutan Pinus Mangunan",
      "Pangrango Mountain Trail Camp",
      "Sunrise Safari & Coffee Camp Kintamani",
      "Belitung Island Hopping & Sunset Camp",
      "Karimunjawa Coral Camp & Snorkeling",
      "Puncak B29 Negeri di Atas Awan Bromo",
      "Eksplorasi Tebing Breksi Moonlight Camp",
      "Festival Lampion Danau Toba Camping",
      "Ranu Kumbolo Trekking & Silent Camp",
      "Merapi Lava Tour & Stargazing Outpost",
      "Derawan Island Marine Camp & Diving",
      "Labuan Bajo Sunset Deck & Island Camp",
      "Kawah Putih Nature Walk & Camp Ciwidey",
      "Sentul Highland Eco-Camp & Waterfall",
      "Semeru Trail Camp: Jejak Para Petualang",
    ],
    artists: [
      "Komunitas Astronomi & Nature Guide",
      "Paguyuban Musisi Dieng & Tamu Budaya",
      "Hutan Bernyanyi Collective",
      "Rinjani Green Mountain Guides",
      "Ijen Expedition Team",
      "Pinus Mangunan Campers",
      "Pangrango Rangers",
      "Kintamani Barista Guides",
      "Belitung Island Rangers",
      "Karimun Ocean Adventurers",
      "B29 Highland Guides",
      "Breksi Art & Camp Union",
      "Toba Lampion Society",
      "Sahabat Ranu Kumbolo",
      "Merapi Jeep Adventurers",
      "Derawan Dive Guides",
      "Flores Eco-Guides",
      "Ciwidey Green Forest Guides",
      "Sentul Trekker Team",
      "Semeru Explorer Union",
    ],
    venues: [
      { name: "Kawasan Pasir Berbisik Bromo", city: "Malang", addr: "Taman Nasional Bromo Tengger Semeru" },
      { name: "Kompleks Candi Arjuna Dieng", city: "Wonosobo", addr: "Dataran Tinggi Dieng, Batur" },
      { name: "Taman Hutan Raya Juanda", city: "Bandung", addr: "Jl. Ir. H. Juanda No.99" },
      { name: "TN Gunung Rinjani Sembalun", city: "Lombok", addr: "Jalur Pendakian Sembalun, Lombok Timur" },
      { name: "Kawah Ijen Banyuwangi", city: "Banyuwangi", addr: "Kawasan Cagar Alam Ijen" },
    ],
    genres: ["Nature Camp", "Highland Camp", "Festival Alam", "Mountain Trekking", "Marine Camp"],
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    ],
    tones: ["espresso", "clay", "olive"],
    badges: ["Glamping", "Ikonik", "Outdoor", "Petualangan", "Eksotis", "Sunrise"],
    priceBase: 120000,
    priceStep: 25000,
    promoters: ["Bromo Astro Adventure", "Dieng Pandawa", "Rimba Echo Creative", "Lombok Eco Trekking"],
  },
  "Olahraga & E-Sport": {
    titles: [
      "MPL Indonesia Season 14 Grand Finals",
      "Super Big Match: Persija vs Persib Bandung",
      "Indonesia Open Super 1000 — Final Day",
      "PUBG Mobile National Championship",
      "Grand Final Liga Futsal Profesional",
      "Derbi Jatim: Persebaya vs Arema FC",
      "Free Fire World Series Indonesia Final",
      "Jakarta Marathon 2026 Night Run",
      "Indonesia Basketball League (IBL) Finals",
      "Valorant Champions Tour Indonesia",
      "Bali International Triathlon Gathering",
      "Kejuaraan Nasional Pencak Silat Piala Emas",
      "Tour de Borobudur Cycling Championship",
      "Pertandingan Ekshibisi Legenda Bulutangkis",
      "Dota 2 SEA Invitation Grand Final",
      "Pertarungan Tinju Gelar Juara Nasional",
      "Turnamen Streetball 3x3 Senayan",
      "Turnamen Catur Cepat Master Indonesia",
      "Kejuaraan Panahan Tradisional Jemparingan",
      "E-Sport All-Stars Charity Showmatch",
    ],
    artists: [
      "Moonton & 6 Tim Playoff Terbaik",
      "Championship Series Liga 1 Indonesia",
      "BWF World Tour & Atlet Bulutangkis",
      "Tencent & Pro Players Indonesia",
      "Federasi Futsal Indonesia",
      "Liga 1 Indonesia Derby",
      "Garena Esports Indonesia",
      "Komite Marathon Jakarta",
      "IBL Finalists 2026",
      "Riot Games & Finalist Teams",
      "Bali Triathlon Committee",
      "IPSI Indonesia",
      "Borobudur Cycling Union",
      "Legenda Bulutangkis All-Stars",
      "Valve SEA Invitational",
      "Komisi Tinju Indonesia",
      "Streetball Senayan Crew",
      "Percasi Master Chess",
      "Jemparingan Keraton Solo",
      "Pro Streamer All-Stars",
    ],
    venues: [
      { name: "Tennis Indoor Senayan", city: "Jakarta", addr: "Kawasan Gelora Bung Karno" },
      { name: "Stadion Utama Gelora Bung Karno", city: "Jakarta", addr: "Jl. Pintu Satu Senayan" },
      { name: "Istora Senayan", city: "Jakarta", addr: "Gelora Bung Karno Sports Complex" },
      { name: "Britama Arena Kelapa Gading", city: "Jakarta", addr: "Kelapa Gading, Jakarta Utara" },
      { name: "Stadion Gelora Bung Tomo", city: "Surabaya", addr: "Benowo, Surabaya Barat" },
    ],
    genres: ["Turnamen E-Sport", "Sepak Bola Liga 1", "Badminton", "Basketball", "Marathon"],
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800&auto=format&fit=crop",
    ],
    tones: ["espresso", "clay", "olive"],
    badges: ["Championship", "El-Clasico", "BWF Super 1000", "Finals", "Adrenalin", "Live"],
    priceBase: 125000,
    priceStep: 15000,
    promoters: ["Moonton Esports", "PT LIB", "PBSI & BWF", "IBL Management"],
  },
  "Amal & Charity": {
    titles: [
      "Malam Harmoni Peduli: 1000 Harapan Anak Pesisir",
      "Konser Nada Lestari: Restorasi Mangrove",
      "Charity Art Auction & Acoustic Night Kunto Aji",
      "Langkah Kecil Senyum Indonesia: Peduli Kanker",
      "Malam Amal Peduli Bencana Sumatera",
      "Konser Kemanusiaan untuk Korban Banjir",
      "Senandung Cinta Panti Asuhan Nusantara",
      "Konser Donasi Pendidikan Anak Pelosok",
      "Gala Dinner & Lelang Filantropi Budaya",
      "Konser Hijau: 10.000 Pohon untuk Hutan",
      "Festival Amal Makanan Rakyat Peduli Sesama",
      "Malam Musik Kasih Ibu & Anak Indonesia",
      "Konser Peduli Difabel: Suara Tanpa Batas",
      "Donasi Nada: Bantuan Medis Pesisir",
      "Malam Amal 100 Seniman Nusantara",
      "Lelang Fotografi Satwa Lindung Indonesia",
      "Konser Peduli Beasiswa Generasi Emas",
      "Malam Doa & Senandung Kemanusiaan",
      "Amal Ramadhan: Berbagi Cahaya Berkah",
      "Grand Charity Concert: Satu Nusa Satu Hati",
    ],
    artists: [
      "Erwin Gutawa, Tulus, & Paduan Suara Anak",
      "Dialog Dini Hari & Danilla Riyadi",
      "Perupa Nusantara & Kunto Aji",
      "Musisi Sahabat Kanker Anak",
      "Aliansi Musisi Peduli Sumatera",
      "Solidaritas Musisi Tanggap Darurat",
      "Paduan Suara Kasih Nusantara",
      "Komunitas Guru Relawan & Musisi",
      "Yayasan Filantropi Indonesia",
      "Musisi Konservasi Rimba",
      "Chef & Musisi Relawan",
      "Diva Indonesia & Sahabat",
      "Komunitas Talenta Difabel",
      "Tim Dokter Relawan & Musisi",
      "Aliansi 100 Seniman Peduli",
      "Fotografer Alam Liar Indonesia",
      "Gerakan Indonesia Mengajar",
      "Lintas Pemuka Budaya & Musisi",
      "Keluarga Besar Musisi Religi",
      "Gabungan Seluruh Bintang Tamu Amal",
    ],
    venues: [
      { name: "Balai Kartini Exhibition Hall", city: "Jakarta", addr: "Jl. Gatot Subroto Kav. 37" },
      { name: "Taman Wisata Alam Angke Kapuk", city: "Jakarta", addr: "Pantai Indah Kapuk, Jakarta Utara" },
      { name: "Jogja National Museum (JNM)", city: "Yogyakarta", addr: "Jl. Prof. DR. Ki Amri Yahya No.1" },
      { name: "Grand Ballroom Hotel Indonesia Kempinski", city: "Jakarta", addr: "Jl. MH Thamrin No.1" },
      { name: "Gedung Teater Sasana Budaya", city: "Bandung", addr: "Jl. Ganesa No.10, Bandung" },
    ],
    genres: ["Konser Amal", "Konservasi Alam", "Lelang Seni", "Kemanusiaan", "Pendidikan"],
    images: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800&auto=format&fit=crop",
    ],
    tones: ["espresso", "clay", "olive"],
    badges: ["100% Donasi", "Eco-Action", "Lelang Amal", "Pendidikan", "Filantropi", "Sosial"],
    priceBase: 100000,
    priceStep: 15000,
    promoters: ["Yayasan Tangan Harapan", "Koalisi Hijau Pesisir", "Aliansi Seniman Peduli", "Dompet Kebaikan"],
  },
  "Seni & Budaya": {
    titles: [
      "Wayang Orang Rock: Kumbakarna Gugur",
      "Pameran Seni Visual & Instalasi 'Cakrawala'",
      "Ritme Nusantara Gamelan Fusion",
      "Sendratari Ramayana Prambanan Open Air",
      "Festival Tari Topeng Cirebon Kolosal",
      "Wayang Kulit Semalam Suntuk Dalang Muda",
      "Pameran Kaligrafi & Ornamen Nusantara",
      "Pagelaran Kolosal Gandrung Sewu Banyuwangi",
      "Pentas Sendratari Bedhaya Ketawang",
      "Pameran Patung Kontemporer Selasar Sunaryo",
      "Festival Musik Etnik Dayak Kalimantan",
      "Wayang Beber Cerita Panji Kuno",
      "Pameran Batik Tulis Pusaka Keraton",
      "Tari Saman Gayo 1000 Penari",
      "Pentas Musik Sasando & Puisi Timor",
      "Kolaborasi Tari Legong x Balet Modern",
      "Pameran Instalasi Cahaya Candi Borobudur",
      "Teater Tari Makyong Kepulauan Riau",
      "Harmoni Angklung Rekor Dunia",
      "Festival Mahakarya Kebudayaan Nusantara",
    ],
    artists: [
      "Wayang Orang Bharata x Rockestra",
      "30 Maestro & Seniman Muda Indonesia",
      "Gamelan Contemporary Orchestra",
      "Paguyuban Tari Ramayana Prambanan",
      "Sanggar Tari Topeng Pesisir",
      "Ki Dalang Seno Junior & Karawitan",
      "Asosiasi Kaligrafer Indonesia",
      "1000 Penari Gandrung Banyuwangi",
      "Abdi Dalem Karaton Surakarta",
      "Selasar Sunaryo Art Space",
      "Sanggar Dayak Borneo Rumpun",
      "Komunitas Wayang Beber Pacitan",
      "Pecinta Batik Antik Nusantara",
      "Sanggar Saman Aceh Seulanga",
      "Maestro Sasando Oebelo Kupang",
      "Dewa Bali Dancers x Ballet Troupe",
      "Studio Instalasi Borobudur",
      "Pelestari Teater Makyong Riau",
      "Saung Angklung Udjo",
      "Aliansi Dewan Kebudayaan Nasional",
    ],
    venues: [
      { name: "Gedung Kesenian Jakarta", city: "Jakarta", addr: "Jl. Gedung Kesenian No.1" },
      { name: "Galeri Nasional Indonesia", city: "Jakarta", addr: "Jl. Medan Merdeka Timur No.14" },
      { name: "Panggung Terbuka Candi Prambanan", city: "Yogyakarta", addr: "Jl. Raya Jogja-Solo KM 16" },
      { name: "Taman Budaya Surakarta", city: "Solo", addr: "Jl. Ir. Sutami No.57" },
      { name: "Selasar Sunaryo Art Space", city: "Bandung", addr: "Jl. Bukit Pakar Timur No.100" },
    ],
    genres: ["Wayang Kontemporer", "Seni Rupa & Instalasi", "Gamelan & Tradisional", "Sendratari", "Musik Etnik"],
    images: [
      "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=800&auto=format&fit=crop",
    ],
    tones: ["espresso", "olive", "clay"],
    badges: ["Mahakarya", "Imersif", "Budaya", "Warisan Dunia", "Sakral", "Pusaka"],
    priceBase: 75000,
    priceStep: 12000,
    promoters: ["Teater Wayang Kontemporer", "Galeri Nasional", "Dinas Budaya Surakarta", "Taman Wisata Candi"],
  },
  "Stand-up Comedy": {
    titles: [
      "Raditya Dika — Tur Komedi 'Masih Belum Lucu'",
      "Grand Final Comedy Battle & Roast Arena",
      "Tur Komika Pantura: Gerobak Tawa Vol. 2",
      "Pandji Pragiwaksono: Cerita Negeri Jenaka",
      "Special Show Bintang Timur: Lucunya Orang Timur",
      "Ernest Prakasa: Set Setengah Matang",
      "Mamat Alkatiri: Amarah Penuh Tawa",
      "Abdur Arsyad: Pahlawan Tanpa Tanda Lucu",
      "Arie Kriting: Dari Timur Penuh Cinta",
      "Indra Jegel & Rigen: Sahabat Berisik Tour",
      "Boris Bokir: Bataknese Tawa Lepas",
      "Dodit Mulyanto: Biola & Rayuan Gombal",
      "Kiki Saputri: Roasting Pejabat Spesial",
      "Stand-Up Comedy Indonesia All Stars Night",
      "Comedy Open Mic Club: Malam Uji Materi",
      "Tur Komedi Mahasiswa Rantau",
      "Komedi Garing Tapi Bikin Ngakak",
      "Late Night Comedy Club Kemang",
      "Roast Battle Champions Cup 2026",
      "Grand Stand-Up Gala: Tawa Sampai Pagi",
    ],
    artists: [
      "Raditya Dika & Opener Pilihan",
      "Roster Roast Master Indonesia",
      "4 Komika Bintang Pantura",
      "Pandji Pragiwaksono",
      "Bintang Emon & Bintang Timur",
      "Ernest Prakasa",
      "Mamat Alkatiri Solo",
      "Abdur Arsyad",
      "Arie Kriting",
      "Indra Jegel x Rigen Rakelna",
      "Boris Bokir",
      "Dodit Mulyanto & Band",
      "Kiki Saputri",
      "SUCI All-Stars Kompas TV",
      "Komika Komunitas Stand-Up Indo",
      "Komika Kampus Jakarta",
      "Komika Absurd Surabaya",
      "Kemang Comedy Club Collective",
      "Roast Masters Union",
      "Top 10 Komika Nasional",
    ],
    venues: [
      { name: "Pusat Perfilman H. Usmar Ismail Hall", city: "Jakarta", addr: "Jl. HR Rasuna Said Kav. C-22" },
      { name: "Graha Bhakti Budaya TIM", city: "Jakarta", addr: "Kawasan Taman Ismail Marzuki" },
      { name: "Grand Ballroom Hotel Santika", city: "Semarang", addr: "Jl. Pandanaran No.116" },
      { name: "Auditorium Driyarkara Sanata Dharma", city: "Yogyakarta", addr: "Mrican, Sleman, Yogyakarta" },
      { name: "Teater Tertutup Dago Tea House", city: "Bandung", addr: "Jl. Bukit Dago Selatan No.53" },
    ],
    genres: ["Special Show Tunggal", "Roast Battle", "Comedy Roadshow", "Open Mic Club", "Stand-up Festival"],
    images: [
      "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
    ],
    tones: ["clay", "olive", "espresso"],
    badges: ["Super Lucu", "Roast Battle", "Tur Pantura", "Sold Out Cepat", "Kocak", "Special Set"],
    priceBase: 110000,
    priceStep: 12000,
    promoters: ["Tawa Manis Entertainment", "Punchline Arena", "Stand Up Indo", "Comica Media"],
  },
  "Atraksi & Wahana": {
    titles: [
      "Dufan Ancol Magic Night & Fast-Track",
      "Waterbom Bali Ultimate VIP Splash Pass",
      "Trans Studio Cyber World Theme Park",
      "Jungleland Sentul VIP Thrill Pass",
      "Taman Safari Indonesia Night Safari Pass",
      "Jatim Park 3 Dino & Sci-Fi Explorer",
      "Batu Secret Zoo & Eco Green Park",
      "Saloka Theme Park Jateng Terusan",
      "Atlantis Water Adventures Ancol Family Pass",
      "The Jungle Waterpark Bogor All-Day Access",
      "Hawai Waterpark Malang Wave Pool Pass",
      "Ocean Dream Samudra Ancol Dolphin Pass",
      "Snow World International Mall Discovery",
      "Sea World Ancol Underwater Tunnel Pass",
      "Taman Mini Indonesia Indah Cable Car & Pass",
      "Bali Safari & Marine Park Elephant Trek",
      "Trans Snow World Bekasi Ski & Sledge",
      "KidZania Jakarta Profesi Explorer",
      "Mikie Funland Berastagi Rollercoaster Pass",
      "Grand Adventure Park Nusantara All-Access",
    ],
    artists: [
      "Taman Impian Jaya Ancol",
      "Waterbom Bali Asia's Best Waterpark",
      "Trans Entertainment Indonesia",
      "Jungleland Adventure World",
      "Taman Safari Wildlife Rangers",
      "Jatim Park Group Batu",
      "Batu Secret Zoo Management",
      "Saloka Theme Park Team",
      "Atlantis Water Ancol Team",
      "The Jungle Adventure Rangers",
      "Hawai Waterpark Malang",
      "Ocean Dream Animal Care Team",
      "Snow World Management",
      "Sea World Marine Biologists",
      "TMII Heritage & Culture Team",
      "Bali Safari Wildlife Rangers",
      "Trans Snow World Instructors",
      "KidZania Educational Facilitators",
      "Mikie Funland Berastagi",
      "Grand Adventure Nusantara",
    ],
    venues: [
      { name: "Dunia Fantasi (Dufan) Ancol", city: "Jakarta", addr: "Jl. Lodan Timur No.7, Pademangan" },
      { name: "Waterbom Bali Park", city: "Bali", addr: "Jl. Kartika Plaza, Tuban, Kuta" },
      { name: "Trans Studio Cibubur", city: "Depok", addr: "Trans Studio Mall, Jl. Alternatif Cibubur" },
      { name: "Taman Safari Bogor", city: "Bogor", addr: "Jl. Kapten Harun Kabir No.724, Cisarua" },
      { name: "Jatim Park 3", city: "Batu", addr: "Jl. Ir. Soekarno No.144, Beji, Batu" },
    ],
    genres: ["Theme Park & Wahana", "Waterpark & Rekreasi", "Indoor Theme Park", "Wildlife & Safari", "Science & Play"],
    images: [
      "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800&auto=format&fit=crop",
    ],
    tones: ["espresso", "clay", "olive"],
    badges: ["Fast-Track", "No. 1 di Asia", "Indoor AC", "Keluarga", "Petualangan", "Waterpark"],
    priceBase: 150000,
    priceStep: 15000,
    promoters: ["PT Pembangunan Jaya Ancol", "Waterbom Bali", "Trans Entertainment", "Jatim Park Group"],
  },
};

const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"];

function generateCategoryEvents(category: Exclude<Category, "Semua Kategori">): EventItem[] {
  const seed = CATEGORY_SEEDS[category];
  const items: EventItem[] = [];

  for (let i = 0; i < 20; i++) {
    const title = seed.titles[i % seed.titles.length];
    const artist = seed.artists[i % seed.artists.length];
    const venueObj = seed.venues[i % seed.venues.length];
    const genre = seed.genres[i % seed.genres.length];
    const image = seed.images[i % seed.images.length];
    const tone = seed.tones[i % seed.tones.length];
    const badge = seed.badges[i % seed.badges.length];
    const priceFrom = seed.priceBase + (i % 6) * seed.priceStep;

    const dayNum = ((i * 3 + 7) % 28) + 1;
    const dayStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const monthIndex = (8 + Math.floor(i / 3)) % 12; // Sep - Dec
    const monthStr = MONTH_NAMES[monthIndex];
    const dateStr = `${dayStr} ${monthStr.slice(0, 1) + monthStr.slice(1).toLowerCase()} 2026`;

    const hour = 14 + (i % 6);
    const timeStr = `${hour}:00 ${venueObj.city === "Bali" || venueObj.city === "Lombok" ? "WITA" : "WIB"}`;
    const soldPercentage = 65 + ((i * 7) % 32);

    const safeSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const id =
      category === "Musik & Konser" && i === 0
        ? "senja-orchestra"
        : category === "Musik & Konser" && i === 1
        ? "kota-tua-jazz"
        : category === "Musik & Konser" && i === 2
        ? "neon-dangdut"
        : category === "Festival Musik" && i === 0
        ? "ombak-festival"
        : `${safeSlug}-${i + 1}`;

    items.push({
      id,
      title,
      category,
      artist,
      venue: venueObj.name,
      address: venueObj.addr,
      city: venueObj.city,
      date: dateStr,
      dayMonth: { day: dayStr, month: monthStr },
      time: timeStr,
      genre,
      priceFrom,
      blurb: `Nikmati pengalaman ${title} resmi dan terbaik bersama ${artist}. Dapatkan tiket resmi tanpa antre dengan verifikasi instan.`,
      tone,
      badge,
      image,
      interestedCount: `${(1.5 + (i * 0.4)).toFixed(1)}k peminat`,
      soldPercentage,
      promoter: seed.promoters[i % seed.promoters.length],
      lineup: [artist, "Special Guest Star", "Opening Showcase", "All-Stars Team"],
      ticketTiers: [
        {
          name: "VIP Diamond Pass",
          price: priceFrom * 2.5,
          perks: ["Kursi nomor baris terdepan", "Fast-track gate masuk", "Merchandise resmi eksklusif"],
          status: i % 4 === 0 ? "Sisa Sedikit" : "Tersedia",
        },
        {
          name: "Reguler Admission",
          price: priceFrom,
          perks: ["Akses arena utama", "Gelang barcode resmi"],
          status: "Tersedia",
        },
      ],
      rundown: [
        { time: "16:00 WIB", act: "Open Gate & Penukaran Wristband" },
        { time: "18:00 WIB", act: "Opening Performance & Pemanasan" },
        { time: "19:30 WIB", act: `Main Show: ${artist}` },
        { time: "22:00 WIB", act: "Grand Finale & Closing Celebration" },
      ],
    });
  }

  return items;
}

// Exactly 20 dummy events for each of the 9 categories = 180 events in total!
export const EVENTS: EventItem[] = [
  ...generateCategoryEvents("Musik & Konser"),
  ...generateCategoryEvents("Festival Musik"),
  ...generateCategoryEvents("Hiburan & Pertunjukan"),
  ...generateCategoryEvents("Wisata & Outdoor"),
  ...generateCategoryEvents("Olahraga & E-Sport"),
  ...generateCategoryEvents("Amal & Charity"),
  ...generateCategoryEvents("Seni & Budaya"),
  ...generateCategoryEvents("Stand-up Comedy"),
  ...generateCategoryEvents("Atraksi & Wahana"),
];
