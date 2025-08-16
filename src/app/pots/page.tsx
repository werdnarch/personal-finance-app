"use client";
import Main from "@/components/ui/Main";
import React from "react";
import Container from "@/components/ui/Container";
import { useQuery } from "@tanstack/react-query";
import { getPots } from "@/libs/action";
import Loading from "@/components/ui/Loading";
import Ellipsis from "@/components/icons/Ellipsis";
import { PotType } from "../types";
import formatCurrency from "../helpers/formatCurrency";
import PotButton from "@/components/ui/PotButton";

export default function page() {
  const {
    data: pots,
    isPending,
    error,
  } = useQuery({ queryKey: ["get-pots"], queryFn: getPots });
  if (error) return "Error occured while fetching " + error;

  if (isPending) return <Loading />;

  return (
    <Main pageName="Pots" buttonName="Add New Pot">
      <section className="grid grid-cols-2 gap-8">
        {pots.map((pot: PotType, index: number) => (
          <Container key={`pot-${index}`} className="flex flex-col gap-6">
            <header className="flex items-center gap-4">
              <div
                style={{ background: `${pot.theme}` }}
                className="w-4 aspect-square rounded-full"
              ></div>
              <h1 className="text-lg font-bold">{pot.name}</h1>

              <button className="ml-auto cursor-pointer text-zinc-400 hover:text-black transition-all duration-200 ease-in-out">
                <Ellipsis />
              </button>
            </header>

            <div className="flex items-center justify-between w-full">
              <p className="text-zinc-400 text-sm">Total Saved</p>
              <p className="text-3xl font-bold">{formatCurrency(pot.total)}</p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="w-full h-2 bg-[#f8f4f0] rounded-full overflow-hidden">
                <div
                  style={{
                    backgroundColor: `${pot.theme}`,
                    width: `${(pot.total / pot.target) * 100}%`,
                  }}
                  className="h-full rounded-full"
                ></div>
              </div>
              <div className=" text-[0.8rem] flex items-center gap-4 justify-between">
                <p className="font-bold text-zinc-700">
                  {((pot.total / pot.target) * 100).toFixed(2)}%
                </p>

                <p className="text-zinc-600">
                  Target of {formatCurrency(pot.target)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <PotButton name="+ Add Money" />
              <PotButton name="Withdraw" />
            </div>
          </Container>
        ))}
      </section>
    </Main>
  );
}
