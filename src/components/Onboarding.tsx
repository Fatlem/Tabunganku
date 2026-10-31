"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { INTRO_STEPS, IntroVisual } from "@/lib/guide";

const KEY = "tabunganku:intro:v1";
export const SHOW_INTRO_EVENT = "tabunganku:show-intro";

/** Pengenalan layar penuh: tampil sekali per perangkat, bisa diulang dari Pengaturan → Bantuan. */
export function Onboarding() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setOpen(true);
    const show = () => { setStep(0); setOpen(true); };
    window.addEventListener(SHOW_INTRO_EVENT, show);
    return () => window.removeEventListener(SHOW_INTRO_EVENT, show);
  }, []);

  const close = useCallback(() => { localStorage.setItem(KEY, "1"); setOpen(false); }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    nextRef.current?.focus();
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open, close]);

  if (!open) return null;
  const s = INTRO_STEPS[step];
  const last = step === INTRO_STEPS.length - 1;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="intro-title"
      className="fixed inset-0 z-50 flex flex-col bg-ground px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="flex justify-end">
        <button onClick={close} className="rounded-md px-2 py-2 text-sm text-mute">Lewati</button>
      </div>

      <div key={step} className="anim-slide mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-8 text-center">
        <div className="flex h-44 items-center justify-center" aria-hidden><Visual kind={s.visual} /></div>
        <div>
          <h2 id="intro-title" className="text-2xl font-semibold">{s.title}</h2>
          <p className="mt-3 text-mute">{s.body}</p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-sm space-y-5">
        <ol className="flex justify-center gap-2" aria-label="Langkah pengenalan">
          {INTRO_STEPS.map((_, i) => (
            <li key={i} aria-current={i === step ? "step" : undefined}
              className={`h-2 rounded-full transition-all ${i === step ? "w-6 bg-brand" : "w-2 bg-line"}`} />
          ))}
        </ol>
        <div className="flex gap-3">
          {step > 0 && <button onClick={() => setStep(step - 1)} className="rounded-full border border-line px-6 py-3 font-semibold">Kembali</button>}
          <button ref={nextRef} onClick={() => (last ? close() : setStep(step + 1))} className="flex-1 rounded-full bg-brand py-3 font-semibold text-ground">
            {last ? "Mulai" : "Lanjut"}
          </button>
        </div>
      </div>
    </div>
  );
}

const CARD = "w-64 rounded-lg border border-line bg-surface";

function Visual({ kind }: { kind: IntroVisual }) {
  switch (kind) {
    case "logo":
      return <div className="anim-pop grid size-24 place-items-center rounded-2xl bg-brand text-ground"><span className="text-5xl font-semibold">T</span></div>;
    case "target":
      return (
        <div className={`${CARD} space-y-3 p-4 text-left`}>
          <div className="flex justify-between text-xs text-mute"><span>Target tabungan</span><span>12 bulan</span></div>
          <p className="anim-rise text-xl font-semibold">Rp 20.000.000</p>
          <div className="h-2 rounded-sm bg-line"><div className="anim-grow-x h-2 w-3/5 origin-left rounded-sm bg-brand" style={{ animationDelay: "300ms" }} /></div>
          <p className="anim-rise text-xs text-mute" style={{ animationDelay: "500ms" }}>Wajib tabung Rp 1.666.667 / bulan</p>
        </div>
      );
    case "catat":
      return (
        <div className="w-64 space-y-2">
          {[["Makan siang", "−Rp25.000"], ["Gaji", "+Rp5.700.000"], ["Transport", "−Rp12.000"]].map(([n, v], i) => (
            <div key={n} className="anim-rise flex justify-between rounded-md border border-line bg-surface px-3 py-2 text-sm" style={{ animationDelay: `${i * 150}ms` }}>
              <span>{n}</span><span className={`font-semibold ${v.startsWith("+") ? "text-brand" : ""}`}>{v}</span>
            </div>
          ))}
        </div>
      );
    case "ringkasan":
      return (
        <div className="flex h-28 w-64 items-end gap-2">
          {[40, 65, 50, 85, 60, 95].map((h, i) => (
            <div key={i} className={`anim-grow-y flex-1 origin-bottom rounded-t-sm ${i % 2 ? "bg-mute/40" : "bg-brand"}`} style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
      );
    case "privasi":
      return (
        <div className={`${CARD} p-4 text-left`}>
          <div className="flex items-center justify-between text-xs text-mute">
            <span>Saldo utama</span>
            <span className="relative size-5"><Eye size={20} className="swap-a absolute inset-0" /><EyeOff size={20} className="swap-b absolute inset-0" /></span>
          </div>
          <p className="relative mt-1 h-8 text-2xl font-semibold">
            <span className="swap-a absolute inset-0">Rp 5.700.000</span><span className="swap-b absolute inset-0">Rp ••••••••</span>
          </p>
        </div>
      );
  }
}
