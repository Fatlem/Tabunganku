export const CATEGORIES = ["Uang Jajan", "Uang Makan", "Transportasi", "Tabungan", "Investasi"] as const;
export const WALLETS = ["Tunai", "Bank", "E-Wallet"] as const;
export const CURRENCIES = ["IDR", "USD", "EUR", "SGD"] as const;

export type Category = (typeof CATEGORIES)[number];
export type Wallet = (typeof WALLETS)[number];
export type Currency = (typeof CURRENCIES)[number];
export type Theme = "light" | "dark" | "system";
export type TxType = "income" | "expense";
export type AllocMode = "standar" | "hemat" | "manual";

export interface Transaction {
  id: string; type: TxType; amount: number; category: Category; wallet: Wallet; note: string;
  date: string; // YYYY-MM-DD
}
export interface Goal { income: number; target: number; deadline: string /* YYYY-MM, kosong = belum diisi */ }
export interface BudgetState { mode: AllocMode; limits: Record<Category, number> }
export interface LedgerData { txs: Transaction[]; budget: BudgetState; goal: Goal }

const zero = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<Category, number>;
export const EMPTY_LEDGER: LedgerData = {
  txs: [],
  budget: { mode: "standar", limits: zero },
  goal: { income: 0, target: 0, deadline: "" },
};
