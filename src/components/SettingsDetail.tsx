"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, ChevronLeft, Play } from "lucide-react";
import { SHOW_INTRO_EVENT } from "./Onboarding";
import { PageHeader, PasswordField, Segmented } from "./ui";
import { useAuth } from "@/context/auth";
import { useLedger } from "@/context/ledger";
import { usePrefs } from "@/context/prefs";
import { SettingsSlug, settingsTitle } from "@/lib/settings";
import { CURRENCIES, Currency, Theme } from "@/lib/types";

const THEMES = [{ value: "light", label: "Terang" }, { value: "dark", label: "Gelap" }, { value: "system", label: "Sistem" }] as const;
const CUR = CURRENCIES.map((c) => ({ value: c, label: c }));
const danger = "w-full rounded-full border border-over py-3 font-semibold text-over";
const outline = "flex w-full items-center justify-center gap-2 rounded-full border border-line bg-surface py-3 font-semibold";

export function SettingsDetail({ slug }: { slug: SettingsSlug }) {
  return (
    <>
      <Link href="/pengaturan" className="mb-4 inline-flex items-center gap-1 py-1 text-sm text-mute">
        <ChevronLeft size={18} aria-hidden /> Pengaturan
      </Link>
      <PageHeader title={settingsTitle(slug)} />
      <div className="max-w-lg">{BODY[slug]()}</div>
    </>
  );
}

const BODY: Record<SettingsSlug, () => React.ReactNode> = {
  profil: () => <ProfileSection />,
  akun: () => <AccountSection />,
  "kata-sandi": () => <PasswordSection />,
  preferensi: () => <ThemeSection />,
  "mata-uang": () => <CurrencySection />,
  bantuan: () => <HelpSection />,
};

function ProfileSection() {
  const { user } = useAuth();
  return (
    <dl className="divide-y divide-line rounded-lg border border-line bg-surface text-sm">
      <div className="flex justify-between gap-3 px-4 py-3"><dt className="text-mute">Nama</dt><dd className="min-w-0 truncate font-medium">{user?.name}</dd></div>
      <div className="flex justify-between gap-3 px-4 py-3"><dt className="text-mute">Username</dt><dd className="min-w-0 truncate font-medium">@{user?.username}</dd></div>
      <div className="flex justify-between gap-3 px-4 py-3"><dt className="text-mute">Email</dt><dd className="min-w-0 truncate font-medium">{user?.email}</dd></div>
    </dl>
  );
}

function AccountSection() {
  const { deleteAccount } = useAuth();
  const { resetData } = useLedger();
  const router = useRouter();
  const [done, setDone] = useState(false);

  return (
    <div className="space-y-8">
      <section aria-labelledby="h-reset" className="space-y-3">
        <h2 id="h-reset" className="font-semibold">Reset semua data keuangan</h2>
        <p className="text-sm text-mute">Menghapus seluruh transaksi, target, dan alokasi. Akun Anda tetap ada.</p>
        <button className={danger} onClick={() => {
          if (window.confirm("Hapus semua transaksi, target, dan alokasi? Tindakan ini tidak bisa dibatalkan.")) { resetData(); setDone(true); }
        }}>Reset semua data keuangan</button>
        {done && <p role="status" className="text-sm text-brand">Data keuangan sudah direset.</p>}
      </section>

      <section aria-labelledby="h-del" className="space-y-3">
        <h2 id="h-del" className="font-semibold">Hapus akun</h2>
        <p className="text-sm text-mute">Menghapus akun beserta seluruh datanya secara permanen. Tindakan ini tidak bisa dibatalkan.</p>
        <button className={danger} onClick={() => {
          if (window.confirm("Hapus akun beserta seluruh datanya?")) { deleteAccount(); router.replace("/login"); }
        }}>Hapus akun</button>
      </section>
    </div>
  );
}

function PasswordSection() {
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
    <form onSubmit={submit} className="space-y-4">
      <PasswordField label="Kata sandi saat ini" name="current" placeholder="Masukan Kata Sandi Saat Ini" autoComplete="current-password" />
      <PasswordField label="Kata sandi baru" name="next" placeholder="Masukan Kata Sandi Baru" autoComplete="new-password"
        hint="Minimal 8 karakter dengan huruf besar, huruf kecil, angka, dan simbol." />
      {msg && <p role={msg.ok ? "status" : "alert"} className={`text-sm ${msg.ok ? "text-brand" : "text-over"}`}>{msg.text}</p>}
      <button type="submit" className={outline}>Simpan kata sandi</button>
    </form>
  );
}

function ThemeSection() {
  const { theme, setTheme } = usePrefs();
  return (
    <div className="space-y-3">
      <Segmented label="Tema" value={theme} options={THEMES} onChange={(v: Theme) => setTheme(v)} />
      <p className="text-sm text-mute">Sistem mengikuti pengaturan terang atau gelap di perangkat Anda.</p>
    </div>
  );
}

function CurrencySection() {
  const { currency, setCurrency } = usePrefs();
  return (
    <div className="space-y-3">
      <Segmented label="Mata uang" value={currency} options={CUR} onChange={(v: Currency) => setCurrency(v)} />
      <p className="text-sm text-mute">Hanya mengubah format tampilan; nominal tidak dikonversi.</p>
    </div>
  );
}

function HelpSection() {
  return (
    <div className="space-y-3">
      <Link href="/panduan" className={outline}><BookOpen size={18} aria-hidden /> Panduan pemakaian</Link>
      <button onClick={() => window.dispatchEvent(new Event(SHOW_INTRO_EVENT))} className={outline}>
        <Play size={18} aria-hidden /> Ulangi pengenalan
      </button>
    </div>
  );
}
