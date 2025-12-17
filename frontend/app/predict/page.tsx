/**
 * Trang dự báo năng suất
 * Form nhập năm cần dự báo và hiển thị kết quả
 */

"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import { predictYear } from "../api/backend";

interface PredictionResult {
  year: number;
  predicted_yield: number;
  confidence_lower: number;
  confidence_upper: number;
  unit: string;
  features_used?: Record<string, number>;
}

export default function PredictPage() {
  const [year, setYear] = useState<number>(2025);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await predictYear(year);
      setResult(data);
    } catch (err) {
      setError("Không thể kết nối đến server. Vui lòng kiểm tra backend.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-predict on initial load
  useEffect(() => {
    handlePredict();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-coffee-800 mb-4">
          🔮 Dự báo năng suất cà phê
        </h1>
        <p className="text-gray-600">
          Nhập năm cần dự báo để xem kết quả từ model Machine Learning
        </p>
      </div>

      {/* Input Form */}
      <Card title="Nhập thông tin">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Năm dự báo (1990 - 2025)
            </label>
            <input
              type="number"
              min="1990"
              max="2025"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full bg-coffee-600 hover:bg-coffee-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? "⏳ Đang dự báo..." : "🔮 Dự báo ngay"}
          </button>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Kết quả dự báo">
            <div className="text-center space-y-4">
              <div>
                <p className="text-gray-500">Năm {result.year}</p>
                <p className="text-5xl font-bold text-coffee-600">
                  {result.predicted_yield.toFixed(2)}
                </p>
                <p className="text-gray-500">{result.unit}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Khoảng tin cậy ±10%</p>
                <p className="text-lg font-medium">
                  {result.confidence_lower.toFixed(2)} -{" "}
                  {result.confidence_upper.toFixed(2)} {result.unit}
                </p>
              </div>
            </div>
          </Card>

          {/* Features Used */}
          {result.features_used && (
            <Card title="Đặc trưng thời tiết đầu vào">
              <div className="space-y-2">
                {Object.entries(result.features_used).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600">{key}</span>
                    <span className="font-medium">
                      {typeof value === "number" ? value.toFixed(2) : value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
