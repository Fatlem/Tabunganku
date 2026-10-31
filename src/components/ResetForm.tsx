"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/auth";
import { inputCls, PasswordField, PasswordMeter } from "./ui";

const field = `${inputCls} mt-1 font-normal`;
const primary = "w-full rounded-full bg-brand py-3 font-semibold text-ground disabled:opacity-60";

export function ResetForm() {
  const { requestReset, confirmReset } = useAuth();
  const [sent, setSent] = useState<{ email: string; code: string } | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function sendCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email"));
    setBusy(true); setError("");
    const r = await requestReset(email);
    setBusy(false);
    if ("error" in r) setError(r.error); else setSent({ email, code: r.code });
  }

  async function reset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!sent) return;
    if (password !== confirm) return setError("Konfirmasi kata sandi tidak sama.");
    setBusy(true); setError("");
    const err = await confirmReset(sent.email, String(new FormData(e.currentTarget).get("code")), password);
    setBusy(false);
    if (err) setError(err); else setDone(true);
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-semibold">Reset kata sandi</h1>
        <p className="mt-1 text-mute">{sent ? "Masukkan kode dan kata sandi baru." : "Masukkan email akun Anda untuk menerima kode reset."}</p>
      </div>

      {done ? (
        <p role="status" className="rounded-lg border border-line bg-surface p-4">
          Kata sandi diperbarui. <Link href="/login" className="font-semibold underline">Masuk sekarang</Link>
        </p>
      ) : !sent ? (
        <form onSubmit={sendCode} className="space-y-4">
          <label className="block text-sm font-medium">Email
            <input name="email" type="email" required autoComplete="email" inputMode="email" spellCheck={false} placeholder="nama@email.com…" className={field} />
          </label>
          {error && <p role="alert" className="text-sm text-over">{error}</p>}
          <button type="submit" disabled={busy} className={primary}>{busy ? "Memproses…" : "Kirim kode"}</button>
        </form>
      ) : (
        <form onSubmit={reset} className="space-y-4">
          <p role="status" className="rounded-lg border border-dashed border-line p-3 text-sm text-mute">
            Mode demo: tidak ada server email, jadi kode ditampilkan di sini: <b className="text-ink">{sent.code}</b> (berlaku 10 menit).
          </p>
          <label className="block text-sm font-medium">Kode 6 digit
            <input name="code" required inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" className={`${field} tracking-widest`} />
          </label>
          <PasswordField label="Kata sandi baru" name="password" autoComplete="new-password" onValueChange={setPassword} />
          <PasswordMeter password={password} />
          <PasswordField label="Konfirmasi kata sandi" name="confirm" autoComplete="new-password" onValueChange={setConfirm} />
          {error && <p role="alert" className="text-sm text-over">{error}</p>}
          <button type="submit" disabled={busy} className={primary}>{busy ? "Memproses…" : "Atur kata sandi baru"}</button>
        </form>
      )}
      {!done && <Link href="/login" className="text-center text-sm text-mute underline">Kembali ke login</Link>}
    </main>
  );
}
