import { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Download, Eye, CalendarDays, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ORG } from "../data/content";
import { Reveal, PageHero } from "../components/shared";
import { API, fileUrl } from "../admin/api";

const REPORTS = [
  {
    year: "2023–2024",
    title: "Annual Report 2023–24",
    file: ORG.reportPdf,
    cover: "/images/35.jpeg",
    desc: "A complete account of the year we reached 1,619 young lives through seven projects — featuring the NABARD-supported MEDP Dhoop Batti programme, International Mahila Diwas, free vocational & computer training, and the Health Camp at Ranchi Women's College.",
  },
];

export default function Reports() {
  const [viewer, setViewer] = useState(null);
  const [dynamic, setDynamic] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/reports`)
      .then(({ data }) =>
        setDynamic(
          data.map((r) => ({
            year: r.year,
            title: r.title,
            file: fileUrl(r.file_id),
            cover: "/images/35.jpeg",
            desc: r.desc || `Published annual report for ${r.year}.`,
          }))
        )
      )
      .catch(() => {});
  }, []);

  const allReports = [...dynamic, ...REPORTS];

  return (
    <div data-testid="reports-page">
      <PageHero eyebrow="Annual Reports" title="Our work, on the record" sub="Transparency is a promise. Read and download our published annual reports — future reports will appear here as they are released." image="/images/35.jpeg" />

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allReports.map((r) => (
              <Reveal key={r.file}>
                <article data-testid={`report-card-${r.year}`} className="card-premium overflow-hidden group">
                  <div className="h-56 overflow-hidden relative">
                    <img src={r.cover} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent" />
                    <span className="absolute bottom-4 left-5 inline-flex items-center gap-2 text-white font-bold">
                      <FileText className="w-5 h-5 text-amber-400" /> {r.title}
                    </span>
                  </div>
                  <div className="p-7">
                    <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-amber-700 mb-3">
                      <CalendarDays className="w-3.5 h-3.5" /> Published {r.year}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">{r.desc}</p>
                    <div className="mt-6 flex gap-3">
                      <button onClick={() => setViewer(r)} data-testid="report-view-button" className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-semibold rounded-full px-5 py-3 transition-all">
                        <Eye className="w-4 h-4" /> Read Online
                      </button>
                      <a href={r.file} download data-testid="report-download-button" className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-full px-5 py-3 transition-all">
                        <Download className="w-4 h-4" /> Download
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}

            <Reveal delay={0.1}>
              <div className="h-full min-h-[320px] rounded-3xl border-2 border-dashed border-emerald-200 flex flex-col items-center justify-center text-center p-10 bg-[#F0FDF4]/50">
                <FileText className="w-10 h-10 text-emerald-300 mb-4" strokeWidth={1.4} />
                <p className="font-heading text-lg font-bold text-emerald-900/70">Annual Report 2024–25</p>
                <p className="text-sm text-slate-500 mt-2">Coming soon — future reports will be published here.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {viewer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setViewer(null)}
            data-testid="pdf-viewer-modal"
          >
            <motion.div
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl w-full max-w-5xl h-[88vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <p className="font-heading font-bold text-emerald-950">{viewer.title}</p>
                <div className="flex gap-2">
                  <a href={viewer.file} download className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-full px-4 py-2 transition-colors">
                    <Download className="w-4 h-4" /> Download
                  </a>
                  <button onClick={() => setViewer(null)} data-testid="pdf-viewer-close" className="p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label="Close viewer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <iframe src={viewer.file} title={viewer.title} className="flex-1 w-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
