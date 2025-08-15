import React from "react";
import formatCurrency from "@/app/helpers/formatCurrency";

interface SpendingSummaryProps {
  theme: string;
  index: number;
  className: string;
  category: string;
  maximum: number;
  spent: number;
}

export default function SpendingSummary({
  className,
  index,
  theme,
  spent,
  maximum,
  category,
}: SpendingSummaryProps) {
  return (
    <div
      key={index}
      className={`p-4 ${className} flex items-center justify-between border-zinc-200 text-sm`}
    >
      <div className="flex items-center gap-4">
        <div
          style={{ backgroundColor: `${theme}` }}
          className="w-1 h-4 rounded-full"
        ></div>
        <p className="text-zinc-600">{category}</p>
      </div>
      <p className="text-[0.8rem] text-zinc-600">
        <span className="font-bold text-black text-[0.9rem]">
          {formatCurrency(spent).replace("-", "")}
        </span>{" "}
        of {formatCurrency(maximum)}
      </p>
    </div>
  );
}
