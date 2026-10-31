"use client";
import { Bar, inputCls, MoneyField, Segmented } from "./ui";
import { useLedger } from "@/context/ledger";
import { usePrefs } from "@/context/prefs";
import { plan, summarize, usage } from "@/lib/budget";
import { monthKey, monthLabel, monthOffset, monthsUntil, today } from "@/lib/format";
import { AllocMode, SAVING_ID } from "@/lib/types";

const MODES = [{ value: "standar", label: "Standar" }, { value: "hemat", label: "Hemat" }, { value: "manual", label: "Manual" }] as const;
const SHORTCUTS = [6, 12, 24];

export function Planner() {
  const { txs, goal, budget, limits, categories, setGoal, setBudget } = useLedger();
  const { money } = usePrefs();
  const s = summarize(txs, monthKey(today()));
  const months = monthsUntil(goal.deadline);
  const complete = goal.income > 0 && goal.target > 0 && months > 0;
  const auto = plan(goal, budget.mode === "hemat" ? "hemat" : "standar", categories);
  const monthly = usage(s.saved, limits[SAVING_ID]);
  const total = goal.target > 0 ? Math.round((s.savedTotal / goal.target) * 100) : 0;

  // Pindah ke manual membawa angka planner saat ini sebagai titik awal.
  const setMode = (mode: AllocMode) => setBudget({ mode, limits: mode === "manual" ? limits : budget.limits });

  return (
    <section aria-labelledby="h-plan" className="space-y-5">
      <h2 id="h-plan" className="text-lg font-semibold">Target tabungan</h2>

      <div className="space-y-4 rounded-lg border border-line bg-surface p-4">
        <MoneyField label="Gaji bulanan" value={goal.income} onChange={(income) => setGoal({ ...goal, income })} />
        <MoneyField label="Target tabungan" value={goal.target} onChange={(target) => setGoal({ ...goal, target })} />
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium">Tenggat target</label>
          <input id="deadline" name="deadline" type="month" min={monthOffset(1)} value={goal.deadline ?? ""}
            onChange={(e) => setGoal({ ...goal, deadline: e.target.value })} className={`${inputCls} mt-1`} />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {SHORTCUTS.map((n) => (
              <button key={n} type="button" onClick={() => setGoal({ ...goal, deadline: monthOffset(n) })} aria-pressed={goal.deadline === monthOffset(n)}
                className={`rounded-full border px-3 py-1.5 text-sm ${goal.deadline === monthOffset(n) ? "border-ink bg-ink text-ground" : "border-line text-mute"}`}>
                {n} bulan
              </button>
            ))}
            {months > 0 && <span className="text-sm text-mute">{monthLabel(goal.deadline)} · {months} bulan lagi</span>}
          </div>
        </div>
      </div>

      {!complete ? (
        <p className="rounded-lg border border-dashed border-line p-5 text-sm text-mute">
          Isi gaji, target, dan tenggat. Porsi tabungan wajib per bulan beserta pembagian kategori akan muncul di sini.
        </p>
      ) : (
        <>
          <Segmented label="Mode alokasi" value={budget.mode} options={MODES} onChange={setMode} />
          <div className="rounded-lg border border-line bg-surface p-4 text-sm">
            <p className="text-mute">Wajib tabung per bulan</p>
            <p className="text-2xl font-semibold">{money(auto.required)}</p>
            {!auto.feasible ? (
              <p role="alert" className="mt-2 text-over">Target tidak terkejar dengan gaji ini. Perpanjang tenggat atau turunkan target.</p>
            ) : budget.mode === "hemat" ? (
              <p className="mt-2 text-mute">Mode hemat menabung {money(limits[SAVING_ID])}/bulan, target tercapai dalam {auto.monthsToGoal} bulan.</p>
            ) : null}
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="flex flex-wrap justify-between gap-x-3 text-sm"><span>Tabungan bulan ini</span><span className="text-mute">{money(s.saved)} dari {money(limits[SAVING_ID])} · {monthly.pct}%</span></p>
              <Bar pct={monthly.pct} label="Progres tabungan bulan ini" />
            </div>
            <div className="space-y-1">
              <p className="flex flex-wrap justify-between gap-x-3 text-sm"><span>Menuju target</span><span className="text-mute">{money(s.savedTotal)} dari {money(goal.target)} · {total}%</span></p>
              <Bar pct={total} label="Progres menuju target" />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
