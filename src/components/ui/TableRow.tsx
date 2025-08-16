import React from "react";
import formatCurrency from "@/app/helpers/formatCurrency";
import Image from "next/image";
import CheckIcon from "../icons/CheckIcon";
import WarningIcon from "../icons/WarningIcon";
import { formatDay } from "@/app/helpers/formatDate";

interface RowProps {
  title: string;
  amount: number;
  date: string;
  image: string;
  status: "Due Soon" | "Upcoming" | "Paid";
}

export default function TableRow({
  title,
  amount,
  date,
  image,
  status,
}: RowProps) {
  return (
    <tr className="border-b-1 last:border-b-0 border-zinc-200 w-full">
      <td className="text-sm  w-[60%] text-left  font-bold p-4 flex items-center gap-4">
        <div className="w-6 aspect-square rounded-full bg-zinc-300 relative overflow-hidden">
          <Image src={image} alt={title} fill className="object-cover"></Image>
        </div>
        <p>{title}</p>
      </td>
      <td className="text-sm w-[20%] text-left  text-zinc-500 p-4">
        <p
          className={`${
            status === "Paid"
              ? "text-[#277c78]"
              : status === "Due Soon"
              ? "text-red-400"
              : "text-zinc-600"
          } flex items-center gap-2`}
        >
          Monthly - {formatDay(date)}
          <span>
            {status === "Paid" ? (
              <CheckIcon />
            ) : status === "Due Soon" ? (
              <WarningIcon />
            ) : null}
          </span>
        </p>
      </td>
      <td className="text-sm  w-[20%] text-right  font-bold p-4">
        {formatCurrency(Math.abs(amount))}
      </td>
    </tr>
  );
}
