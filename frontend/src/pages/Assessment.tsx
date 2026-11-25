import React, { useState } from "react";
import {
  Activity,
  AlertCircle,
  Check,
  Copy,
  Dna,
  HeartPulse,
  Info,
  Mail,
  MessageSquare,
  Printer,
  RefreshCw,
  RotateCcw,
  Send,
  ShieldAlert,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react";
import { api } from "../services/api";
import type { PatientData, PredictionResponse } from "../types";

// Medical presets for 1-click viva demonstrations
const PRESETS: Record<string, { label: string; desc: string; data: PatientData }> = {
  healthy: {
    label: "Healthy Patient Profile",
    desc: "Normal glucose (92 mg/dL), normal BMI (22.5), low pedigree risk",
    data: {
      patient_name: "Elena Vance",
      patient_email: "elena.vance@healthnet.org",
      Pregnancies: 1,
      Glucose: 92,
      BloodPressure: 68,
      SkinThickness: 18,
      Insulin: 65,
      BMI: 22.5,
      DiabetesPedigreeFunction: 0.22,
      Age: 25,
    },
  },
  borderline: {
    label: "Borderline / Pre-Diabetic",
    desc: "Elevated glucose (135 mg/dL), overweight BMI (29.8), moderate pedigree",
    data: {
      patient_name: "Marcus Reed",
      patient_email: "m.reed@biocare.io",
      Pregnancies: 3,
      Glucose: 135,
      BloodPressure: 78,
      SkinThickness: 28,
      Insulin: 125,
      BMI: 29.8,
      DiabetesPedigreeFunction: 0.45,
      Age: 42,
    },
  },
  diabetic: {
    label: "High Risk Diabetic Profile",
    desc: "High fasting glucose (178 mg/dL), obese BMI (36.4), elevated age",
    data: {
      patient_name: "Claire Underwood",
      patient_email: "c.underwood@horizon.med",
      Pregnancies: 5,
      Glucose: 178,
      BloodPressure: 86,
      SkinThickness: 38,
      Insulin: 210,
      BMI: 36.4,
      DiabetesPedigreeFunction: 0.82,
      Age: 53,
    },
  },
};

const INITIAL_FORM: PatientData = {
  patient_name: "Sarah Jenkins",
  patient_email: "sarah.jenkins@example.com",
  Pregnancies: 2,
  Glucose: 120,
  BloodPressure: 72,
  SkinThickness: 25,
  Insulin: 85,
  BMI: 28.4,
  DiabetesPedigreeFunction: 0.38,
  Age: 33,
};

export const Assessment: React.FC = () => {
  const [formData, setFormData] = useState<PatientData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (field: keyof PatientData, val: string) => {
    const num = parseFloat(val);
    setFormData((prev) => ({
      ...prev,
      [field]: isNaN(num) ? 0 : num,
    }));
  };

  const handleTextChange = (field: "patient_name" | "patient_email", val: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const applyPreset = (key: string) => {
    if (PRESETS[key]) {
      setFormData({ ...PRESETS[key].data });
      setError(null);
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setResult(null);
    setError(null);
  };

  const generateReportText = () => {
    if (!result) return "";
    const pName = result.patient_name || formData.patient_name || "Patient";
    const advice =
      result.prediction === 1
        ? "Ensemble decision trees detected elevated metabolic signals consistent with diabetes mellitus. Comprehensive laboratory HbA1c testing is strongly advised."
        : "Patient physiological indicators lie safely within non-diabetic reference distributions. Routine annual metabolic screening recommended.";

    return `DIAPREDICT AI — CLINICAL ASSESSMENT REPORT
Patient Name: ${pName}
Patient Email: ${result.patient_email || formData.patient_email || "N/A"}
Date: ${new Date().toLocaleDateString()}

DIAGNOSTIC OUTCOME:
- Classification: ${result.label}
- Calculated Risk Probability: ${(result.probability * 100).toFixed(1)}% (${result.risk_level} Risk)
- Model: ${result.model_info.model_name} (ROC-AUC: ${result.model_info.roc_auc.toFixed(3)})

RECORDED PHYSIOLOGICAL VITALS:
- Plasma Glucose: ${formData.Glucose} mg/dL
- Body Mass Index (BMI): ${formData.BMI} kg/m²
- Age: ${formData.Age} years
- Diastolic Blood Pressure: ${formData.BloodPressure} mmHg
- Serum Insulin: ${formData.Insulin} mu U/ml
- Skin Thickness: ${formData.SkinThickness} mm
- Diabetes Pedigree Function: ${formData.DiabetesPedigreeFunction}
- Pregnancies: ${formData.Pregnancies}

CLINICAL RECOMMENDATION:
${advice}

*Disclaimer: Generated for academic research and clinical decision support demonstration.`;
  };

  const handleSendEmail = () => {
    if (!result) return;
    const email = result.patient_email || formData.patient_email || "";
    const name = result.patient_name || formData.patient_name || "Patient";
    const subject = encodeURIComponent(`DiaPredict AI Clinical Risk Assessment Report — ${name}`);
    const body = encodeURIComponent(generateReportText());
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
  };

  const handleSendWhatsApp = () => {
    if (!result) return;
    const text = encodeURIComponent(generateReportText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleCopySummary = () => {
    const text = generateReportText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.Glucose <= 0 || formData.BMI <= 0 || formData.Age <= 0) {
      setError("Please ensure Glucose, BMI, and Age contain valid physiological measurements.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.predict(formData);
      setResult(res);
      setTimeout(() => {
        const el = document.getElementById("assessment-result-card");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: any) {
      setError(err.message || "Failed to execute prediction pipeline. Verify FastAPI server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* ─────────────────────────────────────────────────────────────
          PAGE HEADER
         ───────────────────────────────────────────────────────────── */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-amber-300">
          <HeartPulse className="w-3.5 h-3.5" /> Clinical Intake & Prediction
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
          Patient Biometric <span className="italic text-amber-300">Assessment</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#9fa89f] max-w-md mx-auto">
          Input standard non-invasive physiological indicators to calculate real-time probabilistic risk
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1-CLICK EVALUATION PRESETS (FROSTED GLASS PILLS)
         ───────────────────────────────────────────────────────────── */}
      <div className="glass-panel-deep p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
          <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Viva Demonstration Presets
          </span>
          <span className="text-[11px] text-[#849386]">Pre-calibrated clinical scenarios for instant evaluation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key)}
              className="text-left p-3.5 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/5 hover:border-amber-500/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                  {preset.label}
                </span>
                <span className="text-[10px] text-amber-400 font-mono">Load →</span>
              </div>
              <p className="text-[10px] text-[#9fa89f] leading-normal">{preset.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          INPUT FORM (MUTED STONE & GLASS PANEL HIERARCHY)
         ───────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Pipeline Error:</strong> {error}
            </div>
          </div>
        )}

        {/* SECTION 0: PATIENT IDENTITY & NOTIFICATION CONTACT */}
        <div className="glass-panel-deep p-5 sm:p-6 space-y-4 border-amber-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Patient Demographics & Notification Routing
              </h3>
            </div>
            <span className="text-[11px] text-[#849386]">
              Uniquely identifies record in audit log & enables direct diagnostic dispatch
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#b8c0b6] font-medium block mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-300" /> Patient Full Name
              </label>
              <input
                type="text"
                value={formData.patient_name || ""}
                onChange={(e) => handleTextChange("patient_name", e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full input-minimal px-3.5 py-2 text-sm text-white"
              />
              <span className="text-[10px] text-[#849386] mt-1 block">
                Logged in clinical audit trail to distinguish patient records
              </span>
            </div>

            <div>
              <label className="text-xs text-[#b8c0b6] font-medium block mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-300" /> Patient Notification Email
              </label>
              <input
                type="email"
                value={formData.patient_email || ""}
                onChange={(e) => handleTextChange("patient_email", e.target.value)}
                placeholder="e.g. sarah.jenkins@example.com"
                className="w-full input-minimal px-3.5 py-2 text-sm font-mono text-amber-300"
              />
              <span className="text-[10px] text-[#849386] mt-1 block">
                Destination address for automated diagnostic report & risk stratification summary
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SECTION 1: Patient Profile */}
          <div className="glass-card-dark p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <User className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Patient Profile</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <label className="text-[#b8c0b6] font-medium">Age in Years</label>
                  <span className="font-mono text-amber-300">{formData.Age} yrs</span>
                </div>
                <input
                  type="number"
                  min="21"
                  max="100"
                  value={formData.Age}
                  onChange={(e) => handleInputChange("Age", e.target.value)}
                  className="w-full input-minimal px-3.5 py-2 text-sm"
                  required
                />
                <span className="text-[10px] text-[#849386] mt-1 block">Valid cohort range: 21 to 81 years</span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <label className="text-[#b8c0b6] font-medium">Pregnancies Count</label>
                  <span className="font-mono text-amber-300">{formData.Pregnancies}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={formData.Pregnancies}
                  onChange={(e) => handleInputChange("Pregnancies", e.target.value)}
                  className="w-full input-minimal px-3.5 py-2 text-sm"
                  required
                />
                <span className="text-[10px] text-[#849386] mt-1 block">
                  Nulliparity (0) is preserved as a valid clinical state
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: Clinical Vitals */}
          <div className="glass-card-dark p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Clinical Vitals</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <label className="text-[#b8c0b6] font-medium">Diastolic Blood Pressure</label>
                  <span className="font-mono text-emerald-300">{formData.BloodPressure} mm Hg</span>
                </div>
                <input
                  type="number"
                  min="30"
                  max="180"
                  value={formData.BloodPressure}
                  onChange={(e) => handleInputChange("BloodPressure", e.target.value)}
                  className="w-full input-minimal px-3.5 py-2 text-sm"
                  required
                />
                <span className="text-[10px] text-[#849386] mt-1 block">Normal resting: 60 - 80 mm Hg</span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <label className="text-[#b8c0b6] font-medium">Triceps Skin Thickness</label>
                  <span className="font-mono text-emerald-300">{formData.SkinThickness} mm</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={formData.SkinThickness}
                  onChange={(e) => handleInputChange("SkinThickness", e.target.value)}
                  className="w-full input-minimal px-3.5 py-2 text-sm"
                  required
                />
                <span className="text-[10px] text-[#849386] mt-1 block">
                  Subcutaneous body fat marker (0 imputed via median)
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 3: Metabolic & Glycemic (Primary Drivers) */}
          <div className="glass-card-dark p-5 sm:p-6 space-y-4 border-amber-500/20">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Glycemic Core</h3>
              </div>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
                53.9% Weight
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <label className="text-[#b8c0b6] font-medium">Plasma Glucose Concentration</label>
                  <span className="font-mono font-bold text-amber-300">{formData.Glucose} mg/dL</span>
                </div>
                <input
                  type="number"
                  min="40"
                  max="300"
                  value={formData.Glucose}
                  onChange={(e) => handleInputChange("Glucose", e.target.value)}
                  className="w-full input-minimal px-3.5 py-2 text-sm font-semibold"
                  required
                />
                <span className="text-[10px] text-[#849386] mt-1 block">
                  Normal fasting &lt;100; Pre-diabetic 100-125; Diabetic &ge;140 mg/dL
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <label className="text-[#b8c0b6] font-medium">Body Mass Index (BMI)</label>
                  <span className="font-mono font-bold text-amber-300">{formData.BMI} kg/m²</span>
                </div>
                <input
                  type="number"
                  min="12"
                  max="70"
                  step="0.1"
                  value={formData.BMI}
                  onChange={(e) => handleInputChange("BMI", e.target.value)}
                  className="w-full input-minimal px-3.5 py-2 text-sm"
                  required
                />
                <span className="text-[10px] text-[#849386] mt-1 block">
                  Normal: 18.5 - 24.9; Overweight: &ge;25; Obese: &ge;30
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <label className="text-[#b8c0b6] font-medium">2-Hour Serum Insulin</label>
                  <span className="font-mono text-amber-300">{formData.Insulin} mu U/ml</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="900"
                  value={formData.Insulin}
                  onChange={(e) => handleInputChange("Insulin", e.target.value)}
                  className="w-full input-minimal px-3.5 py-2 text-sm"
                  required
                />
                <span className="text-[10px] text-[#849386] mt-1 block">Normal resting: 16 - 166 mu U/ml</span>
              </div>
            </div>
          </div>

          {/* SECTION 4: Genetic Predisposition */}
          <div className="glass-card-dark p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <Dna className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Hereditary Lineage</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <label className="text-[#b8c0b6] font-medium">Diabetes Pedigree Function</label>
                  <span className="font-mono text-emerald-300 font-bold">{formData.DiabetesPedigreeFunction}</span>
                </div>
                <input
                  type="number"
                  min="0.05"
                  max="2.5"
                  step="0.01"
                  value={formData.DiabetesPedigreeFunction}
                  onChange={(e) => handleInputChange("DiabetesPedigreeFunction", e.target.value)}
                  className="w-full input-minimal px-3.5 py-2 text-sm"
                  required
                />
                <span className="text-[10px] text-[#849386] mt-1 block">
                  Scores genetic risk based on family history & kinship degree
                </span>
              </div>

              {/* Informational Capsule */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-[#9fa89f] space-y-1">
                <span className="text-amber-300 font-semibold flex items-center gap-1">
                  <Info className="w-3 h-3" /> Diagnostic Guidance
                </span>
                <p className="leading-relaxed">
                  Our pipeline automatically applies median imputation to zero values in glucose, BP, skin thickness,
                  insulin, and BMI before scaling via StandardScaler.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons (Ref 1 Style Pill) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={resetForm}
            className="px-5 py-3 rounded-full text-xs font-medium text-[#849386] hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="btn-pill-dark disabled:opacity-50"
          >
            <div className="icon-badge">
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
              ) : (
                <Zap className="w-3.5 h-3.5 text-amber-300" />
              )}
            </div>
            <span>{loading ? "EVALUATING CLINICAL INFERENCE..." : "CALCULATE DIABETIC RISK"}</span>
          </button>
        </div>
      </form>

      {/* ─────────────────────────────────────────────────────────────
          PREDICTION RESULT DISPLAY (ATMOSPHERIC GLASS CARD)
         ───────────────────────────────────────────────────────────── */}
      {result && (
        <section id="assessment-result-card" className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-sans text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" /> Diagnostic Risk Output
            </h2>
            <button
              onClick={() => window.print()}
              type="button"
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs text-[#b8c0b6] border border-white/10 flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Audit</span>
            </button>
          </div>

          <div
            className={`glass-panel-deep p-6 sm:p-8 relative overflow-hidden border ${
              result.prediction === 1 ? "border-amber-500/30" : "border-emerald-500/30"
            }`}
          >
            {/* Ambient soft glow matching outcome */}
            <div
              className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${
                result.prediction === 1 ? "bg-amber-500" : "bg-emerald-500"
              }`}
            />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Column: Classification Result */}
              <div className="md:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border bg-white/5 text-amber-300 border-white/10">
                  {result.prediction === 1 ? (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Positive Risk Indication
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Low Probabilistic Risk
                    </>
                  )}
                  <span className="text-[#849386]">|</span>
                  <span className="font-mono text-white">Tier: {result.risk_level}</span>
                </div>

                <div className="space-y-1">
                  <div className="font-serif text-3xl sm:text-4xl text-white font-normal">
                    Classification:{" "}
                    <span
                      className={`font-sans font-bold ${
                        result.prediction === 1 ? "text-amber-300" : "text-emerald-400"
                      }`}
                    >
                      {result.label}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#9fa89f] leading-relaxed pt-1">
                    {result.prediction === 1
                      ? "The ensemble decision trees detected elevated metabolic signals consistent with diabetes mellitus. Comprehensive laboratory HbA1c testing is strongly advised."
                      : "The patient's physiological indicators lie safely within non-diabetic reference distributions. Routine annual metabolic screening recommended."}
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#849386] border-t border-white/5">
                  <span>
                    Model: <strong className="text-white">{result.model_info.model_name}</strong>
                  </span>
                  <span>
                    ROC-AUC: <strong className="text-amber-300 font-mono">{result.model_info.roc_auc.toFixed(3)}</strong>
                  </span>
                  <span>
                    Test Accuracy:{" "}
                    <strong className="text-emerald-400 font-mono">
                      {(result.model_info.accuracy * 100).toFixed(1)}%
                    </strong>
                  </span>
                </div>
              </div>

              {/* Right Column: Probability Dial */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                <div className="text-xs text-[#849386]">Calculated Risk Probability</div>
                <div
                  className={`text-5xl font-extrabold font-mono tracking-tight ${
                    result.prediction === 1 ? "text-amber-300" : "text-emerald-400"
                  }`}
                >
                  {(result.probability * 100).toFixed(1)}%
                </div>

                {/* Smooth Progress Track */}
                <div className="w-full space-y-1.5 pt-1">
                  <div className="flex justify-between text-[10px] text-[#849386]">
                    <span>0% (Low)</span>
                    <span className="font-semibold text-white">{result.risk_level} Risk</span>
                    <span>100% (High)</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        result.probability > 0.6
                          ? "bg-gradient-to-r from-amber-500 to-amber-300"
                          : "bg-gradient-to-r from-emerald-600 to-emerald-400"
                      }`}
                      style={{ width: `${result.probability * 100}%` }}
                    />
                  </div>
                </div>

                <p className="text-[10px] text-[#687368] text-center">
                  Threshold: &ge;50% positive classification (calibrated via 5-fold CV)
                </p>
              </div>
            </div>

            {/* Direct Patient Notification & Report Dispatch Strip */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 bg-black/40 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Clinical Report for: {result.patient_name || formData.patient_name || "Patient"}</span>
                    {(result.patient_email || formData.patient_email) && (
                      <span className="text-[10px] font-mono text-amber-300/80 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                        {result.patient_email || formData.patient_email}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#849386]">
                    Instantly dispatch clinical risk stratification advisory to patient or consulting physician
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleSendEmail}
                  className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-xs text-white border border-white/15 flex items-center gap-1.5 transition-all shadow-sm whitespace-nowrap"
                  title="Compose email report"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-300" />
                  <span>Send Email</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="px-3.5 py-2 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-xs text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-all shadow-sm whitespace-nowrap"
                  title="Share summary via WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs text-[#b8c0b6] border border-white/10 flex items-center gap-1.5 transition-all whitespace-nowrap"
                  title="Copy formatted summary to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
