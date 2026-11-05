# ConcertGo — review UX dan arah visual tahap 3

Tanggal observasi: 5 November 2026. Status: **proposal untuk peninjauan**, bukan persetujuan desain final.

## 1. Cara melihat hasil

Dengan FE aktif di `http://localhost:3100`:

| Layar | URL |
| --- | --- |
| Landing | `/design/discovery` |
| Katalog | `/design/discovery?screen=catalog` |
| Detail | `/design/discovery?screen=detail&id=senja-live` |
| Komponen dan palet | `/design/discovery?screen=system` |
| Contoh hasil kosong | `/design/discovery?screen=catalog&state=empty` |
| Contoh error API | `/design/discovery?screen=catalog&state=error` |

Prototipe responsive, pencarian/filter/sort memakai URL, filter mobile menggunakan dialog, dan pemilihan kategori/jumlah tiket dapat dicoba. Peninjauan berhenti sebelum autentikasi/checkout. Seluruh acara, artis, harga, organizer, dan poster adalah konten studi fiktif. Tidak ada inventori atau pembayaran yang dibuat.

Toolbar gelap paling atas dan pemilih state katalog adalah alat review. Keduanya tidak masuk ke desain produk final. Metadata halaman review menggunakan `noindex`.

## 2. Audit tampilan yang berjalan

Audit memakai browser Chromium, viewport desktop 1440×1000 dan mobile 390×844. Halaman demo digunakan untuk katalog/detail karena route produk saat ini berada di area user. Screenshot full-page dipanaskan dengan scroll agar konten scroll-reveal dan gambar lazy dapat terlihat sebelum capture.

Pengukuran terakhir tersimpan pada [`screenshots/current-metrics.json`](screenshots/current-metrics.json). Nilai koordinat adalah jarak dari bagian atas dokumen, bukan skor performa atau hasil studi pengguna.

| Temuan | Bukti | Implikasi desain |
| --- | --- | --- |
| Pencarian landing terlalu jauh di bawah | Input sekitar y=1009 desktop dan y=1749 mobile | Pencarian dipindahkan ke header, dapat ditemukan pada layar pertama |
| Landing terlalu panjang untuk konten yang berulang | Tinggi sekitar 5853 desktop dan 12770 mobile | Kurangi deretan identik, marquee, CTA registrasi besar, dan section marketing tanpa fungsi pencarian |
| Pencarian katalog tertunda oleh hero | Input sekitar y=660 desktop dan y=778 mobile | Judul katalog informatif dan ringkas; tidak memerlukan hero promosi kedua |
| Arah visual hangat dipakai pada hampir semua permukaan | Canvas krem, card rounded besar, badge/gradien dalam banyak section | Permukaan netral dan border ringan; poster menjadi sumber warna utama |
| Landing tidak memiliki H1 dalam DOM yang diobservasi | Heading utama dan judul section memakai H2 | Satu H1 per layar dengan tujuan halaman yang jelas |
| Koleksi rekomendasi/populer/favorit mengulang sumber | `app/(main)/page.tsx`: ketiga kelompok berasal dari `filtered` | Bedakan kurasi editorial dan kriteria waktu; popularitas perlu metrik server |
| Harga/tanggal/lokasi harus bersaing dengan badge/copy | Hero dan section title berlapis | Hierarki kartu tetap: poster → tanggal → judul → kota/venue → harga |
| Detail mobile mengharuskan scroll ke panel tiket | Panel tiket sesudah konten detail | Ringkasan harga dan anchor “Pilih tiket” tetap tersedia pada bagian bawah mobile |
| Jalur tamu dan user belum konsisten | Landing memakai modal, katalog/detail memakai route user | Rencanakan URL detail publik dan satu sumber komponen discovery |
| Sebagian info marketing tidak memiliki sumber operasional | Testimoni, angka, voucher, jaminan statis | Tampilkan hanya informasi yang bisa dipertanggungjawabkan sumbernya |

