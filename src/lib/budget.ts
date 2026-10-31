import { monthKey, monthsUntil } from "./format";
import { AllocMode, CATEGORIES, Category, Goal, Transaction, TxType } from "./types";

export type Level = "ok" | "warn" | "over";
type Auto = Exclude<AllocMode, "manual">;

const sum = (a: number[]) => a.reduce((s, n) => s + n, 0);
const total = (list: Transaction[], type: TxType) => sum(list.filter((t) => t.type === type).map((t) => t.amount));

export function spentByCategory(txs: Transaction[]) {
  const out = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<Category, number>;
  for (const t of txs) if (t.type === "expense") out[t.category] += t.amount;
  return out;
}

export function usage(spent: number, limit: number): { pct: number; level: Level } {
  if (limit <= 0) return { pct: spent > 0 ? 100 : 0, level: spent > 0 ? "over" : "ok" };
  const pct = Math.round((spent / limit) * 100);
  return { pct, level: pct > 100 ? "over" : pct >= 80 ? "warn" : "ok" };
}

/** Bobot pembagian sisa gaji (setelah tabungan wajib). Hemat: jajan dipangkas, tabungan +10%. */
const WEIGHTS: Record<Auto, Record<Exclude<Category, "Tabungan">, number>> = {
  standar: { "Uang Makan": 45, Transportasi: 20, "Uang Jajan": 20, Investasi: 15 },
  hemat: { "Uang Makan": 50, Transportasi: 20, "Uang Jajan": 10, Investasi: 20 },
};
const SAVING_BOOST: Record<Auto, number> = { standar: 1, hemat: 1.1 };

export interface Plan { required: number; monthsToGoal: number; feasible: boolean; limits: Record<Category, number> }

export function plan(goal: Goal, mode: Auto): Plan {
  const months = monthsUntil(goal.deadline);
  const required = months > 0 ? Math.ceil(goal.target / months) : 0;
  const saving = Math.round(required * SAVING_BOOST[mode]);
  const rest = goal.income - saving;
  const limits = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<Category, number>;
  limits.Tabungan = saving;
  const feasible = required > 0 && rest >= 0;
  if (feasible) {
    for (const [c, w] of Object.entries(WEIGHTS[mode])) limits[c as Category] = Math.floor((rest * w) / 100);
    limits["Uang Makan"] += goal.income - sum(Object.values(limits)); // sisa pembulatan: total selalu = gaji
  }
  return { required, monthsToGoal: saving > 0 ? Math.ceil(goal.target / saving) : 0, feasible, limits };
}

export function summarize(txs: Transaction[], month: string) {
  const cur = txs.filter((t) => monthKey(t.date) === month);
  const spent = spentByCategory(cur);
  return {
    balance: total(txs, "income") - total(txs, "expense"),
    income: total(cur, "income"),
    spending: total(cur, "expense") - spent.Tabungan,
    saved: spent.Tabungan,
    savedTotal: spentByCategory(txs).Tabungan,
    spent,
  };
}

export function trend(txs: Transaction[], n = 6) {
  const now = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const cur = txs.filter((t) => monthKey(t.date) === key);
    return {
      label: new Intl.DateTimeFormat("id-ID", { month: "short" }).format(d),
      income: total(cur, "income"),
      spending: total(cur, "expense") - spentByCategory(cur).Tabungan,
    };
  });
}
