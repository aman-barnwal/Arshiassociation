import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MapPin, CalendarDays, Users, ArrowRight, FolderOpen } from "lucide-react";
import { PROJECTS } from "../data/content";
import { Reveal, PageHero, SectionHeading } from "../components/shared";
import { API, fileUrl } from "../admin/api";

export default function Projects() {
  const [dynamic, setDynamic] = useState([]);

  useEffect(() => {
    axios.get(`${API}/projects`).then(({ data }) => setDynamic(data)).catch(() => {});
  }, []);

  return (
    <div data-testid="projects-page">
      <PageHero eyebrow="Projects 2023–24" title="Documented work, measurable change" sub="Seven projects reached 1,619 young lives this year. Here are the flagship initiatives from our Annual Report." image="/images/23.jpeg" />

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.slug}>
              <Link
                to={`/projects/${p.slug}`}
                data-testid={`project-card-${p.slug}`}
                className={`group grid lg:grid-cols-2 gap-0 card-premium overflow-hidden ${i % 2 ? "lg:[direction:rtl]" : ""}`}
              >
                <div className="h-72 lg:h-auto overflow-hidden [direction:ltr]">
                  <img src={p.cover} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                </div>
                <div className="p-8 md:p-12 [direction:ltr]">
                  <p className="text-xs uppercase tracking-[0.2em] font-bold text-amber-700">{p.subtitle}</p>
                  <h2 className="mt-3 font-heading text-2xl md:text-3xl font-bold text-emerald-950 group-hover:text-emerald-800 transition-colors">{p.title}</h2>
                  <p className="mt-4 text-slate-600 leading-relaxed">{p.summary}</p>
                  <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-800" /> {p.location}</span>
                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-emerald-800" /> {p.date}</span>
                    <span className="inline-flex items-center gap-1.5"><Users className="w-4 h-4 text-emerald-800" /> {p.beneficiaries}</span>
                  </div>
                  <p className="mt-7 inline-flex items-center gap-2 font-bold text-emerald-900">
                    Read the full story <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {dynamic.length > 0 && (
        <section className="py-16 md:py-24 bg-[#F0FDF4]/60" data-testid="dynamic-projects-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="More Projects" title="Recent project folders" sub="Latest initiatives documented by our team, with photographs from the field." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dynamic.map((p) => (
                <Reveal key={p.id}>
                  <Link to={`/projects/view/${p.id}`} data-testid={`dynamic-project-card-${p.id}`} className="group card-premium overflow-hidden block bg-white">
                    <div className="h-52 overflow-hidden bg-emerald-50 flex items-center justify-center">
                      {p.photos[0] ? (
                        <img src={fileUrl(p.photos[0])} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                      ) : (
                        <FolderOpen className="w-10 h-10 text-emerald-200" strokeWidth={1.4} />
                      )}
                    </div>
                    <div className="p-7">
                      {p.subtitle && <p className="text-xs uppercase tracking-[0.2em] font-bold text-amber-700">{p.subtitle}</p>}
                      <h3 className="mt-2 font-heading text-xl font-bold text-emerald-950 group-hover:text-emerald-800 transition-colors">{p.title}</h3>
                      {p.summary && <p className="mt-2.5 text-sm text-slate-600 leading-relaxed line-clamp-3">{p.summary}</p>}
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-500">
                        {p.location && <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-800" /> {p.location}</span>}
                        {p.date && <span className="inline-flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5 text-emerald-800" /> {p.date}</span>}
                        {p.beneficiaries && <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5 text-emerald-800" /> {p.beneficiaries}</span>}
                      </div>
                      <p className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-900">
                        View photos <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
