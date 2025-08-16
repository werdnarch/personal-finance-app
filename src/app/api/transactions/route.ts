import { NextResponse } from "next/server";
import { transactions } from "@/db/data";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const recurring = url.searchParams.get("recurring");

  if (recurring === "true") {
    const unique = transactions.filter(
      (t, i, self) =>
        t.recurring && self.findIndex((x) => x.name === t.name) === i
    );
    return NextResponse.json(unique);
  }

  return NextResponse.json(transactions);
}
