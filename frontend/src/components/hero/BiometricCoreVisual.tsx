import React, { useState } from "react";
import { HeartPulse, ShieldCheck } from "lucide-react";

export const BiometricCoreVisual: React.FC = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[460px] mx-auto aspect-square flex items-center justify-center select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. WARM ATMOSPHERIC LIGHTING REFLECTIONS (REF 1 INSPIRATION)
         ───────────────────────────────────────────────────────────── */}
      {/* Soft warm ambient lighting behind the companion */}
      <div className="ambient-glow-amber w-[340px] h-[340px] top-[15%] right-[10%] opacity-60 transition-opacity duration-700" />
      <div className="ambient-glow-sage w-[400px] h-[400px] top-[20%] left-[5%] opacity-40" />

      {/* Floating dynamic cast shadow on the ground plane */}
      <div
        className="absolute bottom-6 w-[360px] h-[36px] rounded-[100%] bg-black/40 blur-xl transition-all duration-1000"
        style={{
          transform: hovered ? "scale(1.08) translateY(6px)" : "scale(0.96) translateY(0)",
          opacity: hovered ? 0.55 : 0.4,
        }}
      />

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN FLOATING MEDICAL COMPANION VESSEL
         ───────────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 w-full h-full flex items-center justify-center animate-hover-companion"
        style={{
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: hovered ? "scale(1.03) translateY(-8px)" : "scale(1) translateY(0)",
        }}
      >
        <svg
          viewBox="0 0 600 600"
          className="w-full h-full drop-shadow-[0_24px_48px_rgba(0,0,0,0.5)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Matte Ceramic Shell Gradients (Warm Stone / Sage) */}
            <linearGradient id="shellBody" x1="120" y1="80" x2="480" y2="520" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e8ece6" />
              <stop offset="45%" stopColor="#c8d2c7" />
              <stop offset="85%" stopColor="#8d9a8c" />
              <stop offset="100%" stopColor="#5d685c" />
            </linearGradient>

            <linearGradient id="shellHighlight" x1="200" y1="90" x2="400" y2="300" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>

            {/* Tinted Smoked Glass Viewport Gradient */}
            <linearGradient id="glassViewport" x1="180" y1="160" x2="420" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1f2521" stopOpacity="0.92" />
              <stop offset="50%" stopColor="#141815" stopOpacity="0.96" />
              <stop offset="100%" stopColor="#0d100e" stopOpacity="0.98" />
            </linearGradient>

            {/* Warm Amber Interior Glow (The Nestive Warm Illumination) */}
            <radialGradient id="interiorAmberGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.75" />
              <stop offset="70%" stopColor="#d97706" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.0" />
            </radialGradient>

            {/* Soft Sage Energy Stream */}
            <linearGradient id="pulseWave" x1="160" y1="300" x2="440" y2="300" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#34d399" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.1" />
            </linearGradient>

            {/* Pedestal / Base Trim Gradient */}
            <linearGradient id="basePlate" x1="180" y1="440" x2="420" y2="480" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#48544a" />
              <stop offset="50%" stopColor="#2e3530" />
              <stop offset="100%" stopColor="#1b1f1c" />
            </linearGradient>
          </defs>

          {/* ── EXTERIOR MATTE CERAMIC SCULPTED CHASSIS ── */}
          {/* Main Rounded Pod Silhouette */}
          <rect
            x="130"
            y="110"
            width="340"
            height="370"
            rx="110"
            fill="url(#shellBody)"
            filter="drop-shadow(0 15px 30px rgba(0,0,0,0.4))"
          />

          {/* Exterior Specular Rim Lighting Reflection */}
          <rect
            x="132"
            y="112"
            width="336"
            height="180"
            rx="108"
            fill="url(#shellHighlight)"
          />

          {/* Organic Horizontal Architectural Insets (From Ref 1) */}
          <path
            d="M 134 260 L 466 260"
            stroke="#505a50"
            strokeWidth="3"
            strokeOpacity="0.6"
          />
          <path
            d="M 134 263 L 466 263"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.35"
          />

          {/* ── CENTRAL TINTED SMOKED GLASS OBSERVATION CHAMBER ── */}
          <rect
            x="175"
            y="155"
            width="250"
            height="275"
            rx="75"
            fill="url(#glassViewport)"
            stroke="rgba(255, 255, 255, 0.16)"
            strokeWidth="2"
          />

          {/* Glass Inner Rim Specular Highlight */}
          <path
            d="M 185 220 C 185 180, 210 165, 260 165 L 340 165 C 390 165, 415 180, 415 220"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="2"
            fill="none"
          />

          {/* ── INTERIOR GLOWING BIOMETRIC INTELLIGENCE CORE ── */}
          {/* Warm Amber Ambient Glow Field */}
          <circle cx="300" cy="292" r="115" fill="url(#interiorAmberGlow)" />

          {/* Inner Floating Gyro Ring */}
          <ellipse
            cx="300"
            cy="292"
            rx="82"
            ry="48"
            stroke="rgba(251, 191, 36, 0.75)"
            strokeWidth="2"
            fill="none"
            transform="rotate(-18 300 292)"
            strokeDasharray="18 8"
          />

          {/* Outer Floating Gyro Ring */}
          <ellipse
            cx="300"
            cy="292"
            rx="92"
            ry="38"
            stroke="rgba(110, 231, 183, 0.7)"
            strokeWidth="1.5"
            fill="none"
            transform="rotate(32 300 292)"
          />

          {/* Central Neural Intelligence Node (Heart of the AI) */}
          <circle cx="300" cy="292" r="26" fill="#fbbf24" filter="drop-shadow(0 0 16px #f59e0b)" />
          <circle cx="300" cy="292" r="14" fill="#ffffff" />

          {/* Real-time Biometric Pulse Wave Stream */}
          <path
            d="M 190 315 L 240 315 L 255 285 L 270 340 L 285 270 L 300 325 L 315 295 L 330 315 L 410 315"
            stroke="url(#pulseWave)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Internal Telemetry Grid Dots */}
          <circle cx="210" cy="190" r="3" fill="#6ee7b7" opacity="0.8" />
          <circle cx="390" cy="190" r="3" fill="#fbbf24" opacity="0.8" />
          <circle cx="210" cy="395" r="3" fill="#9fa89f" opacity="0.6" />
          <circle cx="390" cy="395" r="3" fill="#6ee7b7" opacity="0.8" />

          {/* ── EXTERIOR ARCHITECTURAL DETAILS (REF 1 INSPIRED) ── */}
          {/* Top Sensor Periscope / Communication Pin */}
          <rect x="294" y="60" width="12" height="52" rx="6" fill="#cad3c9" />
          <circle cx="300" cy="58" r="7" fill="#fbbf24" filter="drop-shadow(0 0 8px #f59e0b)" />

          {/* Floating Minimal Magnetic Antennas */}
          <rect x="380" y="80" width="8" height="32" rx="4" fill="#9aa598" />
          <circle cx="384" cy="78" r="4" fill="#6ee7b7" />

          {/* Lower Floating Intake Grills (Warm Ambient Exhaust like Ref 1) */}
          <g filter="drop-shadow(0 0 8px rgba(245, 158, 11, 0.4))">
            <rect x="210" y="445" width="45" height="12" rx="4" fill="#1b201d" stroke="#f59e0b" strokeWidth="1" />
            <rect x="277" y="445" width="46" height="12" rx="4" fill="#1b201d" stroke="#f59e0b" strokeWidth="1" />
            <rect x="345" y="445" width="45" height="12" rx="4" fill="#1b201d" stroke="#f59e0b" strokeWidth="1" />

            {/* Amber glowing slits inside grills */}
            <rect x="215" y="448" width="35" height="6" rx="2" fill="#fbbf24" />
            <rect x="282" y="448" width="36" height="6" rx="2" fill="#fbbf24" />
            <rect x="350" y="448" width="35" height="6" rx="2" fill="#fbbf24" />
          </g>

          {/* Side Auxiliary Pods (Docking Spheres like Ref 1) */}
          <circle cx="118" cy="320" r="22" fill="#cad3c9" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.3))" />
          <circle cx="118" cy="320" r="12" fill="#242a26" />
          <circle cx="118" cy="320" r="5" fill="#fbbf24" />

          <circle cx="482" cy="240" r="26" fill="#cad3c9" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.3))" />
          <circle cx="482" cy="240" r="14" fill="#242a26" />
          <circle cx="482" cy="240" r="6" fill="#6ee7b7" />
        </svg>

        {/* ─────────────────────────────────────────────────────────────
            3. FLOATING GLASS SENSOR CAPSULES (SURROUNDING TELEMETRY)
           ───────────────────────────────────────────────────────────── */}
        {/* Capsule 1: Top Left Glycemic Telemetry */}
        <div
          className="absolute top-2 left-2 sm:left-4 glass-pill px-3 py-1.5 sm:px-3.5 sm:py-2 flex items-center gap-2 shadow-xl shadow-black/40 border-white/15 z-20 pointer-events-none"
          style={{
            animation: "hover-breathing 6s ease-in-out infinite 1s",
          }}
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
            <HeartPulse className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <div>
            <div className="text-[9px] sm:text-[10px] uppercase font-semibold tracking-wider text-slate-400">Oral Glucose Core</div>
            <div className="text-[11px] sm:text-xs font-mono font-bold text-amber-300">92 mg/dL • Stable</div>
          </div>
        </div>

        {/* Capsule 2: Right Middle Neural Inference */}
        <div
          className="absolute top-[52%] right-1 sm:right-2 glass-pill px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-2.5 shadow-xl shadow-black/40 border-white/15 z-20 pointer-events-none"
          style={{
            animation: "hover-breathing 7s ease-in-out infinite 2.5s",
          }}
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <div className="text-[9px] sm:text-[10px] uppercase font-semibold tracking-wider text-slate-400">Random Forest Ensemble</div>
            <div className="text-[11px] sm:text-xs font-mono font-bold text-emerald-300">Sensitivity: 72.2%</div>
          </div>
        </div>

        {/* Capsule 3: Bottom Left Model Health Status */}
        <div
          className="hidden sm:flex absolute bottom-3 left-4 sm:left-6 glass-pill px-3 py-1.5 sm:px-3.5 sm:py-2 items-center gap-2 shadow-xl shadow-black/40 border-white/15 z-20 pointer-events-none"
          style={{
            animation: "hover-breathing 8s ease-in-out infinite 3.5s",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] sm:text-[11px] font-mono font-medium text-slate-200">
            Zero-Leakage Median Pipeline • Active
          </span>
        </div>
      </div>
    </div>
  );
};
