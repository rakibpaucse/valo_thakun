import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1320px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Brand: deep navy "ink" + periwinkle "iris" + lavender mist + canvas
        ink: {
          50: "#f3f5fb",
          100: "#e6eaf6",
          200: "#c2cce8",
          300: "#9caad6",
          400: "#5e72b3",
          500: "#324593",
          600: "#22337a",
          700: "#1a296a",
          800: "#15225a",
          900: "#122056",  // primary text — Pantone 2766 C
          950: "#0a1238",
        },
        iris: {
          50: "#f1f2fd",
          100: "#e6e7fb",
          200: "#d1d3f7",
          300: "#b1b6f1",
          400: "#8a90e7",
          500: "#5b65dc",  // accent — Pantone 2726 C
          600: "#4a52cb",
          700: "#3f43b5",
          800: "#363b93",
          900: "#303775",
          950: "#1d2046",
        },
        mist: {
          50: "#fafafd",   // canvas
          100: "#f4f5fc",
          200: "#eeeffd",  // mist (secondary surfaces)
          300: "#dfe1f7",
          400: "#c5c8ed",
          500: "#a4a9df",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        brand: ["var(--font-brand)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tightx: "-0.02em",
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(18 32 86 / 0.04), 0 8px 24px -12px rgb(18 32 86 / 0.10)",
        lift: "0 4px 12px -4px rgb(18 32 86 / 0.08), 0 16px 40px -12px rgb(18 32 86 / 0.14)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1)",
        shimmer: "shimmer 1.6s linear infinite",
        float: "float 4s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
