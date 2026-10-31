"use client";
import { AuthProvider } from "@/context/auth";
import { LedgerProvider } from "@/context/ledger";
import { PrefsProvider } from "@/context/prefs";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrefsProvider><AuthProvider><LedgerProvider>{children}</LedgerProvider></AuthProvider></PrefsProvider>
  );
}
