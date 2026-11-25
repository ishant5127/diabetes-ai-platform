import React from "react";
import { AlertTriangle, BookOpen } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-24 border-t border-white/5 bg-[#141815]/80 backdrop-blur-xl relative z-10">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-serif text-lg text-white">
                DiaPredict<span className="text-amber-400 font-sans text-xs ml-1 font-bold">AI</span>
              </span>
              <span className="text-[10px] text-[#9fa89f] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 font-mono">
                Academic Evaluation
              </span>
            </div>
            <p className="text-xs text-[#9fa89f] leading-relaxed">
              An ambient healthcare artificial intelligence platform transforming laboratory data into probabilistic
              clinical risk decisions. Built with a zero-leakage scikit-learn pipeline, FastAPI, and React.
            </p>
          </div>

          {/* Academic Highlights */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Clinical ML Pipeline
            </h4>
            <ul className="text-xs text-[#9fa89f] space-y-1.5">
              <li>• Zero-Data Leakage Median Imputer & Scaler</li>
              <li>• Stratified 80/20 Test Holdout Partition (n = 154)</li>
              <li>• Recall-Optimized Random Forest (72.2% Sensitivity)</li>
              <li>• Asynchronous FastAPI Serialization under 15ms</li>
            </ul>
          </div>

          {/* Medical Disclaimer */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-300/90 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Clinical Disclaimer
            </h4>
            <p className="text-[11px] text-[#849386] leading-relaxed bg-amber-500/5 p-3 rounded-xl border border-amber-500/15">
              This application is designed strictly for academic evaluation and clinical research demonstration. It is
              NOT a certified diagnostic medical device. Predictions must never replace certified clinical testing.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-[#687368] gap-3">
          <p>© 2026 DiaPredict AI • Clinical Machine Learning Decision Support System</p>
          <div className="flex items-center gap-3 text-[11px] text-[#849386]">
            <span>FastAPI 0.115</span>
            <span>•</span>
            <span>scikit-learn 1.5</span>
            <span>•</span>
            <span>React 19</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
