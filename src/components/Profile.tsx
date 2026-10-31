"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { PasswordField, Segmented } from "./ui";
import { useAuth } from "@/context/auth";
import { useLedger } from "@/context/ledger";
import { usePrefs } from "@/context/prefs";
import { CURRENCIES, Currency, Theme } from "@/lib/types";

const THEMES = [{ value: "light", label: "Terang" }, { value: "dark", label: "Gelap" }, { value: "system", label: "Sistem" }] as const;
const CUR = CURRENCIES.map((c) => ({ value: c, label: c }));
const danger = "w-full rounded-full border border-over py-3 font-semibold text-over";

export function Profile() {
  const { user, logout, deleteAccount } = useAuth();
  const { resetData } = useLedger();
  const { theme, setTheme, currency, setCurrency } = usePrefs();
  const router = useRouter();

  return (
    <div className="max-w-lg space-y-8">
      <section aria-labelledby="h-acc">
        <h2 id="h-acc" className="mb-3 text-lg font-semibold">Akun</h2>
        <dl className="divide-y divide-line rounded-lg border border-line bg-surface text-sm">
          <div className="flex justify-between px-4 py-3"><dt className="text-mute">Nama</dt><dd className="font-medium">{user?.name}</dd></div>
          <div className="flex justify-between px-4 py-3"><dt className="text-mute">Username</dt><dd className="min-w-0 truncate font-medium">@{user?.username}</dd></div>
          <div className="flex justify-between gap-3 px-4 py-3"><dt className="text-mute">Email</dt><dd className="min-w-0 truncate font-medium">{user?.email}</dd></div>
        </dl>
      </section>

      <PasswordChange />

      <section aria-labelledby="h-pref" className="space-y-4">
        <h2 id="h-pref" className="text-lg font-semibold">Preferensi</h2>
        <div><p className="mb-2 text-sm text-mute">Tema</p><Segmented label="Tema" value={theme} options={THEMES} onChange={(v: Theme) => setTheme(v)} /></div>
        <div>
          <p className="mb-2 text-sm text-mute">Mata uang tampilan</p>
          <Segmented label="Mata uang" value={currency} options={CUR} onChange={(v: Currency) => setCurrency(v)} />
          <p className="mt-2 text-sm text-mute">Hanya mengubah format; nominal tidak dikonversi.</p>
        </div>
      </section>

      <section aria-labelledby="h-danger" className="space-y-3">
        <h2 id="h-danger" className="text-lg font-semibold">Zona sensitif</h2>
        <button onClick={logout} className="flex w-full items-center justify-center gap-2 rounded-full border border-line bg-surface py-3 font-semibold">
          <LogOut size={18} aria-hidden /> Keluar
        </button>
        <button onClick={() => window.confirm("Hapus semua transaksi, target, dan alokasi? Tindakan ini tidak bisa dibatalkan.") && resetData()} className={danger}>Reset semua data keuangan</button>
        <button onClick={() => { if (window.confirm("Hapus akun beserta seluruh datanya?")) { deleteAccount(); router.replace("/login"); } }} className={danger}>Hapus akun</button>
      </section>
    </div>
  );
}

function PasswordChange() {
  const { changePassword } = useAuth();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const err = await changePassword(String(f.get("current")), String(f.get("next")));
    setMsg(err ? { ok: false, text: err } : { ok: true, text: "Kata sandi diperbarui." });
    if (!err) form.reset();
  }

  return (
    <section aria-labelledby="h-pw">
      <h2 id="h-pw" className="mb-3 text-lg font-semibold">Ubah kata sandi</h2>
      <form onSubmit={submit} className="space-y-4">
        <PasswordField label="Kata sandi saat ini" name="current" autoComplete="current-password" />
        <PasswordField label="Kata sandi baru" name="next" autoComplete="new-password" hint="Minimal 8 karakter dengan huruf besar, huruf kecil, angka, dan simbol." />
        {msg && <p role={msg.ok ? "status" : "alert"} className={`text-sm ${msg.ok ? "text-brand" : "text-over"}`}>{msg.text}</p>}
        <button type="submit" className="w-full rounded-full border border-line bg-surface py-3 font-semibold">Simpan kata sandi</button>
      </form>
    </section>
  );
}
