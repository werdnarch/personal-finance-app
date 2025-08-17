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

export interface PaginatedTransactions {
  data: TransactionType[];
  page: number;
  totalPages: number;
  total: number;
}

export type OverviewPageType = {
  overview: OverviewType;
  pots: {
    "Total Saved": number;
    pots: PotType[];
  };
  transactions: TransactionType[];
  budgets: BudgetType[];
  summary: {
    paid: number;
    "due-soon": number;
    upcoming: number;
  };
};

export type CategoryType =
  | "General"
  | "Dining Out"
  | "Groceries"
  | "Entertainment"
  | "Transportation"
  | "Lifestyle"
  | "Personal Care"
  | "Bills"
  | "Shopping"
  | "Education";
