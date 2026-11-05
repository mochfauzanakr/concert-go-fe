# Rencana perbaikan ConcertGo FE — dev/auth

**Koreksi scope terbaru:** [desain sebelumnya dipertahankan; perubahan visual dibatasi perapian kecil](UI_SCOPE_CORRECTION.md). Rencana redesign luas di bawah bukan persetujuan untuk mengganti tampilan produk.

Tanggal audit: 5 November 2026. Status: rencana implementasi berdasarkan audit source.

Pembaruan: fondasi tahap 1 telah diimplementasikan. Lihat [hasil tahap 1 dan rencana berikutnya](STAGE_1_RESULT_AND_NEXT_STEPS.md) untuk verifikasi, migrasi runtime BE, dan batas integrasi yang masih terbuka. Temuan di bawah mencatat kondisi awal sebelum implementasi.

Tahap 2 juga telah diimplementasikan: [profil, manajemen user, undangan, dan rencana tahap 3–6](STAGE_2_RESULT_AND_NEXT_STEPS.md).

Tahap 3 menghasilkan audit, tokens, screenshot, dan prototipe untuk review: [hasil tahap 3 dan rencana tahap 4–6](STAGE_3_RESULT_AND_NEXT_STEPS.md). Profil demo juga telah disamakan dengan formulir nyata.

## 1. Sasaran dan baseline

- Frontend sasaran: branch lokal `dev/auth`, commit `2518198`.
- Backend kontrak sasaran: `origin/dev/org-management`, commit `484b5b3` saat audit.
- Backend yang sebelumnya dijalankan masih berasal dari `dev/user-management` (`7a6989c`). Mengarahkan FE ke port 8080 saja belum membuktikan kompatibilitas dengan branch sasaran.
- FE lokal dan remote telah divergen. Tentukan baseline sebelum implementasi; jangan mencampur seluruh riwayat dengan pull otomatis. Pertahankan snapshot lokal dan dokumentasikan commit basis yang dipilih bersama tim.
- Hasil akhir: pengalaman mencari tiket yang meyakinkan, identitas akun bersumber dari server, dan fitur yang tersedia benar-benar memanggil kontrak backend yang sesuai.
- Audit ini memeriksa source FE lokal dan source branch remote BE. Belum merupakan pengujian browser visual atau verifikasi seluruh endpoint terhadap BE sasaran yang aktif.

## 2. Temuan yang mendasari prioritas

| Temuan | Bukti source | Dampak |
| --- | --- | --- |
| Daftar user admin masih demo | `app/(main)/admin/dashboard/users/page.tsx` memakai `components/demo/admin/users` | Data, filter, dan perubahan status belum mencerminkan database |
| Edit profil masih lokal | `lib/userProfile.ts`, `app/(main)/user/profile/page.tsx` | Pesan berhasil tidak berarti profil tersimpan ke server; override nama lokal dapat menimpa hasil sinkronisasi server |
| API manajemen user belum dibungkus FE | `services/user.service.ts` | Endpoint BE yang sudah tersedia belum dimanfaatkan |
| Upload belum didukung API client | `services/api-client.ts` selalu memasang JSON Content-Type | FormData akan salah diperlakukan jika langsung ditambahkan tanpa perbaikan client |
| Identitas avatar belum dipetakan | `types/user.types.ts`, `lib/userProfile.ts` | `avatarUrl` dari backend belum menjadi bagian kontrak identitas FE |
| Undangan di UI masih simulasi | `components/demo/admin/invitations.tsx` | Pilihan actor manual, salin token, resend, dan cancel tidak sama dengan kemampuan API nyata |
| Routing role terlalu umum | `lib/session.ts` mengirim semua role selain USER ke admin | Organizer dan staff masuk workspace yang tidak sesuai |
| Layout admin yang ditinjau belum melakukan pemeriksaan sesi/role | `app/(main)/admin/layout.tsx`, `admin/dashboard/layout.tsx` | Perlu audit seluruh akses langsung URL dan guard konsisten; otorisasi backend tetap penentu |
| Header landing memiliki target yang tidak cocok | `SiteHeader.tsx`: `sedang-tren`, `semua-konser`; landing: `populer`, `konser` | Klik navigasi dapat kembali ke atas alih-alih membuka bagian yang dimaksud |
| Tiga kelompok acara memakai kumpulan yang sama | `app/(main)/page.tsx` | Konten terasa berulang dan klaim rekomendasi/popularitas tidak punya sumber operasional |
| Konten promosi terlalu dominan | `components/home/HomeComponents.tsx` | Testimoni, kode promo, angka penjualan, dan jaminan statis mengaburkan katalog |
| Tanggal contoh hero telah lewat pada waktu audit | `components/home/HomeData.tsx` | Event lampau berisiko dipromosikan seolah masih bisa dibeli |
| Komponen discovery terduplikasi | `components/home/*`, `components/features/home/*` | Perubahan untuk tamu dan user mudah berbeda |
| API acara dan tiket belum ada di router BE sasaran | `services/event.service.ts`, `services/ticket.service.ts` dibanding route BE | Tidak bisa diselesaikan hanya dengan mengganti URL FE |
| Test kontrak saat ini memakai HTTP fixture | `tests/auth-contract.test.cjs` | Test hijau belum membuktikan integrasi nyata |
| Dokumen registrasi tidak cocok dengan implementasi | README menyebut memori; service menyimpan pending registration beserta password di sessionStorage | Perlu penyelarasan alur kirim ulang OTP, penyimpanan data, dan dokumentasi |

