import { BudgetType } from "../app/types/index.js";
import { budgets as initialBudgets } from "@/db/data";

export let budgets: BudgetType[] = [...initialBudgets];

export function setBudgets(newBudgets: BudgetType[]) {
  budgets = newBudgets;
}
