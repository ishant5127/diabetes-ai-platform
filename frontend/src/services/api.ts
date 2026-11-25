// ============================================================================
// API Service for Diabetes Prediction Platform
// ============================================================================

import type {
  HealthResponse,
  ModelInfoResponse,
  PatientData,
  PredictionHistoryItem,
  PredictionResponse,
} from "../types";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/+$/, "");

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        let errorDetail = `HTTP Error ${response.status}: ${response.statusText}`;
        try {
          const errJson = await response.json();
          if (errJson.detail) {
            errorDetail = typeof errJson.detail === "string" ? errJson.detail : JSON.stringify(errJson.detail);
          }
        } catch {
          // ignore parsing error
        }
        throw new Error(errorDetail);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      if (err.name === "TypeError" && err.message.includes("Failed to fetch")) {
        throw new Error(
          `Unable to connect to the backend server (${API_BASE}). Please verify the backend service is running.`
        );
      }
      throw err;
    }
  }

  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>("/health");
  }

  async getModelInfo(): Promise<ModelInfoResponse> {
    return this.request<ModelInfoResponse>("/model-info");
  }

  async predict(patient: PatientData): Promise<PredictionResponse> {
    return this.request<PredictionResponse>("/predict", {
      method: "POST",
      body: JSON.stringify(patient),
    });
  }

  async getHistory(): Promise<PredictionHistoryItem[]> {
    return this.request<PredictionHistoryItem[]>("/prediction-history");
  }

  async deleteHistoryItem(id: string): Promise<{ detail: string }> {
    return this.request<{ detail: string }>(`/prediction-history/${id}`, {
      method: "DELETE",
    });
  }
}

export const api = new ApiService();
