"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronRight, MapPin, Minus, Plus, Search, SlidersHorizontal, Ticket, X } from "lucide-react";
import { discoveryCategories, discoveryCities, discoveryDate, discoveryEvents, discoveryMoney, reviewDate, type DiscoveryEvent } from "./discovery-data";
import styles from "./discovery.module.css";

type Screen = "landing" | "catalog" | "detail" | "system";
const base = "/design/discovery";

function designURL(screen: Screen, values: Record<string, string> = {}) {
  const query = new URLSearchParams({ screen, ...values });
  for (const [key, value] of query) if (!value) query.delete(key);
  return `${base}?${query}`;
}

function Poster({ event, hero = false }: { event: DiscoveryEvent; hero?: boolean }) {
  const { background, foreground, accent, lines, edition } = event.poster;
  return <svg viewBox={hero ? "0 0 760 360" : "0 0 400 500"} className={hero ? styles.heroArtwork : styles.poster} role="img" aria-label={`Konsep poster ${event.title}`}>
    <rect width="100%" height="100%" fill={background} />
    <g fill="none" stroke={accent} strokeWidth={hero ? 32 : 15} opacity=".7">
      {[90, 128, 166, 204].map((radius) => <circle key={radius} cx={hero ? 640 : 355} cy={hero ? 180 : 330} r={radius} />)}
    </g>
    <text x="28" y="40" fill={foreground} fontSize="12" fontWeight="600" letterSpacing="2.5">CONCERTGO SELECTS / CONCEPT ART</text>
    {lines.map((line, index) => <text key={line} x="24" y={(hero ? 155 : 180) + index * (hero ? 110 : 90)} fill={foreground} fontSize={line.length > 7 ? 55 : hero ? 115 : 86} fontWeight="850" letterSpacing="-5">{line}</text>)}
    <path d={hero ? "M28 300H730" : "M28 419H372"} stroke={foreground} strokeOpacity=".7" />
    <text x="28" y={hero ? 329 : 450} fill={foreground} fontSize="13" fontWeight="650" letterSpacing="1.4">{edition}</text>
    {!hero && <text x="28" y="478" fill={foreground} fontSize="10" letterSpacing="1.2">POSTER STUDI DESAIN · ACARA FIKTIF</text>}
  </svg>;
}

function EventCard({ event }: { event: DiscoveryEvent }) {
  return <article className={styles.eventCard}>
    <Link href={designURL("detail", { id: event.id })} className={styles.posterLink} aria-label={`Lihat ${event.title}`}><Poster event={event} /></Link>
    <div className={styles.cardBody}>
      <p className={styles.eventDate}>{discoveryDate(event.date)}</p>
      <h3><Link href={designURL("detail", { id: event.id })}>{event.title}</Link></h3>
      <p className={styles.venue}><MapPin size={14} aria-hidden="true" />{event.city} · {event.venue}</p>
      <p className={styles.cardPrice}><span>Mulai dari</span><strong>{discoveryMoney(event.price)}</strong></p>
    </div>
  </article>;
}

function Section({ title, description, href, children }: { title: string; description?: string; href?: string; children: ReactNode }) {
  return <section className={styles.section}>
    <div className={styles.sectionHeading}><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{href && <Link href={href}>Lihat semua <ArrowRight size={16} aria-hidden="true" /></Link>}</div>
    {children}
  </section>;
}

