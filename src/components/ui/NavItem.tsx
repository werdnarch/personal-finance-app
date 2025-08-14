"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
interface NavItemProps {
  name: "Recurring bills" | "Pots" | "Budgets" | "Transactions" | "Overview";
  icon: React.ReactNode;
  minimized: boolean;
}

export default function NavItem({ name, icon, minimized }: NavItemProps) {
  const pathname = usePathname();
  const link =
    name === "Overview" ? "/" : `/${name.toLowerCase().replace(/\s+/g, "-")}`;

  const isActive = pathname === link;

  if (!link) return null;

  return (
    <li className="text-md group cursor-pointer text-zinc-400 hover:text-white transition-all duration-300 ease-in-out h-15 flex items-center relative">
      <Link
        href={link}
        className={`flex h-full items-center w-full gap-4 p-6 relative z-100`}
      >
        <span
          className={`${
            isActive && "text-[#277c78]"
          }  transition-all duration-200 ease-in-out`}
        >
          {icon}
        </span>
        <p
          className={`font-bold flex-1 ${
            minimized ? "opacity-0 absolute" : "opacity-100 delay-200 flex-1"
          } whitespace-nowrap group-hover:delay-0 ${isActive && "text-black"}`}
        >
          {name}
        </p>
      </Link>

      <div
        className={`absolute h-full bg-white transition-all duration-500 ease-in-out
           rounded-r-2xl  border-[#277c78] ${
             isActive ? "w-11/12 border-l-6" : "w-0 border-0"
           }`}
      ></div>
    </li>
  );
}
