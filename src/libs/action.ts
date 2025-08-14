import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/server/trpc/router";
import {
  BudgetType,
  TransactionType,
  type OverviewType,
  type PotType,
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
  const data: BudgetType[] = await res.json();

  return data;
};

export const getTransactions = async () => {
  const res = await fetch("/api/transactions");
  if (!res.ok) throw new Error("Failed to fetch transactions");
  const data: TransactionType[] = await res.json();
  return data;
};

export const getOverviewPage = async () => {
  const [overview, pots, budgets, transactions] = await Promise.all([
    getBalance(),
    getPots(),
    getBudgets(),
    getTransactions(),
  ]);

  return { overview, pots, budgets, transactions };
};
