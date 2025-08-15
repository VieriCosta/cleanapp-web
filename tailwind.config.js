/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // << habilita dark por classe
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#16a34a", foreground: "#ffffff" }
      },
      boxShadow: {
        soft: "0 8px 30px -12px rgba(0,0,0,.15)"
      }
    }
  },
  plugins: [],
};
