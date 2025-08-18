import { NextResponse } from "next/server";
import { pots } from "@/db/store";

export async function GET() {
  return NextResponse.json(pots);
}
