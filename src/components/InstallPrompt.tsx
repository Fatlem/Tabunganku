"use client";
import { useEffect, useState } from "react";

interface BIPEvent extends Event { prompt(): Promise<void> }

export function InstallPrompt() {
  const [evt, setEvt] = useState<BIPEvent | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => { e.preventDefault(); setEvt(e as BIPEvent); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", () => setEvt(null));
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!evt) return null;
  return (
    <button onClick={() => evt.prompt().then(() => setEvt(null))}
      className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-ground">Pasang aplikasi</button>
  );
}
