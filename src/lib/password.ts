export const RULES = [
  { id: "len", label: "Minimal 8 karakter", test: (p: string) => p.length >= 8 },
  { id: "upper", label: "Huruf besar", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower", label: "Huruf kecil", test: (p: string) => /[a-z]/.test(p) },
  { id: "digit", label: "Angka", test: (p: string) => /\d/.test(p) },
  { id: "symbol", label: "Simbol (! @ # $ …)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
] as const;

export const passedCount = (p: string) => RULES.filter((r) => r.test(p)).length;
/** Kata sandi wajib memenuhi semua aturan, termasuk simbol. */
export const isStrong = (p: string) => passedCount(p) === RULES.length;

export function strength(p: string) {
  const n = passedCount(p);
  return n <= 2 ? { label: "Lemah", level: "over" as const }
    : n < RULES.length ? { label: "Sedang", level: "warn" as const }
    : { label: "Kuat", level: "ok" as const };
}
