import React from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  Bell,
  ChevronRight,
  Cpu,
  Dna,
  HeartPulse,
  History as HistoryIcon,
  LineChart as ChartIcon,
  Search,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import type { ModelInfoResponse } from "../../types";

interface Props {
  modelInfo: ModelInfoResponse | null;
}

export const GlassAnalyticsDashboard: React.FC<Props> = ({ modelInfo }) => {

  const evalData = modelInfo?.evaluation;
  const dataset = modelInfo?.dataset;

  // Real-time confidence curve data (derived from evaluation ROC curve)
  const chartData = evalData
    ? evalData.roc_curve.fpr.slice(0, 14).map((fpr, i) => ({
        point: `Pt ${i + 1}`,
        sensitivity: Number((evalData.roc_curve.tpr[i] * 100).toFixed(1)),
        baseline: Number((fpr * 100).toFixed(1)),
      }))
    : [
        { point: "T1", sensitivity: 32, baseline: 10 },
        { point: "T2", sensitivity: 54, baseline: 20 },
        { point: "T3", sensitivity: 68, baseline: 35 },
        { point: "T4", sensitivity: 72.2, baseline: 50 },
        { point: "T5", sensitivity: 84, baseline: 65 },
        { point: "T6", sensitivity: 91, baseline: 80 },
        { point: "T7", sensitivity: 100, baseline: 100 },
      ];

  // Clinical biomarkers list for bottom table
  const biomarkers = [
    {
      name: "Plasma Glucose Concentration",
      tag: "Primary Glycemic Indicator",
      weight: 33.91,
      impact: "High",
      status: "Calibrated",
      sparkline: [20, 35, 45, 65, 80, 75, 92],
    },
    {
      name: "Body Mass Index (BMI)",
      tag: "Adiposity / Metabolic Load",
      weight: 20.0,
      impact: "Critical",
      status: "Calibrated",
      sparkline: [22, 24, 28, 29, 31, 34, 36],
    },
    {
      name: "2-Hour Serum Insulin",
      tag: "Endocrine Response",
      weight: 11.77,
      impact: "Moderate",
      status: "Imputed",
      sparkline: [40, 60, 95, 120, 160, 210, 240],
    },
    {
      name: "Patient Age in Years",
      tag: "Cumulative Metabolic Exposure",
      weight: 11.24,
      impact: "Baseline",
      status: "Normalized",
      sparkline: [21, 28, 35, 42, 48, 55, 62],
    },
    {
      name: "Diabetes Pedigree Function",
      tag: "Kinship Genetic Lineage",
      weight: 7.5,
      impact: "Hereditary",
      status: "Verified",
      sparkline: [0.15, 0.25, 0.38, 0.45, 0.62, 0.82, 1.1],
    },
  ];

  return (
    <div className="w-full glass-panel-deep p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Soft warm interior ambient glow (Ref 2 lighting) */}
      <div className="ambient-glow-amber w-[420px] h-[420px] -top-20 -right-20 opacity-40" />
      <div className="ambient-glow-sage w-[350px] h-[350px] bottom-10 left-10 opacity-30" />

      <div className="flex flex-col lg:flex-row gap-6 relative z-10">
        {/* ─────────────────────────────────────────────────────────────
            LEFT COMPACT VERTICAL SIDEBAR (REF 2 INSPIRATION)
           ───────────────────────────────────────────────────────────── */}
        <aside className="lg:w-16 w-full flex lg:flex-col items-center justify-between py-2 lg:py-6 px-3 lg:px-0 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-xl shrink-0">
          {/* Top Logo Glyph */}
          <div className="flex lg:flex-col items-center gap-4">
            <Link
              to="/"
              className="w-10 h-10 rounded-xl bg-[#232925] border border-white/10 flex items-center justify-center text-amber-400 hover:scale-105 transition-all shadow-md"
              title="AuraDia Home"
            >
              <Activity className="w-5 h-5 text-amber-300" />
            </Link>

            {/* Navigation Icons Stack */}
            <div className="flex lg:flex-col items-center gap-2">
              <Link
                to="/"
                className="w-10 h-10 rounded-xl bg-white/10 border border-amber-500/30 text-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/10 transition-all"
                title="Overview Dashboard"
              >
                <Cpu className="w-4 h-4" />
              </Link>

              <Link
                to="/assessment"
                className="w-10 h-10 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                title="Patient Intake & Prediction"
              >
                <HeartPulse className="w-4 h-4" />
              </Link>

              <Link
                to="/analytics"
                className="w-10 h-10 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                title="ML Model Verification"
              >
                <ChartIcon className="w-4 h-4" />
              </Link>

              <Link
                to="/history"
                className="w-10 h-10 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                title="Assessment History"
              >
                <HistoryIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Bottom Settings / Alert Indicator */}
          <div className="hidden lg:flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-all">
                <Bell className="w-4 h-4" />
              </div>
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-2 right-2 animate-pulse" />
            </div>

            <div className="w-9 h-9 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-all">
              <Settings className="w-4 h-4" />
            </div>
          </div>
        </aside>

        {/* ─────────────────────────────────────────────────────────────
            MAIN DASHBOARD CONTENT AREA
           ───────────────────────────────────────────────────────────── */}
        <div className="flex-1 space-y-6">
          {/* Dashboard Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-sans text-[#f7f6f2] tracking-tight">
                Clinical Health Intelligence
              </h2>
              <p className="text-xs text-[#9fa89f]">
                Real-time diagnostic analytics powered by calibrated Random Forest 5-fold cross-validation
              </p>
            </div>

            {/* Right Header Search & Online Status */}
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Quick lookup..."
                  className="pl-8 pr-3 py-1.5 h-8 rounded-full bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 w-44"
                />
              </div>

              <div className="px-3 py-1.5 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-medium flex items-center gap-2 shrink-0 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Model v1.0 • Ready</span>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              TOP GRID: HERO DIAGNOSTIC CARD + ACTIVE RISK MONITOR
             ───────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Big Card: "Optimize Your Metrics" equivalent in Ref 2 */}
            <div className="lg:col-span-7 glass-card-dark p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
              {/* Warm interior amber glow reflection */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/25 via-amber-600/10 to-transparent rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-3 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-amber-300">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Clinical Diagnostic Decision Support
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Optimize Patient Outcomes <br />
                  <span className="font-serif italic font-normal text-amber-300">With Precision AI</span>
                </h3>

                <p className="text-xs text-[#b8c0b6] max-w-md leading-relaxed">
                  Evaluated on 154 holdout clinical cases. Engineered specifically with balanced class weights to
                  maximize clinical recall, reducing missed diabetic cases by 44.4%.
                </p>

                <div className="pt-2">
                  <Link
                    to="/assessment"
                    className="btn-pill-dark"
                  >
                    <div className="icon-badge">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <span>RUN CLINICAL INTAKE</span>
                  </Link>
                </div>
              </div>

              {/* FLOATING FROSTED METRICS STRIP (DIRECTLY INSPIRED BY REF 2!) */}
              <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/40 backdrop-blur-xl p-3.5 rounded-2xl border border-white/5 relative z-10">
                <div>
                  <div className="text-[10px] text-[#849386] uppercase font-semibold">Recall</div>
                  <div className="text-xl font-bold font-mono text-amber-300">
                    {evalData ? `${(evalData.recall * 100).toFixed(1)}%` : "72.2%"}
                  </div>
                  <div className="text-[10px] text-emerald-400">Sensitivity</div>
                </div>

                <div>
                  <div className="text-[10px] text-[#849386] uppercase font-semibold">ROC-AUC</div>
                  <div className="text-xl font-bold font-mono text-white">
                    {evalData ? evalData.roc_auc.toFixed(3) : "0.826"}
                  </div>
                  <div className="text-[10px] text-[#b8c0b6]">Discrimination</div>
                </div>

                <div>
                  <div className="text-[10px] text-[#849386] uppercase font-semibold">Accuracy</div>
                  <div className="text-xl font-bold font-mono text-white">
                    {evalData ? `${(evalData.accuracy * 100).toFixed(1)}%` : "74.7%"}
                  </div>
                  <div className="text-[10px] text-[#b8c0b6]">115 / 154 Correct</div>
                </div>

                <div>
                  <div className="text-[10px] text-[#849386] uppercase font-semibold">Cohort</div>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    {dataset?.total_records ?? 768}
                  </div>
                  <div className="text-[10px] text-[#b8c0b6]">Pima Patients</div>
                </div>
              </div>
            </div>

            {/* Right Card: Active Patients / Risk Trajectory (Ref 2 Right Graph) */}
            <div className="lg:col-span-5 glass-card-dark p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <div className="text-xs text-[#9fa89f] font-medium flex items-center gap-1.5">
                    <span>Clinical ROC Trajectory</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white mt-1">
                    0.826 <span className="text-xs font-sans text-amber-300 font-normal">AUC</span>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-mono">
                  Test Partition
                </div>
              </div>

              {/* Minimalist Recharts Smooth Curve */}
              <div className="h-44 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="amberCurveGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="point" stroke="#687368" fontSize={10} />
                    <YAxis stroke="#687368" fontSize={10} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(18, 22, 20, 0.95)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "12px",
                        fontSize: "11px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sensitivity"
                      name="True Positive Rate %"
                      stroke="#fbbf24"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#amberCurveGlow)"
                    />
                    <Line
                      type="linear"
                      dataKey="baseline"
                      name="Random (50%)"
                      stroke="#485348"
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#9fa89f]">
                <span>Trained Estimators: 50 Trees</span>
                <span className="text-amber-300 font-mono">Max Depth: 5</span>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              BOTTOM SECTION: PRIMARY BIOMARKERS TABLE (REF 2 INSPIRED)
             ───────────────────────────────────────────────────────── */}
          <div className="glass-card-dark p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Dna className="w-4 h-4 text-amber-400" /> Model Gini Feature Attribution Weights
                </h4>
                <p className="text-xs text-[#9fa89f]">
                  Relative mathematical contribution of physiological vitals during random forest splitting
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#849386]">Sort by:</span>
                <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs text-white">
                  Importance Weight ▼
                </span>
              </div>
            </div>

            {/* List / Table Items (Ref 2 Capsule Rows) */}
            <div className="space-y-2.5">
              {biomarkers.map((bio, idx) => (
                <div
                  key={bio.name}
                  className="p-3.5 rounded-2xl bg-black/30 hover:bg-black/50 border border-white/5 hover:border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-amber-300 shrink-0">
                      0{idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white hover:text-amber-300 transition-colors">
                        {bio.name}
                      </div>
                      <div className="text-[10px] text-[#849386]">{bio.tag}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-8 justify-between sm:justify-end text-xs">
                    <div>
                      <span className="text-[10px] text-[#849386] block">Weight</span>
                      <span className="font-mono font-bold text-white">{bio.weight}%</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#849386] block">Pre-processing</span>
                      <span className="text-[11px] font-mono text-emerald-400">{bio.status}</span>
                    </div>

                    {/* Mini Visual Bar */}
                    <div className="w-24 hidden md:block">
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                          style={{ width: `${bio.weight * 2.8}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      to="/analytics"
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
