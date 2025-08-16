import { NextResponse } from "next/server";
import { transactions } from "@/db/data";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);
  const start = (page - 1) * limit;

  const paginated = transactions.slice(start, start + limit);

  return NextResponse.json({
    data: paginated,
    page,
    totalPages: Math.ceil(transactions.length / limit),
    total: transactions.length,
  });
}
