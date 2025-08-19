import { NextResponse } from "next/server";
import { pots, setPots } from "@/db/store";
import { CreatePotType, PotType } from "@/app/types";
import { notFound } from "next/navigation";

export async function GET() {
  return NextResponse.json(pots);
}
export async function POST(req: Request) {
  try {
    const data: CreatePotType = await req.json();

    const newPot: PotType = {
      id: Date.now(),
      name: data.name,
      total: data.total,
      theme: data.theme,
      target: data.target,
    };

    const newPots = [...pots, newPot];

    setPots(newPots);

    return Response.json({
      success: true,
      message: `Successfully new pot`,
      pot: newPot,
    });
  } catch (error) {
    return Response.json({ error: "Failed to update pot" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const id = await req.json();

    const found = pots.find((pot) => pot.id === id);

    if (!found) {
      return notFound();
    }

    const updatedPots = pots.filter((pot) => pot.id !== id);
    setPots(updatedPots);

    return Response.json({
      success: true,
      message: `Successfully deleted pot`,
      pot: updatedPots,
    });
  } catch (error) {
    return Response.json({ error: "Failed to delete pot" }, { status: 500 });
  }
}
