# Hasil tahap 1 dan rencana berikutnya

Tanggal: 5 November 2026.

Pembaruan: tahap 2 telah dikerjakan. Lihat [hasil tahap 2 dan rencana tahap 3–6](STAGE_2_RESULT_AND_NEXT_STEPS.md). Rencana di bawah mempertahankan catatan penutupan tahap 1.

## Baseline dan runtime backend

- FE tetap pada branch lokal `dev/auth`, basis `2518198` ditambah working tree tahap ini.
- BE dipindahkan ke branch tracking `dev/org-management`. Fetch dan pull fast-forward berhasil; HEAD `484b5b3` sama dengan remote saat diperiksa.
- Source BE tidak diubah. Proses BE port 8080 telah direstart dari branch sasaran.
- Uji nyata menemukan database lokal belum mempunyai kolom `avatar_url`. Migrasi bawaan BE berhasil dijalankan menggunakan environment proses `ENABLE_MIGRATION_DB=true`.
- SMTP runtime pengujian diarahkan ke Mailpit lokal port 1025 melalui environment proses. File `.env` tidak diubah. UI Mailpit: `http://localhost:8025`.
- FE: `http://localhost:3100`. Gunakan hostname yang sama untuk browser dan pengujian dev. Percobaan melalui `127.0.0.1` ditolak oleh pemeriksaan origin aset dev Next.js.

## Perubahan tahap 1

### API dan proxy

- Dukungan JSON dan FormData; browser menetapkan boundary multipart.
- Error terstruktur mempertahankan status HTTP, reqId, dan detail. Timeout dibedakan dari kegagalan koneksi.
- Proxy mengembalikan 504 untuk timeout dan 503 jika upstream tidak terjangkau.
- Route `/uploads/[...path]` mengambil gambar lokal dari root backend, bukan `/api/uploads`.
- Validasi bentuk token, refresh bersamaan memakai satu promise, dan refresh yang masih berjalan tidak boleh menghidupkan kembali sesi yang telah logout.

### Sesi dan akses

- State sesi: loading, authenticated, guest, unavailable.
- Gangguan backend sementara menyediakan retry dan mempertahankan kredensial. Sesi invalid membersihkan token dan identitas user/admin.
- Logout/pergantian refresh token antar-tab memicu sinkronisasi; access token lama pada tab tersebut dibuang.
- Respons sinkronisasi yang tertinggal tidak menimpa sesi baru.
- Guard UI pada area user, admin, staff, dan organizer. Otorisasi API tetap dilakukan backend.
- ADMIN/SUPER_ADMIN menuju dashboard admin; ORGANIZER menuju `/organizer`; USER menuju beranda user; STAFF menuju scanner; role tidak dikenal menuju halaman akses akun.
- Area consumer dapat dibuka semua role akun yang dikenal. Admin hanya role 1/2 dan staff hanya role 5.
- Organizer memiliki halaman tujuan tersendiri yang menjelaskan ketersediaan workspace, bukan akses admin.
- Login/OTP/callback menerapkan identitas sesi. Return path diperiksa agar sesuai origin internal dan role.
- Demo dimasuki eksplisit melalui `?preview=demo`, ditandai pada workspace, serta dapat diakhiri. Preview bukan pemberian role backend.

### OTP dan infrastruktur pengujian

- Pending password registrasi tidak lagi disimpan di sessionStorage; key peninggalan versi lama dibersihkan.
- Resend OTP menggunakan data di memori sesuai kontrak BE saat ini; setelah reload pengguna mengisi formulir kembali.
- Automatic fixture demo berlaku per test/context, termasuk worker yang digunakan ulang dan tab tambahan.
- Output `.next-production` dikecualikan dari lint; CommonJS diperbolehkan khusus test `.cjs`; variabel loader VM diperjelas.
- Default Playwright diselaraskan dengan aplikasi pada `http://localhost:3100`.

## Hasil verifikasi

| Pemeriksaan | Hasil |
| --- | --- |
| `npm run test:auth` | 13 lulus |
| `npm run test:demo` | 8 lulus |
| `npm run build` | Berhasil |
| `npx tsc --noEmit` | Berhasil |
| `npm run lint -- --quiet` | Tidak ada error; lint penuh mencatat 45 warning |
| Browser E2E | Run penuh: 22 lulus, 1 gagal karena init script fixture mengakses storage di about:blank. Setelah fixture diperbaiki, test sinkronisasi tab tersebut lulus pada rerun. Total 23 skenario telah lulus |
| `go test ./...` pada BE sasaran | Berhasil |
| Integrasi BE nyata | Registrasi, OTP Mailpit, login, profil, multipart avatar, baca gambar, penolakan akses admin untuk USER, refresh, logout, dan penolakan refresh token yang dicabut: lulus |

Uji nyata: `RUN_BACKEND_INTEGRATION=1 npm run test:integration` pada Bash. Pada PowerShell, tetapkan `$env:RUN_BACKEND_INTEGRATION="1"` sebelum menjalankan `npm run test:integration`. Tanpa opt-in, test dilewati. Test membuat akun buyer dengan email unik dan satu avatar di database/storage lokal.

### Batas hasil

- Google callback diuji dengan fixture; login Google interaktif perlu verifikasi kredensial dan redirect URI bersama pemilik BE.
- Expiry JWT masih dinonaktifkan di source BE sasaran. Expiry access token dan pencabutan access token seketika setelah suspend/logout belum dinyatakan lulus. Refresh revocation sudah diuji.
- UI profil, daftar user, dan undangan belum dimigrasikan dari lokal/demo. Uji multipart membuktikan transport dan endpoint, bukan penyelesaian UI profil.
- Scanner dan transaksi masih demo karena API operasional belum tersedia pada router yang diaudit.

