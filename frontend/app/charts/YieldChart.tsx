/**
 * YieldChart.tsx
 *
 * Biểu đồ so sánh năng suất thực tế vs dự báo qua các năm
 * Sử dụng Recharts library
 */

"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getYieldHistory } from "../api/backend";

interface YieldData {
  year: number;
  actual: number | null;
  predicted: number;
}

export default function YieldChart() {
  const [data, setData] = useState<YieldData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getYieldHistory();
        // Transform API response to chart data
        const chartData: YieldData[] = response.years.map(
          (year: number, i: number) => ({
            year,
            actual: response.actual_yields[i],
            predicted: response.predicted_yields[i],
          })
        );
        // Filter to show only years with data (2015-2025)
        setData(chartData.filter((d) => d.year >= 2015));
      } catch (error) {
        console.error("Failed to fetch yield history:", error);
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
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis
            domain={[2, 3]}
            label={{ value: "Tấn/ha", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value: number) => value?.toFixed(2)}
            labelFormatter={(label) => `Năm ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#d4844a"
            strokeWidth={2}
            name="Thực tế"
            dot={{ r: 4 }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Dự báo"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