Tidak ditemukan overflow halaman pada enam screenshot awal tersebut. Fokus masalah adalah hierarki, panjang halaman, sumber klaim, dan kemudahan menemukan acara.

### Bukti visual awal

- [Landing desktop](screenshots/current-landing-desktop.png) · [Landing mobile](screenshots/current-landing-mobile.png)
- [Katalog desktop](screenshots/current-catalog-desktop.png) · [Katalog mobile](screenshots/current-catalog-mobile.png)
- [Detail desktop](screenshots/current-detail-desktop.png) · [Detail mobile](screenshots/current-detail-mobile.png)

## 3. Benchmark yang diperiksa

| Situs/sumber | Observasi yang benar-benar tersedia | Pola yang diadaptasi |
| --- | --- | --- |
| [LOKET Discover](https://www.loket.com/discover), diarahkan browser ke `/search?d_s_n=asc` | Pencarian, kategori, lokasi/tanggal/harga/format, urutan mulai segera, kartu nama-tanggal-kota-creator, label sold out | Filter konkret dan metadata event; creator diberi konteks |
| [Ticketmaster](https://www.ticketmaster.com/) | Search dengan location/dates, discovery kategori, popular near you, city navigation, bantuan tiket, penjelasan biaya | Pencarian sebagai alat utama, discovery per kota, dan transparansi rincian harga |
| [Eventbrite Jakarta Music](https://www.eventbrite.com/d/indonesia--jakarta/music--events/) | Pencarian acara dan lokasi, breadcrumb kategori/kota, filter tanggal, empty state dengan instruksi ubah filter, akses tiket/bantuan | Konteks hasil yang jelas dan empty state yang membantu recovery |
| [tiket.com To Do](https://www.tiket.com/to-do) | Ekstraksi terbatas; browser menampilkan verifikasi manusia | Tidak dipakai untuk klaim rinci mengenai layout/filter terbaru |

Benchmark ini bersifat observasi struktur/flow yang dapat diakses, bukan penilaian menyeluruh conversion rate atau audit usability pesaing. Identitas visual, logo, dan aset mereka tidak disalin. Warna dan poster prototipe dibuat sendiri untuk kebutuhan studi.

## 4. Strategi pengalaman pengguna

### Fokus awal

**Music-first marketplace:** konser, festival musik, jazz, dan orkestra. Kategori diperluas ketika konten/kontrak datanya tersedia. Ini menghindari kategori kosong yang hanya membuat katalog tampak besar.

### Tugas utama

1. Menemukan acara berdasarkan musisi, venue, kota, dan waktu.
2. Membandingkan tanggal, lokasi, dan harga tanpa membuka banyak modal.
3. Membaca detail acara tanpa dipaksa login.
4. Memilih kategori/jumlah tiket dan mengetahui biaya sebelum pembayaran.
5. Masuk ke akun dengan tujuan acara yang tetap terjaga.

### Arsitektur informasi sasaran tahap 4

```text
/                         Landing publik
/events                   Katalog publik
/events/[slug]            Detail publik
/sign-in?returnTo=...      Login dengan tujuan internal tervalidasi
/user/checkout?...        Checkout akun; validasi server dibutuhkan
/user/orders              Pesanan
/user/tickets             Tiket
/user/profile             Profil
/admin/dashboard/...      Administrasi berdasarkan role
```

URL di atas adalah kontrak navigasi usulan, belum migrasi route produk. Tahap 4 perlu mapping `/user/events` dan `/user/events/[id]` ke URL publik serta mempertahankan deep link lama. Slug tampilan dan ID database harus dipetakan secara eksplisit. `safeReturnPath` harus diperbarui ketika katalog/detail publik dimigrasikan, tanpa membuka redirect eksternal.

### Flow

```text
Landing
  → search / kategori / kota / koleksi waktu
  → katalog (filter tersimpan di URL)
  → detail publik
  → pilih tiket
  → login bila belum memiliki sesi
  → kembali ke konteks event+tier+jumlah yang sudah divalidasi
  → server memeriksa harga, biaya, stok, expiry
  → konfirmasi → pembayaran → tiket
```

Prototipe menguji bagian sampai pemilihan tiket. Langkah transaksi nyata merupakan dependensi tahap 6.

## 5. Struktur tiap layar

### Landing

1. Header brand, Jelajah acara, Bantuan, akun.
2. Search dan kota pada header.
3. H1 singkat yang menjelaskan tujuan situs.
4. Satu featured event yang dipilih editorial; tidak autoplay.
5. Kategori yang benar-benar memiliki isi.
6. Pilihan minggu ini: kurasi, bukan personalisasi palsu.
7. Dalam waktu dekat: daftar ringkas berdasarkan tanggal.
8. Jelajah kota dan bantuan singkat.

**Dihilangkan dari usulan:** tiga carousel berisi pool yang sama, testimoni rekaan, angka penjualan dekoratif, voucher tanpa fungsi, jaminan refund tanpa aturan, dan CTA registrasi yang mendominasi.

### Katalog

- Breadcrumb, judul hasil, jumlah acara, filter aktif.
- Desktop: sidebar filter dan grid hasil 3 kolom dalam container 1200 px.
- Tablet: grid hasil 2 kolom.
- Mobile: tombol filter membuka dialog; urutan tetap terlihat; grid 2 kolom.
- Search/kota/kategori/tanggal/sort dibaca dari URL, termasuk reload dan back/forward.
- Filter aktif dapat dihapus satu per satu; reset disediakan.
- State ready/loading/empty/error terpisah. Error tidak diganti data demo diam-diam.
- Pagination/cursor server akan ditambahkan setelah kontrak event tersedia; prototipe 8 item tidak membuat pagination palsu.

### Detail

- H1, kategori/kota, lineup ringkas.
- Poster/hero yang sesuai event dan metadata tanggal, zona waktu, venue.
- Anchor Tentang/Jadwal/Ketentuan/Lokasi; isi penting tersedia tanpa login.
- Desktop: panel tiket sticky di kanan.
- Mobile: panel tiket mengikuti dokumen; bar harga/Pilih tiket mengarah ke panel dan memperhatikan safe area.
- Kategori/jumlah/subtotal terbaca; label biaya yang belum dihitung jelas.
- Pada produk final, kondisi tersedia/habis/belum dijual/dibatalkan harus ditentukan server, bukan badge statis.

## 6. Arah visual dan design tokens

Nama arah: **Quiet frame, expressive posters**. UI menjadi bingkai tenang; warna dan karakter datang dari poster.

- Geist Sans memakai font yang sudah tersedia pada aplikasi.
- Canvas `#f7f8f9`, surface putih, ink `#1b2025`, muted `#58616b`.
- Aksen tindakan `#b9431c`, hover `#963414`; kontras diuji terhadap putih.
- Radius kontrol 6 px, kartu 8 px, featured 10 px.
- Container 1200 px, gutter 24 desktop / 16 mobile.
- Skala spacing: 4/8/12/16/20/24/32/40/48/64.
- Poster 4:5, featured landscape 760:360. Aset final harus memiliki varian crop, bukan meregangkan satu gambar.
- H1 40/44 desktop dan 30/36 mobile; judul kartu 17/24 desktop dan 15/21 mobile.
- Motion hanya feedback ringan; konten utama tidak bergantung pada animasi reveal.
- Fokus keyboard biru 3 px dan label kontrol eksplisit. Target kontrol utama minimal 44 px; toolbar review terpisah dari produk.

Token terstruktur: [`discovery.tokens.json`](discovery.tokens.json). Implementasi prototipe memakai CSS module yang di-scope, sehingga penilaian desain tidak mengganti global theme seluruh aplikasi.

### Aturan EventCard

Urutan: poster → tanggal → judul maksimal dua baris → kota/venue → harga mulai. Hindari tombol beli yang berulang di seluruh kartu; detail menjadi jalur utama. Harga awal bukan total checkout; tampilkan “Mulai dari”. Rating, peminat, stok, diskon, serta ranking hanya ditambahkan jika ada sumber server yang valid.

### Kebijakan konten dan aset

- Poster SVG tipografis pada prototipe hanyalah concept art, bukan identitas final setiap acara.
- Tahap 4 menggantinya dengan poster berizin dan metadata sumber aset.
- Hindari mengganti event berbeda dengan foto panggung stok yang sama.
- Tanggal logika menggunakan timestamp terstruktur dan zona waktu. Patokan fixture studi 5 Nov 2026 ditulis eksplisit; produk memakai waktu server, bukan tanggal studi.
- Jam buka pintu/rundown/denah/alamat/kebijakan refund hanya tampil jika tersedia dari organizer.
- Brand mark/writing pada prototype adalah studi lockup; logo final perlu diputuskan dengan aset brand pemilik.

## 7. Handoff komponen tahap 4

| Komponen | Tanggung jawab | Dependensi |
| --- | --- | --- |
| DiscoveryHeader | Search, kota, navigasi, status akun | Sesi tahap 1, URL query |
| EventCard | Satu kontrak metadata tampilan | Adapter DTO event/fixture eksplisit |
| FeaturedEvent | Kurasi kampanye yang terjadwal | Asset landscape, masa tampil |
| EventFilters | Query/kota/kategori/tanggal/sort | Kontrak query katalog |
| ResultsState | Loading/empty/error/retry | Status request, cancellation |
| EventDetail | Informasi publik, anchor, metadata | Detail event dan kebijakan organizer |
| TicketSelector | Tier, jumlah, subtotal, limit | Inventori/harga server pada tahap 6 |
| MobileTicketBar | Shortcut ke selector, safe area | Harga awal event |
| HelpFooter | Bantuan pembelian dan kebijakan | Konten bantuan aktual |

Model tampilan kanonis minimal memerlukan ID, slug, judul, lineup, kategori, kota, venue, timestamp+timezone, poster, harga awal, status penjualan, organizer. Detail memerlukan tier dan kebijakan. Jangan memakai model fixture desain sebagai kontrak backend tanpa kesepakatan.

## 8. Kriteria keputusan review

Sebelum tahap 4, pemilik meninjau:

- Apakah palet netral dan aksen oranye ini cocok untuk ConcertGo?
- Apakah fokus awal musik cukup, atau kategori lain sudah mempunyai konten nyata?
- Apakah hierarki metadata dan grid 2 kolom mobile mudah dibaca?
- Apakah pola featured tunggal dan daftar acara dekat lebih berguna daripada carousel berulang?
- Poster dan logo resmi mana yang tersedia?

Hasil tahap 3 adalah rancangan yang siap ditinjau. Persetujuan pengguna tidak diasumsikan dari tersedianya prototipe.

## 9. Bukti rancangan dan pengukuran

- [Landing desktop](screenshots/proposal-landing-desktop.png) · [Landing mobile](screenshots/proposal-landing-mobile.png)
- [Katalog desktop](screenshots/proposal-catalog-desktop.png) · [Katalog mobile](screenshots/proposal-catalog-mobile.png)
- [Detail desktop](screenshots/proposal-detail-desktop.png) · [Detail mobile](screenshots/proposal-detail-mobile.png)
- [Metrik rancangan](screenshots/proposal-metrics.json)

Pada capture desktop/mobile, input pencarian rancangan berada sekitar y=146/y=190, dibanding y=1009/y=1749 pada landing saat ini. Ini membuktikan perubahan posisi/hierarki, bukan peningkatan conversion rate. Panjang halaman tidak dibandingkan sebagai benchmark performa karena jumlah event dan isi fixture berbeda.

Reproduksi capture dari root FE:

```bash
node scripts/capture-design-review.mjs
node scripts/capture-design-review.mjs --prototype
```

Screenshot adalah artefak review, bukan snapshot test yang harus dipertahankan piksel-per-piksel. Validasi perilaku dilakukan dengan browser test untuk URL, filter, modal, tier/jumlah, keyboard dasar, serta overflow lintas viewport.
