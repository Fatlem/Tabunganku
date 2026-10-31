export const SETTINGS = [
  { slug: "profil", title: "Profil" },
  { slug: "akun", title: "Akun" },
  { slug: "kata-sandi", title: "Ubah kata sandi" },
  { slug: "preferensi", title: "Preferensi" },
  { slug: "mata-uang", title: "Mata uang tampilan" },
  { slug: "bantuan", title: "Bantuan" },
] as const;

export type SettingsSlug = (typeof SETTINGS)[number]["slug"];
export const isSettingsSlug = (s: string): s is SettingsSlug => SETTINGS.some((x) => x.slug === s);
export const settingsTitle = (slug: SettingsSlug) => SETTINGS.find((x) => x.slug === slug)!.title;
