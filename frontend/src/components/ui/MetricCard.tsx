import React from "react";
import type { LucideIcon } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  color?: "cyan" | "teal" | "purple" | "rose" | "amber";
  highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  color = "cyan",
  highlight = false,
}) => {
  const colorMap = {
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    teal: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };

  return (
    <GlassCard level={2} glow={highlight} glowColor={color} className="p-5 relative overflow-hidden group">
      {/* Background soft ambient highlight */}
      <div
        className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none transition-all group-hover:scale-125 ${
          color === "cyan"
            ? "bg-cyan-500"
            : color === "teal"
            ? "bg-teal-500"
            : color === "rose"
            ? "bg-rose-500"
            : color === "amber"
            ? "bg-amber-500"
            : "bg-purple-500"
        }`}
      />

      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className={`p-2.5 rounded-xl border ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {badge && (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
            {badge}
          </span>
        )}
      </div>

      <div className="relative z-10">
        <h4 className="text-xs text-slate-400 font-medium mb-1">{title}</h4>
        <div className="text-2xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
          {value}
        </div>
        {subtitle && <p className="text-[11px] text-slate-400 mt-1 leading-normal">{subtitle}</p>}
      </div>
    </GlassCard>
  );
};
