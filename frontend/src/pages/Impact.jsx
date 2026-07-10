import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Link } from "react-router-dom";
import { TrendingUp, ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import { STATS, BENEFICIARY_DATA } from "../data/content";
import { Reveal, SectionHeading, PageHero, CountUp } from "../components/shared";

const STAT_ICONS = ["Users", "FolderCheck", "HeartPulse", "Sparkles", "Monitor", "Flower2"];
const COLORS = ["#065F46", "#D97706", "#047857", "#B45309"];

export default function Impact() {
  return (
    <div data-testid="impact-page">
      <PageHero eyebrow="Our Impact 2023–24" title="Numbers that carry names and stories" sub="Every figure below represents a real person whose life was touched by AASW's work — documented in our Annual Report 2023–24." image="/images/33.jpeg" />

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {STATS.map((s, i) => {
              const Icon = Icons[STAT_ICONS[i]] || Icons.Star;
              return (
                <Reveal key={s.label} delay={(i % 3) * 0.07}>
                  <div data-testid={`impact-stat-card-${i}`} className="card-premium p-9 text-center relative overflow-hidden group">
                    <span className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-emerald-50 group-hover:scale-125 transition-transform duration-500" />
                    <span className="relative w-14 h-14 mx-auto rounded-2xl bg-emerald-900 text-amber-400 flex items-center justify-center mb-6 shadow-lg shadow-emerald-900/20">
                      <Icon className="w-6.5 h-6.5 w-7 h-7" strokeWidth={1.5} />
                    </span>
                    <p className="relative font-heading text-5xl font-bold text-emerald-950">
                      <CountUp value={s.value} suffix={s.suffix} />
                    </p>
                    <p className="relative mt-3 text-sm uppercase tracking-[0.14em] font-bold text-slate-500">{s.label}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#F0FDF4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Data From The Annual Report" title="Project-wise beneficiaries, 2023–24" sub="A transparent look at where our work reached people — from the villages of Khunti to the campuses of Ranchi." />
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 items-stretch">
            <Reveal>
              <div className="card-premium p-6 md:p-9 h-full" data-testid="impact-chart">
                <div className="flex items-center gap-2.5 mb-8">
                  <TrendingUp className="w-5 h-5 text-amber-700" />
                  <h3 className="font-heading text-xl font-bold text-emerald-950">Beneficiaries by programme</h3>
                </div>
                <ResponsiveContainer width="100%" height={340}>
                  <BarChart data={BENEFICIARY_DATA} margin={{ top: 8, right: 8, left: -18, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#475569" }} interval={0} angle={-12} textAnchor="end" height={58} />
                    <YAxis tick={{ fontSize: 12, fill: "#475569" }} />
                    <Tooltip cursor={{ fill: "rgba(6,78,59,0.05)" }} contentStyle={{ borderRadius: 14, border: "1px solid #E2E8F0", fontSize: 13 }} />
                    <Bar dataKey="beneficiaries" radius={[10, 10, 0, 0]} maxBarSize={64}>
                      {BENEFICIARY_DATA.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="bg-emerald-950 rounded-3xl p-8 md:p-9 h-full text-white grain relative overflow-hidden">
                <h3 className="font-heading text-xl font-bold mb-7">Programme reach at a glance</h3>
                <ul className="space-y-5 relative">
                  {BENEFICIARY_DATA.map((b, i) => (
                    <li key={b.name} data-testid={`impact-table-row-${i}`} className="flex items-center justify-between gap-4 border-b border-white/10 pb-5 last:border-0">
                      <div>
                        <p className="font-semibold text-sm">{b.name}</p>
                        <p className="text-xs text-emerald-200/60 mt-0.5">{b.place}</p>
                      </div>
                      <p className="font-heading text-3xl font-bold text-amber-400">{b.beneficiaries}</p>
                    </li>
                  ))}
                </ul>
                <p className="relative mt-7 text-xs text-emerald-200/60 leading-relaxed">
                  Combined with school- and community-level engagements, AASW touched <strong className="text-amber-400">1,619 young lives</strong> through <strong className="text-amber-400">7 projects</strong> across Jharkhand in 2023–24.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading center eyebrow="Verified & Documented" title="Read the full Annual Report" sub="Every number on this page is drawn from our published Annual Report 2023–24." />
          <Reveal className="-mt-6 flex flex-wrap justify-center gap-4">
            <Link to="/annual-reports" data-testid="impact-report-button" className="inline-flex items-center gap-2 bg-emerald-900 hover:bg-emerald-800 text-white font-semibold rounded-full px-8 py-3.5 transition-all hover:-translate-y-0.5 shadow-md shadow-emerald-900/20">
              View Annual Reports <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/transparency" data-testid="impact-transparency-button" className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold rounded-full px-8 py-3.5 transition-all">
              Transparency & Compliance
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
