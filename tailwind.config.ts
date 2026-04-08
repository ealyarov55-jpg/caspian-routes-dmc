import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          950: "#021a1a",
          900: "#042e2e",
          800: "#065050",
          700: "#0a7070",
          600: "#0d9090",
          500: "#10b0b0",
          400: "#2dd4bf",
          300: "#5eead4",
        },
        gold: {
          DEFAULT: "#c9a84c",
          light: "#e8c97a",
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
        sans:  ["DM Sans", "sans-serif"],
      },
      backgroundImage: {
        "gradient-hero": "linear-gradient(160deg, #021a1a 0%, #065050 50%, #0a5560 100%)",
        "gradient-teal": "linear-gradient(135deg, #042e2e 0%, #0a7070 100%)",
        "gradient-card": "linear-gradient(180deg, transparent 40%, rgba(2,26,26,0.95) 100%)",
      },
      boxShadow: {
        card:  "0 4px 24px rgba(4, 46, 46, 0.12)",
        hover: "0 20px 40px rgba(4, 46, 46, 0.2)",
        glow:  "0 8px 24px rgba(10, 112, 112, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;