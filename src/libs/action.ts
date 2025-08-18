import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

import type { AppRouter } from "@/server/trpc/router";
import {
  BudgetType,
  TransactionType,
  type PaginatedTransactions,
  type OverviewType,
  type PotType,
  OverviewPageType,
  CategoryType,
} from "@/app/types";

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});

export const actions = {
  getPosts: () => trpc.posts.getAll.query(),
  createPost: (title: string) => trpc.posts.create.mutate(title),
};

export const getBalance = async () => {
  const res = await fetch("/api/overview");
  if (!res.ok) throw new Error("Failed to fetch overview");
  const data: OverviewType = (await res.json()) as OverviewType;
  return data;
};

export const getPots = async () => {
  const res = await fetch("/api/pots");
  if (!res.ok) throw new Error("Failed to fetch pots");
  const data: PotType[] = await res.json();
  return data;
};

export const getBudgets = async () => {
  const res = await fetch("/api/budgets");
  if (!res.ok) throw new Error("Failed to fetch budgets");

  const data = await res.json();
  const budgets: BudgetType[] = await data.budgets;
  const transactions: TransactionType[] = await data.transactions;

  return { budgets, transactions };
};

export const getTransactions = async () => {
  const res = await fetch("/api/transactions");
  if (!res.ok) throw new Error("Failed to fetch transactions");
  const data: TransactionType[] = await res.json();
  return data;
};

export const getRecurring = async () => {
  const res = await fetch("/api/transactions?recurring=true");
  if (!res.ok) throw new Error("Failed to fetch transactions");
  const data: TransactionType[] = await res.json();
  return data;
};

export const getOverviewPage = async () => {
  const res = await fetch("/api/overview");
  if (!res.ok) throw new Error("Failed to fetch overview");
  const data: OverviewPageType = await res.json();
  return data;
};

export const getPageTransactions = async (
  page: number,
  limit: number
): Promise<PaginatedTransactions> => {
  const res = await fetch(
    `/api/transactions/paginated?page=${page}&limit=${limit}`
  );
  if (!res.ok) throw new Error("Failed to fetch paginated transactions");
  const data: PaginatedTransactions = await res.json();
  return data;
};

export const deleteBudget = async (category: CategoryType) => {
  const res = await fetch("/api/budgets", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category }),
  });

  if (!res.ok) {
    throw new Error("Failed to delete budget");
  }

  return res.json();
};

export const addBudget = async (budget: BudgetType) => {
  const res = await fetch("/api/budgets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(budget),
  });

  if (!res.ok) {
    throw new Error("Failed to add budget");
  }

  return res.json();
};

export const editBudget = async (
  category: CategoryType,
  budget: BudgetType
) => {
  const res = await fetch("/api/budgets", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category, budget }),
  });

  if (!res.ok) {
    throw new Error("Failed to update budget");
  }

  return res.json();
};
