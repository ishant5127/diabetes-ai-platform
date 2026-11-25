import React from "react";

export const BackgroundEffects: React.FC = () => {
  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          WARM MUTED SAGE & AMBER ATMOSPHERIC LIGHTING (REF 1 & 2)
         ───────────────────────────────────────────────────────────── */}
      {/* Primary Upper Right Warm Illumination (Nestive lighting style) */}
      <div
        className="fixed -top-32 -right-32 w-[650px] h-[650px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(132, 147, 134, 0.1) 40%, transparent 75%)",
          filter: "blur(110px)",
        }}
      />

      {/* Mid Left Soft Desaturated Sage Diffusion */}
      <div
        className="fixed top-1/3 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(92, 107, 96, 0.22) 0%, rgba(42, 49, 44, 0.1) 50%, transparent 75%)",
          filter: "blur(120px)",
        }}
      />

      {/* Lower Center Ambient Warm Glow */}
      <div
        className="fixed -bottom-40 left-1/3 w-[550px] h-[550px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(217, 119, 6, 0.08) 0%, transparent 70%)",
          filter: "blur(130px)",
        }}
      />

      {/* Organic Subtle Grain Overlay */}
      <div className="noise-texture" />
    </>
  );
};
