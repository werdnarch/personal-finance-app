import React, { ReactNode } from "react";
import PageHeader from "./PageHeader";

interface MainProps {
  children: ReactNode;
  className?: string;
  pageName: string;
  buttonName?: string;
}

export default function Main({
  children,
  className,
  pageName,
  buttonName,
}: MainProps) {
  return (
    <main
      className={`w-full h-full max-w-[1280px] p-8 mx-auto ${className} flex flex-col gap-6`}
    >
      <PageHeader pageName={pageName} buttonName={buttonName} />
      <section className="w-full flex-1 flex flex-col gap-6">
        {children}
      </section>
    </main>
  );
}
