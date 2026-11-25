import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, Menu, ShieldCheck, WifiOff, X } from "lucide-react";
import { api } from "../../services/api";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [online, setOnline] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const res = await api.getHealth();
        if (mounted) setOnline(res.model_loaded);
      } catch {
        if (mounted) setOnline(false);
      }
    };
    check();
    const interval = setInterval(check, 12000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { path: "/", label: "Overview" },
    { path: "/assessment", label: "Patient Assessment" },
    { path: "/analytics", label: "Model Analytics" },
    { path: "/history", label: "Audit Log" },
  ];

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-8 pt-4 pb-2">
      <nav className="max-w-6xl mx-auto rounded-full bg-[#1b201d]/75 backdrop-blur-2xl border border-white/10 px-5 sm:px-7 py-3 flex items-center justify-between shadow-2xl shadow-black/40">
        {/* Brand Logo (Ref 1 Style) */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-[#272f2a] border border-white/15 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-all shadow-inner">
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-lg tracking-tight text-white group-hover:text-amber-200 transition-colors">
              DiaPredict<span className="text-amber-400 font-sans font-bold text-xs ml-0.5">AI</span>
            </span>
          </div>
        </Link>

        {/* Centered Minimal Links with Bullet Separators (Directly Inspired by Ref 1!) */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-medium tracking-wide text-[#b8c0b6]">
          {navLinks.map((link, idx) => {
            const active = location.pathname === link.path;
            return (
              <React.Fragment key={link.path}>
                <Link
                  to={link.path}
                  className={`transition-all ${
                    active
                      ? "text-white font-semibold underline underline-offset-8 decoration-amber-400/80 decoration-2"
                      : "hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
                {idx < navLinks.length - 1 && <span className="text-[#525d54] text-[8px]">•</span>}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right Status Pill & CTA */}
        <div className="flex items-center gap-3">
          <div
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border ${
              online === null
                ? "bg-white/5 text-slate-400 border-white/10"
                : online
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/25"
                : "bg-rose-500/10 text-rose-300 border-rose-500/25"
            }`}
          >
            {online ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>FastAPI Active</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-rose-400" />
                <span>Offline</span>
              </>
            )}
          </div>

          <Link
            to="/assessment"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs text-white border border-white/15 transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Intake</span>
          </Link>

          {/* Mobile / Tablet Menu Toggle (< 1024px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile / Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-4 rounded-2xl bg-[#1b201d]/95 backdrop-blur-2xl border border-white/10 space-y-2 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-xl text-xs font-medium ${
                location.pathname === link.path
                  ? "bg-white/10 text-white font-semibold"
                  : "text-slate-300 hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/assessment"
            onClick={() => setMobileMenuOpen(false)}
            className="block sm:hidden px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 text-center mt-2"
          >
            Run Clinical Intake →
          </Link>
        </div>
      )}
    </header>
  );
};
