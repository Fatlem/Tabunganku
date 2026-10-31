import { monthKey, monthsUntil } from "./format";
import { AllocMode, CategoryDef, Goal, SAVING_ID, Transaction, TxType } from "./types";

export type Level = "ok" | "warn" | "over";
type Auto = Exclude<AllocMode, "manual">;

const sum = (a: number[]) => a.reduce((s, n) => s + n, 0);
const total = (list: Transaction[], type: TxType) => sum(list.filter((t) => t.type === type).map((t) => t.amount));

export function spentByCategory(txs: Transaction[]) {
  const out: Record<string, number> = {};
  for (const t of txs) if (t.type === "expense") out[t.category] = (out[t.category] ?? 0) + t.amount;
  return out;
}

export function usage(spent: number, limit: number): { pct: number; level: Level } {
  if (limit <= 0) return { pct: spent > 0 ? 100 : 0, level: spent > 0 ? "over" : "ok" };
  const pct = Math.round((spent / limit) * 100);
  return { pct, level: pct > 100 ? "over" : pct >= 80 ? "warn" : "ok" };
}

/** Mode hemat menabung 10% lebih banyak dari kebutuhan target; sisanya dibagi menurut porsi kategori. */
const SAVING_BOOST: Record<Auto, number> = { standar: 1, hemat: 1.1 };

export interface Plan { required: number; monthsToGoal: number; feasible: boolean; limits: Record<string, number> }

export function plan(goal: Goal, mode: Auto, categories: CategoryDef[]): Plan {
  const months = monthsUntil(goal.deadline);
  const required = months > 0 ? Math.ceil(goal.target / months) : 0;
  const saving = Math.round(required * SAVING_BOOST[mode]);
  const rest = goal.income - saving;
  const limits: Record<string, number> = Object.fromEntries(categories.map((c) => [c.id, 0]));
  limits[SAVING_ID] = saving;
  const feasible = required > 0 && rest >= 0;
  const flex = categories.filter((c) => c.id !== SAVING_ID && c.weight > 0);
  const weightSum = sum(flex.map((c) => c.weight));
  if (feasible && weightSum > 0) {
    for (const c of flex) limits[c.id] = Math.floor((rest * c.weight) / weightSum);
    const top = flex.reduce((a, b) => (b.weight > a.weight ? b : a));
    limits[top.id] += goal.income - sum(Object.values(limits)); // sisa pembulatan: total selalu = gaji
  }
  return { required, monthsToGoal: saving > 0 ? Math.ceil(goal.target / saving) : 0, feasible, limits };
}

export function summarize(txs: Transaction[], month: string) {
  const cur = txs.filter((t) => monthKey(t.date) === month);
  const spent = spentByCategory(cur);
  const saved = spent[SAVING_ID] ?? 0;
  return {
    balance: total(txs, "income") - total(txs, "expense"),
    income: total(cur, "income"),
    spending: total(cur, "expense") - saved,
    saved,
    savedTotal: spentByCategory(txs)[SAVING_ID] ?? 0,
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
      spending: total(cur, "expense") - (spentByCategory(cur)[SAVING_ID] ?? 0),
    };
  });
}
