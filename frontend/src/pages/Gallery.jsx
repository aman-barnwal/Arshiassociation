import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Camera } from "lucide-react";
import { GALLERY, GALLERY_CATEGORIES } from "../data/content";
import { Reveal, PageHero } from "../components/shared";
import { Lightbox } from "../components/Lightbox";
import { API, fileUrl } from "../admin/api";

export default function Gallery() {
  const [category, setCategory] = useState("All");
  const [lightbox, setLightbox] = useState(null);
  const [dynamic, setDynamic] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/gallery`)
      .then(({ data }) => setDynamic(data.map((g) => ({ src: fileUrl(g.file_id), category: g.category, caption: g.caption }))))
      .catch(() => {});
  }, []);

  const all = useMemo(() => [...dynamic, ...GALLERY], [dynamic]);

  const categories = useMemo(() => {
    const extra = dynamic.map((g) => g.category).filter((c) => !GALLERY_CATEGORIES.includes(c));
    return [...GALLERY_CATEGORIES, ...Array.from(new Set(extra))];
  }, [dynamic]);

  const items = useMemo(
    () => (category === "All" ? all : all.filter((g) => g.category === category)),
    [category, all]
  );

  return (
    <div data-testid="gallery-page">
      <PageHero eyebrow="Gallery" title={`${all.length} photographs. One story of change.`} sub="Every image here was captured on the ground — in the villages of Khunti, the classrooms of Ranchi and the communities we serve." image="/images/34.jpeg" />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-wrap gap-2.5 mb-12 justify-center">
            {categories.map((c) => (
              <button
                key={c}
                data-testid={`gallery-filter-${c.toLowerCase().replace(/\s/g, "-")}`}
                onClick={() => setCategory(c)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  category === c
                    ? "bg-emerald-900 text-white shadow-md shadow-emerald-900/20"
                    : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                }`}
              >
                {c} {c !== "All" && <span className="opacity-60">({all.filter((g) => g.category === c).length})</span>}
              </button>
            ))}
          </Reveal>

          <p className="text-center text-sm text-slate-500 mb-10 inline-flex items-center gap-2 w-full justify-center" data-testid="gallery-count">
            <Camera className="w-4 h-4 text-amber-700" /> Showing {items.length} of {all.length} photographs
          </p>

          <motion.div layout className="masonry">
            <AnimatePresence mode="popLayout">
              {items.map((g, idx) => (
                <motion.figure
                  layout
                  key={g.src}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="relative overflow-hidden rounded-2xl group cursor-pointer shadow-sm"
                  onClick={() => setLightbox(idx)}
                  data-testid={`gallery-item-${idx}`}
                >
                  <img src={g.src} alt={g.caption} className="w-full group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <figcaption className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <p className="text-amber-400 text-[10px] uppercase tracking-[0.2em] font-bold">{g.category}</p>
                    <p className="text-white text-sm mt-1 leading-snug">{g.caption}</p>
                  </figcaption>
                </motion.figure>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {lightbox !== null && <Lightbox items={items} index={lightbox} onClose={() => setLightbox(null)} onNavigate={setLightbox} />}
    </div>
  );
}
