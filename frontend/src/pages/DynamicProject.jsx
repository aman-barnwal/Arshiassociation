import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { MapPin, CalendarDays, Users, ArrowLeft } from "lucide-react";
import { Reveal } from "../components/shared";
import { Lightbox } from "../components/Lightbox";
import { API, fileUrl } from "../admin/api";

export default function DynamicProject() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    axios.get(`${API}/projects/${id}`).then(({ data }) => setProject(data)).catch(() => setError(true));
  }, [id]);

  if (error)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center pt-24 px-4 text-center">
        <p className="font-heading text-2xl font-bold text-emerald-950">Project not found</p>
        <Link to="/projects" className="mt-4 inline-flex items-center gap-2 text-emerald-900 font-semibold"><ArrowLeft className="w-4 h-4" /> Back to Projects</Link>
      </div>
    );

  if (!project) return <div className="min-h-[60vh] flex items-center justify-center pt-24"><p className="text-slate-400 text-sm">Loading…</p></div>;

  const photos = project.photos.map((fid) => ({ src: fileUrl(fid), caption: project.title }));

  return (
    <div data-testid="dynamic-project-page">
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-emerald-950">
        {photos[0] && (
          <>
            <img src={photos[0].src} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/60 to-emerald-950" />
          </>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/projects" className="inline-flex items-center gap-2 text-emerald-200/80 hover:text-white text-sm font-semibold mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> All Projects</Link>
          {project.subtitle && <p className="text-xs uppercase tracking-[0.22em] font-bold text-amber-400">{project.subtitle}</p>}
          <h1 className="mt-3 font-heading text-3xl md:text-5xl font-bold text-white leading-tight">{project.title}</h1>
          <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2.5 text-sm text-emerald-100/80">
            {project.location && <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4 text-amber-400" /> {project.location}</span>}
            {project.date && <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-amber-400" /> {project.date}</span>}
            {project.beneficiaries && <span className="inline-flex items-center gap-1.5"><Users className="w-4 h-4 text-amber-400" /> {project.beneficiaries}</span>}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {project.summary && (
            <Reveal className="max-w-3xl mb-14">
              <p className="text-lg text-slate-600 leading-relaxed">{project.summary}</p>
            </Reveal>
          )}
          {photos.length > 0 ? (
            <div className="masonry">
              {photos.map((ph, i) => (
                <figure key={ph.src} className="relative overflow-hidden rounded-2xl group cursor-pointer shadow-sm" onClick={() => setLightbox(i)} data-testid={`dyn-project-photo-${i}`}>
                  <img src={ph.src} alt={project.title} className="w-full group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                </figure>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Photographs coming soon.</p>
          )}
        </div>
      </section>

      {lightbox !== null && <Lightbox items={photos} index={lightbox} onClose={() => setLightbox(null)} onNavigate={setLightbox} />}
    </div>
  );
}
