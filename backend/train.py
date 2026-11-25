"""
Diabetes Prediction Model Training Script
==========================================
Trains a Random Forest classifier on the Pima Indians Diabetes Dataset,
using a proper sklearn Pipeline to avoid data leakage.

Outputs:
  - models/diabetes_pipeline.joblib   (imputer + scaler + classifier)
  - models/model_metadata.json        (all evaluation artefacts)
"""

import json
import os
import warnings
from datetime import datetime, timezone

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
    roc_curve,
)
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

warnings.filterwarnings("ignore")

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
DATASET_PATH = os.path.join(os.path.dirname(__file__), "..", "dataset", "diabetes.csv")
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
ZERO_REPLACE_COLS = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
FEATURE_NAMES = [
    "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
    "Insulin", "BMI", "DiabetesPedigreeFunction", "Age",
]
RANDOM_STATE = 42
TEST_SIZE = 0.2

FEATURE_DESCRIPTIONS = {
    "Pregnancies": "Number of times pregnant",
    "Glucose": "Plasma glucose concentration (mg/dL)",
    "BloodPressure": "Diastolic blood pressure (mm Hg)",
    "SkinThickness": "Triceps skin fold thickness (mm)",
    "Insulin": "2-Hour serum insulin (mu U/ml)",
    "BMI": "Body mass index (kg/m²)",
    "DiabetesPedigreeFunction": "Diabetes pedigree function (genetic risk score)",
    "Age": "Age in years",
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def evaluate_model(pipeline, X_test, y_test):
    """Return a dict of standard classification metrics."""
    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)[:, 1]
    return {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "precision": float(precision_score(y_test, y_pred)),
        "recall": float(recall_score(y_test, y_pred)),
        "f1_score": float(f1_score(y_test, y_pred)),
        "roc_auc": float(roc_auc_score(y_test, y_proba)),
    }


