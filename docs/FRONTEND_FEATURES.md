# Perubahan frontend ConcertGo

Branch: `dev/auth` pada repository `concert-go-fe`. Backend tidak diubah.

## Batasan integrasi

Login, registrasi/OTP, pemulihan sandi, sesi, dan token undangan non-demo memakai API
backend yang sudah tersedia melalui proxy frontend. Koneksi ke backend nyata bergantung
pada alamat server dan konfigurasi pemilik backend. Pengujian kontrak memakai HTTP fixture.

Fitur operasional baru memakai data demo lokal: akun, undangan demo, acara, pesanan,
pembayaran, e-ticket, scanner, notifikasi, percakapan, perangkat, dan audit. Tidak ada
transaksi uang, pengiriman email, atau perubahan akun backend dari fitur demo. Data
tersimpan per origin browser dan tersinkron antar-tab. Reset tersedia di dashboard admin.

## Susunan commit

Empat commit tanggal 6-10 Oktober disusun ulang dari basis `836c76b`.
Konten pekerjaan lama dipertahankan bersama perubahan FE terbaru; commit lama tidak
lagi menjadi bagian dari riwayat `dev/auth`. Cadangan tersedia secara lokal saja.
Infrastruktur bersama diletakkan sebelum fitur yang memakainya. Daftar dan detail
pesanan mempunyai commit berbeda. Operasi data dan tampilan baru dipisahkan dalam
`lib/demo/actions/` serta `components/demo/admin/`, `user/`, dan `support/`.

| Urutan | Commit |
| --- | --- |
| 1 | chore(frontend-runtime): isolate build output and configure preview tests |
| 2 | feat(i18n): persist Indonesian and English interface preferences |
| 3 | feat(api-proxy): forward frontend requests to the existing backend |
| 4 | feat(auth-session): synchronize authenticated profiles and refresh tokens |
| 5 | feat(demo-state): persist isolated browser fixtures for frontend previews |
| 6 | feat(app-shell): unify accessible themed navigation and shared surfaces |
| 7 | feat(sign-in): connect email login with role-aware session navigation |
| 8 | feat(registration): add account signup and OTP email verification |
| 9 | feat(password-recovery): verify OTP before resetting account passwords |
| 10 | feat(google-login): complete OAuth callbacks through the shared session |
| 11 | feat(landing): compose concert discovery with reusable visual sections |
| 12 | feat(admin-navigation): provide responsive sidebar and workspace search |
| 13 | feat(user-profile): edit account avatars and profile backgrounds |
| 14 | feat(user-settings): manage theme language and password preferences |
| 15 | feat(user-wishlist): persist favorite events across visits |
| 16 | feat(user-feedback): retain the dedicated feedback page |
| 17 | feat(admin-profile): persist editable administrator contact details |
| 18 | feat(admin-settings): manage account preferences and password changes |
| 19 | feat(admin-users): filter accounts and confirm suspension changes |
| 20 | feat(admin-invitations): add role-aware invites and one-time activation |
| 21 | feat(event-catalog): filter concerts with responsive discovery cards |
| 22 | feat(event-details): show lineup schedules venues and ticket availability |
| 23 | feat(event-approval): review submissions before publishing concerts |
| 24 | feat(admin-events): edit schedules and notify event cancellations |
| 25 | feat(event-categories): preserve category management in the admin workspace |
| 26 | feat(checkout): reserve ticket quantities with transparent order totals |
| 27 | feat(order-list): filter purchases by payment and reservation status |
| 28 | feat(order-details): simulate payment expiry and order cancellation |
| 29 | feat(e-tickets): render downloadable QR tickets and entry status |
| 30 | feat(admin-transactions): inspect purchases and individual payment details |
| 31 | feat(admin-payouts): retain the dedicated payout management view |
| 32 | feat(admin-reports): retain the finance reporting workspace |
| 33 | feat(notifications): mark account event and order messages as read |
| 34 | feat(account-security): review devices and revoke other demo sessions |
| 35 | feat(support): connect user reports with administrator reply threads |
| 36 | feat(ticket-scanner): validate QR entry and reject reused tickets |
| 37 | feat(activity-log): filter administrative history and export safe CSV |
| 38 | feat(admin-dashboard): summarize live operations and reset demo fixtures |
| 39 | feat(system-settings): retain administrator platform preferences |
| 40 | feat(user-home): summarize upcoming orders and link complete booking flows |
| 41 | test(demo-sync): verify persisted changes across browser tabs |
| 42 | test(responsive-ui): verify mobile desktop dialogs and dark theme |
| 43 | docs(frontend): document feature boundaries validation and commit policy |

Lihat pesan lengkap tiap commit dengan `git log --reverse 836c76b..dev/auth`.
Pesan commit menjelaskan perilaku dan ruang lingkup perubahan; pengujian yang relevan
berada di `tests/demo/`, `tests/browser/`, dan `tests/auth-contract.test.cjs`.

## Halaman utama untuk peninjauan

| Fitur | Route |
| --- | --- |
| Ringkasan operasional | /admin/dashboard |
| Akun dan undangan tim | /admin/dashboard/users, /admin/dashboard/invitations |
| Review dan pengelolaan acara | /admin/dashboard/events/approval, /admin/dashboard/concerts |
| Transaksi dan detail | /admin/dashboard/finance/transactions, /admin/dashboard/finance/transactions/[id] |
| Audit dan bantuan admin | /admin/dashboard/activity, /admin/dashboard/system/help |
| Katalog dan detail acara | /user/events, /user/events/[id] |
| Checkout, daftar, detail pesanan | /user/checkout, /user/orders, /user/orders/[id] |
| Daftar dan detail e-ticket QR | /user/tickets, /user/tickets/[id] |
| Notifikasi, perangkat, bantuan | /user/notifications, /user/security, /user/help |
| Validasi tiket STAFF | /staff/scanner |

## Tampilan dan pemeriksaan

Hero katalog/dashboard, font, hierarki informasi, kartu hover, jumlah hasil pencarian,
reset filter, dan placeholder poster dirapikan. Navigasi, tabel kartu di HP, modal,
fokus keyboard, tema gelap, cetak tiket, serta reduced motion tersedia.

Jalankan `npm run test:auth`, `npm run test:demo`, dan `npm run build`.
Dengan frontend aktif di port 3200, jalankan `npm run test:e2e`; atur
`DEMO_BASE_URL` untuk port lain. Suite memeriksa perjalanan pembelian, undangan,
scan ulang, penolakan izin kamera, persistensi, sinkronisasi tab, serta lebar layar
360/390/1440 piksel. Kamera membutuhkan izin browser pada localhost/HTTPS.

Port default 3100. Bila dipakai server lama, jalankan build terbaru dengan
`npm run start -- --port 3101`.

## Mengambil riwayat yang sudah diperbarui

Karena riwayat branch diganti atas permintaan pemiliknya, jangan langsung mencampur
commit lama lewat pull/merge. Simpan pekerjaan lokal dahulu; untuk meninjau tanpa
mengubah branch lama, gunakan branch lokal baru:

```powershell
git fetch origin
git switch -c review/dev-auth-features --track origin/dev/auth
```

Aturan commit berikutnya tersedia di [CONTRIBUTING.md](../CONTRIBUTING.md).
