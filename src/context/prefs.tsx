"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePersistentState } from "@/lib/usePersistentState";
import { Currency, Theme } from "@/lib/types";

export const SYMBOL: Record<Currency, string> = { IDR: "Rp", USD: "$", EUR: "€", SGD: "S$" };
const DEFAULTS = { theme: "system" as Theme, currency: "IDR" as Currency, hidden: false };

interface PrefsCtx {
  theme: Theme; currency: Currency; hidden: boolean; dark: boolean;
  setTheme: (t: Theme) => void; setCurrency: (c: Currency) => void; toggleHidden: () => void;
  /** Format nominal sesuai mata uang; disamarkan saat mode privasi aktif. */
  money: (n: number) => string;
}
const Ctx = createContext<PrefsCtx | null>(null);

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [p, setP] = usePersistentState("tabunganku:prefs", DEFAULTS);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const d = p.theme === "dark" || (p.theme === "system" && mq.matches);
      document.documentElement.classList.toggle("dark", d);
      setDark(d);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [p.theme]);

  const fmt = useMemo(() => new Intl.NumberFormat("id-ID", {
    style: "currency", currency: p.currency, maximumFractionDigits: p.currency === "IDR" ? 0 : 2,
  }), [p.currency]);
  const money = useCallback((n: number) => (p.hidden ? `${SYMBOL[p.currency]} ••••••••` : fmt.format(n)), [p.hidden, p.currency, fmt]);

  const value = useMemo<PrefsCtx>(() => ({
    ...p, dark, money,
    setTheme: (theme) => setP((s) => ({ ...s, theme })),
    setCurrency: (currency) => setP((s) => ({ ...s, currency })),
    toggleHidden: () => setP((s) => ({ ...s, hidden: !s.hidden })),
  }), [p, dark, money, setP]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const usePrefs = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePrefs harus di dalam PrefsProvider");
  return c;
};
