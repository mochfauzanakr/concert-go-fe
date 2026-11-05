# Hasil tahap 2 dan rencana tahap berikutnya

Tanggal: 5 November 2026.

Pembaruan: [tahap 3 sudah menghasilkan rancangan untuk review](STAGE_3_RESULT_AND_NEXT_STEPS.md). Profil demo juga kini menggunakan komponen formulir yang sama dengan versi nyata; catatan pemisahan implementasi di bawah merekam kondisi saat tahap 2 ditutup.

## Ringkasan pelaksanaan

Frontend dikerjakan pada branch lokal `dev/auth`. Integrasi menggunakan backend `dev/org-management` commit `484b5b3` yang aktif di port 8080. Source backend tidak diubah pada tahap ini. FE tetap di `http://localhost:3100`.

### 2A — Profil akun dan avatar

- Profil user dan admin memakai komponen `components/account/ProfileForm.tsx` yang menyimpan melalui `PUT /users/me`.
- Nama dapat disimpan dengan JSON; nama dan avatar menggunakan multipart. Foto JPG/JPEG/PNG/WebP dibatasi maksimal 2 MB sebelum pengiriman.
- Tersedia preview file, pembatalan pilihan foto baru, status penyimpanan, serta error yang mempertahankan input.
- Setelah penyimpanan, FE membaca kembali `/auth/me` sebelum menampilkan sukses terverifikasi. Jika penyimpanan diterima tetapi pembacaan ulang gagal, pesan menjelaskan kondisi tersebut.
- Nama, email, dan avatar server dipakai untuk identitas user/admin. Override identitas lama dibersihkan untuk akun yang disinkronkan, sedangkan preferensi lokal seperti kota tetap dipertahankan terpisah.
- Navbar tidak lagi membuat override profil dari request sinkronisasi terpisah.
- Pengaturan akun user nyata menggunakan halaman password yang memanggil API. Form lokal untuk bio/kota tidak lagi ditampilkan sebagai editor akun server.
- Penghapusan avatar dan field profil lain menunggu dukungan API; tidak ditampilkan sebagai aksi yang sudah tersimpan ke server.

**Verifikasi nyata:** nama dan avatar diubah melalui UI, logout, login kembali, lalu dibuka dari browser context baru. Nilai server tetap sama.

### 2B — Daftar dan detail user admin

- Halaman `/admin/dashboard/users` memakai `GET /users` dan detail `GET /users/:id` saat menggunakan sesi nyata.
- Pencarian debounce, filter role/status, pageSize 10/20, serta pagination diteruskan ke server.
- Respons dibaca sebagai `data: User[]` dengan `pagination` di tingkat atas.
- Request lama dibatalkan/diabaikan agar hasil pencarian sebelumnya tidak menimpa hasil terbaru.
- Tersedia loading, data kosong, error dengan retry, detail akun, UUID, provider, status, dan tanggal pendaftaran.
- Halaman `/admin/dashboard/users/promoters` menampilkan akun role ORGANIZER dari server; tidak lagi mengklaim statistik event atau verifikasi promotor dari data dummy pada sesi nyata.

### 2C — Edit dan perubahan status

- Nama/role dikirim melalui `PUT /users/:id` dengan `{name, roleId}`.
- Status dikirim melalui `PATCH /users/:id/status` dengan `{status}`.
- Setiap mutasi membutuhkan konfirmasi, mencegah submit ganda, dan memuat ulang data server setelah berhasil.
- ADMIN tidak dapat mengedit ADMIN/SUPER_ADMIN atau memberikan role ADMIN/SUPER_ADMIN. Role akun sendiri tidak dapat diubah melalui editor; status diri sendiri dan SUPER_ADMIN dibatasi sesuai BE.
- Error mutasi mempertahankan input dan menyediakan kesempatan mencoba lagi.
- Form tidak mengklaim penyimpanan alasan suspend karena API tidak menerima field tersebut.

**Verifikasi nyata:** admin mengubah nama/role akun uji, suspend menolak login akun tersebut, aktivasi memungkinkan login kembali, dan pembacaan daftar server membuktikan hasil akhirnya. Penolakan edit root, assignment ADMIN oleh ADMIN, serta perubahan status diri sendiri juga diuji langsung terhadap BE.

### 2D — Undangan dan aktivasi nyata

