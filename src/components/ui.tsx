"use client";
import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { usePrefs, SYMBOL } from "@/context/prefs";
import { Level } from "@/lib/budget";
import { passedCount, RULES, strength } from "@/lib/password";

const FILL: Record<Level, string> = { ok: "bg-brand", warn: "bg-warn", over: "bg-over" };
export const TEXT: Record<Level, string> = { ok: "text-mute", warn: "text-warn", over: "text-over" };
/** text-base eksplisit: tanpa ini input mewarisi ukuran font label induknya (text-sm), sehingga ukurannya tidak seragam. */
export const inputCls = "w-full rounded-md border border-line bg-surface px-3 py-3 text-base";

export function Bar({ pct, level = "ok", label }: { pct: number; level?: Level; label: string }) {
  const w = Math.min(Math.max(pct, 0), 100);
  return (
    <div className="h-2 rounded-sm bg-line" role="progressbar" aria-label={label} aria-valuenow={w} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-2 rounded-sm transition-[width] ${FILL[level]}`} style={{ width: `${w}%` }} />
    </div>
  );
}

export function Segmented<T extends string>({ label, value, options, onChange }: {
  label: string; value: T; options: readonly { value: T; label: string }[]; onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-full border border-line bg-surface p-1 text-sm">
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={value === o.value} onClick={() => onChange(o.value)}
          className={`flex-1 rounded-full px-3 py-2 ${value === o.value ? "bg-ink text-ground" : "text-mute"}`}>{o.label}</button>
      ))}
    </div>
  );
}

export function NumField({ label, value, onChange, suffix }: { label: string; value: number; onChange: (n: number) => void; suffix?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-mute">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <input id={id} name={id} type="number" inputMode="numeric" min={0} autoComplete="off" value={value || ""}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))} className={inputCls} />
        {suffix && <span className="text-sm text-mute">{suffix}</span>}
      </div>
    </div>
  );
}

export function MoneyField({ label, value, onChange, hint }: { label: string; value: number; onChange: (n: number) => void; hint?: string }) {
  const id = useId();
  const { currency } = usePrefs();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">{label}</label>
      <div className="mt-1 flex items-center rounded-md border border-line bg-surface focus-within:ring-2 focus-within:ring-brand">
        <span className="pl-3 text-mute" aria-hidden>{SYMBOL[currency]}</span>
        <input id={id} name={id} type="text" inputMode="numeric" autoComplete="off" placeholder="0"
          value={value ? new Intl.NumberFormat("id-ID").format(value) : ""}
          onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")))}
          className="w-full min-w-0 bg-transparent px-2 py-3 text-base focus-visible:outline-none" />
      </div>
      {hint && <p className="mt-1 text-xs text-mute">{hint}</p>}
    </div>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <header className="mb-8 flex items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-mute">{subtitle}</p>}
      </div>
      {children}
    </header>
  );
}

export function PasswordField({ label, name, autoComplete, hint, placeholder, onValueChange }: { label: string; name: string; autoComplete: string; hint?: string; placeholder?: string; onValueChange?: (v: string) => void }) {
  const id = useId();
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">{label}</label>
      <div className="mt-1 flex items-center rounded-md border border-line bg-surface focus-within:ring-2 focus-within:ring-brand">
        <input id={id} name={name} type={show ? "text" : "password"} required autoComplete={autoComplete} spellCheck={false} placeholder={placeholder}
          onChange={(e) => onValueChange?.(e.target.value)}
          aria-describedby={hint ? `${id}-hint` : undefined} className="w-full min-w-0 bg-transparent px-3 py-3 text-base focus-visible:outline-none" />
        <button type="button" onClick={() => setShow((v) => !v)} aria-pressed={show}
          aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"} className="px-3 text-mute">
          {show ? <EyeOff size={20} aria-hidden /> : <Eye size={20} aria-hidden />}
        </button>
      </div>
      {hint && <p id={`${id}-hint`} className="mt-1 text-xs text-mute">{hint}</p>}
    </div>
  );
}

/** Indikator kekuatan kata sandi + daftar syarat yang sudah/belum terpenuhi. */
export function PasswordMeter({ password }: { password: string }) {
  if (!password) return null;
  const s = strength(password);
  return (
    <div className="space-y-2" aria-live="polite">
      <div className="flex items-center gap-3">
        <div className="flex-1"><Bar pct={(passedCount(password) / RULES.length) * 100} level={s.level} label="Kekuatan kata sandi" /></div>
        <span className={`text-sm font-medium ${s.level === "ok" ? "text-brand" : TEXT[s.level]}`}>{s.label}</span>
      </div>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        {RULES.map((r) => (
          <li key={r.id} className={r.test(password) ? "text-brand" : "text-mute"}>{r.test(password) ? "✓" : "○"} {r.label}</li>
        ))}
      </ul>
    </div>
  );
}
