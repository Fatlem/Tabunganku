import type { Config } from "tailwindcss";

const v = (n: string) => `rgb(var(--${n}) / <alpha-value>)`;

export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ground: v("ground"), surface: v("surface"), ink: v("ink"), mute: v("mute"),
        line: v("line"), brand: v("brand"), warn: v("warn"), over: v("over"), overSoft: v("overSoft") },
      fontFamily: { sans: ["var(--font-jakarta)", "system-ui", "sans-serif"] },
    },
  },
} satisfies Config;
