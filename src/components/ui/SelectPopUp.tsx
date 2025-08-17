import React, { useRef, useEffect } from "react";

interface SelectProps {
  position?: "top" | "bottom";
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function SelectPopUp({
  position = "bottom",
  active,
  setActive,
  triggerRef,
}: SelectProps) {
  const selectRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        selectRef.current &&
        !selectRef.current.contains(target) &&
        (!triggerRef?.current || !triggerRef.current.contains(target))
      ) {
        setActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setActive, triggerRef]);

  return (
    <div
      ref={selectRef}
      className={`w-full rounded-sm h-fit absolute bg-white p-4 shadow-[0px_0px_10px_rgb(0,0,0,0.3)] left-0 ${
        position === "bottom" ? "top-full mt-1" : "bottom-full"
      } ${
        active ? "scale-100 opacity-100" : "scale-95 opacity-0"
      } transition-all duration-300 ease-in-out`}
    >
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
    </div>
  );
}
