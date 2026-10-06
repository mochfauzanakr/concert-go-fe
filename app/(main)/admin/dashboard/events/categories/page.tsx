"use client";

import { motion } from "framer-motion";

const DUMMY_CATEGORIES = [
  { id: "CAT-01", name: "Pop", count: 24, status: "Aktif", color: "bg-blue-100 text-blue-700" },
  { id: "CAT-02", name: "Rock", count: 15, status: "Aktif", color: "bg-red-100 text-red-700" },
  { id: "CAT-03", name: "Jazz", count: 8, status: "Aktif", color: "bg-purple-100 text-purple-700" },
  { id: "CAT-04", name: "Festival", count: 12, status: "Aktif", color: "bg-orange-100 text-orange-700" },
  { id: "CAT-05", name: "Klasik", count: 3, status: "Nonaktif", color: "bg-stone-100 text-stone-700" },
  { id: "CAT-06", name: "EDM", count: 18, status: "Aktif", color: "bg-cyan-100 text-cyan-700" },
];

export default function KategoriGenrePage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex justify-between items-center bg-[#f1e6d0] p-6 rounded-2xl shadow-sm border border-[#e6d9bf]">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-display,serif)] text-[#241608]">Kategori & Genre</h2>
          <p className="text-sm text-[#8a7a63] mt-1">Kelola kategori dan genre acara yang tersedia di platform.</p>
        </div>
        <button className="bg-[#d9691f] hover:bg-[#c45c16] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all flex items-center gap-2">
          <span>➕</span> Tambah Kategori
        </button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {DUMMY_CATEGORIES.map((cat, i) => (
          <motion.div 
            key={cat.id}
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.35, delay: 0.1 + (i * 0.05) }} 
            className="bg-[#f1e6d0] rounded-2xl shadow-sm border border-[#e6d9bf] p-6 hover:shadow-md transition-shadow group relative"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${cat.color}`}>
                {cat.name.charAt(0)}
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                cat.status === 'Aktif' ? 'bg-emerald-200/50 text-emerald-700' : 'bg-red-200/50 text-red-700'
              }`}>
                {cat.status}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-[#241608] mb-1">{cat.name}</h3>
            <p className="text-sm text-[#8a7a63]">{cat.count} Acara Aktif</p>

            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 bg-white text-[#8a7a63] hover:text-[#d9691f] rounded-lg shadow-sm transition-colors" title="Edit">
                ✏️
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
