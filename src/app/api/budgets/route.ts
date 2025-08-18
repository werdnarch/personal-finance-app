import { NextResponse } from "next/server";
import { budgets } from "@/db/store";
import { transactions } from "@/db/data";
import { setBudgets } from "@/db/store";

export async function GET() {
  return NextResponse.json({ budgets, transactions });
}

export async function DELETE(req: Request) {
  const { category } = await req.json();

  // Remove budget with the given category
  const index = budgets.findIndex((b) => b.category === category);

  if (index === -1) {
    return NextResponse.json({ error: "Budget not found" }, { status: 404 });
  }
  const newBudgets = budgets.splice(index, 1);

  setBudgets(budgets);

  return NextResponse.json({ message: "Budget deleted", budgets });
}

export async function POST(req: Request) {
  const data = await req.json();
  const updatedBudgets = [...budgets, data];
  setBudgets(updatedBudgets);
  return NextResponse.json({ message: "Budget Added", updatedBudgets });
}
