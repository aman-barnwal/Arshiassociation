import * as Icons from "lucide-react";
import { Link } from "react-router-dom";
import { Handshake, ArrowRight, Mail } from "lucide-react";
import { PARTNERS, ORG } from "../data/content";
import { Reveal, SectionHeading, PageHero } from "../components/shared";

export default function Partners() {
  return (
    <div data-testid="partners-page">
      <PageHero eyebrow="Our Partners" title="Change is a collaboration" sub="AASW's impact is multiplied by institutions that believe in grassroots development. We are proud to work alongside these partners." image="/images/25.jpeg" />

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {PARTNERS.map((p, i) => {
              const Icon = Icons[p.icon] || Handshake;
              return (
                <Reveal key={p.name} delay={i * 0.08}>
                  <div data-testid={`partner-card-${i}`} className="card-premium p-9 h-full text-center group">
                    <span className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-900 flex items-center justify-center mb-6 group-hover:bg-emerald-900 group-hover:text-amber-400 transition-colors duration-300">
                      <Icon className="w-8 h-8" strokeWidth={1.4} />
                    </span>
                    <h3 className="font-heading text-2xl font-bold text-emerald-950">{p.name}</h3>
                    <p className="mt-1.5 text-xs uppercase tracking-[0.14em] font-bold text-amber-700">{p.full}</p>
                    <p className="mt-4 text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="mt-16">
            <div className="rounded-3xl bg-gradient-to-br from-emerald-900 to-emerald-950 p-10 md:p-14 text-center text-white relative overflow-hidden grain">
              <Handshake className="w-11 h-11 text-amber-400 mx-auto mb-6 relative" strokeWidth={1.3} />
              <h2 className="relative font-heading text-3xl md:text-4xl font-bold tracking-tight">Partner with AASW</h2>
              <p className="relative mt-4 text-emerald-100/75 max-w-2xl mx-auto leading-relaxed">
                We welcome CSR partnerships, institutional collaborations and joint programmes. With CSR Registration No. CSR00055256 and complete statutory compliance, partnering with us is simple and transparent.
              </p>
              <div className="relative mt-8 flex flex-wrap justify-center gap-4">
                <a href={`mailto:${ORG.partnershipEmail}`} data-testid="partner-email-button" className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-full px-8 py-3.5 shadow-lg shadow-amber-900/25 transition-all hover:-translate-y-0.5">
                  <Mail className="w-4 h-4" /> {ORG.partnershipEmail}
                </a>
                <Link to="/contact" data-testid="partner-contact-button" className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-bold rounded-full px-8 py-3.5 hover:bg-white/10 transition-all">
                  Contact us <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
