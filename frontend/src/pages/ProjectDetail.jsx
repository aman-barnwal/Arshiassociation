import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { MapPin, CalendarDays, Users, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { PROJECTS } from "../data/content";
import { Reveal, PageHero } from "../components/shared";
import { Lightbox } from "../components/Lightbox";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [lightbox, setLightbox] = useState(null);
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return <Navigate to="/projects" replace />;

  const idx = PROJECTS.indexOf(project);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const items = project.images.map((src, i) => ({ src, caption: `${project.title} — photo ${i + 1}`, category: project.location }));

  return (
    <div data-testid={`project-detail-${project.slug}`}>
      <PageHero eyebrow={project.subtitle} title={project.title} sub={project.summary} image={project.cover} />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_360px] gap-14">
          <div>
            <Reveal className="space-y-6 text-slate-600 leading-relaxed text-[1.05rem]">
              {project.body.map((p, i) => <p key={i}>{p}</p>)}
            </Reveal>

            <Reveal className="mt-14">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-emerald-950 mb-7">Photo documentation</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.images.map((src, i) => (
                  <button key={src} data-testid={`project-photo-${i}`} onClick={() => setLightbox(i)} className="block overflow-hidden rounded-2xl group relative focus:outline-none focus:ring-2 focus:ring-emerald-600">
                    <img src={src} alt={`${project.title} ${i + 1}`} className="w-full h-40 md:h-48 object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                    <div className="absolute inset-0 bg-emerald-950/0 group-hover:bg-emerald-950/25 transition-colors" />
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          <aside>
            <Reveal delay={0.1} className="sticky top-28 space-y-6">
              <div className="card-premium p-8">
                <h3 className="font-heading text-lg font-bold text-emerald-950 mb-5">Project facts</h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex gap-3"><MapPin className="w-4.5 h-4.5 w-5 h-5 text-amber-700 shrink-0" /><span><strong className="block text-emerald-950">Location</strong>{project.location}</span></li>
                  <li className="flex gap-3"><CalendarDays className="w-5 h-5 text-amber-700 shrink-0" /><span><strong className="block text-emerald-950">Period</strong>{project.date}</span></li>
                  <li className="flex gap-3"><Users className="w-5 h-5 text-amber-700 shrink-0" /><span><strong className="block text-emerald-950">Reach</strong>{project.beneficiaries}</span></li>
                </ul>
              </div>
              <div className="bg-emerald-950 rounded-3xl p-8 text-white">
                <h3 className="font-heading text-lg font-bold mb-5">Highlights</h3>
                <ul className="space-y-3.5">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-sm text-emerald-50/85">
                      <CheckCircle2 className="w-4.5 h-4.5 w-5 h-5 text-amber-400 shrink-0" /> {h}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/donate" data-testid="project-support-button" className="block text-center bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-full px-8 py-3.5 shadow-md shadow-amber-900/15 transition-all hover:-translate-y-0.5">
                Support projects like this
              </Link>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="py-12 bg-[#F8FAFC] border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-5">
          <Link to="/projects" data-testid="back-to-projects" className="inline-flex items-center gap-2 font-semibold text-emerald-900 hover:gap-3.5 transition-all">
            <ArrowLeft className="w-4 h-4" /> All projects
          </Link>
          <Link to={`/projects/${next.slug}`} data-testid="next-project-link" className="inline-flex items-center gap-2 font-semibold text-emerald-900 hover:gap-3.5 transition-all">
            Next: {next.title} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {lightbox !== null && <Lightbox items={items} index={lightbox} onClose={() => setLightbox(null)} onNavigate={setLightbox} />}
    </div>
  );
}
