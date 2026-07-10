import { Target, Eye, Scale, CalendarDays, Award, Users2, Quote } from "lucide-react";
import { ORG, DIRECTOR_MESSAGE } from "../data/content";
import { Reveal, SectionHeading, PageHero } from "../components/shared";

const TIMELINE = [
  { year: "2020", text: "AASW is established on 19 September 2020 as a Section 8 Company under the Companies Act, 2013, with a vision of sustainable social development in Jharkhand." },
  { year: "2021–22", text: "Grassroots groundwork begins — community mobilisation, women's group formation and need assessments across Ranchi and Khunti districts." },
  { year: "2023", text: "A landmark year: CSR, 12A and 80G registrations obtained; the Health Camp at Ranchi Women's College screens 125 students; free computer training launches in Upper Bazar." },
  { year: "2024", text: "The NABARD-supported MEDP Dhoop Batti programme trains 30 women in Murhu, Khunti and International Mahila Diwas is celebrated — 1,619 young lives reached through 7 projects." },
];

const OBJECTIVES = [
  "Empower disadvantaged women and girl children through education and skill development",
  "Promote preventive healthcare and health awareness in communities and campuses",
  "Create sustainable livelihoods and micro-enterprises in rural Jharkhand",
  "Build digital literacy and employability among underprivileged youth",
  "Encourage entrepreneurship, self-help groups and financial independence",
  "Foster inclusion, equality, dignity and social justice at the grassroots",
];