- Halaman undangan admin dan `/invite-user` memakai `POST /users/invite` pada sesi nyata.
- Pengundang berasal dari sesi. SUPER_ADMIN dapat mengundang ADMIN/ORGANIZER, ADMIN mengundang ORGANIZER, dan ORGANIZER mengundang STAFF.
- Organizer mempunyai tautan menuju undangan staff di halaman workspace awalnya.
- FE menampilkan email/role/expiry dari respons server setelah pengiriman berhasil; tidak membuat atau menampilkan raw token sendiri.
- Validasi/aktivasi menggunakan endpoint BE. Tautan tanpa token, token invalid/kedaluwarsa, dan token yang sudah diterima ditangani.
- Daftar riwayat, resend, dan cancel belum disediakan backend, sehingga tidak ditampilkan sebagai operasi akun nyata.

**Verifikasi nyata:** undangan organizer dikirim melalui UI admin, tautan diambil dari email Mailpit, dan aktivasi dilakukan melalui UI tamu. Organizer kemudian mengundang STAFF melalui UI. Role akun hasil aktivasi diperiksa melalui login nyata; token yang telah digunakan ditolak saat divalidasi ulang.

## Pemisahan demo dan API

Implementasi lama untuk profil/pengaturan/promotor dipertahankan di `components/demo/` dan hanya dipakai pada preview eksplisit. Halaman admin user/undangan juga memilih sumber berdasarkan mode sesi. Error API tidak mengalihkan pengguna ke data demo.

Flow operasional lain seperti katalog, transaksi, tiket, scanner, dan dashboard metrik masih mengikuti status demo yang sudah terdokumentasi. Tahap ini mengintegrasikan identitas serta administrasi akun, bukan menyatakan seluruh workspace telah mempunyai API nyata.

## Verifikasi dan pemeriksaan

| Pemeriksaan | Hasil |
| --- | --- |
| `npm run test:auth` | 15 test lulus, termasuk kontrak user management dan matriks izin |
| `npm run test:demo` | 8 test lulus |
| `npm run build` | Berhasil |
| `npx tsc --noEmit` | Berhasil setelah regenerasi file tipe otomatis Next.js yang sempat rusak |
| `npm run lint -- --quiet` | Tidak ada error |
| `npm run test:e2e` | 31 dari 32 lulus pada run penuh; navigasi awal purchase journey timeout saat uji integrasi nyata berjalan bersamaan. Purchase journey lulus pada rerun tersendiri. Seluruh 32 skenario telah lulus, termasuk 9 skenario API UI tahap 2 |
| Uji UI + BE nyata tahap 2 | Lulus: profil lintas sesi, edit/role/status, undangan email, aktivasi organizer/staff/admin, dan pembatasan izin |

Uji integrasi lokal dapat dijalankan melalui Bash:

```bash
RUN_STAGE2_INTEGRATION=1 node --test tests/integration/stage2-account.test.cjs
```

Prasyarat: FE/BE aktif, SMTP BE diarahkan ke Mailpit lokal, Chromium Playwright terpasang, dan container PostgreSQL dev tersedia. Test sengaja opt-in karena membuat akun uji dan avatar di database/storage lokal. Akun actor uji dipromosikan sementara melalui PostgreSQL container untuk menyediakan sesi SUPER_ADMIN. Pada cleanup, akun uji SUPER_ADMIN/ADMIN diturunkan ke USER dan refresh token uji dicabut. Test tidak mengambil kredensial akun milik pengguna.

Variabel opsional: `INTEGRATION_BASE_URL`, `MAILPIT_URL`, dan `INTEGRATION_POSTGRES_CONTAINER`. Provisioning dibatasi pada URL FE localhost/127.0.0.1. Data akun/avatar/email uji tetap ada agar dapat diperiksa; source BE dan `.env` tidak diubah.

## Hal yang masih memerlukan koordinasi backend

1. Expiry access token masih dinonaktifkan pada source BE sasaran. Pencabutan akses langsung setelah suspend/logout perlu ditutup bersama pemilik BE; tahap ini membuktikan penolakan login akun suspended, bukan pencabutan seluruh access token yang telah terbit.
2. Login Google interaktif perlu pemeriksaan kredensial/redirect URI pemilik backend.
3. API delete avatar, field profil tambahan, daftar/resend/cancel undangan belum tersedia.
4. API event, inventori, order, pembayaran, tiket, dan scanner masih menjadi dependensi tahap commerce.

