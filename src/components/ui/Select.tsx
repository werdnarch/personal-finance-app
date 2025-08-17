import React, { useState } from "react";

import Caret from "../icons/Caret";
import { useRef, useEffect } from "react";
import { colors } from "@/db/data";

interface SelectProps {
  position?: string;
  selected: string;
  options: string[];
  setSelected: (option: string) => void;
  label: string;
}

export default function Select({
  position = "bottom",
  selected,
  label,
  options,
  setSelected,
}: SelectProps) {
  const selectRef = useRef<HTMLDivElement | null>(null);
  const selectPopupRef = useRef<HTMLDivElement | null>(null);

  const [active, setActive] = useState<boolean>(false);

  const handleSelect = (theme: string) => {
    setSelected(theme);
    setActive(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // check if click is outside BOTH the popup and the trigger
      if (
        selectPopupRef.current &&
        !selectPopupRef.current.contains(target) &&
        selectRef.current &&
        !selectRef.current.contains(target)
      ) {
        setActive(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [setActive]);

  const found = colors.find((color) => color.name === selected);

  return (
    <div className="relative">
      <label className="flex flex-col gap-1">
        <p>{label}</p>
        <div
          onClick={(e) => {
            e.stopPropagation();
            setActive((prev) => !prev);
          }}
          ref={selectRef}
          className="group border border-zinc-500 p-2 px-3 rounded-sm cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-1">
            {found && (
              <div
                style={{ backgroundColor: `${found.theme}` }}
                className="w-3 bg-blue-400 rounded-full aspect-square"
              ></div>
            )}
            <p>{selected}</p>
          </div>
          <div className="rotate-90 group-hover:scale-90 transition-all duration-200 ease-in-out">
            <Caret width={5} />
          </div>
        </div>
      </label>

      <div
        ref={selectPopupRef}
        className={`absolute overflow-hidden w-full z-100  h-fit bg-white rounded-md shadow-[0_4px_10px_rgb(0,0,0,0.6)]  ${
          active ? "opacity-100" : "opacity-0 pointer-events-none"
        } transition-all duration-300 ${
          position === "bottom" ? "top-full mt-1" : "bottom-full -mb-5"
        }`}
      >
        {options.map((option: string, index: number) => (
          <div
            onClick={() => handleSelect(option)}
            key={index}
            className="p-2 px-4 hover:bg-blue-500 hover:text-white transition-all duration-150 ease-in-out cursor-pointer flex items-center gap-3"
          >
            {colors.find((color) => color.name === option) && (
              <div
                style={{
                  backgroundColor: `${
                    colors.find((color) => color.name === option)?.theme
                  }`,
                }}
                className="w-3 bg-blue-400 rounded-full aspect-square"
              ></div>
            )}
            <p>{option}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
