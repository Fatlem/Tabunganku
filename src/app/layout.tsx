import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  title: "Tabunganku",
  description: "Catat, alokasikan, dan pantau keuangan pribadi.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "Tabunganku", statusBarStyle: "default" },
  icons: { icon: "/icon-512.png", apple: "/icon-192.png" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f4f0" },
    { media: "(prefers-color-scheme: dark)", color: "#111211" },
  ],
  width: "device-width", initialScale: 1, viewportFit: "cover",
};

/** Terapkan tema sebelum paint agar tidak berkedip. */
const THEME_BOOT = `try{var p=JSON.parse(localStorage.getItem("tabunganku:prefs")||"{}"),t=p.theme||"system";if(t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={jakarta.variable} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} /></head>
      <body className="font-sans"><Providers>{children}</Providers></body>
    </html>
  );
}
