import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Download, HandHeart, Compass, MapPin, Sparkles, Quote } from "lucide-react";
import * as Icons from "lucide-react";
import { ORG, STATS, PROGRAMS, PROJECTS, GALLERY } from "../data/content";
import { Reveal, SectionHeading, CountUp } from "../components/shared";

const HERO_IMG = "/images/2.jpeg";

export default function Home() {
  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative min-h-screen flex items-end overflow-hidden grain">
        <img src={HERO_IMG} alt="AASW community programme in Jharkhand" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/55 to-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-40 w-full">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="max-w-4xl">
            <p className="inline-flex items-center gap-2 text-amber-400 text-sm uppercase tracking-[0.25em] font-bold mb-6">
              <Sparkles className="w-4 h-4" /> Section 8 Non-Profit • Est. 2020 • Jharkhand
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[4.25rem] font-bold text-white leading-[1.08] tracking-tight">
              Empowering Communities.<br />
              <span className="text-amber-400">Transforming Lives.</span><br />
              Building a Better Tomorrow.
            </h1>
            <p className="mt-7 text-base md:text-lg text-emerald-50/85 leading-relaxed max-w-2xl">{ORG.heroText}</p>
            <div className="mt-10 flex flex-wrap gap-3.5">
              <Link to="/programs" data-testid="hero-explore-button" className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-full px-7 py-3.5 shadow-lg shadow-amber-900/25 transition-all hover:-translate-y-0.5">
                <Compass className="w-4.5 h-4.5" /> Explore Our Work
              </Link>
              <Link to="/volunteer" data-testid="hero-volunteer-button" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-semibold rounded-full px-7 py-3.5 transition-all hover:-translate-y-0.5">
                <HandHeart className="w-4.5 h-4.5" /> Volunteer With Us
              </Link>
              <Link to="/donate" data-testid="hero-donate-button" className="inline-flex items-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-semibold rounded-full px-7 py-3.5 shadow-lg transition-all hover:-translate-y-0.5">
                Donate <ArrowRight className="w-4 h-4" />
              </Link>
              <a href={ORG.reportPdf} download data-testid="hero-download-report-button" className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold rounded-full px-5 py-3.5 underline decoration-amber-500 decoration-2 underline-offset-8 transition-colors">
                <Download className="w-4 h-4" /> Annual Report
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* IMPACT STRIP */}
      <section className="relative z-10 -mt-1 bg-emerald-950 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {STATS.map((s, i) => (
              <div key={s.label} data-testid={`home-stat-${i}`} className="backdrop-blur-xl bg-white/[0.06] border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-colors">
                <p className="font-heading text-3xl lg:text-4xl font-bold text-amber-400"><CountUp value={s.value} suffix={s.suffix} /></p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-emerald-100/70 font-semibold leading-snug">{s.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <Reveal>
            <div className="relative">
              <img src="/images/21.jpeg" alt="Certificate felicitation ceremony" className="rounded-3xl shadow-2xl shadow-emerald-950/15 w-full object-cover aspect-[4/3]" />
              <div className="absolute -bottom-8 -right-4 sm:-right-8 bg-emerald-900 text-white rounded-2xl p-6 shadow-xl max-w-[240px]">
                <p className="font-heading text-4xl font-bold text-amber-400"><CountUp value={1619} /></p>
                <p className="text-sm mt-1 text-emerald-100/80">young lives touched through 7 projects across Jharkhand</p>
              </div>
            </div>
          </Reveal>
          <div>
            <SectionHeading eyebrow="Who We Are" title="A grassroots movement for dignity and self-reliance" />
            <Reveal delay={0.1}>
              <p className="text-slate-600 leading-relaxed -mt-8">
                {ORG.name} (AASW) is a Section 8 Company registered under the Companies Act, 2013, established on {ORG.established}. We work to create sustainable social development through education, healthcare, women empowerment, livelihood promotion, vocational training, environmental awareness, entrepreneurship development and community welfare across Jharkhand.
              </p>
              <p className="mt-5 text-slate-600 leading-relaxed">
                We believe in empowering marginalized communities with practical opportunities that improve lives, create employment, strengthen rural economies and encourage self-reliance.
              </p>
              <Link to="/about" data-testid="home-about-link" className="mt-8 inline-flex items-center gap-2 text-emerald-900 font-bold hover:gap-3.5 transition-all">
                Read our story <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PROGRAMS PREVIEW */}
      <section className="py-20 md:py-28 bg-[#F0FDF4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="What We Do" title="Programmes that create lasting change" sub="Fourteen focus areas, one goal — a secure, healthy, educated and dignified life for every woman and child." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROGRAMS.slice(0, 6).map((p, i) => {
              const Icon = Icons[p.icon] || Icons.Star;
              return (
                <Reveal key={p.title} delay={i * 0.06}>
                  <div data-testid={`home-program-card-${i}`} className="card-premium overflow-hidden h-full group">
                    <div className="h-48 overflow-hidden">
                      <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-7">
                      <span className="w-11 h-11 -mt-13 relative rounded-xl bg-emerald-900 text-amber-400 flex items-center justify-center mb-4 shadow-lg" style={{ marginTop: "-2.6rem" }}>
                        <Icon className="w-5 h-5" strokeWidth={1.6} />
                      </span>
                      <h3 className="font-heading text-xl font-bold text-emerald-950">{p.title}</h3>
                      <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal className="text-center mt-12">
            <Link to="/programs" data-testid="home-all-programs-button" className="inline-flex items-center gap-2 bg-emerald-900 hover:bg-emerald-800 text-white font-semibold rounded-full px-8 py-3.5 transition-all hover:-translate-y-0.5 shadow-md shadow-emerald-900/20">
              View all 14 programmes <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="On the Ground" title="Featured projects from 2023–24" sub="Real programmes, real people, documented impact — straight from our Annual Report." />
          <div className="grid md:grid-cols-2 gap-8">
            {PROJECTS.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08}>
                <Link to={`/projects/${p.slug}`} data-testid={`home-project-card-${p.slug}`} className="group block card-premium overflow-hidden">
                  <div className="h-64 overflow-hidden relative">
                    <img src={p.cover} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <span className="absolute top-4 left-4 backdrop-blur-md bg-white/85 text-emerald-950 text-xs font-bold px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-amber-700" /> {p.location}
                    </span>
                  </div>
                  <div className="p-7">
                    <h3 className="font-heading text-2xl font-bold text-emerald-950 group-hover:text-emerald-800 transition-colors">{p.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{p.summary}</p>
                    <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-amber-700">
                      {p.beneficiaries} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DIRECTOR QUOTE */}
      <section className="py-20 md:py-28 bg-emerald-950 relative overflow-hidden grain">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <Reveal>
            <Quote className="w-12 h-12 text-amber-500 mx-auto mb-8" strokeWidth={1.2} />
            <p className="font-heading text-2xl md:text-3xl text-white leading-relaxed">
              "Reaching the most marginalized section of our society — empowering women and the girl child through skill development and health awareness — has been our primary goal."
            </p>
            <p className="mt-8 text-amber-400 font-bold">{ORG.director}</p>
            <p className="text-emerald-200/60 text-sm">Director, {ORG.short}</p>
          </Reveal>
        </div>
      </section>

      {/* GALLERY STRIP */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Moments of Change" title="From our field diary" center />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[GALLERY[15], GALLERY[11], GALLERY[24], GALLERY[33], GALLERY[6], GALLERY[1], GALLERY[36], GALLERY[21]].map((g, i) => (
              <Reveal key={g.src} delay={i * 0.05}>
                <Link to="/gallery" className="block overflow-hidden rounded-2xl group relative">
                  <img src={g.src} alt={g.caption} className="w-full h-44 md:h-52 object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-emerald-950/0 group-hover:bg-emerald-950/30 transition-colors" />
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="text-center mt-12">
            <Link to="/gallery" data-testid="home-gallery-button" className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold rounded-full px-8 py-3.5 transition-all">
              Explore the full gallery — {GALLERY.length} photographs <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-amber-600 to-amber-700 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <Reveal>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white tracking-tight">Be the reason a life changes today.</h2>
            <p className="mt-3 text-amber-50/90 max-w-xl">Join us as a volunteer, partner or donor — and help build a Jharkhand where every woman and child thrives.</p>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-wrap gap-3.5 shrink-0">
            <Link to="/donate" data-testid="cta-donate-button" className="inline-flex items-center gap-2 bg-white text-amber-800 font-bold rounded-full px-8 py-3.5 shadow-lg transition-all hover:-translate-y-0.5">
              Donate Now
            </Link>
            <Link to="/volunteer" data-testid="cta-volunteer-button" className="inline-flex items-center gap-2 border-2 border-white/70 text-white font-bold rounded-full px-8 py-3.5 hover:bg-white/10 transition-all">
              Volunteer
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