## 3. Peta kontrak API

Path berikut relatif terhadap `/api` backend. FE tetap menggunakan origin sendiri melalui proxy.

| Area | Endpoint BE tersedia | Rencana FE |
| --- | --- | --- |
| Registrasi | `POST /auth/register`, `POST /auth/verify-otp` | Verifikasi payload, OTP salah/kedaluwarsa, kirim ulang melalui kontrak yang tersedia, loading dan error |
| Login dan sesi | `POST /auth/login`, `GET /auth/me`, `POST /auth/refresh`, `POST /auth/logout` | Sinkronisasi identitas, refresh satu kali untuk request bersamaan, logout dan kegagalan sesi yang konsisten |
| Password | `POST /auth/forgot-password`, `POST /auth/reset-password`, `POST /auth/change-password` | Hubungkan UI aktif dan uji akun email/OAuth sesuai kemampuan BE |
| Google OAuth | `GET /auth/google/login`, `GET /auth/google/callback` | Samakan redirect URI, origin cookie state, callback FE dan format JSON BE |
| Role | `GET /roles` | Petakan role ID dengan hasil server, bukan label dropdown simulasi |
| Daftar user | `GET /users` | Query `page`, `pageSize`, `search`, `roleId`, `status`; pageSize maksimum efektif 20 |
| Detail user | `GET /users/:id` | Gunakan UUID asli, tampilkan provider/status/avatar dari server |
| Edit user admin | `PUT /users/:id` | Payload `{name, roleId}`; validasi izin sesuai actor dan target |
| Status user | `PATCH /users/:id/status` | Payload `{status: "ACTIVE" | "SUSPENDED"}`; dialog konfirmasi dan refresh data |
| Profil sendiri | `PUT /users/me` | Nama via JSON, nama dan avatar via multipart: field `name`, `avatar` |
| Undangan | `POST /users/invite`, `GET /users/validate-invite`, `POST /users/accept-invite` | Hubungkan alur kirim email dan aktivasi; jangan menganggap respons mengandung raw token |
| Aset lokal | `GET /uploads/...` di root BE | Sediakan resolusi/proxy aset terpisah dari prefix `/api`; dukung URL Cloudinary absolut |

Catatan kontrak penting:

- Respons daftar user adalah `data: User[]` dan `pagination` di tingkat atas, bukan `data.items` walaupun usecase internal memakai PageResponse.
- Model auth dan detail user berbeda; bedakan DTO sesi, daftar, dan detail. Field nullable/opsional harus dipetakan secara eksplisit.
- Upload mendukung JPG/JPEG/PNG/WebP maksimal 2 MB menurut storage BE. Penghapusan avatar belum tersedia pada kontrak yang ditinjau.
- API profil saat ini tidak menyimpan bio, nomor telepon, tanggal lahir, background, atau preferensi genre. UI harus membedakan preferensi perangkat dari data akun server.
- Tidak ditemukan endpoint daftar/resend/cancel undangan; tombol tersebut tidak boleh dipresentasikan sebagai operasi server yang sudah ada.
- Tidak ditemukan route organizer-management khusus meskipun nama branch `dev/org-management`. Jadikan source router sebagai acuan, bukan nama branch atau FSD.
- Endpoint event, order, pembayaran, tiket, scanner, wishlist, notifikasi, support, audit, laporan, dan sesi perangkat belum ditemukan di router yang ditinjau. Ini menjadi backlog dependensi BE.

