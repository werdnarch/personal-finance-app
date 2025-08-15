import React from "react";
import Container from "./Container";
import Ellipsis from "../icons/Ellipsis";
import formatCurrency from "@/app/helpers/formatCurrency";
import { formatDate } from "@/app/helpers/formatDate";
import Link from "next/link";
import Caret from "../icons/Caret";
import { TransactionType } from "@/app/types";
import Image from "next/image";

interface ContainerProps {
  name: string;
  theme: string;
  maximum: number;
  spent: number;
  transactions: TransactionType[];
}

export default function BudgetContainer({
  name,
  theme,
  maximum,
  spent,
  transactions,
}: ContainerProps) {
  const percentage = (Math.abs(spent) / maximum) * 100;

  const remaining = maximum - Math.abs(spent);

  return (
    <Container className="flex flex-col gap-4">
      <header className="flex items-center gap-4">
        <div
          style={{ background: `${theme}` }}
          className="w-4 aspect-square rounded-full"
        ></div>
        <h1 className="text-lg font-bold">{name}</h1>

        <button className="ml-auto cursor-pointer text-zinc-400 hover:text-black transition-all duration-200 ease-in-out">
          <Ellipsis />
        </button>
      </header>

      <p className="text-zinc-500 text-sm">
        Maximum of {formatCurrency(maximum)}
      </p>

      <div className="h-8 w-full bg-[#f8f4f0] overflow-hidden rounded-sm">
        <div
          style={{ backgroundColor: `${theme}`, width: `${percentage}%` }}
          className="h-full transition-all duration-150 ease-in-out"
        ></div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-4">
          <div
            style={{ backgroundColor: `${theme}` }}
            className="w-1 h-8 rounded-full"
          ></div>
          <div className="text-[0.8rem] flex flex-col gap-1">
            <p>Spent</p>
            <p className="font-bold">{formatCurrency(Math.abs(spent))}</p>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-4">
          <div className="w-1 h-8 rounded-full bg-[#f8f4f0]"></div>
          <div className="text-[0.8rem] flex flex-col gap-1">
            <p>Remaining</p>
            <p className="font-bold">
              {formatCurrency(remaining > 0 ? remaining : 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full p-4 rounded-lg bg-[#f8f4f0]">
        <header className="flex items-center w-full justify-between">
          <h2 className="font-bold ">Latest Spending</h2>
          <button className="cursor-pointer text-sm text-zinc-500 hover:text-black transition-all duration-200 ease-in-out">
            <Link href={`/transactions`} className="flex items-center gap-2">
              <p>See All</p>
              <Caret width={4} />
            </Link>
          </button>
        </header>
        <div className="w-full flex flex-col mt-2">
          {transactions.map((tr: TransactionType, index: number) => (
            <div
              key={`tr-${index}`}
              className={`flex items-center justify-between border-zinc-200 p-2 ${
                index + 1 !== transactions.length ? "border-b-1" : "border-none"
              }`}
            >
              <div className="flex items-center gap-6">
                <div className="w-8 aspect-square bg-zinc-100 overflow-hidden rounded-full relative">
                  <Image
                    src={tr.avatar}
                    alt={tr.name.toLowerCase().replace(" ", "-")}
                    fill
                    className="object-cover"
                  ></Image>
                </div>
                <p className="font-bold text-[0.8rem]">{tr.name}</p>
              </div>
              <div className="flex flex-col text-right gap-2">
                <p
                  className={`${
                    tr.amount > 0 ? "text-[#277c78]" : ""
                  } text-[0.8rem] font-bold`}
                >
                  {formatCurrency(tr.amount)}
                </p>
                <p className="text-[0.7rem] text-zinc-500">
                  {formatDate(tr.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
