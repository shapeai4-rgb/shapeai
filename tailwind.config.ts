import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: { // Используем только extend — это правильно для v4
      colors: {
        accent: {
          DEFAULT: "#10B981",
          mint: "#A7F3D0",
          teal: "#14B8A6",
        },
        neutral: {
          ink: "#0F172A",
          slate: "#475569",
          mist: "#F8FAFC",
          lines: "#E5E7EB",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        headings: ["var(--font-plus-jakarta-sans)", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
      },
      boxShadow: {
        soft: "0 4px 12px 0 rgba(0, 0, 0, 0.05)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(to bottom, #ECFDF5, #FFFFFF)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;