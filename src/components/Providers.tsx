"use client";
import { AuthProvider } from "@/context/auth";
import { LedgerProvider } from "@/context/ledger";
import { PrefsProvider } from "@/context/prefs";
import { Onboarding } from "./Onboarding";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrefsProvider><AuthProvider><LedgerProvider>{children}<Onboarding /></LedgerProvider></AuthProvider></PrefsProvider>
  );
}