## 4. Arah produk dan visual

### Prinsip

1. Acara dan informasi tiket menjadi konten utama. Pengguna harus cepat menjawab: acara apa, kapan, di mana, dan mulai berapa.
2. Identitas ConcertGo tetap dapat menggunakan aksen oranye, dengan permukaan netral dan kontras teks yang kuat. Palet final diuji pada wireframe, bukan langsung diganti di seluruh aplikasi.
3. Utamakan poster resmi/kurasi yang konsisten daripada foto panggung generik berulang.
4. Tipografi sans-serif yang mudah dibaca, skala ukuran terkendali, radius dan shadow secukupnya. Kurangi badge, emoji, gradasi, glow, dan animasi yang tidak membantu tugas pengguna.
5. Label status, urgensi, diskon, testimoni, jumlah peminat, dan klaim popularitas hanya tampil jika ada sumber yang jelas. Dalam preview, data contoh diberi konteks demo.
6. Pola navigasi dan metadata mengambil pelajaran dari marketplace tiket seperti LOKET, tiket.com To Do, dan Ticketmaster; lakukan benchmark visual terbaru sebelum desain final tanpa menyalin identitas mereka.

### Struktur landing yang diusulkan

```text
Header: logo | pencarian acara/artis | lokasi | Jelajah acara | Bantuan | Akun
Featured: satu banner utama berisi kampanye/acara yang relevan, bukan hero setinggi layar
Kategori: ringkas, hanya kategori yang punya konten
Acara pilihan: grid poster dan metadata; kurasi jelas
Dalam waktu dekat: koleksi dengan kriteria tanggal yang jelas
Jelajah berdasarkan kota: tautan ke katalog dengan filter URL
Informasi pembelian/bantuan singkat
Footer: bantuan, kebijakan, kontak, organizer jika alurnya tersedia
```

- Desktop: container sekitar 1200–1280 px; grid awal 4 kolom dengan metadata terbaca.
- Mobile: pencarian mudah dijangkau; grid 2 kolom bila keterbacaan cukup, 1 kolom jika diperlukan; filter dalam panel yang jelas; tidak mengandalkan hover.
- Kartu: poster rasio konsisten, judul maksimal dua baris, tanggal, kota/venue, harga mulai, status penjualan jika tersedia. Jangan menambah statistik yang tidak bersumber.
- Katalog menjadi halaman hasil tersendiri; kata kunci, kota, tanggal, kategori, dan urutan tersimpan di URL.
- Detail acara memiliki URL publik yang dapat dibagikan. Konten acara dapat dibaca tanpa login; autentikasi diminta saat memasuki tindakan yang memang memerlukannya.
- Setelah login, pertahankan tujuan detail/checkout yang dipilih, dengan validasi tujuan internal.
- State desain wajib: loading, data kosong, hasil tidak ditemukan, error server, gambar gagal, sesi habis, dan fitur belum tersedia.

## 5. Roadmap implementasi dan gerbang selesai

### Tahap 0 — Kunci baseline dan reproduksi masalah (P0)

Pekerjaan:
- Sepakati baseline FE lokal setelah membandingkan perubahan lokal/remote; rekam SHA dan snapshot cadangan sebelum sinkronisasi apa pun.
- Siapkan runtime BE dari `dev/org-management`, rekam SHA, database, Redis, SMTP/Mailpit, frontend URL, OAuth redirect, dan storage yang dipakai.
- Catat kegagalan per flow: halaman, role, langkah, endpoint, status HTTP, reqId, expected/actual. Jangan merekam password/token.
- Ambil screenshot desktop/mobile awal dan rekam error console/network untuk landing, auth, profil, dan user admin.

Selesai jika: hasil uji merujuk pasangan SHA FE/BE yang pasti; setiap blocker punya reproduksi, pemilik FE/BE/config, dan prioritas.

### Tahap 1 — Stabilkan client API, sesi, dan akses (P0)

