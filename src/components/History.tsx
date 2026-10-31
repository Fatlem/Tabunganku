"use client";
import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { useLedger } from "@/context/ledger";
import { usePrefs } from "@/context/prefs";
import { monthKey, monthLabel } from "@/lib/format";
import { CATEGORIES, WALLETS } from "@/lib/types";

const sel = "rounded-md border border-line bg-surface px-3 py-2 text-sm";

export function History() {
  const { txs, removeTx } = useLedger();
  const { money } = usePrefs();
  const [month, setMonth] = useState("");
  const [category, setCategory] = useState("");
  const [wallet, setWallet] = useState("");
  const months = useMemo(() => [...new Set(txs.map((t) => monthKey(t.date)))].sort().reverse(), [txs]);

  const shown = txs
    .filter((t) => (!month || monthKey(t.date) === month)
      && (!category || (t.type === "expense" && t.category === category))
      && (!wallet || t.wallet === wallet))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <select aria-label="Bulan" value={month} onChange={(e) => setMonth(e.target.value)} className={sel}>
          <option value="">Semua bulan</option>{months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
        </select>
        <select aria-label="Kategori" value={category} onChange={(e) => setCategory(e.target.value)} className={sel}>
          <option value="">Semua kategori</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select aria-label="Dompet" value={wallet} onChange={(e) => setWallet(e.target.value)} className={sel}>
          <option value="">Semua dompet</option>{WALLETS.map((w) => <option key={w}>{w}</option>)}
        </select>
      </div>
      {shown.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line p-6 text-sm text-mute">Tidak ada transaksi yang cocok.</p>
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
          {shown.map((t) => {
            const name = t.note || (t.type === "income" ? "Pemasukan" : t.category);
            return (
              <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{name}</p>
                  <p className="truncate text-sm text-mute">{t.date} · {t.type === "income" ? "Pemasukan" : t.category} · {t.wallet}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <span className={`font-semibold ${t.type === "income" ? "text-brand" : ""}`}>{t.type === "income" ? "+" : "−"}{money(t.amount)}</span>
                  <button onClick={() => window.confirm("Hapus transaksi ini?") && removeTx(t.id)} aria-label={`Hapus ${name}`} className="rounded-md p-2 text-mute hover:text-over">
                    <Trash2 size={18} aria-hidden />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
