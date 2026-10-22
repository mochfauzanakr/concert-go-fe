import { motion } from "framer-motion";
import { type Category } from "@/lib/eventsData";
import { CATEGORIES } from "./HomeData";

export function CategoryRail({
  active,
  onSelect,
}: {
  active: Category;
  onSelect: (cat: Category) => void;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {CATEGORIES.map((c, idx) => {
          const isSelected = active === c.label;
          return (
            <motion.button
              key={c.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02, duration: 0.25 }}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(c.label)}
              className={`group flex flex-col items-center gap-1.5 sm:gap-2 rounded-2xl p-2 sm:p-2.5 transition-all focus:outline-hidden cursor-pointer ${
                isSelected ? "bg-theme-card shadow-md shadow-black/10 ring-2 ring-[#d9691f]/35" : "hover:bg-theme-card/40"
              }`}
            >
              <span
                className={`flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-2xl border transition-all ${
                  isSelected
                    ? "border-[#d9691f] bg-[#d9691f] text-[#f6efe1] shadow-md shadow-[#d9691f]/25 scale-105"
                    : "border-theme-border bg-theme-card-hover text-theme-text-muted group-hover:border-[#d9691f] group-hover:bg-theme-bg"
                }`}
              >
                {c.icon}
              </span>
              <span
                className={`text-[11px] sm:text-[12px] font-medium leading-tight whitespace-nowrap transition-colors ${
                  isSelected ? "font-bold text-[#d9691f]" : "text-theme-text-muted"
                }`}
              >
                {c.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
