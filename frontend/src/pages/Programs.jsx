import * as Icons from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PROGRAMS } from "../data/content";
import { Reveal, SectionHeading, PageHero } from "../components/shared";

export default function Programs() {
  return (
    <div data-testid="programs-page">
      <PageHero eyebrow="Our Programmes" title="Fourteen pathways to a dignified life" sub="Every programme is designed around one belief — practical opportunity is the most powerful form of empowerment." image="/images/27.jpeg" />

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {PROGRAMS.map((p, i) => {
              const Icon = Icons[p.icon] || Icons.Star;
              return (
                <Reveal key={p.title} delay={(i % 3) * 0.06}>
                  <article data-testid={`program-card-${i}`} className="card-premium overflow-hidden h-full group flex flex-col">
                    <div className="h-52 overflow-hidden relative">
                      <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/50 to-transparent" />
                      <span className="absolute bottom-4 left-5 w-11 h-11 rounded-xl backdrop-blur-md bg-white/90 text-emerald-900 flex items-center justify-center shadow-lg">
                        <Icon className="w-5 h-5" strokeWidth={1.6} />
                      </span>
                    </div>
                    <div className="p-7 flex-1">
                      <h3 className="font-heading text-xl font-bold text-emerald-950">{p.title}</h3>
                      <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F0FDF4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading center eyebrow="See It In Action" title="Explore the projects behind these programmes" />
          <Reveal className="-mt-6">
            <Link to="/projects" data-testid="programs-to-projects-button" className="inline-flex items-center gap-2 bg-emerald-900 hover:bg-emerald-800 text-white font-semibold rounded-full px-8 py-3.5 transition-all hover:-translate-y-0.5 shadow-md shadow-emerald-900/20">
              View our projects <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
