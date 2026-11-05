# Frontend ConcertGo — dev/auth

## Scope aktif

Tampilan landing, beranda, katalog, detail acara, dan footer dipertahankan sesuai arahan pengguna. Profil demo dan akun nyata menggunakan formulir bersama. Tidak ada program membership atau poin loyalitas.

## Integrasi backend yang tersedia

- Login email, registrasi/OTP, pemulihan dan perubahan kata sandi.
- Callback Google dengan hasil login/identitas yang terlihat oleh pengguna. Redirect Google harus menuju origin FE yang sesuai dengan konfigurasi BE dan Google Console.
- Access token diperbarui sebelum expiry, saat request memerlukan pembaruan, dan melalui timer pada tab aktif. Web Locks mengoordinasikan rotasi antar-tab jika didukung browser.
- Profil nama/avatar menggunakan API, dengan pembacaan ulang server setelah penyimpanan.
- Daftar/detail user, perubahan nama/role/status, dan undangan sesuai izin backend.
- Transport API mendukung JSON/multipart dan aset avatar lokal.

Backend sasaran adalah `concert-go` branch `dev/org-management`. Source backend tidak disertakan dalam perubahan frontend ini. Google OAuth nyata tetap membutuhkan kredensial serta redirect URI yang benar dari pemilik backend.

## Fitur yang tetap demo lokal

Acara, reservasi, pesanan, simulasi pembayaran, e-ticket, scanner, notifikasi, perangkat, bantuan, dan audit tetap memakai browser-local fixtures. Tidak ada API konser/tiket/pembayaran baru yang ditambahkan. Simulasi tidak melakukan transaksi uang atau membatasi akun backend.

Preview dimasuki eksplisit melalui tombol demo atau `?preview=demo`. Error backend tidak dialihkan diam-diam menjadi data demo. Reset data operasional tersedia pada dashboard demo.

## Halaman

| Fitur | Route |
| --- | --- |
| Landing | `/` |
| Beranda akun | `/user/homepage` |
| Profil | `/user/profile`, `/admin/dashboard/profile` |
| Pengguna/undangan | `/admin/dashboard/users`, `/admin/dashboard/invitations`, `/invite-user` |
| Aktivasi | `/accept-invite?token=...` |
| Katalog/detail contoh | `/user/events`, `/user/events/[id]` |
| Pesanan/tiket demo | `/user/orders`, `/user/tickets` |
| Scanner demo | `/staff/scanner` |
| Studi desain terpisah | `/design/discovery` |

## Pemeriksaan

```text
npm run test:auth
npm run test:demo
npm run lint
npm run build
npm run test:e2e
```

FE default `http://localhost:3100`. Test kontrak memakai fixture HTTP; suite integrasi nyata memerlukan opt-in dan layanan lokal. Detail hasil tahap sebelumnya tersedia di dokumen `STAGE_*`; [koreksi scope tampilan](UI_SCOPE_CORRECTION.md) mengesampingkan rencana redesign luas.

## Riwayat

Commit tambahan dikelompokkan berdasarkan perubahan yang benar-benar tersedia, dengan label demo untuk simulasi. Seluruh commit remote lama dan SHA kolaborator dipertahankan. Lihat `git log --oneline 367e55c..dev/auth` untuk kelompok perbaikan baru.

Aturan kontribusi: [CONTRIBUTING.md](../CONTRIBUTING.md). Ringkasan rewrite: [HISTORY_REWRITE.md](HISTORY_REWRITE.md).
