"use client";

const DUMMY_USERS = [
  { id: "1", name: "Raka Pratama", email: "raka@example.com", role: "User", status: "Aktif", lastLogin: "Hari ini, 10:24" },
  { id: "2", name: "Dina Melia", email: "dina.mel@example.com", role: "User", status: "Aktif", lastLogin: "Kemarin, 14:30" },
  { id: "3", name: "Budi Santoso", email: "budi.santoso@example.com", role: "Admin", status: "Aktif", lastLogin: "Hari ini, 08:15" },
  { id: "4", name: "Siti Aminah", email: "siti99@example.com", role: "User", status: "Nonaktif", lastLogin: "2 minggu yang lalu" },
  { id: "5", name: "Joko Anwar", email: "joko.anwar@example.com", role: "User", status: "Aktif", lastLogin: "3 hari yang lalu" },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f1e6d0] p-6 rounded-2xl shadow-sm border border-[#e6d9bf]">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display,serif)] text-[#241608]">Manajemen Pengguna</h2>
          <p className="text-sm text-[#8a7a63] mt-1">Kelola akun pengguna terdaftar, peran, dan status.</p>
        </div>
        <button className="bg-[#d9691f] hover:bg-[#c45c16] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all flex items-center gap-2">
          <span>➕</span> Tambah Pengguna
        </button>
      </div>

      <div className="bg-[#f1e6d0] rounded-2xl shadow-sm border border-[#e6d9bf] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/40 border-b border-[#e6d9bf] text-[#5a4a35] text-sm font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Nama Pengguna</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Peran</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6">Terakhir Login</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6d9bf]/50">
              {DUMMY_USERS.map((user) => (
                <tr key={user.id} className="hover:bg-white/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#e6d9bf] flex items-center justify-center text-[#d9691f] font-bold shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-bold text-[#241608] group-hover:text-[#d9691f] transition-colors">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#5a4a35]">
                    {user.email}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      user.role === 'Admin' ? 'bg-orange-200 text-[#d9691f]' : 'bg-[#e6d9bf]/50 text-[#241608]'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      user.status === 'Aktif' ? 'bg-emerald-200/50 text-emerald-700' : 'bg-red-200/50 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-[#8a7a63]">
                    {user.lastLogin}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-[#8a7a63] hover:text-[#d9691f] transition-colors" title="Edit">
                        ✏️
                      </button>
                      <button className="p-2 text-[#8a7a63] hover:text-red-600 transition-colors" title="Hapus">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
