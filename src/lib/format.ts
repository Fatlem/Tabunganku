export const monthKey = (d: string) => d.slice(0, 7);
export const today = () => new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD, zona lokal
export const monthLabel = (key: string) =>
  new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date(`${key}-01`));

const ym = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
/** Bulan (YYYY-MM) n bulan dari sekarang. */
export const monthOffset = (n: number) => { const d = new Date(); d.setMonth(d.getMonth() + n, 1); return ym(d); };
/** Jumlah bulan dari sekarang sampai tenggat (0 jika kosong/sudah lewat). */
export function monthsUntil(deadline?: string) {
  if (!deadline) return 0;
  const [y, m] = deadline.split("-").map(Number);
  const now = new Date();
  return Math.max((y - now.getFullYear()) * 12 + (m - 1 - now.getMonth()), 0);
}
