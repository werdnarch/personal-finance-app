import { NextResponse } from "next/server";
import { pots } from "@/db/data";

export async function GET() {
  return NextResponse.json(pots);
}
