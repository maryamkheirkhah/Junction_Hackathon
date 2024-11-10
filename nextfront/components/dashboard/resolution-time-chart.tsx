"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

interface ResolutionData {
  average_resolution_time: number;
  median_resolution_time: number;
  functional_area: string;
}

export function ResolutionTimeChart() {
  const [data, setData] = useState<ResolutionData[]>([]);

  useEffect(() => {
    // Simulated data - replace with actual API call
    const areas = ["Monitoring", "Operations", "Planning", "Maintenance"];
    const simulatedData = areas.map((area) => ({
      functional_area: area,
      average_resolution_time: Math.random() * 10 + 2,
      median_resolution_time: Math.random() * 8 + 1,
    }));
    setData(simulatedData);
  }, []);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="functional_area" />
          <YAxis />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <Card className="p-2">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-[#3E5660]">
                        {payload[0].payload.functional_area}
                      </p>
                      <p className="text-xs text-[#6D838F]">
                        Average: {payload[0].value.toFixed(1)} days
                      </p>
                      <p className="text-xs text-[#6D838F]">
                        Median: {payload[1].value.toFixed(1)} days
                      </p>
                    </div>
                  </Card>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="average_resolution_time"
            stroke="#D5121E"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="median_resolution_time"
            stroke="#4d9d88"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}