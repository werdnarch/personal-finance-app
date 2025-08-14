"use client";

import React, { useState } from "react";
import Logo from "./Logo";
import Nav from "./Nav";
import ArrowIcon from "../icons/ArrowIcon";

export default function SideBar() {
  const [minimized, setMinimized] = useState<boolean>(false);

  return (
    <aside
      className={`${
        minimized ? "w-[5%]" : "w-[20%]"
      } max-w-[300px] transition-all duration-500 ease-in-out bg-[#201f24] rounded-r-4xl`}
    >
      <div className="sticky top-0 h-screen flex flex-col items-center gap-8">
        <Logo />
        <Nav minimized={minimized} />

        <div className="w-full text-zinc-500 h-[10%] flex items-center justify-center mt-auto">
          <button
            onClick={() => setMinimized((prev) => !prev)}
            className="cursor-pointer hover:text-white transition-all duration-200 flex items-center gap-2 ease-in-out"
          >
            <div
              className={`${
                minimized && "rotate-180"
              } transition-all duration-200 ease-linear`}
            >
              <ArrowIcon />
            </div>
            <p
              className={`${
                minimized ? "absolute opacity-0" : "opacity-100 duration-1000"
              } transition-opacity duration-200 ease-in-out`}
            >
              Minimize Menu
            </p>
          </button>
        </div>
      </div>
    </aside>
  );
}
