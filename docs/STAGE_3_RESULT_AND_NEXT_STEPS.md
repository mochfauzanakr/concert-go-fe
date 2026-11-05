# Hasil tahap 3 dan rencana tahap berikutnya

Tanggal: 5 November 2026. FE: branch lokal `dev/auth`.

## 1. Permintaan tambahan — profil demo mengikuti profil nyata

Profil user dan admin pada mode demo kini menggunakan `ProfileForm` yang sama dengan akun nyata:

- Struktur dan judul “Profil akun”, pemilihan/preview foto, nama lengkap, email read-only, serta tombol Simpan profil konsisten.
- Validasi JPG/PNG/WebP maksimal 2 MB sama.
- Mode nyata menyimpan ke backend; demo menyimpan lokal dan menggunakan pesan yang menyebut browser, bukan server.
- Data profil demo mempunyai storage terpisah (`concertgo-demo-profiles-v1`), sehingga tidak mengubah identitas atau token akun nyata.
- Navbar user dan topbar admin menampilkan profil demo yang sesuai.
- Editor profil demo lama yang berbeda tampilannya sudah digantikan komponen bersama.

Untuk mencoba: buka `/user/profile?preview=demo` atau `/admin/dashboard/profile?preview=demo`.

Bukti: [user desktop](design/screenshots/profile-user-desktop.png), [user mobile](design/screenshots/profile-user-mobile.png), [admin desktop](design/screenshots/profile-admin-desktop.png), [admin mobile](design/screenshots/profile-admin-mobile.png).

## 2. Hasil tahap 3 — rancangan yang dapat ditinjau

Prototipe responsive tersedia di:

| Bagian | URL lokal |
| --- | --- |
| Landing | `http://localhost:3100/design/discovery` |
| Katalog | `http://localhost:3100/design/discovery?screen=catalog` |
| Detail | `http://localhost:3100/design/discovery?screen=detail&id=senja-live` |
| Komponen dan palet | `http://localhost:3100/design/discovery?screen=system` |

Hasil lengkap:

1. [Audit visual, benchmark, UX, spesifikasi, dan handoff](design/DISCOVERY_REVIEW.md).
2. [Design tokens terstruktur](design/discovery.tokens.json).
3. Enam screenshot tampilan awal dan enam screenshot usulan discovery desktop/mobile di `docs/design/screenshots/`.
4. Prototipe klik untuk pencarian, filter, urutan hasil, state loading/empty/error, detail, kategori tiket, jumlah, dan subtotal.
5. Komponen studi dan CSS scoped di `components/design/`; rancangan tidak mengganti global theme aplikasi.

Status desain: **siap ditinjau**. Rancangan belum dianggap disetujui. Data dan poster pada prototipe adalah contoh fiktif; pemilihan tiket berhenti pada dialog review, tanpa reservasi/pembayaran.

## 3. Keputusan desain yang diusulkan

- Fokus awal pada musik: konser, festival, jazz, orkestra.
- Pencarian berada di header dan terlihat pada layar pertama.
- Latar netral/putih; poster menjadi sumber warna. Aksen tindakan oranye gelap, radius serta shadow lebih terkendali.
- Satu featured event, kurasi editorial, koleksi berbasis waktu, dan jelajah kota.
- Kartu konsisten: poster → tanggal → judul → kota/venue → harga mulai.
- Katalog memakai sidebar desktop dan dialog filter mobile; filter dipertahankan dalam URL.
- Detail diusulkan publik; desktop memiliki panel tiket sticky dan mobile memiliki shortcut harga/Pilih tiket di bawah.
- Klaim popularitas, promo, rating, urgensi, dan refund hanya tampil jika ada sumber yang valid.
- Checkout menunjukkan rincian biaya final dari server; prototipe menandai biaya yang belum dihitung.

### Bukti perubahan hierarki

Audit mengukur posisi input pencarian landing sekitar y=1009 desktop dan y=1749 mobile. Dalam rancangan menjadi y=146 desktop dan y=190 mobile, termasuk toolbar review. Pengukuran ini menjelaskan penempatan pencarian; bukan klaim peningkatan penjualan atau performa.

Benchmark yang dapat diperiksa: LOKET melalui browser, Ticketmaster dan Eventbrite melalui struktur halaman yang tersedia. tiket.com terhalang verifikasi browser, sehingga tidak menjadi dasar klaim detail.

## 4. Verifikasi

