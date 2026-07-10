import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { MapPin, Phone, Mail, User, Send, Loader2, CheckCircle2, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { ORG } from "../data/content";
import { Reveal, SectionHeading, PageHero } from "../components/shared";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const INFO = [
  { icon: MapPin, k: "Registered Office", v: ORG.address },
  { icon: User, k: "Director", v: ORG.director },
  { icon: Phone, k: "Phone", v: `${ORG.phone} • Office: ${ORG.officePhone}` },
  { icon: Mail, k: "Email", v: `${ORG.email} • Partnerships: ${ORG.partnershipEmail}` },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, form);
      setDone(true);
      toast.success("Message sent! We'll get back to you soon.");
    } catch {
      toast.error("Could not send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="contact-page">
      <PageHero eyebrow="Contact Us" title="We'd love to hear from you" sub="Questions, partnerships, media or volunteering — reach out and the AASW team in Ranchi will respond promptly." image="/images/44.jpeg" />

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {INFO.map((f, i) => (
              <Reveal key={f.k} delay={i * 0.06}>
                <div data-testid={`contact-info-card-${i}`} className="card-premium p-7 h-full">
                  <span className="w-11 h-11 rounded-xl bg-emerald-900 text-amber-400 flex items-center justify-center mb-4">
                    <f.icon className="w-5 h-5" strokeWidth={1.6} />
                  </span>
                  <p className="text-xs uppercase tracking-[0.16em] font-bold text-slate-400">{f.k}</p>
                  <p className="mt-2 text-sm font-medium text-emerald-950 leading-relaxed break-words">{f.v}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <Reveal>
              <SectionHeading eyebrow="Write To Us" title="Send a message" />
              {done ? (
                <div data-testid="contact-success" className="card-premium p-12 text-center -mt-4">
                  <CheckCircle2 className="w-14 h-14 text-emerald-700 mx-auto mb-5" strokeWidth={1.4} />
                  <h3 className="font-heading text-2xl font-bold text-emerald-950">Message sent!</h3>
                  <p className="mt-3 text-slate-600">Thank you for reaching out. We'll reply to {form.email} shortly.</p>
                </div>
              ) : (
                <form onSubmit={submit} data-testid="contact-form" className="card-premium p-8 md:p-10 space-y-5 -mt-4">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-emerald-950 mb-1.5">Name *</label>
                      <input required data-testid="contact-name-input" value={form.name} onChange={set("name")} placeholder="Your name" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-emerald-950 mb-1.5">Phone</label>
                      <input data-testid="contact-phone-input" value={form.phone} onChange={set("phone")} placeholder="+91" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-emerald-950 mb-1.5">Email *</label>
                    <input required type="email" data-testid="contact-email-input" value={form.email} onChange={set("email")} placeholder="you@example.com" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-emerald-950 mb-1.5">Subject *</label>
                    <input required data-testid="contact-subject-input" value={form.subject} onChange={set("subject")} placeholder="How can we help?" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-emerald-950 mb-1.5">Message *</label>
                    <textarea required rows={5} data-testid="contact-message-input" value={form.message} onChange={set("message")} placeholder="Write your message..." className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent resize-none" />
                  </div>
                  <button type="submit" disabled={loading} data-testid="contact-submit-button" className="w-full inline-flex items-center justify-center gap-2 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold rounded-full px-8 py-4 shadow-md shadow-emerald-900/20 transition-all hover:-translate-y-0.5">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send Message
                  </button>
                </form>
              )}
            </Reveal>

            <Reveal delay={0.1}>
              <SectionHeading eyebrow="Find Us" title="Our office in Ranchi" />
              <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-100 -mt-4" data-testid="contact-map">
                <iframe
                  title="AASW Office Location - Lalpur, Ranchi"
                  src="https://www.google.com/maps?q=Vandana+Apartment,+Lalpur,+Ranchi,+Jharkhand+834001&output=embed"
                  className="w-full h-[380px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="mt-7 card-premium p-7">
                <p className="text-xs uppercase tracking-[0.16em] font-bold text-slate-400 mb-4">Follow our journey (coming soon)</p>
                <div className="flex gap-3">
                  {[["Facebook", Facebook], ["Instagram", Instagram], ["Twitter", Twitter], ["YouTube", Youtube]].map(([name, Icon]) => (
                    <a key={name} href="#social" data-testid={`contact-social-${name.toLowerCase()}`} aria-label={name} className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-900 flex items-center justify-center hover:bg-emerald-900 hover:text-amber-400 transition-colors">
                      <Icon className="w-5 h-5" strokeWidth={1.6} />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
