"use client";
import { createContext, useContext, useMemo } from "react";
import { plan } from "@/lib/budget";
import { usePersistentState } from "@/lib/usePersistentState";
import { BudgetState, CategoryDef, EMPTY_LEDGER, Goal, LedgerData, Transaction } from "@/lib/types";
import { dataKey, useAuth } from "./auth";

interface LedgerCtx extends LedgerData {
  ready: boolean;
  /** Limit bulanan aktif per id kategori: hasil planner (standar/hemat) atau input manual. */
  limits: Record<string, number>;
  addTx: (t: Omit<Transaction, "id">) => void;
  removeTx: (id: string) => void;
  resetData: () => void;
  setBudget: (b: BudgetState) => void;
  setGoal: (g: Goal) => void;
  /** Mengembalikan pesan error, atau null jika berhasil. */
  addCategory: (name: string, weight: number) => string | null;
  setCategoryWeight: (id: string, weight: number) => void;
  removeCategory: (id: string) => void;
}
const Ctx = createContext<LedgerCtx | null>(null);

export function LedgerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [data, setData, ready] = usePersistentState(user ? dataKey(user.id) : null, EMPTY_LEDGER);

  const value = useMemo<LedgerCtx>(() => {
    const { budget, categories, goal } = data;
    const limits = budget.mode === "manual"
      ? Object.fromEntries(categories.map((c) => [c.id, budget.limits[c.id] ?? 0]))
      : plan(goal, budget.mode, categories).limits;
    return {
      ...data, ready, limits,
      addTx: (t) => setData((d) => ({ ...d, txs: [{ ...t, id: crypto.randomUUID() }, ...d.txs] })),
      removeTx: (id) => setData((d) => ({ ...d, txs: d.txs.filter((t) => t.id !== id) })),
      resetData: () => setData(EMPTY_LEDGER),
      setBudget: (b) => setData((d) => ({ ...d, budget: b })),
      setGoal: (g) => setData((d) => ({ ...d, goal: g })),
      addCategory: (name, weight) => {
        const n = name.trim();
        if (n.length < 2 || n.length > 24) return "Nama kategori 2–24 karakter.";
        if (categories.some((c) => c.name.toLowerCase() === n.toLowerCase())) return "Nama kategori sudah ada.";
        const def: CategoryDef = { id: `c_${crypto.randomUUID()}`, name: n, weight };
        setData((d) => ({ ...d, categories: [...d.categories, def] }));
        return null;
      },
      setCategoryWeight: (id, w) =>
        setData((d) => ({ ...d, categories: d.categories.map((c) => (c.id === id ? { ...c, weight: w } : c)) })),
      removeCategory: (id) =>
        setData((d) => ({
          ...d,
          categories: d.categories.filter((c) => c.id !== id),
          budget: { ...d.budget, limits: Object.fromEntries(Object.entries(d.budget.limits).filter(([k]) => k !== id)) },
        })),
    };
  }, [data, ready, setData]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLedger = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLedger harus di dalam LedgerProvider");
  return c;
};
