import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-inter)"],
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: "var(--font-inter)",
            h1: {
              fontFamily: "var(--font-inter)",
              fontWeight: "700",
            },
            h2: {
              fontFamily: "var(--font-inter)",
              fontWeight: "600",
            },
            h3: {
              fontFamily: "var(--font-inter)",
              fontWeight: "600",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config; 