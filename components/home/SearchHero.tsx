import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EVENTS, type Category, type EventItem } from "@/lib/eventsData";
import { CATEGORY_META } from "./HomeData";
import { Search, Sparkles, MapPin, Music, Filter } from "lucide-react";

export function splitMatch(text: string, query: string) {
  if (!query.trim()) return { before: text, match: "", after: "" };
  const i = text.toLowerCase().indexOf(query.trim().toLowerCase());
  if (i === -1) return { before: text, match: "", after: "" };
  return {
    before: text.slice(0, i),
    match: text.slice(i, i + query.trim().length),
    after: text.slice(i + query.trim().length),
  };
}

export function Highlighted({ text, query }: { text: string; query: string }) {
  const { before, match, after } = splitMatch(text, query);
  if (!match) return <>{text}</>;
  return (
    <>
      {before}
      <span className="font-semibold text-[#d9691f]">{match}</span>
      {after}
    </>
  );
}

const MAX_SUGGESTIONS = 6;

type Suggestion = {
  key: string;
  kind: "event" | "city" | "genre";
  label: string;
  meta?: string;
  event?: EventItem;
};

export function buildSuggestions(query: string, category: Category): Suggestion[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const pool = EVENTS.filter((e) => e.category === category);

  const results: Suggestion[] = [];

  for (const e of pool) {
    const hit =
      e.title.toLowerCase().includes(q) ||
      e.artist.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q);
    if (hit) {
      results.push({
        key: `event-${e.id}`,
        kind: "event",
        label: e.title,
        meta: `${e.artist} · ${e.venue}, ${e.city}`,
        event: e,
      });
    }
  }

  const poolCities = Array.from(new Set(pool.map((e) => e.city)));
  for (const c of poolCities) {
    if (c.toLowerCase().includes(q) && !results.some((r) => r.kind === "city" && r.label === c)) {
      const count = pool.filter((e) => e.city === c).length;
      results.push({
        key: `city-${c}`,
        kind: "city",
        label: c,
        meta: `${count} acara tersedia`,
      });
    }
  }

  const poolGenres = Array.from(new Set(pool.map((e) => e.genre)));
  for (const g of poolGenres) {
    if (g.toLowerCase().includes(q)) {
      const count = pool.filter((e) => e.genre === g).length;
      results.push({
        key: `genre-${g}`,
        kind: "genre",
        label: g,
        meta: `${count} acara pilihan`,
      });
    }
  }

  return results.slice(0, MAX_SUGGESTIONS);
}