| Pemeriksaan | Hasil |
| --- | --- |
| `npm run test:e2e` | **42 lulus dalam satu run penuh** |
| Cakupan baru | 2 skenario profil demo dan 8 skenario prototipe discovery |
| Ukuran viewport rancangan | 360, 390, 768, 1440 px; tanpa overflow halaman pada empat layar rancangan |
| Flow rancangan | Search/sort tersimpan di URL setelah reload, filter dialog/Escape, subtotal tiket, empty/error recovery, tanpa request transaksi |
| Profil nyata tahap 2 | Suite 9 skenario UI API tetap lulus |
| `npm run test:auth` | 15 lulus |
| `npm run test:demo` | 8 lulus |
| `npm run lint -- --quiet` | Tidak ada error |
| `npx tsc --noEmit` | Berhasil |
| `npm run build` | Berhasil; route review memakai metadata noindex |
| Kontras token utama | Accent/putih 5,41:1; muted/putih 6,29:1; ink/canvas 15,43:1 |

Kontras adalah pemeriksaan pasangan warna tersebut, bukan sertifikasi aksesibilitas seluruh situs. Review keyboard dasar, reflow, dan screenshot tetap diperlukan saat tahap 4 mengintegrasikan komponen ke produk.

Backend tidak diubah pada tahap ini. Integrasi backend nyata tahap 2 tidak diulang karena perubahan utama adalah penyatuan UI demo dan rancangan; regresi kontrak serta browser profil nyata telah dijalankan.

## 5. Tahap 4 — Terapkan discovery ke halaman produk

Urutan implementasi yang disarankan setelah review arah visual:

### 4A. Fondasi komponen discovery

- Pecah prototipe menjadi header/search, EventCard, featured, filter, results state, detail facts, ticket selector, serta footer yang reusable.
- Terjemahkan design tokens yang disetujui ke implementasi produk; migrasi bertahap agar area akun/admin tetap stabil.
- Tentukan adapter event kanonis dan sumber data eksplisit. Poster studi diganti aset final/berizin.

### 4B. Katalog dan detail publik

- Buat `/events` dan `/events/[slug]` yang dapat dibuka tamu.
- Mapping URL/ID lama agar deep link `/user/events/...` tidak putus.
- Query kota/kategori/tanggal/search/sort tersimpan di URL; pagination/cursor mengikuti kontrak data.
- Tangani 404, gambar gagal, loading, empty, error, cancelled, sold out, dan belum dijual secara jelas.
- Pertahankan tujuan event+tier+jumlah setelah login, dengan validasi internal dan pemeriksaan ulang server.

### 4C. Landing dan penyatuan tamu/user

- Terapkan featured ringkas, kurasi yang mempunyai kriteria jelas, acara dekat, dan kota.
- Kurangi komponen discovery duplikat serta section marketing statis yang tidak mendukung pencarian.
- Navbar mencerminkan sesi; satu jalur detail acara dipakai tamu dan akun.

### 4D. Validasi produk

- Uji mobile, keyboard, dialog, link lama, URL filter, dan keadaan sesi.
- Optimalkan dimensi/crop/lazy loading poster dan batas server/client.
- Ukur LCP/CLS secara lab lalu laporkan kondisi pengukuran; pengukuran field menunggu trafik nyata.

**Kriteria selesai:** discovery produk mengikuti rancangan yang disepakati, link publik dan login menjaga konteks, metadata terbaca di mobile, dan setiap klaim/status sesuai sumber data. Integrasi event nyata masih mengikuti ketersediaan endpoint backend.

## 6. Tahap 5 — Konsistensi akun dan workspace

- Terapkan komponen/tokens stabil ke login, registrasi, profil, pengaturan, tabel/dialog admin, dan feedback.
- Samakan loading/empty/error/konfirmasi serta navigasi yang mengikuti role.
- Audit menu dan statistik agar data demo tidak dipresentasikan sebagai hasil operasional server.
- Pertahankan perbedaan sumber data secara jelas meskipun tampilan demo dan nyata konsisten.

**Kriteria selesai:** aplikasi terasa satu produk dan setiap field/tombol/pesan mempunyai perilaku yang sesuai labelnya.

## 7. Tahap 6 — Commerce dan tiket nyata

- Sepakati endpoint event/inventori, order, reservasi, biaya, pembayaran, tiket, dan scanner bersama pemilik backend.
- Harga/stok/expiry berasal dari server; checkout mempunyai retry aman/idempotensi.
- Status pembayaran diverifikasi backend/provider. QR diterbitkan dan ditandai terpakai oleh server.
- Uji pembatalan, expiry, scan ulang, dan request paralel lintas sesi/perangkat.
- Selesaikan gap expiry JWT serta verifikasi Google OAuth bersama pemilik BE.

**Kriteria selesai:** pembelian sampai gate terbukti pada backend, bukan hanya localStorage.

Langkah berikutnya adalah review rancangan di `/design/discovery`, lalu pelaksanaan tahap 4 berdasarkan arah yang dipilih.
