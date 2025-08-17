"use client";
import Chart from "@/components/ui/Chart";
import Container from "@/components/ui/Container";
import Loading from "@/components/ui/Loading";
import Main from "@/components/ui/Main";
import { getBudgets } from "@/libs/action";
import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { BudgetType, TransactionType } from "../types";
import SpendingSummary from "@/components/ui/SpendingSummary";
import BudgetContainer from "@/components/ui/BudgetContainer";
import PopUp from "@/components/ui/PopUp";
import { type CategoryType } from "../types";
import Select from "@/components/ui/Select";
import { colors } from "@/db/data";

export default function Page() {
  const { data, isPending, error } = useQuery({
    queryKey: ["get-budgets-page"],
    queryFn: () => getBudgets(),
  });

  const [menuActive, setMenuActive] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>("Green");
  const [category, setCategory] = useState<string>("General");

  if (error) return "Error occured while fetching, " + error;

  if (isPending) return <Loading />;

  const budgets = data.budgets;
  const transactions = data.transactions;

  return (
    <Main
      pageName="Budgets"
      buttonName="Add New Budget"
      onClick={() => setMenuActive(true)}
    >
      <section className="flex w-full gap-8">
        <div className="w-[40%]">
          <Container className="flex flex-col items-center gap-4">
            <Chart budgets={budgets} />

            <div className="w-full">
              <h1 className="font-bold text-lg">Spending Summary</h1>
              {budgets.map((budget: BudgetType, index: number) => (
                <SpendingSummary
                  key={index}
                  className={`${
                    index + 1 === budgets.length ? "border-0" : "border-b-1"
                  }`}
                  maximum={budget.maximum}
                  category={budget.category}
                  spent={
                    transactions
                      .filter(
                        (tr: TransactionType) => tr.category === budget.category
                      )
                      .reduce((acc, value) => acc + value.amount, 0) || 0
                  }
                  theme={budget.theme}
                  index={index}
                />
              ))}
            </div>
          </Container>
        </div>
        <div className="flex-1">
          <section className="flex flex-col w-full gap-6">
            {budgets.map((budget: BudgetType, index: number) => (
              <BudgetContainer
                key={`budget-${index}`}
                name={budget.category}
                theme={budget.theme}
                maximum={budget.maximum}
                spent={
                  transactions
                    .filter(
                      (tr: TransactionType) => tr.category === budget.category
                    )
                    .reduce((acc, value) => acc + value.amount, 0) || 0
                }
                transactions={transactions
                  .filter((tr) => tr.category === budget.category)
                  .slice(0, 3)}
              ></BudgetContainer>
            ))}
          </section>
        </div>
      </section>

      <PopUp
        active={menuActive}
        setActive={setMenuActive}
        title="Add New Budget"
      >
        <p className="text-zinc-600 text-sm">
          Choose a category to set a spending budget. These categories can help
          you monitor spending.
        </p>

        <form className="text-sm flex flex-col gap-6">
          <label htmlFor="category" className="flex flex-col gap-2">
            <p className="font-bold">Budget Category</p>
            <div>
              <input
                id="category"
                className="w-full p-2 outline-0 border rounded-sm"
              ></input>
            </div>
          </label>

          <Select
            label="Budget Category"
            selected={category}
            setSelected={setCategory}
            options={["General", "Dining Out"]}
            position="bottom"
          />

          <Select
            label="Theme"
            selected={theme}
            options={colors.map((color) => color.name)}
            setSelected={setTheme}
            position="top"
          />
        </form>
      </PopUp>
    </Main>
  );
}
