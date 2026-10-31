export const WALLETS = ["Tunai", "Bank", "E-Wallet"] as const;
export const CURRENCIES = ["IDR", "USD", "EUR", "SGD"] as const;

export type Wallet = (typeof WALLETS)[number];
export type Currency = (typeof CURRENCIES)[number];
export type Theme = "light" | "dark" | "system";
export type TxType = "income" | "expense";
export type AllocMode = "standar" | "hemat" | "manual";

/** id kategori bawaan = namanya, sehingga data lama tetap cocok. Kategori buatan sendiri: `c_<uuid>`. */
export const SAVING_ID = "Tabungan";
export interface CategoryDef {
  id: string; name: string;
  /** Porsi dari sisa gaji setelah tabungan wajib (dinormalisasi otomatis, tidak harus 100). */
  weight: number;
  fixed?: boolean; // tidak bisa dihapus
}
export const DEFAULT_CATEGORIES: CategoryDef[] = [
  { id: SAVING_ID, name: "Tabungan", weight: 0, fixed: true },
  { id: "Uang Makan", name: "Uang Makan", weight: 45 },
  { id: "Transportasi", name: "Transportasi", weight: 20 },
  { id: "Uang Jajan", name: "Uang Jajan", weight: 20 },
  { id: "Investasi", name: "Investasi", weight: 15 },
];

export interface Transaction {
  id: string; type: TxType; amount: number; category: string; wallet: Wallet; note: string;
  date: string; // YYYY-MM-DD
}
export interface Goal { income: number; target: number; deadline: string /* YYYY-MM, kosong = belum diisi */ }
export interface BudgetState { mode: AllocMode; limits: Record<string, number> }
export interface LedgerData { txs: Transaction[]; budget: BudgetState; goal: Goal; categories: CategoryDef[] }

export const EMPTY_LEDGER: LedgerData = {
  txs: [],
  categories: DEFAULT_CATEGORIES,
  budget: { mode: "standar", limits: {} },
  goal: { income: 0, target: 0, deadline: "" },
};
