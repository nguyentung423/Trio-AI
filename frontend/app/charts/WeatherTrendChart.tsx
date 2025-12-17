/**
 * WeatherTrendChart.tsx
 *
 * Biểu đồ xu hướng thời tiết qua các năm
 * Hiển thị SPI và số ngày nóng >33°C
 * TODO: Kết nối backend mới
 */

"use client";

import { useEffect, useState } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// TODO: Cập nhật API_BASE_URL khi có backend mới
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface WeatherData {
  year: number;
  rain_Feb_Mar: number;
  temp_max_MayJun: number;
  days_over_33: number;
  SPI_MarJun: number;
}

export default function WeatherTrendChart() {
  const [data, setData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // TODO: Bật lại khi có backend mới
      if (!API_BASE_URL) {
        setError("Backend chưa được kết nối");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/weather-trend`);
        if (!response.ok) throw new Error("Failed to fetch");
        const result = await response.json();

        // Transform API response to chart data
        const chartData: WeatherData[] = result.years.map(
          (year: number, i: number) => ({
            year,
            rain_Feb_Mar: result.rain_Feb_Mar[i],
            temp_max_MayJun: result.temp_max_MayJun[i],
            days_over_33: result.days_over_33[i],
            SPI_MarJun: result.SPI_MarJun[i],
          })
        );
        // Filter to recent years
        setData(chartData.filter((d) => d.year >= 2010));
      } catch (err) {
        console.error("Failed to fetch weather trend:", err);
        setError("Không thể tải dữ liệu thời tiết");
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

  if (error) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis
            yAxisId="left"
            label={{ value: "SPI", angle: -90, position: "insideLeft" }}
            domain={[-2, 2]}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "Ngày", angle: 90, position: "insideRight" }}
            domain={[0, 50]}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              value.toFixed(2),
              name,
            ]}
          />
          <Legend />
          <ReferenceLine
            yAxisId="left"
            y={0}
            stroke="#666"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            yAxisId="left"
            y={-1}
            stroke="#ef4444"
            strokeDasharray="3 3"
            label="Hạn"
          />
          <Bar
            yAxisId="right"
            dataKey="days_over_33"
            fill="#f97316"
            name="Ngày >33°C"
            radius={[4, 4, 0, 0]}
            opacity={0.7}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="SPI_MarJun"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Chỉ số hạn (SPI)"
            dot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