Pekerjaan:
- API client mendukung JSON dan FormData; browser menetapkan multipart boundary.
- Pertahankan status HTTP, pesan validasi, serta reqId pada error terstruktur. Bedakan 400/401/403/404/409/429 dan kegagalan koneksi.
- Jangan mengubah semua kegagalan proxy menjadi diagnosis tunggal; bedakan timeout dan upstream tidak terjangkau.
- Tangani 401 final dan refresh invalid dengan membersihkan token sekaligus identitas UI; koneksi putus tidak boleh dianggap logout otomatis.
- Definisikan state sesi loading/authenticated/guest/unavailable agar tidak muncul kedipan identitas atau akses yang keliru.
- Susun matriks role dan guard halaman/tombol; USER, ADMIN, SUPER_ADMIN, ORGANIZER, STAFF memiliki tujuan yang sesuai kemampuan nyata. Organizer tidak otomatis mendapat panel admin; staff diarahkan ke area tugasnya dengan konteks demo bila scanner belum terhubung.
- Audit login, OTP, recovery, change-password, Google callback, dan deep link setelah login.
- Hilangkan ketergantungan penyimpanan password pending registration di sessionStorage. Pertahankan alur memori yang jujur saat reload, atau sepakati endpoint resend OTP dengan BE.

Selesai jika: request paralel tidak memicu refresh berulang; error izin tidak menyamar sebagai error koneksi; direct URL ditangani; logout membersihkan UI; flow auth lulus terhadap runtime sasaran.

Dependensi BE yang perlu ditangani: validasi expiry JWT pada branch sasaran sedang dinonaktifkan. Uji expiry nyata baru dapat dinyatakan lulus setelah perilaku BE disepakati/diperbaiki. Audit juga akses token setelah suspend/logout; revoke refresh token saja belum membuktikan access token langsung tidak berlaku.

### Tahap 2 — Integrasi profil, user admin, dan undangan (P1)

Urutan fitur:
1. Profil: baca identitas server, simpan nama, upload avatar, perbarui navbar/profil setelah sukses, verifikasi setelah reload/login ulang.
2. Daftar/detail user: pencarian debounce, filter server, pagination, cancel/abaikan respons lama, UUID, loading/empty/error.
3. Edit nama/role dan status: kemampuan sesuai actor-target, konfirmasi, disable submit ganda, error server, refetch setelah sukses.
4. Undangan: role dari sesi, kirim email nyata, validasi token, aktivasi sekali pakai dan penanganan token invalid/kedaluwarsa.

Aturan penting:
- Hapus override lokal untuk field identitas yang sudah dimiliki server melalui migrasi state yang terbatas; pertahankan preferensi perangkat secara terpisah.
- SUPER_ADMIN mengundang ADMIN/ORGANIZER; ADMIN mengundang ORGANIZER; ORGANIZER mengundang STAFF, mengikuti usecase BE.
- ADMIN tidak mengubah ADMIN/SUPER_ADMIN atau memberikan role ADMIN/SUPER_ADMIN. Status diri sendiri dan SUPER_ADMIN tidak dapat diubah melalui flow status.
- Jangan mengklaim alasan suspend tersimpan jika payload hanya menerima status.
- Jangan menampilkan sukses persisten sebelum server mengonfirmasi. Saat gagal, formulir mempertahankan input yang aman.

Selesai jika: perubahan terbukti pada pembacaan server ulang dan sesi browser baru; data akun tidak tercampur; email undangan diterima di Mailpit; izin negatif diverifikasi oleh BE.

### Tahap 3 — Validasi desain sebelum implementasi luas (P1)

Pekerjaan:
- Benchmark 2–3 situs tiket: header, pencarian, rasio poster, metadata, filter, detail, CTA mobile.
- Buat wireframe desktop/mobile untuk landing, katalog, detail, auth, profil, dan user management; fokus awal persetujuan pada tiga halaman discovery.
- Tetapkan design tokens warna, font, spacing, radius, border, fokus, serta state input/button.
- Siapkan poster, copy ringkas, aturan tanggal dan sumber kurasi.
- Setujui screenshot rancangan serta checklist perilaku sebelum merombak halaman penuh.

Selesai jika: arah visual dan hierarki konten disepakati; pengguna dapat mengenali event, tanggal, lokasi, dan harga tanpa membuka modal; tidak ada klaim marketing tanpa sumber.

Tahap ini dapat dikerjakan bersamaan dengan tahap 1–2 setelah baseline terkunci.

### Tahap 4 — Bangun ulang discovery secara bertahap (P1)

