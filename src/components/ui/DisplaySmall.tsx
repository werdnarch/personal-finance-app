import React from "react";
import formatCurrency from "@/app/helpers/formatCurrency";
import { colors } from "@/db/data";

interface Props {
  name: string;
  total: number;
  index: number;
  theme?: string;
}

export default function DisplaySmall({ index, name, total, theme }: Props) {
  return (
    <div className="flex items-center gap-4">
      <div
        style={{
          backgroundColor: theme ? `${theme}` : `${colors[index].theme}`,
        }}
        className="w-1 h-full rounded-full"
      ></div>
      <div className="flex flex-col gap-1">
        <p className="text-[0.85rem] text-zinc-500">{name}</p>
        <p className="text-sm font-bold">{formatCurrency(total)}</p>
      </div>
    </div>
  );
}