export default function DiscoveryPrototype() {
  const params = useSearchParams();
  const router = useRouter();
  const requested = params.get("screen");
  const screen: Screen = requested === "catalog" || requested === "detail" || requested === "system" ? requested : "landing";
  const q = params.get("q") || "";
  const city = params.get("city") || "";
  const category = params.get("category") || "";
  const date = params.get("date") || "";
  const sort = params.get("sort") || "date";
  const state = params.get("state") || "ready";
  const [search, setSearch] = useState(q);
  const [location, setLocation] = useState(city);
  const [tier, setTier] = useState("regular");
  const [quantity, setQuantity] = useState(1);
  const filterDialog = useRef<HTMLDialogElement>(null);
  const reviewDialog = useRef<HTMLDialogElement>(null);
  const selected = discoveryEvents.find((event) => event.id === params.get("id")) || discoveryEvents[0];
  const filters = { q, city, category, date, sort };
  useEffect(() => { setSearch(q); setLocation(city); }, [q, city]);
  useEffect(() => { setTier("regular"); setQuantity(1); }, [selected.id]);

  const filtered = discoveryEvents.filter((event) => {
    const matchesQuery = `${event.title} ${event.artist} ${event.venue} ${event.city}`.toLocaleLowerCase("id").includes(q.toLocaleLowerCase("id"));
    const within30 = Date.parse(event.date) >= reviewDate && Date.parse(event.date) < reviewDate + 30 * 86400000;
    return matchesQuery && (!city || event.city === city) && (!category || event.category === category) && (!date || within30);
  }).sort((a, b) => sort === "price" ? a.price - b.price : Date.parse(a.date) - Date.parse(b.date));
  const activeFilters = [q, city, category, date].filter(Boolean).length;

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(designURL("catalog", { ...filters, q: search.trim(), city: location }));
  }
  function submitFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    router.push(designURL("catalog", { q, sort, city: String(form.get("city") || ""), category: String(form.get("category") || ""), date: String(form.get("date") || "") }));
    filterDialog.current?.close();
  }
  const filterForm = <form onSubmit={submitFilters} key={`${city}-${category}-${date}`} className={styles.filterForm}>
    <h2>Filter acara</h2>
    <label>Kota<select name="city" aria-label="Filter kota" defaultValue={city}><option value="">Semua kota</option>{discoveryCities.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label>Kategori<select name="category" aria-label="Filter kategori" defaultValue={category}><option value="">Semua kategori</option>{discoveryCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label>Tanggal<select name="date" aria-label="Filter tanggal" defaultValue={date}><option value="">Semua tanggal</option><option value="next30">30 hari ke depan</option></select></label>
    <button className={styles.primary} type="submit">Terapkan filter</button>
    <Link className={styles.textButton} href={designURL("catalog")} onClick={() => filterDialog.current?.close()}>Reset semua</Link>
    <p className={styles.note}>Patokan tanggal studi: 5 Nov 2026.</p>
  </form>;

  return <div className={styles.workspace}>
    <a className={styles.skipLink} href="#discovery-content">Lewati ke konten</a>
    <div className={styles.reviewBar}>
      <div><strong>STUDI DESAIN / 03</strong><span>Rancangan interaktif · acara fiktif · tanpa transaksi</span></div>
      <nav aria-label="Layar rancangan">{[["landing", "Landing"], ["catalog", "Katalog"], ["detail", "Detail"], ["system", "Komponen"]].map(([key, label]) => <Link key={key} href={designURL(key as Screen, key === "detail" ? { id: selected.id } : {})} aria-current={screen === key ? "page" : undefined}>{label}</Link>)}</nav>
    </div>
    <header className={styles.siteHeader}>
      <div className={styles.headerRow}>
        <Link href={base} className={styles.brand}><span aria-hidden="true" className={styles.brandMark}>C</span>concert<span>go</span><small>®</small></Link>
        <nav aria-label="Navigasi utama"><Link href={designURL("catalog")} aria-current={screen === "catalog" ? "page" : undefined}>Jelajah acara</Link><a href="#discovery-help">Bantuan</a></nav>
        <button className={styles.accountButton} onClick={() => reviewDialog.current?.showModal()}>Masuk / Daftar</button>
      </div>
      <form className={styles.searchBar} onSubmit={submitSearch} role="search">
        <label className={styles.searchField}><Search size={20} aria-hidden="true" /><input type="search" aria-label="Cari acara atau musisi" placeholder="Cari acara, musisi, atau venue" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
        <label className={styles.locationField}><MapPin size={18} aria-hidden="true" /><select aria-label="Lokasi pencarian" value={location} onChange={(event) => setLocation(event.target.value)}><option value="">Semua kota</option>{discoveryCities.map((item) => <option key={item}>{item}</option>)}</select></label>
        <button className={styles.primary} type="submit">Cari acara <ArrowRight size={17} aria-hidden="true" /></button>
      </form>
    </header>

    <main id="discovery-content" className={styles.container}>
      {screen === "landing" && <>
        <section className={styles.intro}><p className={styles.eyebrow}>LIVE MUSIC, GOOD COMPANY.</p><h1>Temukan panggung berikutnya.</h1><p>Konser, festival, dan pertunjukan musik di kota pilihanmu.</p></section>
        <section className={styles.featured} aria-labelledby="featured-title">
          <Link href={designURL("detail", { id: "senja-live" })} className={styles.featuredPoster} aria-label="Lihat Senja Live — Jakarta"><Poster event={discoveryEvents[0]} hero /></Link>
          <div className={styles.featuredInfo}><span className={styles.eyebrow}>PILIHAN EDITOR</span><h2 id="featured-title">Satu malam.<br /> Banyak cerita.</h2><p>Senja Live — Jakarta</p><p className={styles.featuredMeta}>12 Des 2026 · Basket Hall, Senayan</p><div className={styles.featuredBottom}><strong>{discoveryMoney(185000)}<small>mulai dari / orang</small></strong><Link href={designURL("detail", { id: "senja-live" })} className={styles.darkButton}>Lihat acara <ArrowRight size={16} aria-hidden="true" /></Link></div></div>
        </section>
        <nav className={styles.categoryNav} aria-label="Kategori acara"><span>Temukan berdasarkan</span>{discoveryCategories.map((item) => <Link key={item} href={designURL("catalog", { category: item })}>{item}<ChevronRight size={16} aria-hidden="true" /></Link>)}</nav>
        <Section title="Pilihan minggu ini" description="Kurasi editorial untuk rencana menontonmu." href={designURL("catalog")}><div className={styles.eventGrid}>{[0, 1, 3, 6].map((index) => <EventCard key={discoveryEvents[index].id} event={discoveryEvents[index]} />)}</div></Section>
        <Section title="Dalam waktu dekat" description="Acara dalam 30 hari sejak tanggal studi desain." href={designURL("catalog", { date: "next30" })}><div className={styles.upcomingList}>{discoveryEvents.filter((event) => Date.parse(event.date) < reviewDate + 30 * 86400000).sort((a, b) => Date.parse(a.date) - Date.parse(b.date)).map((event) => <Link className={styles.upcomingItem} key={event.id} href={designURL("detail", { id: event.id })}><span className={styles.dateTile}><small>NOV</small><strong>{new Date(event.date).getDate()}</strong></span><div><h3>{event.title}</h3><p>{event.city} · {event.venue}</p></div><strong>{discoveryMoney(event.price)}</strong><ArrowRight size={18} aria-hidden="true" /></Link>)}</div></Section>
        <Section title="Mau nonton di mana?"><div className={styles.cityGrid}>{discoveryCities.map((item, index) => <Link key={item} href={designURL("catalog", { city: item })}><span className={styles.cityIndex}>0{index + 1}</span><strong>{item}</strong><ArrowRight size={17} aria-hidden="true" /></Link>)}</div></Section>
      </>}

      {screen === "catalog" && <>
        <div className={styles.catalogIntro}><p className={styles.breadcrumb}><Link href={base}>Beranda</Link><ChevronRight size={13} aria-hidden="true" />Jelajah acara</p><h1>{q ? `Hasil untuk “${q}”` : city ? `Acara di ${city}` : "Jelajah acara"}</h1><p>Cari acara yang cocok dengan rencana dan anggaranmu.</p></div>
        <div className={styles.catalogLayout}>
          <aside className={styles.filterSidebar}>{filterForm}</aside>
          <section className={styles.results} aria-label="Hasil pencarian">
            <div className={styles.resultsToolbar}><p role="status">{state === "empty" ? 0 : filtered.length} acara{activeFilters > 0 && ` · ${activeFilters} filter aktif`}</p><button className={styles.filterTrigger} onClick={() => filterDialog.current?.showModal()}><SlidersHorizontal size={17} aria-hidden="true" />Filter</button><label>Urutkan<select aria-label="Urutkan hasil" value={sort} onChange={(event) => router.push(designURL("catalog", { ...filters, sort: event.target.value }))}><option value="date">Tanggal terdekat</option><option value="price">Harga terendah</option></select></label></div>
            {activeFilters > 0 && <div className={styles.filterChips}>{Object.entries({ q, city, category, date }).filter(([, value]) => value).map(([key, value]) => <Link key={key} href={designURL("catalog", { ...filters, [key]: "" })} aria-label={`Hapus filter ${value}`}>{key === "date" ? "30 hari ke depan" : value}<X size={12} aria-hidden="true" /></Link>)}</div>}
            <div className={styles.statePicker}><label>Uji state rancangan<select aria-label="State rancangan" value={state} onChange={(event) => router.push(designURL("catalog", { ...filters, state: event.target.value }))}><option value="ready">Data tersedia</option><option value="loading">Loading</option><option value="empty">Kosong</option><option value="error">Error API</option></select></label></div>
            {state === "loading" ? <div className={styles.eventGrid} aria-label="Memuat acara" role="status">{[0, 1, 2].map((key) => <div className={styles.skeleton} key={key}><span /><span /><span /></div>)}</div> : state === "error" ? <div className={styles.resultState} role="alert"><h2>Acara belum dapat dimuat</h2><p>Periksa koneksi lalu coba lagi. Data contoh tidak menggantikan error server secara otomatis.</p><Link className={styles.primary} href={designURL("catalog", filters)}>Coba lagi</Link></div> : state === "empty" || filtered.length === 0 ? <div className={styles.resultState}><Search size={28} aria-hidden="true" /><h2>Belum ada acara yang cocok</h2><p>Coba kata kunci lain atau perluas pilihan kota dan tanggal.</p><Link className={styles.primary} href={designURL("catalog")}>Reset pencarian</Link></div> : <div className={styles.eventGrid}>{filtered.map((event) => <EventCard key={event.id} event={event} />)}</div>}
          </section>
        </div>
      </>}

      {screen === "detail" && <>
        <p className={styles.breadcrumb}><Link href={designURL("catalog")}><ArrowLeft size={14} aria-hidden="true" />Semua acara</Link><ChevronRight size={13} aria-hidden="true" />{selected.category}</p>
        <div className={styles.detailLayout}>
          <div className={styles.detailMain}>
            <header className={styles.detailHeader}><p className={styles.eyebrow}>{selected.category.toUpperCase()} / {selected.city.toUpperCase()}</p><h1>{selected.title}</h1><p>{selected.artist}</p></header>
            <div className={styles.detailArtwork}><Poster event={selected} hero /></div>
            <div className={styles.factGrid}><div><CalendarDays size={20} aria-hidden="true" /><p><strong>{discoveryDate(selected.date)}</strong><span>{selected.time} · waktu setempat</span></p></div><div><MapPin size={20} aria-hidden="true" /><p><strong>{selected.venue}</strong><span>{selected.city}</span></p></div></div>
            <nav className={styles.detailNav} aria-label="Informasi acara"><a href="#about-event">Tentang</a><a href="#event-schedule">Jadwal</a><a href="#event-terms">Ketentuan</a><a href="#event-location">Lokasi</a></nav>
            <section id="about-event" className={styles.detailSection}><h2>Tentang acara</h2><p>{selected.title} mempertemukan {selected.artist.toLowerCase()} dalam pertunjukan langsung di {selected.venue}. Pilih kategori tiket yang sesuai, lalu periksa jadwal dan ketentuan sebelum memesan.</p><p className={styles.note}>Deskripsi dan artis adalah contoh untuk menilai rancangan, bukan pengumuman acara nyata.</p></section>
            <section id="event-schedule" className={styles.detailSection}><h2>Jadwal acara</h2><div className={styles.schedule}><span>17.00</span><p>Pintu masuk dibuka</p><span>{selected.time}</span><p>Pertunjukan dimulai</p></div><p className={styles.note}>Jadwal ilustrasi; rundown final mengikuti informasi penyelenggara.</p></section>
            <section id="event-terms" className={styles.detailSection}><h2>Sebelum membeli</h2><ul><li>Periksa nama acara, tanggal, dan kategori tiket.</li><li>Ketentuan usia, penukaran, dan refund harus berasal dari penyelenggara.</li><li>Harga dan ketersediaan final diverifikasi server saat pemesanan.</li></ul></section>
            <section id="event-location" className={styles.detailSection}><h2>Lokasi</h2><p><strong>{selected.venue}</strong><br />{selected.city}, Indonesia</p><div className={styles.locationPlaceholder}><MapPin size={22} aria-hidden="true" /><p>Denah lokasi resmi ditempatkan di sini setelah alamat dan koordinat tersedia.</p></div></section>
          </div>
          <aside className={styles.ticketPanel} id="ticket-selection">
            <div className={styles.ticketHeading}><Ticket size={20} aria-hidden="true" /><h2>Pilih tiket</h2></div><p className={styles.note}>Harga contoh per orang. Bukan inventori nyata.</p>
            <fieldset className={styles.tierOptions}><legend>Kategori tiket</legend>{[["regular", "Regular", selected.price, "Akses area reguler"], ["premium", "Premium", selected.price + 150000, "Akses area premium"]].map(([id, name, price, description]) => <label key={String(id)} className={tier === id ? styles.selectedTier : ""}><input type="radio" name="ticket-tier" value={String(id)} checked={tier === id} onChange={() => setTier(String(id))} /><span><strong>{name}</strong><small>{description}</small></span><b>{discoveryMoney(Number(price))}</b></label>)}</fieldset>
            <div className={styles.quantityRow}><span>Jumlah tiket</span><div><button aria-label="Kurangi tiket" disabled={quantity <= 1} onClick={() => setQuantity((value) => value - 1)}><Minus size={16} aria-hidden="true" /></button><output aria-label="Jumlah tiket dipilih">{quantity}</output><button aria-label="Tambah tiket" disabled={quantity >= 4} onClick={() => setQuantity((value) => value + 1)}><Plus size={16} aria-hidden="true" /></button></div></div>
            <div className={styles.subtotal}><span>Subtotal · {quantity} tiket</span><strong>{discoveryMoney((selected.price + (tier === "premium" ? 150000 : 0)) * quantity)}</strong></div>
            <p className={styles.note}>Biaya layanan dan pajak belum dihitung. Rincian final harus tampil sebelum pembayaran.</p>
            <button className={styles.primary} onClick={() => reviewDialog.current?.showModal()}>Tinjau pilihan <ArrowRight size={17} aria-hidden="true" /></button>
            <p className={styles.organizer}>Diselenggarakan oleh<strong>{selected.organizer}</strong></p>
          </aside>
        </div>
        <div className={styles.mobilePurchase}><div><small>Mulai dari</small><strong>{discoveryMoney(selected.price)}</strong></div><a className={styles.primary} href="#ticket-selection">Pilih tiket <ArrowRight size={17} aria-hidden="true" /></a></div>
      </>}

      {screen === "system" && <>
        <section className={styles.intro}><p className={styles.eyebrow}>ARAH VISUAL / MUSIC-FIRST MARKETPLACE</p><h1>Acara lebih dulu.<br />Dekorasi secukupnya.</h1><p>Permukaan netral, tipografi jelas, poster berkarakter, dan satu aksen tindakan.</p></section>
        <Section title="Palet utama"><div className={styles.palette}>{[["Ink", "#1b2025"], ["Canvas", "#f7f8f9"], ["Surface", "#ffffff"], ["Accent", "#b9431c"], ["Muted", "#58616b"], ["Border", "#dce0e4"]].map(([name, color]) => <div key={name}><span style={{ background: color }} /><strong>{name}</strong><code>{color}</code></div>)}</div></Section>
        <Section title="Tipografi & tindakan" description="Geist Sans. Body 16/24, label 13/20, judul kartu 17/24, H1 40/44 desktop dan 30/36 mobile."><div className={styles.componentRow}><button className={styles.primary}>Tindakan utama <ArrowRight size={16} aria-hidden="true" /></button><button className={styles.secondary}>Tindakan sekunder</button><button className={styles.primary} disabled>Tidak tersedia</button><span className={styles.successLabel}><Check size={15} aria-hidden="true" />Konfirmasi server</span></div></Section>
        <Section title="Kartu acara" description="Poster 4:5, tanggal, judul, venue/kota, harga. Tanpa rating atau urgensi buatan."><div className={styles.sampleGrid}><EventCard event={discoveryEvents[0]} /><div className={styles.componentNotes}><h3>Aturan komponen</h3><ul><li>Judul maksimal dua baris; teks lengkap tetap di tautan.</li><li>Target sentuh minimal 44 px untuk kontrol.</li><li>Focus ring terlihat dan tidak mengandalkan hover.</li><li>Grid 4 kolom desktop, 2 kolom mobile.</li><li>Poster studi diganti aset berizin saat implementasi.</li></ul><Link className={styles.secondary} href={designURL("catalog", { state: "error" })}>Lihat state error</Link><Link className={styles.secondary} href={designURL("catalog", { state: "empty" })}>Lihat state kosong</Link></div></div></Section>
      </>}
    </main>

    <footer className={styles.footer} id="discovery-help"><div className={styles.footerInner}><div><Link href={base} className={styles.footerBrand}>concertgo.</Link><p>Temukan acara. Rencanakan malamnya.</p><small>Studi desain tahap 3 · konten ilustrasi.</small></div><div className={styles.footerLinks}><h2>Jelajah</h2><Link href={designURL("catalog")}>Semua acara</Link><Link href={designURL("catalog", { category: "Festival" })}>Festival</Link><Link href={designURL("catalog", { category: "Konser" })}>Konser</Link></div><div className={styles.footerHelp}><h2>Perlu bantuan?</h2><details><summary>Bagaimana cara membeli tiket?</summary><p>Pilih acara dan kategori tiket, periksa rincian biaya, lalu masuk saat melanjutkan pemesanan. Pembayaran tidak tersedia pada studi desain.</p></details><details><summary>Apakah data ini acara nyata?</summary><p>Seluruh acara dan harga pada rancangan adalah contoh. Tidak ada reservasi atau pembayaran yang dibuat.</p></details></div></div><div className={styles.footerBottom}>© 2026 ConcertGo · Rancangan untuk peninjauan, bukan penawaran penjualan tiket.</div></footer>

    <dialog ref={filterDialog} className={styles.dialog} aria-labelledby="filter-dialog-title"><div className={styles.dialogHeader}><h2 id="filter-dialog-title">Sesuaikan pencarian</h2><button aria-label="Tutup filter" onClick={() => filterDialog.current?.close()}><X size={20} aria-hidden="true" /></button></div>{filterForm}</dialog>
    <dialog ref={reviewDialog} className={styles.dialog} aria-labelledby="review-dialog-title"><div className={styles.dialogHeader}><h2 id="review-dialog-title">Pratinjau alur berikutnya</h2><button aria-label="Tutup pratinjau" onClick={() => reviewDialog.current?.close()}><X size={20} aria-hidden="true" /></button></div><div className={styles.reviewContent}><p>Rancangan ini berhenti sebelum autentikasi dan checkout.</p>{screen === "detail" && <p><strong>{selected.title}</strong><br />{quantity} × {tier === "regular" ? "Regular" : "Premium"}</p>}<p>Pada implementasi, masuk ke akun mempertahankan konteks acara dan tiket. Harga, biaya, serta ketersediaan diperiksa oleh server.</p><button className={styles.primary} onClick={() => reviewDialog.current?.close()}>Kembali ke rancangan</button></div></dialog>
  </div>;
}
