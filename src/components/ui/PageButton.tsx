import React from "react";
import Caret from "../icons/Caret";

interface ButtonProps {
  tag: number | "Next" | "Prev";
  onClick?: () => void;
  page: number;
  active?: boolean;
}

export default function PageButton({
  tag,
  onClick,
  page,
  active = true,
}: ButtonProps) {
  return (
    <button
      disabled={!active}
      onClick={onClick}
      className={`flex ${
        !active && "pointer-events-none opacity-50"
      } items-center border rounded-sm border-zinc- cursor-pointer text-sm gap-3 py-2 px-4 ${
        page === tag
          ? "bg-black text-white border-black"
          : "hover:bg-[#98908b] border-[#98908b] hover:text-white"
      } transition-all duration-300 ease-in-out`}
    >
      {tag === "Prev" && (
        <div className="rotate-180">
          <Caret />
        </div>
      )}

      <p>{tag}</p>

      {tag === "Next" && (
        <div className="">
          <Caret />
        </div>
      )}
    </button>
  );
}