export default function About() {
  return (
    <div data-testid="about-page">
      <PageHero eyebrow="About Us" title="Our journey of empowerment since 2020" sub="From a bold idea in Ranchi to 1,619 young lives reached across Jharkhand — this is the story of Arshi Association for Social Welfare." image="/images/7.jpeg" />

      {/* STORY */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          <div>
            <SectionHeading eyebrow="Our Story" title="Established for impact, built on trust" />
            <Reveal className="-mt-6 space-y-5 text-slate-600 leading-relaxed">
              <p>
                {ORG.name} (AASW) was established on <strong className="text-emerald-950">{ORG.established}</strong> and is registered as a <strong className="text-emerald-950">Section 8 Company under the Companies Act, 2013</strong> with the Ministry of Corporate Affairs — a legal structure that binds us to non-profit purpose, governance and transparency.
              </p>
              <p>
                Our objective is to create sustainable social development through education, healthcare, women empowerment, livelihood promotion, vocational training, environmental awareness, entrepreneurship development and community welfare across Jharkhand.
              </p>
              <p>
                During the reporting period 2023–24, AASW successfully reached <strong className="text-emerald-950">1,619 young lives through seven different projects</strong> across Jharkhand, focusing on women empowerment, girl child development, health awareness and skill development.
              </p>
              <p>
                We believe in empowering marginalized communities by providing practical opportunities that improve lives, create employment, strengthen rural economies and encourage self-reliance — working hand in hand with partners like NABARD, JSLPS and Ranchi Women's College.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="space-y-4">
            <img src="/images/5.jpeg" alt="Community outreach in Khunti" className="rounded-3xl shadow-xl w-full object-cover aspect-[16/10]" />
            <div className="grid grid-cols-2 gap-4">
              <img src="/images/16.jpeg" alt="Certificate distribution" className="rounded-2xl shadow-lg w-full object-cover aspect-square" />
              <img src="/images/13.jpeg" alt="Computer education" className="rounded-2xl shadow-lg w-full object-cover aspect-square" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* MISSION VISION */}
      <section className="py-20 md:py-28 bg-[#F0FDF4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Purpose" title="Mission, vision & values" center />
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Reveal>
              <div data-testid="mission-card" className="card-premium p-9 h-full border-t-4 border-t-emerald-800">
                <span className="w-13 h-13 rounded-2xl bg-emerald-900 text-amber-400 flex items-center justify-center mb-6 w-12 h-12">
                  <Target className="w-6 h-6" strokeWidth={1.6} />
                </span>
                <h3 className="font-heading text-2xl font-bold text-emerald-950">Our Mission</h3>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  To unlock the potential of disadvantaged women, children and marginalized communities through education, healthcare, livelihood skills, vocational training and community development — while promoting inclusion, equality, dignity and social justice. Child and gender development, and social welfare, are fundamental to everything we do.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div data-testid="vision-card" className="card-premium p-9 h-full border-t-4 border-t-amber-600">
                <span className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6" strokeWidth={1.6} />
                </span>
                <h3 className="font-heading text-2xl font-bold text-emerald-950">Our Vision</h3>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  A society where every woman and child enjoys a secure, healthy, educated and dignified life — supported by a responsive environment and real opportunities for social, economic, cultural and moral development.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-14 max-w-5xl mx-auto">
            <div className="card-premium p-9">
              <div className="flex items-center gap-3 mb-6">
                <Scale className="w-6 h-6 text-amber-700" strokeWidth={1.6} />
                <h3 className="font-heading text-2xl font-bold text-emerald-950">Our Objectives</h3>
              </div>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                {OBJECTIVES.map((o) => (
                  <li key={o} className="flex gap-3 text-slate-600 text-sm leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-2" /> {o}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Milestones" title="The journey so far" center />
          <div className="relative" data-testid="timeline">
            <span className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-emerald-100 md:-translate-x-px" />
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.05} className={`relative pl-14 md:pl-0 pb-12 md:w-1/2 ${i % 2 ? "md:ml-auto md:pl-14" : "md:pr-14 md:text-right"}`}>
                <span className={`absolute top-1 left-3 md:left-auto ${i % 2 ? "md:-left-2.5" : "md:-right-2.5"} w-5 h-5 rounded-full bg-amber-500 border-4 border-white shadow-md`} />
                <p className="font-heading text-2xl font-bold text-emerald-900">{t.year}</p>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DIRECTOR'S MESSAGE */}
      <section className="py-20 md:py-28 bg-emerald-950 relative overflow-hidden grain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="From the Director's Desk" title="A message from Ashutosh Kumar" light />
          <div className="grid lg:grid-cols-[340px_1fr] gap-12 items-start" data-testid="director-message">
            <Reveal>
              <div className="rounded-3xl overflow-hidden border border-emerald-800/60 shadow-2xl">
                <img src="/images/director.jpeg" alt="Ashutosh Kumar, Director of AASW" className="w-full object-cover aspect-[4/3] lg:aspect-[3/4] object-center" />
              </div>
              <div className="mt-5 text-center">
                <p className="font-heading text-xl font-bold text-white">{ORG.director}</p>
                <p className="text-amber-400 text-sm font-semibold">Director, {ORG.short}</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="backdrop-blur-xl bg-white/[0.05] border border-white/10 rounded-3xl p-8 md:p-10 relative">
                <Quote className="w-10 h-10 text-amber-500/70 mb-6" strokeWidth={1.2} />
                <div className="space-y-5 text-emerald-50/85 leading-relaxed">
                  {DIRECTOR_MESSAGE.map((p, i) => <p key={i}>{p}</p>)}
                </div>
                <p className="mt-8 font-heading text-2xl text-amber-400 italic">— Ashutosh Kumar</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* QUICK FACTS */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-3 gap-6">
          {[
            { icon: CalendarDays, k: "Established", v: "19 September 2020" },
            { icon: Award, k: "Legal Status", v: "Section 8 Company, Companies Act 2013" },
            { icon: Users2, k: "Operational Area", v: "All districts of Jharkhand" },
          ].map((f, i) => (
            <Reveal key={f.k} delay={i * 0.06}>
              <div className="card-premium p-7 flex items-start gap-4">
                <f.icon className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" strokeWidth={1.6} />
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] font-bold text-slate-400">{f.k}</p>
                  <p className="mt-1.5 font-semibold text-emerald-950">{f.v}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
