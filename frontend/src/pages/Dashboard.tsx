import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { BiometricCoreVisual } from "../components/hero/BiometricCoreVisual";
import { GlassAnalyticsDashboard } from "../components/dashboard/GlassAnalyticsDashboard";
import { api } from "../services/api";
import type { ModelInfoResponse } from "../types";

export const Dashboard: React.FC = () => {
  const [modelInfo, setModelInfo] = useState<ModelInfoResponse | null>(null);

  useEffect(() => {
    let mounted = true;
    api
      .getModelInfo()
      .then((data) => {
        if (mounted) setModelInfo(data);
      })
      .catch((err) => {
        console.error("Failed to load model info:", err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* ─────────────────────────────────────────────────────────────
          1. CINEMATIC HERO SECTION (INDIRECTLY MODELED ON REF 1)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-2 sm:pt-6 pb-6 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* LEFT COLUMN: EDITORIAL TYPOGRAPHY & CTAS (REF 1) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-left">
            {/* Social Proof / Validation Eyebrow Badge (Ref 1 Style) */}
            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#1b201d]/80 border border-white/10 text-xs text-[#b8c0b6] shadow-md">
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-[#3c463f] border border-[#232925] flex items-center justify-center text-[9px] text-amber-300 font-bold">
                  98%
                </div>
                <div className="w-5 h-5 rounded-full bg-[#49544c] border border-[#232925] flex items-center justify-center text-[9px] text-emerald-300 font-bold">
                  AI
                </div>
              </div>
              <span className="text-[11px] font-medium text-[#dcded9]">
                Trained on Validated Clinical Cohort (NIDDK)
              </span>
            </div>

            {/* Main Editorial Headline (Ref 1 Style: Serif + Italic Contrast) */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.08] tracking-tight">
              Predict Health. <br />
              <span className="italic text-amber-300 font-light">The Intelligent Way.</span>
            </h1>

            {/* Muted Subtitle with Generous Whitespace */}
            <p className="text-sm sm:text-base text-[#9fa89f] max-w-lg leading-relaxed font-sans font-light">
              Ambient clinical decision support for early diabetic risk stratification — without invasive laboratory
              delays. Engineered with zero-leakage cross-validation to maximize sensitivity and protect patient lives.
            </p>

            {/* Primary Action Button (Ref 1 Pill Style: "CONNECT YOUR SPACE") */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link to="/assessment" className="btn-pill-dark">
                <div className="icon-badge">
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <span>ANALYZE PATIENT RISK</span>
              </Link>

              <Link
                to="/analytics"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-[#b8c0b6] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                <span>View Model Verification</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </Link>
            </div>

            {/* 4 Bottom Step Pills (Directly from Ref 1!) */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-lg">
              {[
                { step: "01", label: "Patient Vitals", desc: "8 Markers" },
                { step: "02", label: "Imputation", desc: "Zero Leakage" },
                { step: "03", label: "Random Forest", desc: "5-Fold CV" },
                { step: "04", label: "Risk Stratum", desc: "Low / High" },
              ].map((item) => (
                <div key={item.step} className="glass-pill p-3 text-left min-w-0">
                  <div className="text-[10px] font-mono text-[#849386] mb-1">{item.step}</div>
                  <div className="text-xs font-semibold text-white truncate">{item.label}</div>
                  <div className="text-[10px] text-[#9fa89f] truncate">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: DOMINANT 3D BIOMETRIC COMPANION CENTERPIECE (REF 1) */}
          <div className="lg:col-span-5 flex items-center justify-center py-2 lg:py-0">
            <BiometricCoreVisual />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. EMBEDDED MASTER ANALYTICS DASHBOARD (REF 2 INSPIRATION)
         ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-amber-300">
            <Activity className="w-3.5 h-3.5" /> Reference-Grade Glassmorphic Telemetry
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            Real-Time Model <span className="italic text-amber-300">Intelligence</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#9fa89f]">
            Inspect live inference telemetry, test partition metrics, and mathematical biomarker attributions
          </p>
        </div>

        {/* Master Glass Dashboard Container */}
        <GlassAnalyticsDashboard modelInfo={modelInfo} />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. CLINICAL SENSITIVITY & AUDIT CALLOUT
         ───────────────────────────────────────────────────────────── */}
      <section className="glass-panel-deep p-8 sm:p-10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" /> Medical ML Engineering Rationale
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              Why 72.2% Clinical Recall <br />
              <span className="italic text-amber-300">Outperforms Naive Accuracy</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#9fa89f] leading-relaxed">
              In clinical diabetes diagnostics, a <strong>False Negative</strong> is catastrophic: a diabetic patient
              is sent home with false reassurance, resulting in untreated progression to nephropathy or cardiovascular
              events. Our pipeline uses <strong>GridSearchCV with balanced class weights</strong>, achieving 72.2% recall
              and reducing missed diabetic cases from 27 down to 15.
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col gap-3">
            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-1">
              <span className="text-[10px] text-[#849386] uppercase font-mono">Baseline Logistic Recall</span>
              <div className="text-2xl font-bold font-mono text-slate-500 line-through">50.0%</div>
              <span className="text-[10px] text-rose-400">Missed 50% of positive cases</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#1d2420] border border-amber-500/30 space-y-1 shadow-lg shadow-amber-500/5">
              <span className="text-[10px] text-amber-300 uppercase font-mono">Tuned Random Forest Recall</span>
              <div className="text-2xl font-bold font-mono text-amber-300">+22.2% Gain (72.2%)</div>
              <span className="text-[10px] text-emerald-400">Optimal clinical screening sensitivity</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
