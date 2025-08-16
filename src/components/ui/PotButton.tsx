import React from "react";

interface ButtonProps {
  name: string;
}

export default function PotButton({ name }: ButtonProps) {
  return (
    <button className=" flex-1 rounded-lg bg-[#f8f4f0] cursor-pointer border-1 border-transparent hover:bg-transparent hover:border-black/50 transition-all duration-500 ease-in-out p-4">
      <p className="font-bold text-sm ">{name}</p>
    </button>
  );
}
