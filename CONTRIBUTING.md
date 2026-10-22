# Kontribusi frontend

## Satu fitur, satu commit

Pisahkan perubahan menurut fitur yang dapat dijelaskan dan ditinjau secara mandiri.
Contoh: undangan tim, daftar pesanan, detail pesanan, dan scanner tiket mempunyai
commit sendiri. Jangan menggabungkan semua daftar pekerjaan ke satu commit.

Sertakan komponen, route, operasi data, dan pengujian terkait fitur di commit yang
sama. Infrastruktur bersama mendapat commit terpisah sebelum fitur yang memakainya.
Jika satu issue berisi beberapa butir pekerjaan, setiap fitur/butir tetap dipisahkan.

Gunakan judul yang menyebutkan perilaku konkret, misalnya:

```text
feat(admin-invitations): add role-aware invitations and one-time activation
fix(checkout): release reserved seats when an order is cancelled
```

Isi pesan commit menjelaskan perubahan perilaku, halaman yang terdampak, batasan
demo/API, dan pengujian yang relevan. Hindari judul seperti "fix issue", "update UI",
"semua fitur", atau "perbaikan" tanpa penjelasan.

## Pemeriksaan sebelum push

```powershell
npm run test:auth
npm run test:demo
npm run build
```

Jalankan `npm run test:e2e` dengan frontend aktif; atur `DEMO_BASE_URL` jika port
berbeda dari 3200. Periksa tampilan desktop, HP, tema gelap, dialog, dan navigasi.
Fitur baru menggunakan data demo lokal sampai integrasi backend disepakati.

Push hanya branch frontend yang dikerjakan. Jangan menyertakan perubahan backend,
file `.env.local`, token, atau kredensial. Jangan menulis ulang riwayat branch
bersama tanpa instruksi pemiliknya; bila sudah diizinkan, simpan cadangan lokal dan
gunakan `--force-with-lease` dengan SHA remote yang telah diperiksa.
