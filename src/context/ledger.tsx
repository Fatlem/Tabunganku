"use client";
import { createContext, useContext, useMemo } from "react";
import { plan } from "@/lib/budget";
import { usePersistentState } from "@/lib/usePersistentState";
import { BudgetState, Category, EMPTY_LEDGER, Goal, LedgerData, Transaction } from "@/lib/types";
import { dataKey, useAuth } from "./auth";

interface LedgerCtx extends LedgerData {
  ready: boolean;
  /** Limit bulanan aktif: hasil planner (standar/hemat) atau input manual. */
  limits: Record<Category, number>;
  addTx: (t: Omit<Transaction, "id">) => void;
  removeTx: (id: string) => void;
  resetData: () => void;
  setBudget: (b: BudgetState) => void;
  setGoal: (g: Goal) => void;
}
const Ctx = createContext<LedgerCtx | null>(null);

export function LedgerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [data, setData, ready] = usePersistentState(user ? dataKey(user.id) : null, EMPTY_LEDGER);

  const value = useMemo<LedgerCtx>(() => ({
    ...data, ready,
    limits: data.budget.mode === "manual" ? data.budget.limits : plan(data.goal, data.budget.mode).limits,
    addTx: (t) => setData((d) => ({ ...d, txs: [{ ...t, id: crypto.randomUUID() }, ...d.txs] })),
    removeTx: (id) => setData((d) => ({ ...d, txs: d.txs.filter((t) => t.id !== id) })),
    resetData: () => setData(EMPTY_LEDGER),
    setBudget: (budget) => setData((d) => ({ ...d, budget })),
    setGoal: (goal) => setData((d) => ({ ...d, goal })),
  }), [data, ready, setData]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLedger = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLedger harus di dalam LedgerProvider");
  return c;
};
