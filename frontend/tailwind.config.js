/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Instrument Serif", "serif"],
        body: ["Space Grotesk", "sans-serif"],
      },
      colors: {
        ink: "#18230F",
        moss: "#27391C",
        clay: "#5A6E3A",
        sand: "#F5F1E6",
        ember: "#C84C09",
        slate: "#111827",
        mist: "#E5EEF8",
        ocean: "#0F172A",
        cyan: "#3AAED8",
      },
      backgroundImage: {
        "hero-wash":
          "radial-gradient(circle at 20% 20%, rgba(200, 76, 9, 0.16), transparent 45%), radial-gradient(circle at 75% 0%, rgba(39, 57, 28, 0.2), transparent 40%), linear-gradient(160deg, #f5f1e6 0%, #ede6d6 60%, #e4ddcb 100%)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 500ms ease-out both",
      },
    },
  },
  plugins: [],
};