Urutan:
1. Shared header/footer dan komponen pencarian.
2. EventCard tunggal, grid, filter, dan state hasil.
3. Landing dengan koleksi berbeda yang kriterianya jelas; hapus pengulangan baris dan section promosi dekoratif yang tidak berfungsi.
4. Katalog dengan state URL dan detail publik; pertahankan deep link lama melalui mapping/redirect jika route berubah.
5. Samakan komponen discovery tamu/user; pecah bagian server-renderable dan interaksi client sesuai panduan Next.js terpasang.

Aturan data:
- Pisahkan sumber `demo` dan `api` secara eksplisit; jangan fallback diam-diam dari error API ke data demo.
- Gunakan tipe event kanonis dan adapter DTO. Jadwal memakai timestamp terstruktur serta zona waktu, bukan parsing label tanggal untuk logika utama.
- Jika API event belum tersedia, desain dapat divalidasi dengan fixture berlabel. Kriteria integrasi katalog tetap berstatus terblokir, bukan dinyatakan selesai.
- Jangan menampilkan CTA transaksi nyata pada event yang hanya contoh atau telah lewat masa penjualannya.

Selesai jika: navigasi tidak buntu, semua link section valid, pencarian/filter dapat dipulihkan dari URL, tampilan mobile terbaca, detail dapat dibagikan, dan tidak ada duplikasi implementasi discovery utama.

### Tahap 5 — Konsistensi akun dan workspace (P2)

- Terapkan token/komponen yang telah stabil ke auth, profil, pengaturan, tabel admin, dialog, dan feedback.
- Sederhanakan profil agar bukan halaman jejaring sosial: identitas, foto, password, dan preferensi yang benar-benar didukung.
- Menu hanya menunjukkan tindakan yang relevan untuk role dan kemampuan sumber data.
- Pisahkan preview demo dari workspace akun nyata, termasuk indikator, data, dan navigasinya.

Selesai jika: field/tombol memiliki perilaku yang sesuai label; feedback dan interaksi konsisten; tidak ada simulasi actor di workspace nyata.

### Tahap 6 — Integrasi transaksi setelah kontrak BE tersedia (P2, bergantung BE)

Sepakati kontrak event/inventori, order, reservasi, biaya, pembayaran, status, tiket, dan scanner sebelum mengganti implementasi demo.

- Harga akhir, stok, kapasitas, expiry reservasi, dan status pembayaran ditetapkan server.
- Checkout mendukung retry aman/idempotensi; perubahan status pembayaran bersumber dari verifikasi BE/provider.
- QR tiket diterbitkan dan divalidasi server; scan ulang dan request paralel diuji agar satu tiket tidak dapat dipakai dua kali.
- Sinkronisasi pembatalan event/refund mengikuti aturan yang disepakati, bukan janji copy marketing.

Selesai jika: perjalanan katalog → detail → checkout → pembayaran → tiket → scan terbukti lintas sesi/perangkat terhadap server. Browser localStorage bukan bukti transaksi.

## 6. Strategi pengujian dan kualitas

### Integrasi prioritas

- Login valid/invalid, refresh paralel, sesi tidak valid, logout, restart browser, dan account switching.
- OTP benar/salah/kedaluwarsa, recovery, Google state/callback, dan change-password sesuai provider akun.
- Profil JSON/multipart, nama invalid, avatar >2 MB/format ditolak, URL upload lokal dan Cloudinary, data setelah reload.
- Daftar user dengan pagination/filter, respons kosong, pencarian cepat yang memicu respons tertukar.
- Role: SUPER_ADMIN, ADMIN, USER, ORGANIZER, STAFF; cek tindakan positif dan negatif termasuk direct API.
- Invite duplicate/invalid/expired/accepted, email SMTP gagal, dan aktivasi kedua.
- Gangguan koneksi, timeout, upstream non-JSON, 403, 404, 409, 429, dan 500: pesan spesifik serta recovery yang jelas.

### UI dan performa

- Viewport 360, 390, 768, 1024, dan 1440 px; keyboard, focus trap/return pada dialog, Escape, label form, pembaca layar dasar, reduced motion.
- Tidak ada horizontal overflow halaman, gambar terdistorsi, CTA tertutup, atau error console pada flow utama.
- Poster berdimensi eksplisit, lazy loading di bawah fold, prioritas hanya untuk aset utama; hindari seluruh landing menjadi client component tanpa kebutuhan.
- Target setelah tersedia data pengukuran: LCP <=2,5 dtk, CLS <=0,1, INP <=200 ms pada persentil 75 data pengguna nyata. Gunakan pengukuran lab sebagai proxy awal dan laporkan kondisi pengujian; jangan menyatakan target field tercapai dari satu Lighthouse run.

