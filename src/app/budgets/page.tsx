"use client";
import Chart from "@/components/ui/Chart";
import Container from "@/components/ui/Container";
import Loading from "@/components/ui/Loading";
import Main from "@/components/ui/Main";
import { getBudgets } from "@/libs/action";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { BudgetType, CategoryType, TransactionType } from "../types";
import SpendingSummary from "@/components/ui/SpendingSummary";
import BudgetContainer from "@/components/ui/BudgetContainer";
import PopUp from "@/components/ui/PopUp";
import Select from "@/components/ui/Select";
import { colors } from "@/db/data";
import z from "zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  maximum: z.number().min(1),
});

type formType = z.infer<typeof formSchema>;

export default function Page() {
  const { data, isPending, error } = useQuery({
    queryKey: ["get-budgets-page"],
    queryFn: () => getBudgets(),
  });

  const { register, handleSubmit, reset } = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maximum: 0,
    },
  });

  const onSubmit: SubmitHandler<formType> = (data) => {
    const newBudget: BudgetType = {
      category: category,
      maximum: data.maximum,
      theme:
        colors.find((cl) => cl.name.toLowerCase() === theme.toLowerCase())
          ?.theme || "#277C78",
    };
    console.log(newBudget);
    reset();
    setCategory("General");
    setTheme("Green");
    setMaximumSpend(0);
    setMenuActive(false);
  };

  const [menuActive, setMenuActive] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>("Green");
  const [category, setCategory] = useState<string>("General");
  const [maximumSpend, setMaximumSpend] = useState<number>(0);

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
                name={budget.category as CategoryType}
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="text-sm flex flex-col gap-6"
        >
          <Select
            label="Budget Category"
            selected={category}
            setSelected={setCategory}
            options={[
              "General",
              "Dining Out",
              "Groceries",
              "Entertainment",
              "Transportation",
              "Lifestyle",
              "Personal Care",
              "Bills",
              "Shopping",
              "Education",
            ]}
            position="bottom"
          />

          <label className="w-full">
            <p className="text-zinc-600 font-bold text-[0.8rem]">
              Maximum Spend
            </p>
            <div className="w-full relative">
              <input
                {...register("maximum", { valueAsNumber: true })}
                defaultValue={maximumSpend}
                onChange={(e) => setMaximumSpend(Number(e.target.value))}
                type="number"
                className="border w-full outline-0 border-zinc-500 p-3 px-10 rounded-sm cursor-pointer flex items-center justify-between"
              ></input>
              <div className="absolute top-0 h-full left-0 flex items-center justify-center text-zinc-500 w-[7%]">
                <p>$</p>
              </div>
            </div>
          </label>

          <Select
            label="Theme"
            selected={theme}
            options={colors.map((color) => color.name)}
            setSelected={setTheme}
            position="top"
          />
          <button
            disabled={maximumSpend <= 0}
            type="submit"
            className={`text-white bg-black hover:bg-zinc-700 transition-all duration-200 ease-in-out px-6 text-sm p-4 rounded-lg  font-semibold
              ${
                maximumSpend <= 0
                  ? "opacity-60 cursor-not-allowed pointer-events-none"
                  : "cursor-pointer opacity-100"
              }`}
          >
            Add Budget
          </button>
        </form>
      </PopUp>
    </Main>
  );
}
