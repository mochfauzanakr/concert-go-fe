# Perapian commit dev/auth tanpa mengubah riwayat pemilik

Arahan akhir pengguna pada 5 November 2026: commit pemilik repository tidak boleh diubah. Branch tetap `dev/auth`; tidak dibuat branch pengembangan baru.

- Basis commit baru: `origin/dev/auth` pada `367e55c78b4cf372e6f2673046ad64afd4a3a3fe`.
- Seluruh commit remote lama, termasuk merge, CI, dan CODEOWNERS milik pemilik repository, dipertahankan dengan SHA asli.
- Kandidat rewrite pernah disiapkan lokal sebelum arahan akhir tersebut, tetapi tidak dipush. Perbaikan akhir ditambahkan sebagai commit baru berdasarkan fitur.
- Commit baru memisahkan integrasi akun nyata, preview browser-local, dan studi desain. Tidak ada klaim API konser/tiket yang belum tersedia.
- Tampilan sebelum redesign dipertahankan dan konsep member/poin dihapus.
- Backup lengkap pekerjaan dan riwayat disimpan lokal dalam `concert-go-fe-before-rewrite-20261105.bundle` di folder temporary OpenCode. Ref snapshot lokal: `refs/backups/dev-auth-before-rewrite-20261105`.
- Push akhir menggunakan fast-forward biasa, bukan force push. Jika remote berubah, push harus berhenti untuk diperiksa ulang.

Pesan commit lama yang menjadi ancestor commit pemilik tidak dihapus, karena penghapusannya akan mengubah SHA commit pemilik. Kolaborator remote dapat mengambil commit tambahan dengan alur sinkronisasi biasa; pekerjaan lokal tetap perlu diamankan sebelum pull.
