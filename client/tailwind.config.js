/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        "brand-bg": "#f8fafc",
        "brand-dark": "#0f172a",
        "brand-light": "#f1f5f9",
      },
      textColor: {
        "brand-dark": "#0f172a",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        "gradient-hero": "linear-gradient(135deg, #4f46e5 0%, #06b6d4 50%, #7c3aed 100%)",
        "gradient-subtle": "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "soft-sm": "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
        "soft-md": "0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -1px rgba(15, 23, 42, 0.06)",
        "soft-lg": "0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)",
        "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
}