## Tahap 2 — Profil dan administrasi tersimpan ke server

### 2A. Profil akun — prioritas implementasi pertama

1. Tambah service `PUT /users/me` untuk JSON dan multipart serta DTO detail user.
2. Jadikan nama, email, dan avatar server sumber identitas navbar, profil user, dan profil admin.
3. Migrasikan override lokal hanya untuk field identitas server; preferensi perangkat dipisahkan.
4. Hubungkan upload JPG/PNG/WebP maksimal 2 MB dengan preview, loading, dan error.
5. Tampilkan sukses setelah konfirmasi BE, kemudian verifikasi ulang melalui `/auth/me` dan sesi browser baru.
6. Field yang belum didukung BE tidak dipresentasikan sebagai data akun tersimpan. Penghapusan avatar menunggu kontrak BE.

**Selesai jika:** identitas konsisten pada navbar/profil, tetap benar setelah logout/login dan sesi baru, serta upload gagal tidak menghasilkan pesan sukses.

### 2B. Daftar dan detail user admin

- Hubungkan `GET /users` dan `GET /users/:id`.
- Pencarian, filter role/status, pagination menggunakan server; pageSize efektif maksimum 20.
- Baca `data: User[]` dan `pagination` tingkat atas.
- Tangani respons pencarian tertukar, loading, kosong, error, UUID invalid, dan akun tidak ditemukan.

**Selesai jika:** data dan halaman sesuai database; role selain ADMIN/SUPER_ADMIN ditolak oleh API dan UI.

### 2C. Edit nama/role/status

- Hubungkan `PUT /users/:id` dengan `{name, roleId}` dan `PATCH /users/:id/status` dengan `{status}`.
- Ikuti matriks actor-target BE, konfirmasi perubahan, cegah submit ganda, dan refetch setelah sukses.
- Alasan suspend tidak diklaim tersimpan karena belum diterima API.

**Selesai jika:** hasil terbukti melalui pembacaan server ulang dan tindakan terlarang ditolak backend.

### 2D. Undangan nyata

- Hubungkan kirim email, validasi token, dan aktivasi.
- Role pengundang berasal dari sesi, bukan pemilihan actor simulasi.
- SUPER_ADMIN mengundang ADMIN/ORGANIZER; ADMIN mengundang ORGANIZER; ORGANIZER mengundang STAFF.
- Tangani email duplikat, SMTP gagal, token invalid/kedaluwarsa, serta aktivasi ulang.
- Daftar/resend/cancel menunggu endpoint; respons kirim undangan tidak diasumsikan memiliki raw token.

**Selesai jika:** email diterima di Mailpit, akun aktif dengan role benar, dan token tidak dapat digunakan dua kali.

## Tahap 3 — Validasi desain discovery

- Benchmark marketplace tiket dan buat wireframe desktop/mobile untuk landing, katalog, detail.
- Tetapkan poster, grid, pencarian, metadata, filter, design tokens, dan copy ringkas.
- Utamakan acara/tanggal/lokasi/harga; hilangkan koleksi berulang serta klaim tanpa sumber.
- Setujui rancangan tiga halaman discovery sebelum implementasi UI luas.

**Selesai jika:** arah visual dan hierarki konten disepakati melalui contoh tampilan desktop/mobile.

## Tahap 4 — Implementasi discovery

- Shared header/footer, pencarian, EventCard, grid, dan seluruh state hasil.
- Landing: featured ringkas, koleksi dengan kriteria berbeda, serta jelajah kota.
- Katalog: filter/search di URL. Detail: URL publik yang dapat dibagikan.
- Satukan komponen tamu/user dan pertahankan deep link atau mapping route lama.
- Demo/API dipisahkan eksplisit; tidak ada fallback diam-diam ketika API gagal.

**Selesai jika:** navigasi valid, metadata terbaca di mobile, filter dapat dipulihkan dari URL, dan CTA memiliki tujuan benar. Integrasi event nyata bergantung pada API event.

## Tahap 5 — Konsistensi akun dan workspace

- Terapkan design tokens/komponen stabil pada auth, profil, pengaturan, tabel, dialog, dan feedback.
- Menu mengikuti role serta kemampuan server.
- Sederhanakan profil dan bedakan preferensi perangkat dari identitas akun.

**Selesai jika:** tidak ada field/tombol yang menjanjikan penyimpanan atau kemampuan yang belum disediakan sistem.

## Tahap 6 — Transaksi dan tiket nyata

- Sepakati kontrak event/inventori, reservasi, order, biaya, pembayaran, tiket, scanner.
- Harga/stok/expiry ditentukan server; retry checkout aman; status pembayaran diverifikasi backend.
- QR diterbitkan dan ditandai terpakai server, termasuk penolakan scan ulang/request paralel.
- Uji pembelian sampai gate lintas sesi/perangkat.

**Selesai jika:** seluruh perjalanan terbukti terhadap backend, bukan hanya localStorage.

Prioritas setelah peninjauan: **2A → 2B → 2C → 2D**. Tahap desain 3 dapat berjalan setelah kebutuhan/aset disepakati. Gap JWT/OAuth dibahas dengan pemilik BE agar verifikasi auth dapat ditutup sepenuhnya.
