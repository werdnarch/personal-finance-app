import React, { ReactNode } from "react";
import PageHeader from "./PageHeader";

interface MainProps {
  children: ReactNode;
  className?: string;
  pageName: string;
  buttonName?: string;
  onClick?: () => void;
}

export default function Main({
  children,
  className,
  pageName,
  buttonName,
  onClick,
}: MainProps) {
  return (
    <main
      className={`w-full min-h-screen max-w-[1280px] p-8 pb-8 mx-auto ${className} flex flex-col gap-6`}
    >
      <PageHeader
        onClick={onClick}
        pageName={pageName}
        buttonName={buttonName}
      />
      <section className="w-full flex-1 flex flex-col gap-6">
        {children}
      </section>
    </main>
  );
}
