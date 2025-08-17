import React from "react";

interface HeaderProps {
  pageName: string;
  buttonName?: string;
  onClick?: () => void;
}
export default function PageHeader({
  pageName,
  buttonName,
  onClick,
}: HeaderProps) {
  return (
    <header className="w-full h-[10vh] max-h-[100px] flex items-center justify-between">
      <h1 className="font-bold text-3xl">{pageName}</h1>

      {buttonName && (
        <button
          onClick={onClick}
          className="text-white bg-black hover:bg-zinc-700 transition-colors duration-200 ease-in-out px-6 text-sm p-4 rounded-lg cursor-pointer font-semibold"
        >
          + {buttonName}
        </button>
      )}
    </header>
  );
}
