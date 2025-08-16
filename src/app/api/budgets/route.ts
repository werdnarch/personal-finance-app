import { NextResponse } from "next/server";
import { budgets } from "@/db/data";
import { transactions } from "@/db/data";

export async function GET() {
  return NextResponse.json({ budgets, transactions });
}
