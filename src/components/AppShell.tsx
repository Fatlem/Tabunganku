"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/auth";
import { useLedger } from "@/context/ledger";
import { InstallPrompt } from "./InstallPrompt";
import { Nav } from "./Nav";

/** Proteksi rute: hanya pengguna terautentikasi yang melihat area aplikasi. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const { ready: dataReady } = useLedger();
  const router = useRouter();

  useEffect(() => { if (ready && !user) router.replace("/login"); }, [ready, user, router]);

  if (!ready || !user || !dataReady) return <p role="status" className="p-8 text-mute">Memuat…</p>;
  return (
    <div className="mx-auto min-h-dvh max-w-5xl md:grid md:grid-cols-[200px_1fr] md:gap-10 md:px-8">
      <a href="#utama" className="sr-only focus:not-sr-only">Lewati ke konten</a>
      <Nav />
      <main id="utama" className="px-4 pb-28 pt-6 md:px-0 md:pb-12 md:pt-8">
        <div className="mb-4 flex justify-end empty:hidden"><InstallPrompt /></div>
        {children}
      </main>
    </div>
  );
}
