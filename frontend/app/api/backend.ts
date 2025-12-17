/**
 * backend.ts
 *
 * Helper functions để gọi Backend API
 * Kết nối với FastAPI backend cho dự báo năng suất cà phê
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ============================================================================
// API Response Types
// ============================================================================

export interface PredictionResponse {
  year: number;
  predicted_yield: number;
  confidence_lower: number;
  confidence_upper: number;
  unit: string;
  features_used?: Record<string, number>;
}

export interface FeatureImportanceResponse {
  features: string[];
  importance_scores: number[];
  shap_mean_abs?: number[];
}

export interface YieldHistoryResponse {
  years: number[];
  actual_yields: (number | null)[];
  predicted_yields: number[];
}

export interface WeatherTrendResponse {
  years: number[];
  rain_Feb_Mar: number[];
  temp_max_MayJun: number[];
  days_over_33: number[];
  SPI_MarJun: number[];
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  features_loaded: boolean;
  data_years: number[];
  model_name?: string;
  feature_count?: number;
}

export interface AvailableYearsResponse {
  available_years: number[];
  years_with_yield_data: number[];
  min_year: number;
  max_year: number;
}

// Scenario types
export type ScenarioKey =
  | "normal"
  | "favorable"
  | "el_nino"
  | "la_nina"
  | "severe_drought"
  | "major_storm";

export interface ScenarioPredictionResponse {
  crop: string;
  province: string;
  year: number;
  scenario: string;
  scenario_label: string;
  predicted_yield_ton_ha: number;
  confidence_lower: number;
  confidence_upper: number;
  unit: string;
  confidence_note: string;
}

export interface PredictScenarioParams {
  province?: string;
  year: number;
  scenario?: ScenarioKey;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Dự báo năng suất cho năm cụ thể
 */
export async function predictYear(year: number): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/predict-year?year=${year}`);
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `Failed to predict for year ${year}`);
  }
  return response.json();
}

/**
 * Lấy SHAP feature importance
 */
export async function getFeatureImportance(): Promise<FeatureImportanceResponse> {
  const response = await fetch(`${API_BASE_URL}/feature-importance`);
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || "Failed to fetch feature importance");
  }
  return response.json();
}

/**
 * Lấy lịch sử năng suất các năm
 */
export async function getYieldHistory(): Promise<YieldHistoryResponse> {
  const response = await fetch(`${API_BASE_URL}/yield-history`);
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || "Failed to fetch yield history");
  }
  return response.json();
}

/**
 * Health check endpoint
 */
export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error("Backend is not healthy");
  }
  return response.json();
}

/**
 * Lấy xu hướng thời tiết theo năm
 */
export async function getWeatherTrend(): Promise<WeatherTrendResponse> {
  const response = await fetch(`${API_BASE_URL}/weather-trend`);
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || "Failed to fetch weather trend");
  }
  return response.json();
}

/**
 * Lấy danh sách các năm có sẵn
 */
export async function getAvailableYears(): Promise<AvailableYearsResponse> {
  const response = await fetch(`${API_BASE_URL}/years`);
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || "Failed to fetch available years");
  }
  return response.json();
}

/**
 * Dự báo năng suất theo kịch bản thời tiết
 */
export async function predictScenario(
  params: PredictScenarioParams
): Promise<ScenarioPredictionResponse> {
  const searchParams = new URLSearchParams();
  if (params.province) searchParams.set("province", params.province);
  searchParams.set("year", params.year.toString());
  if (params.scenario) searchParams.set("scenario", params.scenario);

  const response = await fetch(
    `${API_BASE_URL}/predict-scenario?${searchParams.toString()}`
  );
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Unknown error" }));
    throw new Error(
      error.detail || `Failed to predict scenario for year ${params.year}`
    );
  }
  return response.json();
}
