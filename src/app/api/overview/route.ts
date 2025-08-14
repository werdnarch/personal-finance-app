import { NextResponse } from "next/server";
import { overview } from "@/db/data";

export async function GET() {
  return NextResponse.json(overview);
}