def subsample_roc(fpr, tpr, thresholds, n_points=100):
    """Subsample ROC curve data to ~n_points for JSON storage."""
    if len(fpr) <= n_points:
        return fpr.tolist(), tpr.tolist(), thresholds.tolist()
    idx = np.linspace(0, len(fpr) - 1, n_points, dtype=int)
    return fpr[idx].tolist(), tpr[idx].tolist(), thresholds[idx].tolist()


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    print("=" * 60)
    print("  Diabetes Prediction — Model Training Pipeline")
    print("=" * 60)

    # 1. Load data ----------------------------------------------------------
    df = pd.read_csv(DATASET_PATH)
    print(f"\n✓ Dataset loaded: {df.shape[0]} rows × {df.shape[1]} columns")

    # 2. Replace 0s with NaN in physiological columns ----------------------
    df[ZERO_REPLACE_COLS] = df[ZERO_REPLACE_COLS].replace(0, np.nan)
    missing_counts = df[ZERO_REPLACE_COLS].isnull().sum()
    print(f"✓ Replaced 0→NaN in {ZERO_REPLACE_COLS}")
    for col, cnt in missing_counts.items():
        print(f"    {col}: {cnt} missing")

    # 3. Drop duplicates ----------------------------------------------------
    before = len(df)
    df = df.drop_duplicates()
    print(f"✓ Dropped {before - len(df)} duplicate rows")

    # 4. Split --------------------------------------------------------------
    X = df[FEATURE_NAMES]
    y = df["Outcome"]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, stratify=y, random_state=RANDOM_STATE,
    )
    print(f"✓ Train/test split: {len(X_train)} / {len(X_test)}")

    # 5. Build pipelines for baseline models --------------------------------
    print("\n--- Baseline Model Comparison ---")
    baseline_models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=RANDOM_STATE),
        "Random Forest": RandomForestClassifier(random_state=RANDOM_STATE),
        "SVM": SVC(probability=True, random_state=RANDOM_STATE),
    }

    baseline_results = []
    for name, clf in baseline_models.items():
        pipe = Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
            ("classifier", clf),
        ])
        pipe.fit(X_train, y_train)
        metrics = evaluate_model(pipe, X_test, y_test)
        baseline_results.append({"model": name, **metrics})
        print(
            f"  {name:25s}  Acc={metrics['accuracy']:.4f}  "
            f"Prec={metrics['precision']:.4f}  Rec={metrics['recall']:.4f}  "
            f"F1={metrics['f1_score']:.4f}  AUC={metrics['roc_auc']:.4f}"
        )

    # 6. GridSearchCV on Random Forest --------------------------------------
    print("\n--- Grid Search (Random Forest, scoring=recall, cv=5) ---")
    rf_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
        ("classifier", RandomForestClassifier(random_state=RANDOM_STATE)),
    ])

    param_grid = {
        "classifier__n_estimators": [50, 100, 200],
        "classifier__max_depth": [None, 5, 10, 20],
        "classifier__min_samples_split": [2, 5, 10],
        "classifier__class_weight": ["balanced", None],
    }

    grid_search = GridSearchCV(
        rf_pipeline, param_grid,
        scoring="recall", cv=5, n_jobs=-1, verbose=1,
    )
    grid_search.fit(X_train, y_train)

    best_pipeline = grid_search.best_estimator_
    best_params = grid_search.best_params_
    print(f"\n✓ Best params: {best_params}")
    print(f"  Best CV recall: {grid_search.best_score_:.4f}")

    # 7. Evaluate best model on test set ------------------------------------
    print("\n--- Best Model Evaluation (Test Set) ---")
    y_pred = best_pipeline.predict(X_test)
    y_proba = best_pipeline.predict_proba(X_test)[:, 1]

    test_metrics = {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "precision": float(precision_score(y_test, y_pred)),
        "recall": float(recall_score(y_test, y_pred)),
        "f1_score": float(f1_score(y_test, y_pred)),
        "roc_auc": float(roc_auc_score(y_test, y_proba)),
    }
    for k, v in test_metrics.items():
        print(f"  {k:12s}: {v:.4f}")

    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = cm.ravel()
    print(f"\n  Confusion Matrix: TN={tn}  FP={fp}  FN={fn}  TP={tp}")

    # Classification report
    cls_report = classification_report(y_test, y_pred, output_dict=True)

    # ROC curve
    fpr, tpr, thresholds = roc_curve(y_test, y_proba)
    fpr_sub, tpr_sub, thresh_sub = subsample_roc(fpr, tpr, thresholds)

    # Feature importance
    rf_model = best_pipeline.named_steps["classifier"]
    importance = dict(zip(FEATURE_NAMES, [float(v) for v in rf_model.feature_importances_]))
    print("\n  Feature Importances:")
    for feat, imp in sorted(importance.items(), key=lambda x: -x[1]):
        print(f"    {feat:30s}: {imp:.4f}")

    # 8. Compute input ranges from raw data (pre-NaN replacement) -----------
    df_raw = pd.read_csv(DATASET_PATH)
    input_ranges = {}
    for feat in FEATURE_NAMES:
        col = df_raw[feat]
        if feat in ZERO_REPLACE_COLS:
            col_nonzero = col[col != 0]
            input_ranges[feat] = {
                "min": float(col_nonzero.min()),
                "max": float(col_nonzero.max()),
                "type": "float",
            }
        else:
            input_ranges[feat] = {
                "min": int(col.min()),
                "max": int(col.max()),
                "type": "int" if col.dtype in [np.int64, np.int32] else "float",
            }

    # 9. Build metadata JSON ------------------------------------------------
    class_dist = y.value_counts()
    metadata = {
        "model_name": "Random Forest (Optimized)",
        "algorithm": "RandomForestClassifier",
        "best_params": {k.replace("classifier__", ""): v for k, v in best_params.items()},
        "dataset": {
            "name": "Pima Indians Diabetes Database",
            "source": "National Institute of Diabetes and Digestive and Kidney Diseases",
            "total_records": int(len(df)),
            "features": len(FEATURE_NAMES),
            "target_variable": "Outcome",
            "class_distribution": {
                "non_diabetic": int(class_dist.get(0, 0)),
                "diabetic": int(class_dist.get(1, 0)),
            },
            "feature_names": FEATURE_NAMES,
            "feature_descriptions": FEATURE_DESCRIPTIONS,
            "missing_values_treatment": "Median imputation for zero-valued measurements",
            "feature_scaling": "StandardScaler (z-score normalization)",
        },
        "evaluation": {
            "test_size": TEST_SIZE,
            **test_metrics,
            "confusion_matrix": [[int(tn), int(fp)], [int(fn), int(tp)]],
            "roc_curve": {
                "fpr": [round(v, 6) for v in fpr_sub],
                "tpr": [round(v, 6) for v in tpr_sub],
                "thresholds": [round(v, 6) for v in thresh_sub],
            },
            "feature_importance": {k: round(v, 6) for k, v in importance.items()},
            "classification_report": cls_report,
        },
        "baseline_comparison": baseline_results,
        "training_date": datetime.now(timezone.utc).isoformat(),
        "preprocessing_steps": [
            "Replace biologically impossible zero values with NaN",
            "Median imputation for missing values",
            "StandardScaler normalization",
        ],
        "input_ranges": input_ranges,
    }

    # 10. Save artefacts ---------------------------------------------------
    os.makedirs(MODELS_DIR, exist_ok=True)

    pipeline_path = os.path.join(MODELS_DIR, "diabetes_pipeline.joblib")
    joblib.dump(best_pipeline, pipeline_path)
    print(f"\n✓ Pipeline saved → {pipeline_path}")

    metadata_path = os.path.join(MODELS_DIR, "model_metadata.json")
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"✓ Metadata saved → {metadata_path}")

    print("\n" + "=" * 60)
    print("  Training complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
