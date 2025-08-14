import React from "react";
import formatCurrency from "@/app/helpers/formatCurrency";
import { formatDate } from "@/app/helpers/formatDate";
import Image from "next/image";

interface Props {
  amount: number;
  name: string;
  image: string;
  date: string;
  index: number;
}

export default function TransactionContainer({
  amount,
  name,
  image,
  date,
  index,
}: Props) {
  return (
    <div
      className={`flex items-center justify-between border-zinc-200 p-4 ${
        index !== 5 ? "border-b-1" : "border-none"
      }`}
    >
      <div className="flex items-center gap-6">
        <div className="w-8 aspect-square bg-zinc-100 overflow-hidden rounded-full relative">
          <Image
            src={image}
            alt={name.toLowerCase().replace(" ", "-")}
            fill
            className="object-cover"
          ></Image>
        </div>
        <p className="font-bold text-[0.9rem]">{name}</p>
      </div>
      <div className="flex flex-col text-right  gap-2">
        <p
          className={`${amount > 0 ? "text-[#277c78]" : ""} text-sm font-bold`}
        >
          {formatCurrency(amount)}
        </p>
        <p className="text-[0.8rem] text-zinc-500">{formatDate(date)}</p>
      </div>
    </div>
  );
}
