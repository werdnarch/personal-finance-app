import formatCurrency from "@/app/helpers/formatCurrency";
import React from "react";
import { colors } from "@/db/data";

interface Props {
  category: "Paid Bills" | "Due Soon" | "Total Upcoming";
  amount: number;
}

export default function RecurringContainer({ category, amount }: Props) {
  const theme =
    category === "Paid Bills"
      ? colors[0].theme
      : category === "Total Upcoming"
      ? colors[1].theme
      : category === "Due Soon"
      ? colors[2].theme
      : null;

  return (
    <div
      style={{ borderColor: `${theme}` }}
      className="flex rounded-lg border-l-4  items-center p-4 text-sm bg-[#f8f4f0] justify-between"
    >
      <p className="text-zinc-500">{category}</p>
      <p className="font-bold">{formatCurrency(amount).replace(/[-+]/g, "")}</p>
    </div>
  );
}
