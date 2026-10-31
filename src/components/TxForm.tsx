"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { inputCls, Segmented } from "./ui";
import { useLedger } from "@/context/ledger";
import { today } from "@/lib/format";
import { CATEGORIES, Category, TxType, WALLETS, Wallet } from "@/lib/types";

const TYPES = [{ value: "expense", label: "Pengeluaran" }, { value: "income", label: "Pemasukan" }] as const;

export function TxForm() {
  const { addTx } = useLedger();
  const router = useRouter();
  const [type, setType] = useState<TxType>("expense");
  const [error, setError] = useState("");
  const amountRef = useRef<HTMLInputElement>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const amount = Number(f.get("amount"));
    if (!(amount > 0)) { setError("Nominal harus lebih dari 0."); amountRef.current?.focus(); return; }
    addTx({
      type, amount, wallet: f.get("wallet") as Wallet, date: String(f.get("date")),
      category: type === "income" ? "Tabungan" : (f.get("category") as Category),
      note: String(f.get("note") ?? "").trim(),
    });
    router.push("/riwayat");
  }

  return (
    <form onSubmit={submit} className="max-w-lg space-y-5" noValidate>
      <Segmented label="Jenis transaksi" value={type} options={TYPES} onChange={setType} />
      <label className="block text-sm">Nominal
        <input ref={amountRef} name="amount" type="number" inputMode="numeric" min={1} autoComplete="off" placeholder="25000…"
          aria-invalid={!!error} aria-describedby="amount-error" className={`${inputCls} mt-1 text-lg`} />
        <span id="amount-error" role="alert" className="mt-1 block text-over">{error}</span>
      </label>
      {type === "expense" && (
        <label className="block text-sm">Kategori
          <select name="category" className={`${inputCls} mt-1`}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
      )}
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm">Dompet
          <select name="wallet" className={`${inputCls} mt-1`}>{WALLETS.map((w) => <option key={w}>{w}</option>)}</select>
        </label>
        <label className="block text-sm">Tanggal
          <input name="date" type="date" defaultValue={today()} className={`${inputCls} mt-1`} />
        </label>
      </div>
      <label className="block text-sm">Catatan
        <input name="note" autoComplete="off" placeholder="Makan siang di kantin…" className={`${inputCls} mt-1`} />
      </label>
      <button type="submit" className="w-full rounded-full bg-brand py-3 font-semibold text-ground">Simpan transaksi</button>
    </form>
  );
}
