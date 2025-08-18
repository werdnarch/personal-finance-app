import React, { useEffect, useRef, useState } from "react";
import Container from "./Container";
import Ellipsis from "../icons/Ellipsis";
import formatCurrency from "@/app/helpers/formatCurrency";
import { formatDate } from "@/app/helpers/formatDate";
import Link from "next/link";
import Caret from "../icons/Caret";
import { CategoryType, TransactionType } from "@/app/types";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBudget, deleteBudget } from "@/libs/action";
import PopUp from "./PopUp";

interface ContainerProps {
  name: CategoryType;
  theme: string;
  maximum: number;
  spent: number;
  transactions: TransactionType[];
  onEditClick: () => void;
}

export default function BudgetContainer({
  name,
  theme,
  maximum,
  spent,
  transactions,
  onEditClick,
}: ContainerProps) {
  const percentage = (Math.abs(spent) / maximum) * 100;

  const queryClient = useQueryClient();

  const elliMenuRef = useRef<HTMLDivElement | null>(null);
  const elliButtonRef = useRef<HTMLButtonElement | null>(null);

  const deleteBudgetMutation = useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-budgets-page"] });
      queryClient.invalidateQueries({ queryKey: ["overview"] });
    },
  });

  const [elliMenu, setElliMenu] = useState<boolean>(false);
  const [deleteMenu, setDeleteMenu] = useState<boolean>(false);

  const remaining = maximum - Math.abs(spent);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        elliMenuRef.current &&
        !elliMenuRef.current.contains(target) &&
        elliButtonRef.current &&
        !elliButtonRef.current.contains(target)
      ) {
        setElliMenu(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setElliMenu(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [setElliMenu]);

  return (
    <Container className="flex flex-col gap-4">
      <header className="flex items-center gap-4">
        <div
          style={{ background: `${theme}` }}
          className="w-4 aspect-square rounded-full"
        ></div>
        <h1 className="text-lg font-bold">{name}</h1>

        <div className="ml-auto relative">
          <button
            ref={elliButtonRef}
            onClick={() => setElliMenu((prev) => !prev)}
            className=" cursor-pointer text-zinc-400 hover:text-black transition-all duration-200 ease-in-out"
          >
            <Ellipsis />
          </button>

          <div
            ref={elliMenuRef}
            className={`absolute top-full right-0 shadow-[0_4px_10px_rgb(0,0,0,0.6)] bg-white rounded-md min-w-30 text-sm ${
              elliMenu
                ? "opacity-100"
                : "opacity-0 pointer-events-none scale-90"
            } transition-all duration-200 ease-in-out`}
          >
            <button
              onClick={() => {
                onEditClick();
                setElliMenu(false);
              }}
              className="p-2 px-4 cursor-pointer text-zinc-600"
            >
              Edit Budget
            </button>
            <hr className="text-zinc-200 w-[90%] mx-auto"></hr>
            <button
              onClick={() => {
                setElliMenu(false);
                setDeleteMenu(true);
              }}
              className="p-2 px-4 cursor-pointer whitespace-nowrap text-red-400"
            >
              Delete Budget
            </button>
          </div>
        </div>
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

      <PopUp
        active={deleteMenu}
        setActive={setDeleteMenu}
        title={`Delete "${name}"?`}
      >
        <p className="text-sm text-zinc-500">
          Are you sure you want to delete this budget? This action cannot be
          reversed, and all the data inside it will be removed forever.
        </p>
        <div className="w-full mt-4 flex flex-col gap-1">
          <button
            onClick={() => {
              deleteBudgetMutation.mutate(name);
              setDeleteMenu(false);
            }}
            className="bg-[#c94736] w-full p-4 rounded-md text-white cursor-pointer hover:bg-[#d46c5e] transition-all duration-200 ease-in-out"
          >
            <p className="text-sm font-bold">Yes, Confirm Deletion</p>
          </button>

          <button
            onClick={() => setDeleteMenu(false)}
            className="w-fit mx-auto cursor-pointer p-3"
          >
            <p className="text-sm">No, Go Back</p>
          </button>
        </div>
      </PopUp>
    </Container>
  );
}
