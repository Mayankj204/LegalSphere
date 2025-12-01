/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui"],
      },
      colors: {
        ls: {
          black: "#0A0A0A",
          charcoal: "#141414",
          darkgrey: "#1C1C1C",
          red: "#FF002E",
          redGlow: "rgba(255,0,46,0.18)",
          offwhite: "#F5F5F5",
          muted: "#9A9A9A",
        },
      },
      boxShadow: {
        glow: "0 6px 30px rgba(255,0,46,0.12), 0 0 40px rgba(255,0,46,0.06)",
        card: "0 6px 20px rgba(0,0,0,0.55)",
      },
      borderRadius: {
        "lg-2": "14px",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg,#FF002E 0%, rgba(255,0,46,0.6) 100%)",
      },
      keyframes: {
        floaty: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
          "100%": { transform: "translateY(0px)" },
        },
        slowSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        driftX: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(40px)" },
          "100%": { transform: "translateX(0)" },
        },
        pulseRed: {
          "0%": { boxShadow: "0 0 0 0 rgba(255,0,46,0.25)" },
          "70%": { boxShadow: "0 0 40px 20px rgba(255,0,46,0.03)" },
          "100%": { boxShadow: "0 0 0 0 rgba(255,0,46,0)" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        slowSpin: "slowSpin 40s linear infinite",
        driftX: "driftX 18s ease-in-out infinite",
        pulseRed: "pulseRed 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
