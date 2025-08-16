"use client";
import Container from "@/components/ui/Container";
import Main from "@/components/ui/Main";
import { getRecurring } from "@/libs/action";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import Loading from "@/components/ui/Loading";
import formatCurrency from "../helpers/formatCurrency";
import RecurringIcon2 from "@/components/icons/RecurringIcon2";
import { TransactionType } from "../types";
import TableRow from "@/components/ui/TableRow";

export default function page() {
  const {
    data: recurring,
    isPending,
    error,
  } = useQuery({
    queryKey: ["get-recurring-recurring"],
    queryFn: getRecurring,
  });

  if (error) return "Error occured while fetching, " + error;

  if (isPending) return <Loading />;

  const now = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(now.getDate() + 7);

  const dueSoon = recurring.filter((t) => {
    const d = new Date(t.date);
    return d >= now && d <= sevenDaysFromNow;
  });
  const dueSoonTotal = dueSoon.reduce((acc, t) => acc + t.amount, 0);

  const upcoming = recurring.filter((t) => {
    const d = new Date(t.date);
    return d > sevenDaysFromNow;
  });

  const upcomingTotal = upcoming.reduce((acc, t) => acc + t.amount, 0);

  const paid = recurring.filter((t) => new Date(t.date) < now);
  const paidTotal = paid.reduce((acc, t) => acc + t.amount, 0);

  return (
    <Main pageName="Recurring Bills">
      <section className="flex gap-8">
        <div className="w-[30%] flex flex-col gap-8">
          <Container theme="dark">
            <div className="w-full flex flex-col gap-8">
              <RecurringIcon2 />
              <div className="flex flex-col gap-2">
                <p className="text-sm">Total Bills</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(
                    Math.abs(recurring.reduce((acc, v) => acc + v.amount, 0))
                  )}
                </p>
              </div>
            </div>
          </Container>

          <Container>
            <h4 className="font-bold">Summary</h4>
            <div className="flex flex-col mt-2">
              <div className="py-3 flex items-center justify-between text-[0.8rem] border-b-1 border-zinc-200">
                <p className="text-zinc-500">Paid Bills</p>

                <p className="font-bold flex items-center gap-1">
                  <span>{paid.length}</span>(
                  {formatCurrency(Math.abs(paidTotal))})
                </p>
              </div>
              <div className="py-3 flex items-center justify-between text-[0.8rem] border-b-1 border-zinc-200">
                <p className="text-zinc-500">Total Upcoming</p>

                <p className="font-bold flex items-center gap-1">
                  <span>{upcoming.length}</span>(
                  {formatCurrency(Math.abs(upcomingTotal))})
                </p>
              </div>
              <div className="py-3 flex items-center justify-between text-[0.8rem]">
                <p className="text-zinc-500">Due Soon</p>

                <p className="font-bold flex items-center gap-1 text-red-400">
                  <span>{dueSoon.length}</span>(
                  {formatCurrency(Math.abs(dueSoonTotal))})
                </p>
              </div>
            </div>
          </Container>
        </div>
        <div className="flex-1">
          <Container>
            <table className="w-full">
              <thead className="w-full">
                <tr className="border-b-1 border-zinc-200 w-full">
                  <th className="text-sm  w-[60%] text-left font-normal text-zinc-500 p-4">
                    Bill Title
                  </th>
                  <th className="text-sm  w-[20%] text-left font-normal text-zinc-500 p-4">
                    Due Date
                  </th>
                  <th className="text-sm  w-[20%] font-normal text-right text-zinc-500 p-4">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {recurring.map((rc: TransactionType, index: number) => (
                  <TableRow
                    key={`recurring-${index}`}
                    amount={rc.amount}
                    date={rc.date}
                    title={rc.name}
                    image={rc.avatar}
                    status={(() => {
                      const billDate = new Date(rc.date);
                      const thisMonth = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        billDate.getDate()
                      );

                      if (thisMonth < now) return "Paid";
                      if (thisMonth <= sevenDaysFromNow) return "Due Soon";
                      return "Upcoming";
                    })()}
                  />
                ))}
              </tbody>
            </table>
          </Container>
        </div>
      </section>
    </Main>
  );
}
