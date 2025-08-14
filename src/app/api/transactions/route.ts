import { NextResponse } from "next/server";
import { transactions } from "@/db/data";

export async function GET() {
  return NextResponse.json(transactions);
}
