import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "teo-teal-dark": "var(--teal-dark)",
        "teo-teal": "var(--teal)",
        "teo-teal-pale": "var(--teal-pale)",
        "teo-teal-tint": "var(--teal-tint)",
        "teo-teal-ghost": "var(--teal-ghost)",
        "teo-gold-dark": "var(--gold-dark)",
        "teo-gold": "var(--gold)",
        "teo-dark": "var(--dark)",
        "teo-text-m": "var(--text-m)",
        "teo-text-l": "var(--text-l)",
      },
      fontFamily: {
        headline: ['"Baloo 2"', "sans-serif"],
        body: ['"DM Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
