import * as Icons from "lucide-react";
import { ShieldCheck, FileBadge } from "lucide-react";
import { COMPLIANCE } from "../data/content";
import { Reveal, SectionHeading, PageHero } from "../components/shared";

export default function Transparency() {
  return (
    <div data-testid="transparency-page">
      <PageHero eyebrow="Transparency & Compliance" title="Accountability you can verify" sub="AASW is registered under the Ministry of Corporate Affairs and holds every statutory registration required of a credible non-profit. Verify us — we welcome it." image="/images/42.jpeg" />

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {COMPLIANCE.map((c, i) => {
              const Icon = Icons[c.icon] || ShieldCheck;
              return (
                <Reveal key={c.label} delay={(i % 3) * 0.07}>
                  <div data-testid={`compliance-card-${i}`} className="card-premium p-8 h-full relative overflow-hidden group">
                    <span className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[3rem] group-hover:bg-amber-50 transition-colors" />
                    <span className="relative w-12 h-12 rounded-xl bg-emerald-900 text-amber-400 flex items-center justify-center mb-6 shadow-md">
                      <Icon className="w-5.5 h-5.5 w-6 h-6" strokeWidth={1.5} />
                    </span>
                    <p className="relative text-xs uppercase tracking-[0.16em] font-bold text-slate-400">{c.label}</p>
                    <p className="relative mt-2.5 font-mono text-lg font-bold text-emerald-950 break-all">{c.value}</p>
                    <p className="relative mt-3.5 text-sm text-slate-500 leading-relaxed">{c.note}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="mt-14">
            <div className="rounded-3xl bg-emerald-950 p-9 md:p-12 text-white flex flex-col md:flex-row items-start md:items-center gap-7 grain relative overflow-hidden">
              <FileBadge className="w-12 h-12 text-amber-400 shrink-0 relative" strokeWidth={1.3} />
              <div className="relative">
                <h3 className="font-heading text-2xl font-bold">Tax benefits for donors</h3>
                <p className="mt-2.5 text-emerald-100/75 leading-relaxed max-w-3xl">
                  With valid 12A and 80G registrations (valid 2023–28) and CSR Registration No. CSR00055256, contributions to AASW are eligible for income tax deduction under Section 80G, and corporates can route CSR funds to our programmes with complete statutory compliance. Certificates are available on request and will be uploaded here soon.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 bg-[#F0FDF4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading center eyebrow="Registered & Verifiable" title="Section 8 Company under the Companies Act, 2013" sub="Established 19 September 2020 • Ministry of Corporate Affairs, Government of India • Operational across all districts of Jharkhand." />
        </div>
      </section>
    </div>
  );
}
