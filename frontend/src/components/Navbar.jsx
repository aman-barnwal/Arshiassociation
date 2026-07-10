import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";
import { NAV_LINKS } from "../data/content";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const solid = scrolled || !isHome || open;

  return (
    <header
      data-testid="main-navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        solid ? "bg-white/85 backdrop-blur-xl shadow-[0_1px_20px_rgba(6,78,59,0.08)] border-b border-emerald-900/5" : "bg-gradient-to-b from-black/50 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" data-testid="navbar-logo" className="flex items-center gap-2.5 group">
            <span className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform overflow-hidden ${solid ? "bg-white ring-1 ring-emerald-900/10" : "bg-white/95"}`}>
              <img src="/images/logo.jpeg" alt="AASW logo" className="w-full h-full object-contain p-0.5" />
            </span>
            <span className="leading-tight">
              <span className={`block font-heading font-bold text-lg tracking-tight ${solid ? "text-emerald-950" : "text-white"}`}>AASW</span>
              <span className={`block text-[10px] uppercase tracking-[0.18em] ${solid ? "text-emerald-800/70" : "text-white/70"}`}>Social Welfare</span>
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-0.5">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                data-testid={`nav-link-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-full text-[13px] font-semibold transition-colors ${
                    isActive
                      ? solid ? "text-emerald-900 bg-emerald-50" : "text-white bg-white/15"
                      : solid ? "text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/70" : "text-white/85 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/donate" data-testid="nav-donate-button" className="ml-2 inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[13px] font-semibold px-5 py-2.5 rounded-full shadow-md shadow-amber-900/15 transition-all hover:-translate-y-0.5">
              <Heart className="w-3.5 h-3.5" /> Donate
            </Link>
          </nav>

          <button
            data-testid="mobile-menu-toggle"
            onClick={() => setOpen(!open)}
            className={`xl:hidden p-2 rounded-full ${solid ? "text-emerald-950 hover:bg-emerald-50" : "text-white hover:bg-white/10"}`}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            data-testid="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-4 grid grid-cols-2 gap-1">
              {NAV_LINKS.map((l) => (
                <NavLink key={l.to} to={l.to} className={({ isActive }) => `px-4 py-3 rounded-xl text-sm font-semibold ${isActive ? "bg-emerald-50 text-emerald-900" : "text-slate-700 hover:bg-slate-50"}`}>
                  {l.label}
                </NavLink>
              ))}
              <Link to="/donate" className="col-span-2 mt-1 inline-flex items-center justify-center gap-2 bg-amber-600 text-white font-semibold px-5 py-3 rounded-xl">
                <Heart className="w-4 h-4" /> Donate
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
