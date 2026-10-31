"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo } from "react";
import { Eye, EyeOff } from "lucide-react";
import { PageHeader, Bar } from "./ui";
import { usePrefs } from "@/context/prefs";
import { useLedger } from "@/context/ledger";
import { summarize, trend, usage } from "@/lib/budget";
import { monthKey, monthLabel, today } from "@/lib/format";
import { CATEGORIES } from "@/lib/types";

const fallback = () => <div className="h-56" aria-hidden />;
const TrendChart = dynamic(() => import("./charts").then((m) => m.TrendChart), { ssr: false, loading: fallback });
const CategoryDonut = dynamic(() => import("./charts").then((m) => m.CategoryDonut), { ssr: false, loading: fallback });

export function Dashboard() {
  const { txs, goal, limits } = useLedger();
  const { money, hidden, toggleHidden } = usePrefs();
  const month = monthKey(today());
  const s = useMemo(() => summarize(txs, month), [txs, month]);
  const months = useMemo(() => trend(txs), [txs]);
  const pie = CATEGORIES.map((c) => ({ name: c, value: s.spent[c] })).filter((d) => d.value > 0);
  const over = CATEGORIES.filter((c) => usage(s.spent[c], limits[c]).level === "over");
  const goalPct = goal.target > 0 ? Math.round((s.savedTotal / goal.target) * 100) : 0;

  return (
    <>
      <PageHeader title={`Ringkasan · ${monthLabel(month)}`} />
      <div className="space-y-8">
        <section aria-label="Saldo" className="rounded-lg border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-mute">Saldo utama</p>
            <button onClick={toggleHidden} aria-pressed={hidden} aria-label={hidden ? "Tampilkan nominal" : "Sembunyikan nominal"} className="rounded-md p-2 text-mute">
              {hidden ? <EyeOff size={20} aria-hidden /> : <Eye size={20} aria-hidden />}
            </button>
          </div>
          <p className="mt-1 text-3xl font-semibold">{money(s.balance)}</p>
        </section>

        <section aria-label="Ringkasan bulan ini" className="grid grid-cols-3 divide-x divide-line rounded-lg border border-line bg-surface">
          <Kpi label="Pemasukan" value={money(s.income)} />
          <Kpi label="Pengeluaran" value={money(s.spending)} />
          <Kpi label="Total tabungan" value={money(s.savedTotal)} />
        </section>

        <Link href="/alokasi" className="block space-y-2 rounded-lg border border-line bg-surface p-4">
          <p className="flex justify-between text-sm"><span>Target tabungan</span><span className="text-mute">{money(s.savedTotal)} dari {money(goal.target)} · {goalPct}%</span></p>
          <Bar pct={goalPct} label="Progres target tabungan" />
        </Link>

        {over.length > 0 && (
          <p role="status" className="rounded-lg bg-overSoft px-4 py-3 text-sm text-over">Melebihi limit: {over.join(", ")}.</p>
        )}

        <section aria-labelledby="h-trend">
          <h2 id="h-trend" className="mb-3 text-lg font-semibold">Tren 6 bulan</h2>
          <TrendChart data={months} />
        </section>

        <section aria-labelledby="h-cat">
          <h2 id="h-cat" className="mb-3 text-lg font-semibold">Pengeluaran per kategori</h2>
          {pie.length === 0
            ? <p className="rounded-lg border border-dashed border-line p-6 text-sm text-mute">Belum ada pengeluaran bulan ini.</p>
            : <CategoryDonut data={pie} />}
        </section>
      </div>
    </>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 px-3 py-4 sm:px-5">
      <p className="text-xs text-mute sm:text-sm">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold sm:text-xl">{value}</p>
    </div>
  );
}
