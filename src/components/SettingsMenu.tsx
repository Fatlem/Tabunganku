"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, CircleHelp, Coins, KeyRound, LogOut, Palette, User, UserCog, type LucideIcon } from "lucide-react";
import { PageHeader } from "./ui";
import { useAuth } from "@/context/auth";
import { usePrefs } from "@/context/prefs";
import { SETTINGS, SettingsSlug } from "@/lib/settings";

const ICONS: Record<SettingsSlug, LucideIcon> = {
  profil: User, akun: UserCog, "kata-sandi": KeyRound, preferensi: Palette, "mata-uang": Coins, bantuan: CircleHelp,
};
const THEME_LABEL = { light: "Terang", dark: "Gelap", system: "Sistem" } as const;

export function SettingsMenu() {
  const { user, logout } = useAuth();
  const { theme, currency } = usePrefs();
  const router = useRouter();

  const hint: Record<SettingsSlug, string> = {
    profil: user ? `${user.name} · @${user.username}` : "",
    akun: "Reset data keuangan dan hapus akun",
    "kata-sandi": "Perbarui kata sandi Anda",
    preferensi: `Tema ${THEME_LABEL[theme]}`,
    "mata-uang": currency,
    bantuan: "Panduan pemakaian dan pengenalan",
  };

  return (
    <>
      <PageHeader title="Pengaturan" subtitle="Kelola akun, tampilan, dan bantuan." />
      <ul className="max-w-lg divide-y divide-line rounded-lg border border-line bg-surface">
        {SETTINGS.map(({ slug, title }) => {
          const Icon = ICONS[slug];
          return (
            <li key={slug}>
              <Link href={`/pengaturan/${slug}`} className="flex items-center gap-3 px-4 py-4">
                <Icon size={20} aria-hidden className="shrink-0 text-mute" />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{title}</span>
                  <span className="block truncate text-sm text-mute">{hint[slug]}</span>
                </span>
                <ChevronRight size={18} aria-hidden className="shrink-0 text-mute" />
              </Link>
            </li>
          );
        })}
      </ul>
      <button onClick={() => { logout(); router.replace("/login"); }}
        className="mt-6 flex w-full max-w-lg items-center justify-center gap-2 rounded-full border border-line bg-surface py-3 font-semibold">
        <LogOut size={18} aria-hidden /> Keluar
      </button>
    </>
  );
}
