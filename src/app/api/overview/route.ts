import { NextResponse } from "next/server";
import { overview } from "@/db/data";
import { pots } from "@/db/data";
import { transactions } from "@/db/data";

import { budgets } from "@/db/store";

export async function GET() {
  const overviewPots = pots.slice(0, 4);
  const overviewTransactions = transactions.slice(0, 5);

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

  const data = {
    overview: overview,
    pots: {
      "Total Saved": pots.reduce((acc, pot) => acc + pot.total, 0),
      pots: overviewPots,
    },
    transactions: overviewTransactions,
    budgets: budgets,
    summary: {
      paid: paidTotal,
      "due-soon": dueSoonTotal,
      upcoming: upcomingTotal,
    },
  };

  return NextResponse.json(data);
}
