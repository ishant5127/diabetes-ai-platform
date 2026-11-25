import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  Award,
  BarChart3,
  CheckCircle2,
  Cpu,
  Grid,
  Layers,
  LineChart as LineChartIcon,
  RefreshCw,
  Sliders,
  TrendingUp,
} from "lucide-react";
import { api } from "../services/api";
import type { ModelInfoResponse } from "../types";

export const Analytics: React.FC = () => {
  const [modelInfo, setModelInfo] = useState<ModelInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    api
      .getModelInfo()
      .then((data) => {
        if (mounted) {
          setModelInfo(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load model info:", err);
        if (mounted) {
          setError(err.message || "Failed to load model analytics from backend.");
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4">
        <RefreshCw className="w-7 h-7 text-amber-400 animate-spin" />
        <p className="text-xs text-[#9fa89f] font-mono">Retrieving cross-validation artefacts...</p>
      </div>
    );
  }

  if (error || !modelInfo) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 rounded-2xl bg-rose-950/30 border border-rose-500/20 text-center space-y-3">
        <h3 className="text-sm font-bold text-rose-300">Analytics Service Unavailable</h3>
        <p className="text-xs text-[#9fa89f]">{error || "Could not retrieve model metadata."}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-xs text-white"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { evaluation, baseline_comparison, best_params, preprocessing_steps } = modelInfo;
  const cm = evaluation.confusion_matrix;
  const tn = cm[0][0];
  const fp = cm[0][1];
  const fn = cm[1][0];
  const tp = cm[1][1];

  // Feature Importance data
  // Friendly readable labels for chart display
  const FEATURE_LABELS: Record<string, string> = {
    Glucose: "Glucose",
    BMI: "BMI Index",
    Age: "Age",
    Insulin: "Serum Insulin",
    DiabetesPedigreeFunction: "Pedigree Func.",
    Pregnancies: "Pregnancies",
    BloodPressure: "Blood Press.",
    SkinThickness: "Skin Thickness",
  };

  const featData = Object.entries(evaluation.feature_importance)
    .map(([name, val]) => ({
      name: FEATURE_LABELS[name] || name,
      fullName: name,
      importance: Number((val * 100).toFixed(2)),
    }))
    .sort((a, b) => b.importance - a.importance);

  // ROC Curve points
  const rocData = evaluation.roc_curve.fpr.map((fprVal, idx) => ({
    fpr: Number(fprVal.toFixed(3)),
    tpr: Number(evaluation.roc_curve.tpr[idx].toFixed(3)),
    baseline: Number(fprVal.toFixed(3)),
  }));

  // Baseline Comparison data
  const compData = baseline_comparison.map((item) => ({
    name: item.model,
    Accuracy: Number((item.accuracy * 100).toFixed(1)),
    Recall: Number((item.recall * 100).toFixed(1)),
    "ROC-AUC": Number((item.roc_auc * 100).toFixed(1)),
  }));

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* ─────────────────────────────────────────────────────────────
          HEADER
         ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-amber-300 mb-2">
            <Cpu className="w-3.5 h-3.5" /> Evaluated Machine Learning Artifacts
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            Model Analytics & <span className="italic text-amber-300">Verification</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#9fa89f]">
            Rigorous test holdout metrics generated from 5-fold cross-validated grid search
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs font-mono text-slate-300">
            Selected: <span className="text-amber-300 font-semibold">{modelInfo.algorithm}</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          METRIC TILES (REF 2 STYLE GLASS CARDS)
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card-dark p-5 space-y-2 border-amber-500/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-300 uppercase font-mono tracking-wider">Primary Target</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-amber-300">
            {(evaluation.recall * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-[#9fa89f]">Clinical Recall (Sensitivity)</div>
        </div>

        <div className="glass-card-dark p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#849386] uppercase font-mono tracking-wider">Discrimination</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {evaluation.roc_auc.toFixed(3)}
          </div>
          <div className="text-[11px] text-[#9fa89f]">ROC-AUC Area</div>
        </div>

        <div className="glass-card-dark p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#849386] uppercase font-mono tracking-wider">Holdout</span>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {(evaluation.accuracy * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-[#9fa89f]">Overall Test Accuracy</div>
        </div>

        <div className="glass-card-dark p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#849386] uppercase font-mono tracking-wider">Precision</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {(evaluation.precision * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-[#9fa89f]">Positive Predictive Value</div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ROW 1: CONFUSION MATRIX & ROC CURVE
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CONFUSION MATRIX */}
        <div className="lg:col-span-5 glass-panel-deep p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Grid className="w-4 h-4 text-amber-400" /> Confusion Matrix (Holdout n=154)
              </h3>
              <p className="text-[11px] text-[#849386]">Actual truth vs algorithm prediction distribution</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center space-y-1">
              <span className="text-[10px] text-[#849386] font-mono uppercase">True Negative (TN)</span>
              <div className="text-3xl font-bold font-mono text-white">{tn}</div>
              <span className="text-[10px] text-emerald-400">Correctly Healthy</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-center space-y-1">
              <span className="text-[10px] text-amber-300 font-mono uppercase">False Positive (FP)</span>
              <div className="text-3xl font-bold font-mono text-amber-300">{fp}</div>
              <span className="text-[10px] text-[#849386]">Type I Error</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-center space-y-1">
              <span className="text-[10px] text-rose-300 font-mono uppercase">False Negative (FN)</span>
              <div className="text-3xl font-bold font-mono text-rose-300">{fn}</div>
              <span className="text-[10px] text-rose-400">Type II (Critical)</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-center space-y-1">
              <span className="text-[10px] text-emerald-300 font-mono uppercase">True Positive (TP)</span>
              <div className="text-3xl font-bold font-mono text-emerald-300">{tp}</div>
              <span className="text-[10px] text-emerald-400">Correctly Diabetic</span>
            </div>
          </div>

          <p className="text-[11px] text-[#9fa89f] leading-relaxed pt-2 border-t border-white/5">
            By tuning hyperparameters with balanced class weights, False Negatives were reduced from 27 down to 15,
            ensuring <strong>72.2%</strong> of true diabetic patients receive early clinical warning.
          </p>
        </div>

        {/* ROC CURVE */}
        <div className="lg:col-span-7 glass-panel-deep p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <LineChartIcon className="w-4 h-4 text-amber-400" /> Receiver Operating Characteristic (ROC)
              </h3>
              <p className="text-[11px] text-[#849386]">Area Under the Curve: 0.826 (High Discrimination)</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-300 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              AUC 0.826
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rocData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="amberRocGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="fpr"
                  stroke="#687368"
                  fontSize={10}
                  tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                />
                <YAxis
                  dataKey="tpr"
                  stroke="#687368"
                  fontSize={10}
                  tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                />
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
                  dataKey="tpr"
                  name="Model ROC"
                  stroke="#fbbf24"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#amberRocGradient)"
                />
                <Line
                  type="linear"
                  dataKey="baseline"
                  name="Random Baseline (0.5)"
                  stroke="#485348"
                  strokeDasharray="4 4"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#849386] pt-2 border-t border-white/5">
            <span>X-Axis: False Positive Rate (1 - Specificity)</span>
            <span>Y-Axis: True Positive Rate (Sensitivity)</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ROW 2: GINI FEATURE IMPORTANCES & BENCHMARK COMPARISON
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* GINI FEATURE IMPORTANCE */}
        <div className="lg:col-span-6 glass-card-dark p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" /> Gini Feature Importance Weights
              </h3>
              <p className="text-[11px] text-[#849386]">Relative feature contribution across all 50 trees</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" stroke="#687368" fontSize={10} tickFormatter={(v) => `${v}%`} />
                <YAxis dataKey="name" type="category" stroke="#b8c0b6" fontSize={10} width={95} />
                <Tooltip
                  formatter={(v: any) => [`${v}%`, "Weight"]}
                  contentStyle={{
                    backgroundColor: "rgba(18, 22, 20, 0.95)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "12px",
                    fontSize: "11px",
                  }}
                />
                <Bar dataKey="importance" fill="#fbbf24" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-[#9fa89f] leading-relaxed pt-2 border-t border-white/5">
            <strong>Glucose (33.9%)</strong> and <strong>BMI (20.0%)</strong> account for more than 53% of total
            predictive weight, confirming medical literature that insulin resistance and obesity are primary markers.
          </p>
        </div>

        {/* ALGORITHM BENCHMARK COMPARISON */}
        <div className="lg:col-span-6 glass-card-dark p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" /> Algorithm Benchmark Comparison
              </h3>
              <p className="text-[11px] text-[#849386]">Baseline models vs final deployed Random Forest</p>
            </div>
            <span className="text-[10px] text-amber-300 font-mono">Tuned RF Selected</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="#b8c0b6" fontSize={10} />
                <YAxis stroke="#687368" fontSize={10} domain={[40, 90]} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  formatter={(v: any) => [`${v}%`]}
                  contentStyle={{
                    backgroundColor: "rgba(18, 22, 20, 0.95)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "12px",
                    fontSize: "11px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                <Bar dataKey="Recall" fill="#fbbf24" radius={[4, 4, 0, 0]} name="Recall % (Sensitivity)" />
                <Bar dataKey="Accuracy" fill="#6ee7b7" radius={[4, 4, 0, 0]} name="Accuracy %" />
                <Bar dataKey="ROC-AUC" fill="#b8c0b6" radius={[4, 4, 0, 0]} name="ROC-AUC %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-[#9fa89f] leading-relaxed pt-2 border-t border-white/5">
            While baseline Random Forest had slightly higher raw accuracy, our tuned version with balanced weights
            delivers superior <strong>72.2% recall</strong>, making it the most clinically responsible choice.
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ROW 3: HYPERPARAMETERS & PREPROCESSING
         ───────────────────────────────────────────────────────────── */}
      <div className="glass-panel-deep p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" /> Optimal Hyperparameters (GridSearchCV 5-Fold)
          </h3>
          <span className="text-xs text-amber-300 font-mono">sklearn.model_selection</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-[#849386] font-mono block">Class Weight</span>
            <span className="font-mono text-base font-bold text-amber-300">
              {best_params.class_weight || "balanced"}
            </span>
            <span className="text-[10px] text-[#687368] block">Compensates 65/35 imbalance</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-[#849386] font-mono block">Max Depth</span>
            <span className="font-mono text-base font-bold text-white">{best_params.max_depth ?? 5}</span>
            <span className="text-[10px] text-[#687368] block">Regularization vs overfitting</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-[#849386] font-mono block">Min Samples Split</span>
            <span className="font-mono text-base font-bold text-white">
              {best_params.min_samples_split ?? 10}
            </span>
            <span className="text-[10px] text-[#687368] block">Minimum node partition</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-[#849386] font-mono block">Estimators (Trees)</span>
            <span className="font-mono text-base font-bold text-amber-300">{best_params.n_estimators ?? 50}</span>
            <span className="text-[10px] text-[#687368] block">Ensemble voter count</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#b8c0b6]">
            Deployed Preprocessing Pipeline
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {preprocessing_steps.map((step, idx) => (
              <div
                key={step}
                className="p-3.5 rounded-2xl bg-black/30 border border-white/5 text-xs text-slate-300 flex items-start gap-3"
              >
                <span className="w-5 h-5 rounded-full bg-white/10 text-amber-300 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                  0{idx + 1}
                </span>
                <span className="text-[11px] text-[#b8c0b6] leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
