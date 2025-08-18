import { BudgetType, PotType } from "../app/types/index.js";
import { budgets as initialBudgets, pots as initialPots } from "@/db/data";

export let budgets: BudgetType[] = [...initialBudgets];

export let pots: PotType[] = [...initialPots];

export function setBudgets(newBudgets: BudgetType[]) {
  budgets = newBudgets;
}

export function setPots(newPots: PotType[]) {
  pots = newPots;
}
