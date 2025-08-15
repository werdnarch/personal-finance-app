"use client";
import Chart from "@/components/ui/Chart";
import Container from "@/components/ui/Container";
import Loading from "@/components/ui/Loading";
import Main from "@/components/ui/Main";
import { getOverviewPage } from "@/libs/action";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { BudgetType, TransactionType } from "../types";
import formatCurrency from "../helpers/formatCurrency";
import SpendingSummary from "@/components/ui/SpendingSummary";
import BudgetContainer from "@/components/ui/BudgetContainer";

export default function page() {
  const { data, isPending, error } = useQuery({
    queryKey: ["get-overview-page"],
    queryFn: getOverviewPage,
  });

  if (error) return "Error occured while fetching, " + error;

  if (isPending) return <Loading />;

  const budgets = data.budgets;
  const transactions = data.transactions;

  return (
    <Main pageName="Budgets" buttonName="Add New Budget">
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
    </Main>
  );
}
