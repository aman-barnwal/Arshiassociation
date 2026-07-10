import { Link } from "react-router-dom";
import { GraduationCap, Stethoscope, HeartHandshake, Wrench, Tractor, Sprout, BadgePercent, Clock, Mail, ShieldCheck } from "lucide-react";
import { ORG } from "../data/content";
import { Reveal, SectionHeading, PageHero } from "../components/shared";

const IMPACT_AREAS = [
  { icon: GraduationCap, title: "Education", desc: "Fund free computer classes and learning support for underprivileged youth." },
  { icon: Stethoscope, title: "Healthcare", desc: "Sponsor free health camps, screenings and counselling for women and students." },
  { icon: HeartHandshake, title: "Women Empowerment", desc: "Back SHGs, leadership training and enterprise programmes for rural women." },
  { icon: Wrench, title: "Vocational Training", desc: "Equip a trainee with job-ready skills — from beautician courses to digital literacy." },
  { icon: Tractor, title: "Rural Development", desc: "Strengthen village economies through micro-enterprise and market linkage." },
  { icon: Sprout, title: "Sustainable Livelihoods", desc: "Help families move from daily wage uncertainty to self-reliant incomes." },
];

export default function Donate() {
  return (
    <div data-testid="donate-page">
      <PageHero eyebrow="Donate" title="Your generosity becomes someone's opportunity" sub="Every rupee you give is converted into training, healthcare, education and dignity for women, children and youth across Jharkhand." image="/images/17.jpeg" />

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Where Your Money Goes" title="Six ways your contribution creates change" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {IMPACT_AREAS.map((a, i) => (
              <Reveal key={a.title} delay={(i % 3) * 0.06}>
                <div data-testid={`donate-area-${i}`} className="card-premium p-8 h-full">
                  <span className="w-12 h-12 rounded-xl bg-emerald-900 text-amber-400 flex items-center justify-center mb-5">
                    <a.icon className="w-6 h-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-heading text-xl font-bold text-emerald-950">{a.title}</h3>
                  <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16">
            <div data-testid="donate-gateway-notice" className="rounded-3xl bg-emerald-950 p-10 md:p-14 text-white text-center relative overflow-hidden grain">
              <span className="relative inline-flex items-center gap-2 bg-amber-600/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-[0.18em] px-5 py-2.5 rounded-full mb-7">
                <Clock className="w-4 h-4" /> Online payment gateway coming soon
              </span>
              <h2 className="relative font-heading text-3xl md:text-4xl font-bold tracking-tight">Want to donate right now?</h2>
              <p className="relative mt-4 text-emerald-100/75 max-w-2xl mx-auto leading-relaxed">
                Secure online donations are being set up. Until then, please write to us and our team will personally guide you through the contribution process — for individuals as well as CSR partners.
              </p>
              <div className="relative mt-8 flex flex-wrap justify-center gap-4">
                <a href={`mailto:${ORG.email}?subject=Donation to AASW`} data-testid="donate-email-button" className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-full px-8 py-3.5 shadow-lg shadow-amber-900/25 transition-all hover:-translate-y-0.5">
                  <Mail className="w-4 h-4" /> {ORG.email}
                </a>
                <Link to="/contact" data-testid="donate-contact-button" className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-bold rounded-full px-8 py-3.5 hover:bg-white/10 transition-all">
                  Contact us
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="mt-14 grid sm:grid-cols-2 gap-7 max-w-4xl mx-auto">
            <Reveal>
              <div className="card-premium p-8 flex gap-5">
                <BadgePercent className="w-9 h-9 text-amber-700 shrink-0" strokeWidth={1.4} />
                <div>
                  <h3 className="font-heading text-lg font-bold text-emerald-950">80G tax benefits</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">Donations to AASW are eligible for tax deduction under Section 80G (Registration No. AAUCA0662P22PT02, valid 2023–28).</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="card-premium p-8 flex gap-5">
                <ShieldCheck className="w-9 h-9 text-amber-700 shrink-0" strokeWidth={1.4} />
                <div>
                  <h3 className="font-heading text-lg font-bold text-emerald-950">CSR-ready</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">With CSR Registration No. CSR00055256, corporates can channel CSR funds to AASW programmes with full compliance.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
