import React, { ReactNode } from "react";
import Link from "next/link";
import Caret from "../icons/Caret";

interface ContainerProps {
  children: ReactNode;
  theme?: "dark" | "light";
  containerName?: "Pots" | "Budgets" | "Recurring Bills" | "Transactions";
  buttonName?: string;
  className?: string;
}

export default function Container({
  children,
  theme = "light",
  containerName,
  buttonName = "See Details",
  className,
}: ContainerProps) {
  return (
    <div
      className={`w-full p-8 rounded-2xl flex flex-col items-center gap-4 ${
        theme === "light" ? "bg-white text-black" : "bg-[#201f24] text-white"
      } `}
    >
      {containerName && (
        <header className="flex items-center w-full justify-between">
          <h2 className="font-bold text-lg">{containerName}</h2>
          <button className="cursor-pointer text-sm text-zinc-500 hover:text-black transition-all duration-200 ease-in-out">
            <Link
              href={`${containerName.toLowerCase().replace(" ", "-")}`}
              className="flex items-center gap-2"
            >
              <p>{buttonName}</p>
              <Caret width={4} />
            </Link>
          </button>
        </header>
      )}
      <section className={`w-full ${className}`}>{children}</section>
    </div>
  );
}
