import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3;
  glow?: boolean;
  glowColor?: "cyan" | "teal" | "purple" | "rose" | "amber";
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  level = 2,
  glow = false,
  glowColor = "cyan",
  onClick,
}) => {
  const levelClass =
    level === 1
      ? "glass-panel"
      : level === 2
      ? "glass-card"
      : "bg-white/[0.05] backdrop-blur-md border border-white/[0.1] rounded-lg";

  const glowClass = glow
    ? glowColor === "cyan"
      ? "shadow-lg shadow-cyan-500/10 border-cyan-500/30"
      : glowColor === "teal"
      ? "shadow-lg shadow-teal-500/10 border-teal-500/30"
      : glowColor === "rose"
      ? "shadow-lg shadow-rose-500/10 border-rose-500/30"
      : glowColor === "amber"
      ? "shadow-lg shadow-amber-500/10 border-amber-500/30"
      : "shadow-lg shadow-purple-500/10 border-purple-500/30"
    : "";

  return (
    <div
      onClick={onClick}
      className={`transition-all duration-300 ${levelClass} ${glowClass} ${
        onClick ? "cursor-pointer hover:bg-white/[0.06] hover:-translate-y-0.5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};
