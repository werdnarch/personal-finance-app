"use client";
import React from "react";
import Main from "@/components/ui/Main";
import Container from "@/components/ui/Container";
import { useQuery } from "@tanstack/react-query";
import { getOverviewPage } from "@/libs/action";
import formatCurrency from "./helpers/formatCurrency";
import JarIcon from "@/components/icons/JarIcon";
import { BudgetType, PotType, TransactionType } from "./types";
import { PieChart } from "recharts";
import DisplaySmall from "@/components/ui/DisplaySmall";
import Chart from "@/components/ui/Chart";
import TransactionContainer from "@/components/ui/TransactionContainer";
import RecurringContainer from "@/components/ui/RecurringContainer";
import Loading from "@/components/ui/Loading";

export default function Home() {
  const { data, isPending, error } = useQuery({
    queryKey: ["get-overview-page"],
    queryFn: getOverviewPage,
  });

  if (error) return "Error occured while fetching " + error;

  if (isPending) return <Loading />;

  const balance = data.overview;
  const pots = data.pots;
  const budgets = data.budgets;
  const transactions = data.transactions;

  const now = new Date();

  const dueSoonTotal = transactions
    .filter(
      (t) =>
        t.category === "Bills" &&
        t.recurring &&
        new Date(t.date) <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const upcomingTotal = transactions
    .filter(
      (t) =>
        t.category === "Bills" &&
        t.recurring &&
        new Date(t.date) > new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const paidTotal = transactions
    .filter((t) => t.category === "Bills" && !t.recurring)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Main pageName="Overview">
      <section className="w-full flex items-center gap-8">
        <Container theme="dark">
          <h2 className=" text-[0.9rem]">Current Balance</h2>
          <h1 className="text-3xl font-bold">
            {formatCurrency(balance.current)}
          </h1>
        </Container>
        <Container>
          <h2 className="text-zinc-600 text-[0.9rem]">Income</h2>
          <h1 className="text-3xl font-bold">
            {formatCurrency(balance.income)}
          </h1>
        </Container>
        <Container>
          <h2 className="text-zinc-600 text-[0.9rem]">Expenses</h2>
          <h1 className="text-3xl font-bold">
            {formatCurrency(Number(balance.expenses))}
          </h1>
        </Container>
      </section>

      <section className="flex  gap-6">
        <div className="flex flex-1 flex-col gap-6">
          <Container containerName="Pots">
            <div className="flex gap-4">
              <div className="flex-1 bg-[#f8f4f0] p-4 flex gap-4 rounded-lg">
                <div className="h-full flex items-center justify-center">
                  <JarIcon />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-zinc-600">Total Saved</p>
                  <h3 className="font-bold text-3xl">
                    {formatCurrency(
                      pots.reduce((acc, pot) => acc + pot.total, 0)
                    )}
                  </h3>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3">
                {pots.slice(0, 4).map((pot: PotType, index: number) => (
                  <DisplaySmall
                    key={index}
                    name={pot.name}
                    total={pot.total}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </Container>

          <Container containerName="Transactions" buttonName="See All">
            <section className="flex flex-col">
              {transactions
                .splice(0, 5)
                .map((tr: TransactionType, index: number) => (
                  <TransactionContainer
                    key={`transaction-${index}`}
                    amount={tr.amount}
                    image={tr.avatar}
                    name={tr.name}
                    date={tr.date}
                    index={index + 1}
                  />
                ))}
            </section>
          </Container>
        </div>

        <div className="flex w-[40%] flex-col gap-6">
          <Container containerName="Budgets">
            <section className="flex gap-4">
              <div className="flex-1 flex items-center justify-center">
                <Chart budgets={budgets} />
              </div>
              <div className="w-[40%] flex flex-col gap-4">
                {budgets.map((budget: BudgetType, index: number) => (
                  <DisplaySmall
                    key={index}
                    name={budget.category}
                    total={budget.maximum}
                    theme={budget.theme}
                    index={index}
                  />
                ))}
              </div>
            </section>
          </Container>
          <Container
            containerName="Recurring Bills"
            className="flex flex-col gap-4"
          >
            <RecurringContainer category="Paid Bills" amount={paidTotal} />
            <RecurringContainer
              category="Total Upcoming"
              amount={upcomingTotal}
            />
            <RecurringContainer category="Due Soon" amount={dueSoonTotal} />
          </Container>
        </div>
      </section>
    </Main>
  );
}
