"use client";
import Main from "@/components/ui/Main";
import React, { useState } from "react";
import Container from "@/components/ui/Container";
import { useQuery } from "@tanstack/react-query";
import { getPots } from "@/libs/action";
import Loading from "@/components/ui/Loading";
import Ellipsis from "@/components/icons/Ellipsis";
import { PotType } from "../types";
import formatCurrency from "../helpers/formatCurrency";
import PotButton from "@/components/ui/PotButton";
import PopUp from "@/components/ui/PopUp";
import ButtonContent from "@/components/ui/ButtonContent";
import PotContainer from "@/components/ui/PotContainer";
import { number } from "zod";

export default function page() {
  const {
    data: pots,
    isPending,
    error,
  } = useQuery({ queryKey: ["get-pots"], queryFn: getPots });
  if (error) return "Error occured while fetching " + error;

  const [menuActive, setMenuActive] = useState<boolean>(false);

  if (isPending) return <Loading />;

  return (
    <Main
      pageName="Pots"
      buttonName="Add New Pot"
      onClick={() => {
        setMenuActive(true);
      }}
    >
      <section className="grid grid-cols-2 gap-8">
        {pots.map((pot: PotType, index: number) => (
          <PotContainer
            key={`pot-${index}`}
            target={pot.target}
            theme={pot.theme}
            name={pot.name}
            total={pot.total}
            id={pot.id}
          />
        ))}
      </section>
    </Main>
  );
}
