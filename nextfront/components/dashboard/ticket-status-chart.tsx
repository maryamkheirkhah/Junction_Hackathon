"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

const data = [
  { name: "Open", value: 5, color: "#D5121E" },
  { name: "In Progress", value: 10, color: "#A15885" },
  { name: "Resolved", value: 8, color: "#4d9d88" },
  { name: "Rejected", value: 2, color: "#6D838F" },
];

export function TicketStatusChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <Card className="p-2">
                    <div className="text-[#3E5660]">
                      <span className="font-bold">{payload[0].payload.name}</span>
                      <span className="ml-2">{payload[0].value}</span>
                    </div>
                  </Card>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="value" fill="#D5121E">
            {data.map((entry, index) => (
              <Bar key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}