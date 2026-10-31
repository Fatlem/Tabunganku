"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { inputCls, PasswordField, PasswordMeter } from "./ui";

const field = `${inputCls} mt-1 font-normal`;

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { user, login, register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const isLogin = mode === "login";
  const mismatch = !isLogin && confirm !== "" && confirm !== password;

  useEffect(() => { if (user) router.replace("/"); }, [user, router]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const username = String(f.get("username"));
    if (mismatch || (!isLogin && confirm !== password)) return setError("Konfirmasi kata sandi tidak sama.");
    setBusy(true); setError("");
    const err = isLogin
      ? await login(username, password)
      : await register(String(f.get("name")), username, String(f.get("email")), password);
    if (err) setError(err);
    setBusy(false);
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-6 py-10">
      <div>
        <p className="font-semibold text-brand">Tabunganku</p>
        <h1 className="mt-2 text-3xl font-semibold">{isLogin ? "Masuk" : "Buat akun"}</h1>
        <p className="mt-1 text-mute">{isLogin ? "Lanjutkan mencatat keuangan Anda." : "Mulai dari target tabungan pertama."}</p>
      </div>

      <form onSubmit={submit} className="space-y-4" noValidate={false}>
        {!isLogin && (
          <label className="block text-sm font-medium">Nama
            <input name="name" required autoComplete="name" autoCapitalize="none" spellCheck={false} placeholder="Masukan Nama" className={field} />
          </label>
        )}
        <label className="block text-sm font-medium">Username
          <input name="username" required autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="Masukan Username" className={field} />
        </label>
        {!isLogin && (
          <label className="block text-sm font-medium">Email
            <input name="email" type="email" required autoComplete="email" inputMode="email" spellCheck={false} placeholder="nama@email.com" className={field} />
            <span className="mt-1 block text-xs font-normal text-mute">Dipakai untuk mereset kata sandi.</span>
          </label>
        )}
        <PasswordField label="Kata sandi" name="password" autoComplete={isLogin ? "current-password" : "new-password"} onValueChange={setPassword} />
        {!isLogin && (
          <>
            <PasswordMeter password={password} />
            <PasswordField label="Konfirmasi kata sandi" name="confirm" autoComplete="new-password" onValueChange={setConfirm} />
            {mismatch && <p role="alert" className="-mt-2 text-xs text-over">Konfirmasi belum sama dengan kata sandi.</p>}
          </>
        )}
        {isLogin && <Link href="/reset-password" className="block text-sm text-mute underline">Lupa kata sandi?</Link>}
        {error && <p role="alert" className="text-sm text-over">{error}</p>}
        <button type="submit" disabled={busy} className="w-full rounded-full bg-brand py-3 font-semibold text-ground disabled:opacity-60">
          {busy ? "Memproses…" : isLogin ? "Masuk" : "Daftar"}
        </button>
      </form>

      <p className="text-center text-sm text-mute">
        {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
        <Link href={isLogin ? "/register" : "/login"} className="font-semibold text-ink underline">{isLogin ? "Daftar" : "Masuk"}</Link>
      </p>
    </main>
  );
}