## Tahap 3 — Rancangan visual dan UX discovery

**Tujuan:** menghasilkan rancangan website penjualan tiket yang jelas, kredibel, serta mempunyai hierarki informasi yang disepakati sebelum implementasi luas.

Urutan pekerjaan:
1. Audit visual halaman yang berjalan pada desktop/mobile; inventarisasi komponen, duplikasi, serta titik navigasi yang membingungkan.
2. Benchmark 2–3 marketplace tiket untuk pola pencarian, kategori, poster, metadata, filter, detail, dan CTA mobile.
3. Susun arsitektur informasi: landing → katalog → detail → pemilihan tiket; pertahankan konteks acara saat pengguna login.
4. Buat wireframe desktop/mobile untuk tiga halaman discovery.
5. Tetapkan design tokens: tipografi, warna netral/aksen, spacing, radius, border, fokus, button/input serta state loading/error/empty.
6. Siapkan aset poster dan copy ringkas. Koleksi populer, diskon, testimoni, dan urgensi hanya tampil bila ada sumber yang jelas.

**Hasil untuk ditinjau:** wireframe landing/katalog/detail, arah visual, contoh EventCard, struktur navigasi, serta daftar komponen yang akan diganti/digabungkan.

**Kriteria selesai:** pengguna dapat mengenali acara, tanggal, kota/venue, dan harga dengan cepat. Desktop/mobile memakai pola yang konsisten dan CTA mempunyai tujuan jelas.

## Tahap 4 — Implementasi landing, katalog, dan detail acara

- Bangun shared header/footer, pencarian, EventCard, grid, filter, serta seluruh state hasil berdasarkan rancangan tahap 3.
- Landing memakai featured banner ringkas, koleksi dengan kriteria berbeda, kategori relevan, jelajah kota, dan bantuan pembelian.
- Filter/search/sort katalog disimpan di URL. Detail acara mempunyai URL publik yang dapat dibagikan.
- Satukan komponen discovery tamu/user dan perbaiki target navigasi/deep link lama.
- Data contoh tetap diberi konteks; tidak ada fallback diam-diam dari error API ke demo. Acara lampau tidak dipromosikan sebagai tiket yang masih dapat dibeli.
- Optimalkan gambar, batas komponen client/server, keyboard, reduced motion, dan keterbacaan mobile.

**Kriteria selesai:** navigasi dan pencarian tidak buntu, filter pulih saat reload, informasi utama terbaca di mobile, serta detail/CTA sesuai kondisi penjualan. Integrasi katalog nyata mengikuti ketersediaan API event.

## Tahap 5 — Konsistensi akun dan workspace

- Terapkan design system yang sudah disepakati pada auth, profil, pengaturan, tabel admin, modal, feedback, dan navigasi.
- Rapikan menu sesuai role/kemampuan API; bedakan metrik/operasi demo dari data server.
- Samakan loading, empty, error, konfirmasi mutasi, dan akses keyboard.
- Tinjau seluruh link dan tombol agar labelnya sesuai perilaku nyata.

**Kriteria selesai:** pengguna tidak bingung membedakan data akun, preferensi perangkat, dan simulasi. Tidak ada pesan sukses yang melampaui operasi yang benar-benar berhasil.

## Tahap 6 — Transaksi dan tiket dengan backend nyata

- Sepakati kontrak event/inventori, reservasi, order, biaya, pembayaran, tiket, dan gate scanning bersama pemilik BE.
- Server menentukan harga akhir, stok, expiry, status pembayaran, serta validitas tiket.
- Checkout memiliki retry/idempotensi; pembayaran diverifikasi backend/provider.
- QR diterbitkan/ditandai terpakai oleh server, termasuk penolakan scan ulang dan kondisi request paralel.
- Uji lengkap katalog → detail → checkout → pembayaran → e-ticket → gate lintas sesi/perangkat.

**Kriteria selesai:** alur pembelian dan penggunaan tiket terbukti pada server, bukan browser localStorage. Pembatalan/refund mengikuti aturan yang telah disepakati.

Prioritas berikutnya: **tahap 3, mulai dari audit visual dan wireframe landing/katalog/detail**, sambil mengoordinasikan gap backend agar tahap commerce tidak terhambat di akhir.