### Pemeriksaan sebelum penutupan pekerjaan

```text
npm run lint
npm run test:auth
npm run test:demo
npm run build
DEMO_BASE_URL=http://localhost:3100 npm run test:e2e
```

Sintaks variabel environment disesuaikan shell. Pisahkan suite E2E demo dari suite integrasi BE nyata; beri label hasil masing-masing. Test baru dipilih untuk risiko nyata seperti multipart, role, sesi, dan persistensi, bukan sekadar memeriksa ulang markup implementasi.

## 7. Paket pekerjaan dan dependensi

| ID | Paket | Prioritas | Dependensi | Bukti selesai |
| --- | --- | --- | --- | --- |
| BASE-01 | Baseline branch dan runtime BE sasaran | P0 | Keputusan basis FE | SHA, konfigurasi non-rahasia, reproduksi |
| API-01 | Error terstruktur, JSON/FormData, proxy aset | P0 | BASE-01 | Kontrak dan uji multipart/error |
| AUTH-01 | Lifecycle sesi, routing role, OAuth/OTP | P0 | API-01 | Flow nyata dan izin negatif |
| ACCOUNT-01 | Profil server dan avatar | P1 | AUTH-01 | Read-after-write dan sesi baru |
| USERS-01 | List/detail/filter/pagination user | P1 | API-01, AUTH-01 | Query dan hasil server |
| USERS-02 | Edit role/nama/status | P1 | USERS-01 | Matriks actor-target dan refetch |
| INVITE-01 | Kirim email dan aktivasi nyata | P1 | AUTH-01 | Mailpit dan token sekali pakai |
| UX-01 | Benchmark, wireframe, design tokens | P1 | BASE-01 | Rancangan desktop/mobile disepakati |
| DISCOVERY-01 | Header, card, landing, katalog/detail | P1 | UX-01 | Screenshot dan flow pencarian |
| CONSISTENCY-01 | Akun/admin mengikuti design system | P2 | ACCOUNT-01, UX-01 | State dan komponen konsisten |
| COMMERCE-01 | Order/payment/tiket/scanner nyata | P2 | Kontrak dan API BE baru | E2E lintas sesi terhadap server |

Discovery visual dapat berjalan dengan fixture eksplisit sementara integrasi event menunggu BE. Utamakan perbaikan sesi dan profil sebagai vertical slice pertama untuk membuktikan pondasi integrasi sebelum memperluas workspace.

## 8. Cara pelaksanaan dan keputusan yang perlu dikunci

- Implementasi dibagi per fitur yang dapat ditinjau, sesuai CONTRIBUTING.md. Kelompok perubahan UI dan integrasi memiliki kriteria lulus masing-masing; commit/push dilakukan ketika diminta.
- Setiap paket menyertakan daftar file, migrasi state/route bila ada, cara verifikasi, screenshot untuk perubahan visual, serta dependensi BE yang belum selesai.
- Review milestone: baseline → auth/profil nyata → manajemen user/undangan → rancangan discovery → discovery terimplementasi → konsistensi dan regresi.
- Jangan memakai merge besar untuk mengatasi divergensi FE sekaligus redesign. Selesaikan keputusan basis terlebih dahulu agar hasil audit dan perubahan dapat ditelusuri.

Keputusan awal:
1. Gunakan FE lokal `2518198` sebagai kandidat basis sesuai permintaan dev/auth sementara; konfirmasikan sebelum sinkronisasi riwayat remote.
2. Gunakan BE `dev/org-management` sebagai target kontrak; identifikasi pemilik untuk gap JWT, resend OTP, dan API commerce.
3. Prioritaskan integrasi nyata auth/profil/user/invite, dengan redesign discovery berjalan setelah wireframe disepakati.
4. Konfirmasi aset brand/poster yang dapat digunakan dan cakupan awal: fokus musik/konser atau multi-kategori. Hindari kategori kosong demi terlihat lengkap.

Rencana dianggap berhasil ketika tampilan tiket lebih cepat dipahami, data akun/administrasi terbukti berasal dari BE sasaran, dan batas fitur yang belum memiliki API terlihat jelas tanpa sukses simulasi yang membingungkan.
