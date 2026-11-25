# 🏥 DiaPredict.AI — Precision Clinical Machine Learning Platform for Diabetes Risk Assessment

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.115-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_19_TypeScript-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![scikit-learn](https://img.shields.io/badge/ML-scikit--learn_1.5-F7931E.svg?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![TailwindCSS](https://img.shields.io/badge/UI-Tailwind_CSS_v4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/Status-Evaluation_Ready-10b981.svg)]()

> **Final College Academic Evaluation & Capstone Project**  
> An end-to-end, production-grade clinical AI healthcare web application transforming standard notebook code into a robust full-stack diagnostic decision support system. Built with a **leakage-free scikit-learn pipeline**, **FastAPI backend**, and a **futuristic glassmorphism React/TypeScript interface**.

---

## 📌 Table of Contents

1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [Original Project Audit vs. Engineered Improvements](#2-original-project-audit-vs-engineered-improvements)
3. [Machine Learning Pipeline & Methodology](#3-machine-learning-pipeline--methodology)
4. [System Architecture & Data Flow](#4-system-architecture--data-flow)
5. [API Specification](#5-api-specification)
6. [UI/UX Design System (Glassmorphism Hierarchy)](#6-uiux-design-system-glassmorphism-hierarchy)
7. [Step-by-Step Setup & Execution Guide](#7-step-by-step-setup--execution-guide)
8. [Comprehensive Viva & Oral Evaluation Preparation (30 Questions & Answers)](#8-comprehensive-viva--oral-evaluation-preparation)

---

## 1. Executive Summary & Problem Statement

### The Clinical Problem
Diabetes mellitus is a chronic metabolic disorder characterized by elevated levels of blood glucose, leading over time to serious damage to the heart, blood vessels, eyes, kidneys, and nerves. According to the International Diabetes Federation (IDF), over 537 million adults live with diabetes globally, with nearly **50% undiagnosed**.

Early identification of diabetic risk enables lifestyle interventions (dietary modification, weight loss, exercise) that can prevent or delay disease progression.

### The Engineering Solution
**DiaPredict.AI** transforms a basic offline Colab notebook into an interactive, real-time diagnostic platform. Rather than merely outputting a binary label, the platform:
- Ingests patient biometric profiles through an interactive medical intake form.
- Dynamically transforms data using a serialized scikit-learn pipeline (strictly fitted only on training data).
- Generates probability confidence distributions and clinical risk tiers (**Low**, **Moderate**, **High**).
- Displays comprehensive model evaluation artefacts (ROC-AUC, Confusion Matrix, Gini Feature Importances).
- Preserves a persistent audit trail for clinical record-keeping.

---

## 2. Original Project Audit vs. Engineered Improvements

| Critical Dimension | Original Colab Project (`CE1_Diabetes_Prediction.ipynb`) | Engineered Production Platform (`DiaPredict.AI`) | Clinical / Technical Impact |
| :--- | :--- | :--- | :--- |
| **Data Leakage** | ⚠️ **Severe Leakage**: Imputer and `StandardScaler` were fit on the **entire dataset** (768 rows) *before* `train_test_split`. | ✅ **Zero Leakage**: `SimpleImputer` and `StandardScaler` are encapsulated in an `sklearn.pipeline.Pipeline`, fitted **strictly on the 80% training split**. | Prevents test distribution information from leaking into model training, guaranteeing realistic generalization. |
| **Model Persistence** | ❌ **No Persistence**: Model was trained on-the-fly inside notebook cells; lost upon runtime restart. | ✅ **Joblib Serialization**: Complete pipeline (`imputer` + `scaler` + `classifier`) serialized to `diabetes_pipeline.joblib`. | FastAPI backend loads the pipeline once into memory at startup; inference latency is under **15 milliseconds**. |
| **Evaluation Strategy** | ⚠️ Generic focus on accuracy or uncalibrated test metrics. | ✅ **Recall-Optimized GridSearchCV**: 5-fold cross-validation with `scoring='recall'` and `class_weight='balanced'`. | Boosted clinical sensitivity from **50.0%** to **72.2%**, cutting False Negatives by **44.4%**. |
| **User Interface** | ❌ None (raw matplotlib and seaborn plots inside Jupyter cells). | ✅ **Futuristic Glassmorphism React 19 Frontend**: Multi-level frosted glass, Recharts data visualizations, responsive mobile layout. | Professional startup-grade medical interface ready for high-stakes viva demonstration. |
| **Architecture** | ❌ Monolithic notebook script. | ✅ **Decoupled Client-Server REST Architecture**: React 19 SPA communicating with asynchronous FastAPI backend via JSON endpoints. | Clean separation of concerns, testable, maintainable, scalable. |
| **Demonstration Usability** | ⚠️ Required manual variable modification in code. | ✅ **1-Click Clinical Presets**: Instant loading of calibrated *Healthy*, *Borderline*, and *Diabetic* patient scenarios. | Enables rapid, seamless live demonstrations during evaluator viva interviews. |

---

## 3. Machine Learning Pipeline & Methodology

### 3.1 Dataset Profile: Pima Indians Diabetes Database
- **Source**: National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK).
- **Cohort**: All patients are female, at least 21 years of age, of Pima Indian heritage.
- **Records**: 768 samples (500 Non-Diabetic [65.1%], 268 Diabetic [34.9%]).
- **Target Variable**: `Outcome` (0 = Non-diabetic, 1 = Diabetic).

### 3.2 Feature Definitions & Zero-Value Biological Imputation
In medical diagnostic datasets, a recorded value of `0` does not always indicate a true measurement. A living human cannot have zero blood pressure or zero glucose:
1. `Glucose`: 5 zero values → Treated as missing (replaced with NaN).
2. `BloodPressure`: 35 zero values → Treated as missing (replaced with NaN).
3. `SkinThickness`: 227 zero values → Treated as missing (replaced with NaN).
4. `Insulin`: 374 zero values → Treated as missing (replaced with NaN).
5. `BMI`: 11 zero values → Treated as missing (replaced with NaN).
6. `Pregnancies`: Zero values represent true nulliparity (0 pregnancies) → Preserved.
7. `Age`: Non-zero integer → Preserved.
8. `DiabetesPedigreeFunction`: Genetic family history score → Preserved.

**Imputation Strategy**: `SimpleImputer(strategy='median')` was selected over mean imputation because physiological metrics like serum insulin and BMI exhibit heavy positive skewness with extreme clinical outliers. The median provides a robust, outlier-resistant central tendency measure.

### 3.3 Scaler
`StandardScaler` transforms each feature to $z = \frac{x - \mu}{\sigma}$ ($mean = 0, variance = 1$), ensuring that distance-sensitive algorithms and gradient estimators are not dominated by high-magnitude variables (e.g., Insulin up to 846 vs. Pedigree up to 2.4).

### 3.4 Algorithm Benchmarking Comparison

All models were evaluated on the identical 20% holdout test partition ($n = 154$, 100 Healthy, 54 Diabetic):

| Algorithm | Accuracy | Precision | Recall (Sensitivity) | F1-Score | ROC-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression (Baseline)** | 70.78% | 60.00% | 50.00% | 0.5455 | 0.8130 |
| **Support Vector Machine (RBF Kernel)** | 74.03% | 65.22% | 55.56% | 0.6000 | 0.7964 |
| **Random Forest (Default)** | 77.27% | 70.21% | 61.11% | 0.6535 | 0.8181 |
| **Random Forest (GridSearchCV Tuned)** 🏆 | **74.68%** | **61.90%** | **72.22%** | **0.6667** | **0.8256** |

### 3.5 Why We Selected the Tuned Random Forest
Although default Random Forest achieved higher raw accuracy (77.3%), its sensitivity was only 61.1% (missing 21 out of 54 diabetic patients).  
Our **GridSearchCV tuned model** prioritized `recall` using `class_weight='balanced'`:
- **Best Hyperparameters**: `class_weight: 'balanced'`, `max_depth: 5`, `min_samples_split: 10`, `n_estimators: 50`.
- **Recall**: **72.22%** (successfully identifying 39 out of 54 diabetic cases).
- **ROC-AUC**: **0.8256** (outstanding discriminatory ability across all decision boundaries).
- **False Negatives**: Reduced from 27 (Logistic Regression) to **15**.

### 3.6 Top Diagnostic Drivers (Gini Feature Importance)
1. **Plasma Glucose**: **33.91%** (Primary glycemic indicator)
2. **Body Mass Index (BMI)**: **20.00%** (Adiposity / metabolic syndrome marker)
3. **Serum Insulin**: **11.77%** (Endocrine regulatory response)
4. **Age**: **11.24%** (Cumulative exposure & metabolic slowdown)
5. **Diabetes Pedigree Function**: **7.50%** (Genetic susceptibility)
6. **Pregnancies**: **6.86%** (Gestational metabolic stress)
7. **Skin Thickness**: **4.79%** (Subcutaneous body fat)
8. **Blood Pressure**: **3.93%** (Vascular tone)

---

## 4. System Architecture & Data Flow

```mermaid
flowchart TD
    subgraph Client["Frontend Client (React 19 + TypeScript + Vite)"]
        UI["Glassmorphism Web UI<br/>(Tailwind CSS v4)"]
        Form["Patient Assessment Form<br/>(Live Range & Type Validation)"]
        Presets["1-Click Clinical Presets<br/>(Healthy / Borderline / Diabetic)"]
        Charts["Interactive Visualizations<br/>(ROC Curve, Confusion Matrix, Gini Importance)"]
    end

    subgraph Server["Backend Server (FastAPI + Python 3.12)"]
        API["REST API Router (/api/*)"]
        Pydantic["Pydantic v2 Schema Validation<br/>(PatientData, Bounded Constraints)"]
        Service["PredictionService (Singleton)"]
        History["Audit Trail Store<br/>(prediction_history.json)"]
    end

    subgraph ML["Machine Learning Pipeline (Scikit-Learn Artifacts)"]
        Joblib["diabetes_pipeline.joblib"]
        subgraph Pipeline["Sklearn Pipeline Object"]
            Imp["SimpleImputer<br/>(strategy='median')"]
            Scaler["StandardScaler<br/>(mean=0, var=1)"]
            RF["RandomForestClassifier<br/>(50 trees, balanced weights, depth=5)"]
        end
        Meta["model_metadata.json<br/>(Evaluation Metrics, ROC coords, Input Ranges)"]
    end

    UI --> Form
    Presets --> Form
    Form -->|POST /api/predict (JSON)| API
    API --> Pydantic
    Pydantic --> Service
    Service -->|Run Pipeline| Pipeline
    Joblib -.->|Loaded at Startup| Service
    Pipeline --> Imp --> Scaler --> RF
    RF -->|predict_proba| Service
    Service --> History
    Service -->|PredictionResponse (JSON)| API
    API -->|Risk Level, Probability, Label| UI
    Meta -.->|GET /api/model-info| Charts
```

---

## 5. API Specification

Base URL: `http://localhost:8000/api`

### 1. `GET /health`
Returns server status and model readiness.
```json
{
  "status": "healthy",
  "model_loaded": true,
  "timestamp": "2026-11-24T17:00:57.148473+00:00"
}
```

### 2. `GET /model-info`
Returns comprehensive evaluation artefacts, confusion matrix, ROC curve points, feature importances, dataset summary, and baseline benchmark comparisons.

### 3. `POST /predict`
Executes patient risk prediction.
- **Request Body**:
```json
{
  "Pregnancies": 5,
  "Glucose": 178,
  "BloodPressure": 86,
  "SkinThickness": 38,
  "Insulin": 210,
  "BMI": 36.4,
  "DiabetesPedigreeFunction": 0.82,
  "Age": 53
}
```
- **Response**:
```json
{
  "prediction": 1,
  "probability": 0.8739,
  "risk_level": "High",
  "label": "Diabetic",
  "patient_data": { ... },
  "model_info": {
    "model_name": "Random Forest (Optimized)",
    "algorithm": "RandomForestClassifier",
    "accuracy": 0.7468,
    "roc_auc": 0.8256
  }
}
```

### 4. `GET /prediction-history`
Returns array of recent assessment records with timestamps and input echos.

### 5. `DELETE /prediction-history/{id}`
Deletes an assessment item from the persistent JSON audit log.

---

## 6. UI/UX Design System (Glassmorphism Hierarchy)

The application employs a **dark cybernetic medical aesthetic** built on three distinct glassmorphism elevation levels:

- **Level 1 (Main Glass Panels)**: `backdrop-blur-xl bg-white/[0.04] border border-white/[0.08]` — Used for primary content sections and assessment result reveal cards.
- **Level 2 (Secondary Cards)**: `backdrop-blur-lg bg-white/[0.03] border border-white/[0.06]` — Used for metric tiles, form groups, and chart containers.
- **Level 3 (Interactive Controls)**: `backdrop-blur-md bg-white/[0.05] border border-white/[0.1]` with dynamic glowing focus states (`border-cyan-500/50 shadow-cyan-500/20`).
- **Color Accents**:
  - `Electric Cyan (#06b6d4)`: AI operations, primary actions, and ROC curve.
  - `Medical Teal (#14b8a6)`: Data preprocessing, vital indicators, accuracy metrics.
  - `Alert Rose (#f43f5e)`: Positive diabetic classification, high risk alerts, Recall metric.
  - `Clinical Emerald (#10b981)`: Negative (healthy) classification, online status.
  - `Warning Amber (#f59e0b)`: Pre-diabetic ranges and medical educational disclaimer.

---

## 7. Step-by-Step Setup & Execution Guide

### Prerequisites
- Python 3.10+ installed
- Node.js 18+ and npm installed

### Step 1: Clone or Navigate to the Project
```bash
cd "c:\Users\ishan\Desktop\Hackathon Project\diabetes-ai-platform"
```

### Step 2: Set Up Backend & Retrain Model (Optional)
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run model training & pipeline serialization
python train.py

# Start FastAPI server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend is now live at: `http://127.0.0.1:8000` (Interactive Swagger docs at `http://127.0.0.1:8000/docs`).*

### Step 3: Set Up and Start Frontend
In a new terminal window:
```bash
cd "c:\Users\ishan\Desktop\Hackathon Project\diabetes-ai-platform\frontend"

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
*Frontend is now live at: `http://127.0.0.1:5173`.*

---

## 8. Comprehensive Viva & Oral Evaluation Preparation

Below are **30 detailed viva questions and high-scoring answers** designed specifically for your college project evaluation:

### Part A: Problem Formulation & Dataset (Q1 - Q7)

#### Q1: What is the primary objective of this project?
> **Answer**: The objective is to build an intelligent clinical decision-support web application that predicts a patient's risk of diabetes mellitus from non-invasive physiological vitals. It addresses the global issue of undiagnosed diabetes by providing real-time risk stratification (Low, Moderate, High) through a production-ready machine learning pipeline connected to a modern web application.

#### Q2: Which dataset did you use, and what are its characteristics?
> **Answer**: We utilized the **Pima Indians Diabetes Database**, originally compiled by the National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK). It consists of 768 female patients of Pima Indian heritage aged 21 and older. There are 8 continuous/integer numerical features and 1 binary classification target (`Outcome`). 500 patients (65.1%) are non-diabetic and 268 (34.9%) are diabetic.

#### Q3: What are the 8 features in the dataset?
> **Answer**:
> 1. `Pregnancies`: Number of times pregnant.
> 2. `Glucose`: 2-hour oral glucose tolerance test concentration (mg/dL).
> 3. `BloodPressure`: Diastolic blood pressure (mm Hg).
> 4. `SkinThickness`: Triceps skin fold thickness (mm).
> 5. `Insulin`: 2-hour serum insulin level (mu U/ml).
> 6. `BMI`: Body Mass Index (weight in kg / (height in m)²).
> 7. `DiabetesPedigreeFunction`: Mathematical score representing genetic family predisposition.
> 8. `Age`: Patient age in years.

#### Q4: Why did certain features contain zero values, and how did you handle them?
> **Answer**: Biologically, a living patient cannot possess a glucose level, diastolic blood pressure, or BMI of zero. In this legacy dataset, zeros in `Glucose` (5), `BloodPressure` (35), `SkinThickness` (227), `Insulin` (374), and `BMI` (11) represent missing clinical measurements. We converted these zeros to `NaN` and imputed them using `SimpleImputer(strategy='median')`. We did **not** convert `Pregnancies` to NaN because zero pregnancies represents a valid clinical state (nulliparity).

#### Q5: Why did you choose median imputation instead of mean imputation?
> **Answer**: In medical datasets, variables like serum insulin and skin thickness have significant positive skewness with high outliers (e.g., insulin values up to 846 mu U/ml). The mean is easily distorted by extreme values, whereas the median represents the true 50th percentile and provides a far more representative and robust central imputation value.

#### Q6: Is the dataset balanced or imbalanced? How does this affect modeling?
> **Answer**: The dataset is moderately imbalanced with a **65:35 negative-to-positive ratio** (500 non-diabetic vs. 268 diabetic). If an algorithm simply guessed "Non-Diabetic" for every patient, it would achieve 65.1% baseline accuracy while having 0% sensitivity. Therefore, accuracy alone is an invalid metric, and models must be trained using class-weight balancing and evaluated via Recall, F1-score, and ROC-AUC.

#### Q7: What is the Diabetes Pedigree Function (DPF)?
> **Answer**: The Diabetes Pedigree Function is a continuous clinical score developed by Smith et al. that calculates the expected genetic risk of diabetes based on family medical history. It incorporates the degrees of kinship (parents, grandparents, siblings), the age at which relatives developed diabetes, and the percentage of genes shared.

---

### Part B: Machine Learning Pipeline & Leakage (Q8 - Q15)

#### Q8: What is data leakage, and where was it present in the original notebook?
> **Answer**: Data leakage occurs when information from outside the training dataset is inadvertently used to create the model, artificially inflating performance metrics that fail in real-world deployment. In the original notebook, `SimpleImputer` and `StandardScaler` were called via `fit_transform()` on the **entire dataset of 768 rows prior to splitting**. Consequently, the test set's median and standard deviation influenced the training features.

#### Q9: How did you fix data leakage in your implementation?
> **Answer**: We utilized scikit-learn's `Pipeline` object:
> ```python
> pipeline = Pipeline([
>     ("imputer", SimpleImputer(strategy="median")),
>     ("scaler", StandardScaler()),
>     ("classifier", RandomForestClassifier(class_weight="balanced", ...))
> ])
> ```
> We partitioned the data first (`train_test_split(test_size=0.2, stratify=y)`), and called `fit()` strictly on `X_train`. The imputer and scaler calculated their parameters solely from the training partition and applied those learned transformations to `X_test` and incoming production inference requests.

#### Q10: Why did you use feature scaling (StandardScaler)?
> **Answer**: Different features possess vastly differing scales (e.g., `Insulin` ranges from 14 to 846, while `DiabetesPedigreeFunction` ranges from 0.08 to 2.42). Features on large scales can disproportionately dominate distance calculations and gradient convergence. `StandardScaler` standardizes features to zero mean and unit variance ($z = (x - \mu) / \sigma$).

#### Q11: What is a stratified train-test split, and why did you use it?
> **Answer**: `stratify=y` guarantees that both the training set (80%) and test set (20%) maintain the exact same proportion of diabetic (34.9%) and non-diabetic (65.1%) samples as the parent dataset. Without stratification, random sampling could produce a test partition with disproportionately few diabetic patients, biasing evaluation.

#### Q12: Which algorithms did you benchmark as baselines?
> **Answer**: We benchmarked three distinct algorithmic paradigms:
> 1. **Logistic Regression**: A linear generalized model establishing the baseline classification boundary.
> 2. **Support Vector Classifier (SVM)**: A maximum-margin kernelized classifier utilizing a Radial Basis Function (RBF) kernel.
> 3. **Random Forest Classifier**: A non-linear bootstrap-aggregated (bagging) decision tree ensemble.

#### Q13: What is Random Forest, and why is it suitable for this task?
> **Answer**: Random Forest builds an ensemble of decorrelated decision trees using bootstrap aggregation (bagging) and random feature subspace selection. It handles non-linear medical relationships, interactions between features (e.g., Glucose interacting with BMI and Age), is robust to outliers, and prevents single-tree overfitting through majority voting.

#### Q14: What is GridSearchCV, and what hyperparameters did you optimize?
> **Answer**: GridSearchCV performs exhaustive hyperparameter search over a specified parameter grid, evaluated via stratified $k$-fold cross-validation. We searched:
> - `n_estimators`: [50, 100, 200]
> - `max_depth`: [None, 5, 10, 20]
> - `min_samples_split`: [2, 5, 10]
> - `class_weight`: ['balanced', None]  
> The optimal configuration was: `n_estimators=50`, `max_depth=5`, `min_samples_split=10`, `class_weight='balanced'`.

#### Q15: How does `class_weight='balanced'` work mathematically?
> **Answer**: `class_weight='balanced'` adjusts the cost function weights inversely proportional to class frequencies:
> $$w_j = \frac{N}{k \cdot n_j}$$
> where $N$ is total samples, $k$ is number of classes (2), and $n_j$ is samples in class $j$. This assigns a higher penalty to misclassifying the minority diabetic class, forcing trees to prioritize sensitivity.

---

### Part C: Evaluation Metrics & Clinical Rationale (Q16 - Q21)

#### Q16: Define Precision, Recall, and F1-Score.
> **Answer**:
> - **Precision**: $\frac{TP}{TP + FP}$ — Out of all patients predicted diabetic, how many actually have diabetes?
> - **Recall (Sensitivity)**: $\frac{TP}{TP + FN}$ — Out of all patients who truly have diabetes, how many did the AI successfully catch?
> - **F1-Score**: $2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}$ — The harmonic mean balancing precision and recall.

#### Q17: Why is Recall (Sensitivity) more important than Precision in this project?
> **Answer**: In diagnostic screening:
> - A **False Positive** (FP) means a healthy patient is flagged as high risk. They will undergo a confirmatory clinical blood test (fasting plasma glucose or HbA1c) which clears them. The consequence is minor anxiety and a follow-up test.
> - A **False Negative** (FN) means an undiagnosed diabetic patient is falsely assured they are healthy. They receive no treatment, leading to irreversible organ damage, diabetic ketoacidosis, neuropathy, or cardiovascular events.  
> Therefore, minimizing False Negatives (maximizing Recall) is the primary clinical objective.

#### Q18: Explain your model's Confusion Matrix numbers.
> **Answer**: On our holdout test set of 154 patients:
> - **True Negatives (TN)** = 76 (Correctly identified as healthy)
> - **False Positives (FP)** = 24 (Healthy patients flagged for clinical follow-up)
> - **False Negatives (FN)** = 15 (Diabetic patients missed)
> - **True Positives (TP)** = 39 (Diabetic patients successfully identified)  
> Recall = $39 / (39 + 15) = 72.2\%$. Specificity = $76 / (76 + 24) = 76.0\%$.

#### Q19: What is ROC-AUC, and what does your score of 0.826 signify?
> **Answer**: The Receiver Operating Characteristic (ROC) curve plots True Positive Rate vs. False Positive Rate across all classification thresholds from 0.0 to 1.0. The Area Under the Curve (AUC) measures the probability that the classifier ranks a randomly chosen positive patient higher than a randomly chosen negative patient. An AUC of **0.8256** represents excellent diagnostic discrimination (well above random chance 0.50).

#### Q20: What are the top two features influencing predictions, and does this align with medical science?
> **Answer**: Our Gini feature importances reveal that **Glucose (33.9%)** and **BMI (20.0%)** account for over 53% of the total predictive power. This aligns with medical endocrinology: persistent hyperglycemia is the defining symptom of diabetes, and elevated BMI (excess adiposity) induces cellular insulin receptor resistance.

#### Q21: What is the difference between overfitting and underfitting, and how did you prevent them?
> **Answer**:
> - **Overfitting**: Model memorizes noise and idiosyncrasies in training data, achieving 99% train accuracy but failing on test data.
> - **Underfitting**: Model is too simplistic to capture underlying patterns (e.g., linear regression on non-linear data).  
> We prevented overfitting by setting `max_depth=5` (pruning deep branches), `min_samples_split=10`, and using 5-fold cross-validation during hyperparameter tuning.

---

### Part D: Full-Stack Architecture & Engineering (Q22 - Q27)

#### Q22: Why did you choose FastAPI over Flask or Django?
> **Answer**:
> 1. **High Performance**: Built on ASGI (`Starlette` and `Uvicorn`), FastAPI offers near-NodeJS asynchronous throughput.
> 2. **Native Type Safety & Validation**: Built-in integration with `Pydantic v2` automatically validates incoming request data types and bounds.
> 3. **Automatic OpenAPI/Swagger Documentation**: Automatically generates interactive API documentation at `/docs`.
> 4. **Modern Pythonic Syntax**: Supports Python type hints and clean lifespan management for ML model caching.

#### Q23: How does the trained model get loaded and executed in production?
> **Answer**: We use a `PredictionService` singleton with an asynchronous FastAPI `lifespan` handler. At server startup, `joblib.load()` loads the complete pre-trained pipeline object (`diabetes_pipeline.joblib`) into memory once. When incoming patient JSON arrives, the service constructs a single-row Pandas DataFrame, applies zero-to-NaN conversions, calls `pipeline.predict_proba()`, and returns structured probability values in under 15ms.

#### Q24: How does React communicate with the Python backend?
> **Answer**: The frontend communicates via asynchronous HTTP requests using the browser's native `fetch` API wrapped in an `ApiService` class. The client sends a `POST` request with JSON payload to `http://localhost:8000/api/predict`. CORS (Cross-Origin Resource Sharing) middleware configured in FastAPI permits requests from the Vite development server (`http://localhost:5173`).

#### Q25: Why did you use Tailwind CSS v4 and Framer Motion?
> **Answer**:
> - **Tailwind CSS v4**: Provides high-performance utility-first styling with native CSS variable support, enabling custom frosted glass backdrop-filters (`backdrop-blur-xl`), luminous border highlights, and dark-theme ambient gradients.
> - **Framer Motion**: Enables smooth micro-interactions, spring physics on diagnostic result reveals, and staggered metric card entrances that make the application feel like a commercial medical product.

#### Q26: How does the application handle patient privacy?
> **Answer**: In compliance with privacy-by-design principles, the platform does not collect personally identifiable information (PII) such as patient names, Social Security numbers, or addresses. Predictions are audited anonymously in a localized JSON history store with unique UUIDs, and users can purge individual assessment records with one click.

#### Q27: How does the UI assist an evaluator during a live presentation?
> **Answer**: We built-in **1-click viva presets** on the assessment page:
> 1. *Healthy Patient Profile*: Demonstrates low risk prediction (2.1% probability).
> 2. *Borderline Profile*: Demonstrates intermediate risk prediction (42.5% probability).
> 3. *High Risk Diabetic Profile*: Demonstrates positive classification (87.4% probability).  
> This allows the evaluator to test the system's dynamic responsiveness without manually typing 8 numbers.

---

### Part E: Limitations & Future Enhancements (Q28 - Q30)

#### Q28: What are the primary limitations of the current machine learning model?
> **Answer**:
> 1. **Demographic Specificity**: The dataset is restricted to female Pima Indian patients aged 21+, which may not generalize to diverse global ethnicities or male populations.
> 2. **Dataset Volume**: 768 samples is relatively small for deep learning or complex gradient boosting ensembles.
> 3. **Missing Biomarkers**: Modern clinical diagnostics include glycated hemoglobin (HbA1c) and lipid profiles (LDL, HDL, triglycerides), which were not recorded in this 1988 dataset.

#### Q29: How would you scale this system for production hospital deployment?
> **Answer**:
> 1. **Containerization**: Package frontend and backend as Docker multi-stage images orchestrated via Kubernetes or AWS ECS.
> 2. **Persistent Database**: Transition from local JSON history to PostgreSQL with SQLAlchemy ORM and Alembic schema migrations.
> 3. **EHR / FHIR Integration**: Implement HL7/FHIR (Fast Healthcare Interoperability Resources) API standards to integrate directly with hospital Electronic Health Record systems.
> 4. **Authentication & HIPAA Compliance**: Add OAuth2/JWT authentication and end-to-end TLS encryption.

#### Q30: If you had more time, what advanced ML techniques would you incorporate?
> **Answer**:
> 1. **SHAP (SHapley Additive exPlanations)**: Provide localized explainability for individual patients (e.g., showing a patient a waterfall plot proving their glucose of 178 contributed +0.32 to their probability score).
> 2. **Ensemble Stacking**: Combine XGBoost, LightGBM, and CatBoost with a Logistic Regression meta-learner.
> 3. **Active Learning**: Collect validated clinical feedback to continuously retrain and monitor model drift using MLflow or Weights & Biases.

---

## 9. Verification & Health Check

Both services run locally:
- **FastAPI Backend**: `http://127.0.0.1:8000`
- **Swagger Documentation**: `http://127.0.0.1:8000/docs`
- **React Frontend**: `http://127.0.0.1:5173`

*DiaPredict.AI — Engineered with precision for final academic evaluation.*
