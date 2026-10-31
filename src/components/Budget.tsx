"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Bar, inputCls, MoneyField, NumField, TEXT } from "./ui";
import { useLedger } from "@/context/ledger";
import { usePrefs } from "@/context/prefs";
import { summarize, usage, Level } from "@/lib/budget";
import { monthKey, today } from "@/lib/format";

const NOTE: Record<Level, string> = { ok: "", warn: "Hampir habis", over: "Melebihi limit" };

export function Budget() {
  const { txs, goal, budget, limits, categories, setBudget, addCategory, setCategoryWeight, removeCategory } = useLedger();
  const { money } = usePrefs();
  const { spent } = summarize(txs, monthKey(today()));
  const manual = budget.mode === "manual";
  const allocated = categories.reduce((s, c) => s + (limits[c.id] ?? 0), 0);
  const [name, setName] = useState("");
  const [weight, setWeight] = useState(10);
  const [error, setError] = useState("");

  const setLimit = (id: string, v: number) => setBudget({ ...budget, limits: { ...limits, [id]: v } });
  const txCount = (id: string) => txs.filter((t) => t.category === id).length;

  function add(e: React.FormEvent) {
    e.preventDefault();
    const err = addCategory(name, weight);
    setError(err ?? "");
    if (!err) setName("");
  }

  return (
    <section aria-labelledby="h-budget" className="space-y-4">
      <h2 id="h-budget" className="text-lg font-semibold">Kategori & limit</h2>
      {!manual && <p className="text-sm text-mute">Porsi dihitung dari sisa gaji setelah tabungan wajib. Total porsi tidak harus 100%, otomatis disesuaikan.</p>}
      {!manual && allocated === 0 && <p className="text-sm text-mute">Limit muncul setelah target tabungan diisi di atas.</p>}
      {manual && goal.income > 0 && allocated !== goal.income && (
        <p role="status" className="text-sm text-warn">
          Total alokasi {money(allocated)} {allocated > goal.income ? "melebihi" : "kurang dari"} gaji ({money(goal.income)}).
        </p>
      )}

      <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
        {categories.map((c) => {
          const limit = limits[c.id] ?? 0;
          const sp = spent[c.id] ?? 0;
          const { pct, level } = usage(sp, limit);
          const used = txCount(c.id);
          return (
            <li key={c.id} className="space-y-3 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 truncate font-medium">{c.name}</p>
                {!c.fixed && (
                  <button type="button" disabled={used > 0} title={used > 0 ? `Dipakai di ${used} transaksi` : undefined}
                    onClick={() => window.confirm(`Hapus kategori "${c.name}"?`) && removeCategory(c.id)}
                    aria-label={`Hapus kategori ${c.name}`} className="rounded-md p-2 text-mute enabled:hover:text-over disabled:opacity-40">
                    <Trash2 size={18} aria-hidden />
                  </button>
                )}
              </div>

              {manual ? (
                <div className="grid grid-cols-[minmax(0,1fr)_6.5rem] gap-3">
                  <MoneyField label="Nominal" value={limit} onChange={(v) => setLimit(c.id, v)} />
                  <NumField label="Persen" suffix="%" value={goal.income ? Math.round((limit / goal.income) * 100) : 0}
                    onChange={(p) => setLimit(c.id, Math.round((goal.income * p) / 100))} />
                </div>
              ) : c.fixed ? (
                <p className="flex flex-wrap justify-between gap-x-3 text-sm"><span className="text-mute">Wajib tabung</span><span className="font-semibold">{money(limit)}</span></p>
              ) : (
                <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-end gap-3">
                  <NumField label="Porsi" suffix="%" value={c.weight} onChange={(w) => setCategoryWeight(c.id, w)} />
                  <p className="pb-3 text-right font-semibold">{money(limit)}</p>
                </div>
              )}

              <Bar pct={pct} level={level} label={`Pemakaian ${c.name}`} />
              <p className={`flex flex-wrap justify-between gap-x-3 text-sm ${TEXT[level]}`}>
                <span>{money(sp)} · {pct}%</span><span className="font-medium">{NOTE[level]}</span>
              </p>
              {!c.fixed && used > 0 && <p className="text-xs text-mute">Dipakai di {used} transaksi, jadi belum bisa dihapus.</p>}
            </li>
          );
        })}
      </ul>

      <form onSubmit={add} className="space-y-3 rounded-lg border border-dashed border-line p-4">
        <p className="font-medium">Tambah kategori</p>
        <div className="grid grid-cols-[minmax(0,1fr)_6.5rem] gap-3">
          <label className="block text-sm">Nama
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={24} autoComplete="off" placeholder="Hobi, Donasi…" className={`${inputCls} mt-1`} />
          </label>
          <NumField label="Porsi" suffix="%" value={weight} onChange={setWeight} />
        </div>
        {error && <p role="alert" className="text-sm text-over">{error}</p>}
        <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full border border-line bg-surface py-3 font-semibold">
          <Plus size={18} aria-hidden /> Tambah
        </button>
      </form>
    </section>
  );
}
