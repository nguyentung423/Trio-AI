/**
 * FeatureImportanceChart.tsx
 *
 * Biểu đồ SHAP feature importance
 * Hiển thị tầm quan trọng của các yếu tố thời tiết
 */

"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getFeatureImportance } from "../api/backend";

interface FeatureData {
  feature: string;
  importance: number;
}

// Feature name translations
const featureLabels: Record<string, string> = {
  rain_Feb_Mar: "Mưa T2-T3 (kích hoa)",
  soil_Apr_Jun: "Độ ẩm đất T4-T6",
  temp_max_MayJun: "Nhiệt max T5-T6",
  days_over_33: "Ngày >33°C",
  radiation_JunSep: "Bức xạ T6-T9",
  rain_OctDec: "Mưa T10-T12",
  humidity_Apr_Jun: "Độ ẩm KK T4-T6",
  SPI_MarJun: "Chỉ số hạn T3-T6",
};

const colors = [
  "#d4844a",
  "#e9c093",
  "#f2d9be",
  "#3b82f6",
  "#93c5fd",
  "#dbeafe",
  "#22c55e",
  "#86efac",
];

export default function FeatureImportanceChart() {
  const [data, setData] = useState<FeatureData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFeatureImportance();
        // Transform API response to chart data
        const chartData: FeatureData[] = response.features.map(
          (feature: string, i: number) => ({
            feature: featureLabels[feature] || feature,
            importance: response.importance_scores[i],
          })
        );
        // Sort by importance descending
        chartData.sort((a, b) => b.importance - a.importance);
        setData(chartData);
      } catch (error) {
        console.error("Failed to fetch feature importance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        ⏳ Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 0.4]} />
          <YAxis
            dataKey="feature"
            type="category"
            width={130}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(value: number) => [
              `${(value * 100).toFixed(1)}%`,
              "Tầm quan trọng",
            ]}
          />
          <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
