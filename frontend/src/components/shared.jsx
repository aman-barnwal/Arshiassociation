import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export const Reveal = ({ children, delay = 0, className = "", ...rest }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
    {...rest}
  >
    {children}
  </motion.div>
);

export const SectionHeading = ({ eyebrow, title, sub, center = false, light = false }) => (
  <Reveal className={`max-w-3xl ${center ? "mx-auto text-center" : ""} mb-12 lg:mb-16`}>
    {eyebrow && (
      <p className={`text-sm uppercase tracking-[0.22em] font-bold mb-4 ${light ? "text-amber-400" : "text-amber-700"}`}>{eyebrow}</p>
    )}
    <h2 className={`font-heading text-3xl md:text-4xl lg:text-[2.75rem] tracking-tight font-bold leading-tight ${light ? "text-white" : "text-emerald-950"}`}>{title}</h2>
    {sub && <p className={`mt-5 text-base md:text-lg leading-relaxed ${light ? "text-emerald-100/75" : "text-slate-600"}`}>{sub}</p>}
  </Reveal>
);

export const CountUp = ({ value, duration = 2000, suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value, duration]);

  return <span ref={ref}>{display.toLocaleString("en-IN")}{suffix}</span>;
};

export const PageHero = ({ eyebrow, title, sub, image }) => (
  <section className="relative pt-36 pb-20 lg:pt-48 lg:pb-28 bg-emerald-950 overflow-hidden">
    {image && (
      <>
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-emerald-950/70 to-emerald-950" />
      </>
    )}
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl">
        {eyebrow && <p className="text-sm uppercase tracking-[0.22em] font-bold text-amber-400 mb-4">{eyebrow}</p>}
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">{title}</h1>
        {sub && <p className="mt-6 text-base md:text-lg text-emerald-100/80 leading-relaxed">{sub}</p>}
      </motion.div>
    </div>
  </section>
);
