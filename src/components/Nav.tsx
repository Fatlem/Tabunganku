"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, LayoutDashboard, Plus, Target, User } from "lucide-react";

const ITEMS = [
  { href: "/", label: "Ringkasan", Icon: LayoutDashboard },
  { href: "/alokasi", label: "Alokasi", Icon: Target },
  { href: "/catat", label: "Catat", Icon: Plus },
  { href: "/riwayat", label: "Riwayat", Icon: History },
  { href: "/profil", label: "Profil", Icon: User },
];

export function Nav() {
  const path = usePathname();
  return (
    <nav aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-10 flex justify-around border-t border-line bg-ground pb-[env(safe-area-inset-bottom)] md:static md:flex-col md:justify-start md:gap-1 md:border-0 md:pt-8">
      <p className="mb-4 hidden px-3 text-lg font-semibold md:block">Tabunganku</p>
      {ITEMS.map(({ href, label, Icon }) => {
        const active = href === "/" ? path === "/" : path.startsWith(href) || (href === "/profil" && path === "/panduan");
        const primary = href === "/catat";
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined}
            className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 py-2 text-xs md:flex-none md:flex-row md:gap-3 md:rounded-md md:px-3 md:py-2 md:text-sm ${active ? "font-semibold text-ink md:bg-line" : "text-mute"}`}>
            <span className={`grid size-9 place-items-center md:size-auto ${primary ? "rounded-full bg-brand text-ground md:bg-transparent md:text-inherit" : ""}`}>
              <Icon size={20} aria-hidden />
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
