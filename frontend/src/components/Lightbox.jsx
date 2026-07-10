import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export const Lightbox = ({ items, index, onClose, onNavigate }) => {
  const prev = useCallback(() => onNavigate((index - 1 + items.length) % items.length), [index, items.length, onNavigate]);
  const next = useCallback(() => onNavigate((index + 1) % items.length), [index, items.length, onNavigate]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  const item = items[index];
  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        data-testid="lightbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <button data-testid="lightbox-close" onClick={onClose} className="absolute top-5 right-5 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Close">
          <X className="w-7 h-7" />
        </button>
        <button data-testid="lightbox-prev" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-3 sm:left-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Previous">
          <ChevronLeft className="w-8 h-8" />
        </button>
        <motion.figure
          key={item.src}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="max-w-5xl max-h-[85vh] flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={item.src} alt={item.caption} className="max-h-[75vh] w-auto rounded-xl shadow-2xl object-contain" />
          <figcaption className="mt-4 text-center">
            <p className="text-white text-sm md:text-base">{item.caption}</p>
            <p className="text-amber-400/90 text-xs uppercase tracking-[0.18em] mt-1.5">{item.category} • {index + 1} / {items.length}</p>
          </figcaption>
        </motion.figure>
        <button data-testid="lightbox-next" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-3 sm:right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Next">
          <ChevronRight className="w-8 h-8" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
