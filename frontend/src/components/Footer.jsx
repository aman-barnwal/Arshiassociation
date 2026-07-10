import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube, Linkedin, Download } from "lucide-react";
import { ORG, NAV_LINKS } from "../data/content";

export const Footer = () => (
  <footer data-testid="main-footer" className="bg-emerald-950 text-emerald-100/80 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      <div className="lg:col-span-1">
        <div className="flex items-center gap-2.5 mb-5">
          <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-emerald-800 overflow-hidden">
            <img src="/images/logo.jpeg" alt="AASW logo" className="w-full h-full object-contain p-0.5" />
          </span>
          <div>
            <p className="font-heading font-bold text-white text-lg leading-tight">AASW</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-300/60">Est. 2020 • Ranchi</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed">
          {ORG.name} is a Section 8 Company creating sustainable social development across Jharkhand through education, healthcare, women empowerment and livelihood promotion.
        </p>
        <div className="flex gap-2.5 mt-6">
          {[Facebook, Instagram, Twitter, Youtube, Linkedin].map((Icon, i) => (
            <a key={i} href="#social" data-testid={`footer-social-${i}`} aria-label="Social media" className="w-9 h-9 rounded-full bg-emerald-900/70 border border-emerald-800/60 flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 transition-colors">
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-heading text-white font-semibold text-lg mb-5">Quick Links</h4>
        <ul className="space-y-2.5 text-sm">
          {NAV_LINKS.slice(1, 8).map((l) => (
            <li key={l.to}><Link to={l.to} className="hover:text-amber-400 transition-colors">{l.label}</Link></li>
          ))}
          <li><Link to="/transparency" className="hover:text-amber-400 transition-colors">Transparency & Compliance</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-heading text-white font-semibold text-lg mb-5">Get Involved</h4>
        <ul className="space-y-2.5 text-sm">
          <li><Link to="/volunteer" className="hover:text-amber-400 transition-colors">Volunteer With Us</Link></li>
          <li><Link to="/donate" className="hover:text-amber-400 transition-colors">Donate</Link></li>
          <li><Link to="/partners" className="hover:text-amber-400 transition-colors">Partner With Us</Link></li>
          <li>
            <a href={ORG.reportPdf} download data-testid="footer-download-report" className="inline-flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <Download className="w-3.5 h-3.5" /> Annual Report 2023–24
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-heading text-white font-semibold text-lg mb-5">Contact</h4>
        <ul className="space-y-3.5 text-sm">
          <li className="flex gap-3"><MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /><span>{ORG.address}</span></li>
          <li className="flex gap-3"><Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /><span>{ORG.phone}<br />{ORG.officePhone} (Office)</span></li>
          <li className="flex gap-3"><Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /><span>{ORG.email}<br />{ORG.partnershipEmail} (Partnerships)</span></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-300/50">
        <p>© {new Date().getFullYear()} {ORG.name}. All rights reserved.</p>
        <p>CIN: U85320JH2020NPL015168 • NGO Darpan: JH/2020/0267108</p>
      </div>
    </div>
  </footer>
);