export function SearchHero(props: {
  selectedCategory: Category;
  query: string;
  setQuery: (v: string) => void;
  genre: string;
  setGenre: (v: string) => void;
  availableGenres: string[];
  city: string;
  setCity: (v: string) => void;
  availableCities: string[];
  sort: string;
  setSort: (v: string) => void;
  resultCount: number;
  totalInCategory: number;
  onSubmit: () => void;
}) {
  const {
    selectedCategory,
    query,
    setQuery,
    genre,
    setGenre,
    availableGenres,
    city,
    setCity,
    availableCities,
    sort,
    setSort,
    resultCount,
    totalInCategory,
    onSubmit,
  } = props;

  const meta = CATEGORY_META[selectedCategory] ?? CATEGORY_META["Festival Musik"];

  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(
    () => buildSuggestions(query, selectedCategory),
    [query, selectedCategory]
  );

  useEffect(() => {
    setHighlightIndex(0);
  }, [query]);

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const showDropdown = isOpen && query.trim().length > 0 && suggestions.length > 0;

  const activeFilterCount = [
    genre !== "Semua Genre",
    city !== "Semua Kota",
    sort !== "Tanggal terdekat",
  ].filter(Boolean).length;

  function resetFilters() {
    setGenre("Semua Genre");
    setCity("Semua Kota");
    setSort("Tanggal terdekat");
  }

  function applySuggestion(s: Suggestion) {
    if (s.kind === "city") {
      setCity(s.label);
      setQuery("");
    } else if (s.kind === "genre") {
      setGenre(s.label);
      setQuery("");
    } else {
      setQuery(s.label);
    }
    setIsOpen(false);
    onSubmit();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) {
      if (e.key === "Enter") onSubmit();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      applySuggestion(suggestions[highlightIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <motion.section
      key={selectedCategory}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-3xl px-6 pb-12 pt-4 text-center"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-[#d9691f]/30 bg-theme-card-hover/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#b5772f]">
        <Sparkles className="w-3.5 h-3.5" /> {meta.tag}
      </span>

      <h2 className="mt-4 font-[var(--font-display,serif)] text-3xl font-bold leading-tight text-theme-text md:text-5xl">
        {meta.title}
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-sm text-theme-text-muted md:text-base">
        {meta.subtitle}
      </p>

      {/* Input Search Box */}
      <div ref={containerRef} className="relative mx-auto mt-8 max-w-xl">
        <div className="flex items-center gap-2 rounded-full border border-theme-border bg-theme-card p-2 pl-5 shadow-md shadow-black/5 transition-all focus-within:border-[#d9691f] focus-within:ring-2 focus-within:ring-[#d9691f]/20">
          <Search className="w-5 h-5 text-theme-text-light" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={meta.placeholder}
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls="search-suggestions"
            className="flex-1 bg-transparent text-sm text-theme-text placeholder:text-theme-text-light focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              aria-label="Bersihkan pencarian"
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="shrink-0 rounded-full px-2 py-1 text-xs text-theme-text-light hover:text-theme-text"
            >
              ✕
            </button>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onSubmit}
            className="rounded-full bg-theme-button px-5 py-2.5 text-xs font-semibold text-[#f6efe1] transition-colors hover:bg-[#3a2010] sm:text-sm"
          >
            Temukan
          </motion.button>
        </div>

        {/* Live suggestions dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <motion.ul
              id="search-suggestions"
              role="listbox"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-theme-border bg-theme-card text-left shadow-2xl"
            >
              {suggestions.map((s, i) => (
                <li key={s.key} role="option" aria-selected={i === highlightIndex}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setHighlightIndex(i)}
                    onClick={() => applySuggestion(s)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      i === highlightIndex ? "bg-theme-bg" : "bg-theme-card hover:bg-theme-bg/50"
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-theme-card-hover text-theme-text-light">
                      {s.kind === "city" ? <MapPin className="w-4 h-4" /> : s.kind === "genre" ? <Music className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-theme-text">
                        <Highlighted text={s.label} query={query} />
                      </span>
                      {s.meta && <span className="block truncate text-xs text-theme-text-light">{s.meta}</span>}
                    </span>
                    <span className="shrink-0 rounded-full bg-theme-card-hover px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-theme-text-light">
                      {s.kind === "city" ? "Kota" : s.kind === "genre" ? "Kategori" : "Acara"}
                    </span>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Filter Chips */}
      <div className="mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm">
        <button
          type="button"
          onClick={resetFilters}
          disabled={activeFilterCount === 0}
          className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-medium transition-all ${
            activeFilterCount > 0
              ? "border-[#d9691f] bg-[#d9691f] text-white shadow-xs hover:bg-[#c15f1b]"
              : "cursor-default border-theme-border bg-theme-card/70 text-theme-text-muted"
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-theme-card px-1 text-[10px] font-bold text-[#d9691f]">
              {activeFilterCount}
            </span>
          )}
        </button>

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="rounded-full border border-theme-border bg-theme-card/80 px-3.5 py-1.5 text-theme-text-muted transition-colors focus:border-[#d9691f] focus:outline-hidden"
        >
          <option>Semua Genre</option>
          {availableGenres.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-full border border-theme-border bg-theme-card/80 px-3.5 py-1.5 text-theme-text-muted transition-colors focus:border-[#d9691f] focus:outline-hidden"
        >
          <option>Semua Kota</option>
          {availableCities.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-theme-border bg-theme-card/80 px-3.5 py-1.5 text-theme-text-muted transition-colors focus:border-[#d9691f] focus:outline-hidden"
        >
          <option>Tanggal terdekat</option>
          <option>Harga terendah</option>
          <option>Harga tertinggi</option>
        </select>
      </div>

      <p className="mt-3 text-xs text-theme-text-light">
        Menampilkan <span className="font-semibold text-theme-text">{resultCount}</span> dari {totalInCategory} {meta.unit} tersedia
      </p>
    </motion.section>
  );
}
