import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/design-system/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
      },
      colors: {
        pulse: {
          canvas: "#F7F9F5",
          surface: "#FFFFFF",
          border: "#E6ECE2",
          primary: "#8CBA51",
          lime: "#DEFF8B",
          ink: "#141D14",
          muted: "#5A6B5A",
          peach: "#FBCEB5",
          peachText: "#3D1E10",
          coral: "#FF5D6C",
        },
      },
      borderRadius: {
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};

export default config;
