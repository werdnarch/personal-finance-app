export type OverviewType = {
  current: number;
  income: number;
  expenses: number;
};

export type TransactionType = {
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
};

export type BudgetType = {
  category: string;
  maximum: number;
  theme: string;
};

export type PotType = {
  id: number;
  name: string;
  target: number;
  total: number;
  theme: string;
};

export type Color = {
  id: number;
  name: string;
  theme: string;
};
