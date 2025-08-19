import React, { useState } from "react";
import Container from "./Container";
import Ellipsis from "../icons/Ellipsis";
import formatCurrency from "@/app/helpers/formatCurrency";
import PotButton from "./PotButton";
import PopUp from "./PopUp";
import ButtonContent from "./ButtonContent";

interface PotContainerProps {
  theme: string;
  name: string;
  total: number;
  target: number;
  id: number;
}

export default function PotContainer({
  theme,
  id,
  name,
  total,
  target,
}: PotContainerProps) {
  const [menuActive, setMenuActive] = useState<boolean>(false);
  const [task, setTask] = useState<"add" | "withdraw">("add");
  return (
    <Container className="flex flex-col gap-6">
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

      <div className="flex items-center justify-between w-full">
        <p className="text-zinc-400 text-sm">Total Saved</p>
        <p className="text-3xl font-bold">{formatCurrency(total)}</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="w-full h-2 bg-[#f8f4f0] rounded-full overflow-hidden">
          <div
            style={{
              backgroundColor: `${theme}`,
              width: `${(total / target) * 100}%`,
            }}
            className="h-full rounded-full"
          ></div>
        </div>
        <div className=" text-[0.8rem] flex items-center gap-4 justify-between">
          <p className="font-bold text-zinc-700">
            {((total / target) * 100).toFixed(2)}%
          </p>

          <p className="text-zinc-600">Target of {formatCurrency(target)}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <PotButton
          name="+ Add Money"
          onClick={() => {
            setMenuActive(true);
            setTask("add");
          }}
        />
        <PotButton
          name="Withdraw"
          onClick={() => {
            setMenuActive(true);
            setTask("withdraw");
          }}
        />
      </div>

      <PopUp
        active={menuActive}
        setActive={setMenuActive}
        title={
          task === "withdraw"
            ? `Withdraw from '${name}'`
            : task === "add"
            ? `Add to ‘${name}'`
            : ""
        }
      >
        <div className="text-zinc-600 text-sm mb-3">
          {task === "add" ? (
            <p>
              Add money to your pot to keep it separate from your main balance.
              As soon as you add this money, it will be deducted from your
              current balance.
            </p>
          ) : (
            <p>
              Withdraw from your pot to put money back in your main balance.
              This will reduce the amount you have in this pot.
            </p>
          )}
        </div>

        {(task === "add" || task === "withdraw") && (
          <ButtonContent
            id={id}
            total={total}
            theme={theme}
            target={target}
            task={task}
            setActive={setMenuActive}
          />
        )}
      </PopUp>
    </Container>
  );
}
