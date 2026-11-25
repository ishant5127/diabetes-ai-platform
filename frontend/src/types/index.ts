// ============================================================================
// TypeScript Schema Definitions for Diabetes AI Prediction Platform
// ============================================================================

export interface PatientData {
  patient_name?: string;
  patient_email?: string;
  Pregnancies: number;
  Glucose: number;
  BloodPressure: number;
  SkinThickness: number;
  Insulin: number;
  BMI: number;
  DiabetesPedigreeFunction: number;
  Age: number;
}

export interface ModelSummaryInfo {
  model_name: string;
  algorithm: string;
  accuracy: number;
  roc_auc: number;
}

export interface PredictionResponse {
  prediction: number;
  probability: number;
  risk_level: "Low" | "Moderate" | "High";
  label: "Non-Diabetic" | "Diabetic";
  patient_name?: string;
  patient_email?: string;
  patient_data: PatientData;
  model_info: ModelSummaryInfo;
}

export interface PredictionHistoryItem {
  id: string;
  timestamp: string;
  patient_name?: string;
  patient_email?: string;
  patient_data: PatientData;
  prediction: number;
  probability: number;
  risk_level: "Low" | "Moderate" | "High";
  label: "Non-Diabetic" | "Diabetic";
}

export interface DatasetMeta {
  name: string;
  source: string;
  total_records: number;
  features: number;
  target_variable: string;
  class_distribution: {
    non_diabetic: number;
    diabetic: number;
  };
  feature_names: string[];
  feature_descriptions: Record<string, string>;
  missing_values_treatment: string;
  feature_scaling: string;
}

export interface EvaluationMeta {
  test_size: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  confusion_matrix: [[number, number], [number, number]];
  roc_curve: {
    fpr: number[];
    tpr: number[];
    thresholds: number[];
  };
  feature_importance: Record<string, number>;
  classification_report: Record<string, any>;
}

export interface BaselineComparisonItem {
  model: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
}

export interface FeatureRange {
  min: number;
  max: number;
  type: "int" | "float";
}

export interface ModelInfoResponse {
  model_name: string;
  algorithm: string;
  best_params: Record<string, any>;
  dataset: DatasetMeta;
  evaluation: EvaluationMeta;
  baseline_comparison: BaselineComparisonItem[];
  training_date: string;
  preprocessing_steps: string[];
  input_ranges: Record<string, FeatureRange>;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  timestamp: string;
}
