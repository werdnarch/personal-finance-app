import { pots, setPots } from "@/db/store";
import { notFound } from "next/navigation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { amount, task } = await request.json();
    const id = parseInt(resolvedParams.id);

    const foundIndex = pots.findIndex((pot) => pot.id === id);

    if (foundIndex === -1) {
      return notFound();
    }

    const found = pots[foundIndex];

    // Validate withdrawal
    if (task === "withdraw" && found.total < amount) {
      return Response.json(
        { error: "Insufficient funds in pot" },
        { status: 400 }
      );
    }

    const newTotal =
      task === "add" ? found.total + amount : found.total - amount;

    const updatedPots = pots.map((pot, index) =>
      index === foundIndex ? { ...pot, total: newTotal } : pot
    );

    setPots(updatedPots);

    return Response.json({
      success: true,
      message: `Successfully ${
        task === "add" ? "added to" : "withdrew from"
      } pot`,
      updatedTotal: newTotal,
    });
  } catch (error) {
    return Response.json({ error: "Failed to update pot" }, { status: 500 });
  }
}
