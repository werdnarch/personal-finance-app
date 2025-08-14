import { BudgetType } from "@/app/types";
import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useState } from "react";

interface ChartProps {
  budgets: BudgetType[];
}

export default function Chart({ budgets }: ChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const total = budgets.reduce((sum, b) => sum + b.maximum, 0);
      const percent = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-2 rounded shadow">
          <p className="text-[0.8rem] text-zinc-500">
            {payload[0].payload.category}
          </p>
          <p className="text-sm font-bold">{percent}%</p>
        </div>
      );
    }
    return null;
  };
  return (
    <PieChart
      className="w-full"
      width={200}
      height={200}
      style={{ outline: "none" }}
    >
      <Pie
        data={budgets}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={90}
        dataKey="maximum"
        stroke="none"
        paddingAngle={1}
        onMouseEnter={(_, index) => setActiveIndex(index)}
        onMouseLeave={() => setActiveIndex(null)}
      >
        {budgets.map((budget, index) => (
          <Cell
            key={`cell-${index}`}
            fill={budget.theme}
            opacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
            stroke="none"
            style={{ transition: "opacity 0.3s ease" }}
            className="cursor-pointer transition-opacity duration-200 ease-in-out"
          />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
    </PieChart>
  );
}
