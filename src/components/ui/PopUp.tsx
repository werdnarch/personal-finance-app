import React, { ReactNode, useEffect, useRef } from "react";
import CloseIcon from "../icons/CloseIcon";

interface PopUpProps {
  children: ReactNode;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
}

export default function PopUp({
  children,
  active,
  setActive,
  title,
}: PopUpProps) {
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setActive(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [setActive]);

  return (
    <section
      className={`h-full w-full ${
        active ? "opacity-100" : "opacity-0 pointer-events-none"
      } absolute top-0 left-0 flex items-center justify-center bg-black/30 transition-opacity duration-200 ease-in-out`}
    >
      <div
        ref={popupRef}
        className={`w-[90%] max-w-[600px] p-4 md:p-8 bg-white rounded-2xl ${
          active ? "scale-100" : "scale-95"
        } transition-all duration-300 ease-in-out flex flex-col gap-4`}
      >
        <header className="flex items-center justify-between">
          <p className="text-3xl font-bold">{title}</p>

          <button
            onClick={() => setActive(false)}
            className="cursor-pointer scale-90 hover:scale-100 transition-all duration-150 ease-linear"
          >
            <CloseIcon />
          </button>
        </header>
        {children}
      </div>
    </section>
  );
}
