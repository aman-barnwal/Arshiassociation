import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { HandHeart, Stethoscope, GraduationCap, Megaphone, Sprout, Users, Loader2, CheckCircle2 } from "lucide-react";
import { Reveal, SectionHeading, PageHero } from "../components/shared";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ROLES = [
  { icon: Megaphone, title: "Awareness Campaigns", desc: "Help spread awareness on health, education and women's rights in communities and campuses." },
  { icon: Stethoscope, title: "Health Camps", desc: "Doctors, nurses and health workers can support our free screening and counselling camps." },
  { icon: GraduationCap, title: "Education Programmes", desc: "Educators and students can teach, mentor and run digital literacy sessions for youth." },
  { icon: Sprout, title: "Livelihood Initiatives", desc: "Professionals can train women's groups in enterprise, marketing and financial literacy." },
  { icon: Users, title: "Community Development", desc: "Social workers can engage with WSHGs and children in need of care and protection." },
];

const INTERESTS = ["Awareness Campaigns", "Health Camps", "Education Programmes", "Livelihood Initiatives", "Community Development"];

export default function Volunteer() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", profession: "", availability: "", message: "" });
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const toggle = (i) => setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/volunteer`, { ...form, areas_of_interest: interests });
      setDone(true);
      toast.success("Thank you! Your volunteer application has been received.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="volunteer-page">
      <PageHero eyebrow="Volunteer" title="Lend your time. Change a life." sub="Students, professionals, doctors, educators, social workers and citizens — there is a place for you in this movement." image="/images/8.jpeg" />

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Ways To Contribute" title="Where volunteers make the difference" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-24">
            {ROLES.map((r, i) => (
              <Reveal key={r.title} delay={(i % 3) * 0.06}>
                <div data-testid={`volunteer-role-${i}`} className="card-premium p-8 h-full">
                  <span className="w-12 h-12 rounded-xl bg-emerald-900 text-amber-400 flex items-center justify-center mb-5">
                    <r.icon className="w-5.5 h-5.5 w-6 h-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-heading text-xl font-bold text-emerald-950">{r.title}</h3>
                  <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{r.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <Reveal>
              <SectionHeading eyebrow="Join Us" title="Volunteer application" sub="Fill in the form and our team will reach out to you within a few days." />
              <img src="/images/28.jpeg" alt="AASW volunteers and trainees" className="rounded-3xl shadow-xl w-full object-cover aspect-[4/3] -mt-4" />
            </Reveal>

            <Reveal delay={0.1}>
              {done ? (
                <div data-testid="volunteer-success" className="card-premium p-12 text-center">
                  <CheckCircle2 className="w-14 h-14 text-emerald-700 mx-auto mb-5" strokeWidth={1.4} />
                  <h3 className="font-heading text-2xl font-bold text-emerald-950">Application received!</h3>
                  <p className="mt-3 text-slate-600">Thank you for stepping forward, {form.name.split(" ")[0]}. Our team will contact you at {form.email} soon.</p>
                </div>
              ) : (
                <form onSubmit={submit} data-testid="volunteer-form" className="card-premium p-8 md:p-10 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-emerald-950 mb-1.5">Full name *</label>
                      <input required data-testid="volunteer-name-input" value={form.name} onChange={set("name")} placeholder="Your name" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-emerald-950 mb-1.5">Phone *</label>
                      <input required data-testid="volunteer-phone-input" value={form.phone} onChange={set("phone")} placeholder="+91" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-emerald-950 mb-1.5">Email *</label>
                      <input required type="email" data-testid="volunteer-email-input" value={form.email} onChange={set("email")} placeholder="you@example.com" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-emerald-950 mb-1.5">Profession</label>
                      <input data-testid="volunteer-profession-input" value={form.profession} onChange={set("profession")} placeholder="Student, doctor, educator..." className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-emerald-950 mb-2">Areas of interest</label>
                    <div className="flex flex-wrap gap-2">
                      {INTERESTS.map((i) => (
                        <button type="button" key={i} data-testid={`volunteer-interest-${i.toLowerCase().replace(/\s/g, "-")}`} onClick={() => toggle(i)} className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${interests.includes(i) ? "bg-emerald-900 text-white" : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100"}`}>
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-emerald-950 mb-1.5">Availability</label>
                    <select data-testid="volunteer-availability-select" value={form.availability} onChange={set("availability")} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600">
                      <option value="">Select availability</option>
                      <option>Weekends</option>
                      <option>Weekdays</option>
                      <option>Full-time</option>
                      <option>Event-based / occasional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-emerald-950 mb-1.5">Why do you want to volunteer?</label>
                    <textarea rows={4} data-testid="volunteer-message-input" value={form.message} onChange={set("message")} placeholder="Tell us a little about yourself..." className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent resize-none" />
                  </div>
                  <button type="submit" disabled={loading} data-testid="volunteer-submit-button" className="w-full inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-bold rounded-full px-8 py-4 shadow-md shadow-amber-900/15 transition-all hover:-translate-y-0.5">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <HandHeart className="w-4 h-4" />} Submit Application
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
