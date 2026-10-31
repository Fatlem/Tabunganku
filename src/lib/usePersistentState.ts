"use client";
import { useEffect, useState } from "react";

/** State yang disimpan di localStorage per-key. `ready` false sampai data untuk key aktif termuat. */
export function usePersistentState<T>(key: string | null, initial: T) {
  const [value, setValue] = useState(initial);
  const [loaded, setLoaded] = useState<string | null>(null);

  useEffect(() => {
    if (!key) return setLoaded(null);
    try {
      const raw = localStorage.getItem(key);
      setValue(raw ? { ...initial, ...JSON.parse(raw) } : initial);
    } catch { setValue(initial); }
    setLoaded(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (key && loaded === key) localStorage.setItem(key, JSON.stringify(value));
  }, [key, loaded, value]);

  return [value, setValue, !!key && loaded === key] as const;
}
