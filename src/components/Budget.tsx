"use client";
import { Bar, MoneyField, NumField, TEXT } from "./ui";
import { usePrefs } from "@/context/prefs";
import { useLedger } from "@/context/ledger";
import { summarize, usage, Level } from "@/lib/budget";
import { monthKey, today } from "@/lib/format";
import { CATEGORIES, Category } from "@/lib/types";

const NOTE: Record<Level, string> = { ok: "", warn: "Hampir habis", over: "Melebihi limit" };

export function Budget() {
  const { txs, goal, budget, limits, setBudget } = useLedger();
  const { money } = usePrefs();
  const { spent } = summarize(txs, monthKey(today()));
  const manual = budget.mode === "manual";
  const set = (c: Category, v: number) => setBudget({ ...budget, limits: { ...limits, [c]: v } });
  const allocated = CATEGORIES.reduce((s, c) => s + limits[c], 0);

  return (
    <section aria-labelledby="h-budget" className="space-y-4">
      <h2 id="h-budget" className="text-lg font-semibold">Limit per kategori</h2>
      {!manual && allocated === 0 && <p className="text-sm text-mute">Limit muncul setelah target tabungan diisi di atas.</p>}
      {manual && goal.income > 0 && allocated !== goal.income && (
        <p role="status" className="text-sm text-warn">
          Total alokasi {money(allocated)} {allocated > goal.income ? "melebihi" : "kurang dari"} gaji ({money(goal.income)}).
        </p>
      )}
      <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
        {CATEGORIES.map((c) => {
          const { pct, level } = usage(spent[c], limits[c]);
          return (
            <li key={c} className="space-y-3 px-4 py-4">
              {manual ? (
                <div className="space-y-2">
                  <p className="font-medium">{c}</p>
                  <div className="grid grid-cols-[1fr_6rem] gap-3">
                    <MoneyField label="Nominal" value={limits[c]} onChange={(v) => set(c, v)} />
                    <NumField label="Persen" suffix="%" value={goal.income ? Math.round((limits[c] / goal.income) * 100) : 0}
                      onChange={(p) => set(c, Math.round((goal.income * p) / 100))} />
                  </div>
                </div>
              ) : (
                <div className="flex justify-between gap-3"><p className="font-medium">{c}</p><p className="font-semibold">{money(limits[c])}</p></div>
              )}
              <Bar pct={pct} level={level} label={`Pemakaian ${c}`} />
              <p className={`flex justify-between text-sm ${TEXT[level]}`}>
                <span>{money(spent[c])} · {pct}%</span><span className="font-medium">{NOTE[level]}</span>
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
