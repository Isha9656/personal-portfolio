/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#0b0f19",
        secondary: "#4f46e5",
        accent: "#0ea5e9",
        cyan: "#0ea5e9",
        dimWhite: "#94a3b8",
        dimBlue: "rgba(79, 70, 229, 0.08)",
        violet: "#6366f1",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-main": "linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)",
        "gradient-card": "linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(14, 165, 233, 0.03))",
      },
      animation: {
        "float": "float-up 4s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      boxShadow: {
        "glow-purple": "0 0 20px rgba(79, 70, 229, 0.15)",
        "glow-cyan": "0 0 20px rgba(14, 165, 233, 0.15)",
        "card": "0 8px 30px rgba(0, 0, 0, 0.2)",
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
};