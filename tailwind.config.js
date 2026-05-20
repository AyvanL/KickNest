/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF8FA3",
        lavender: "#B9A7E5",
        peach: "#FFD6B3",
        yellowSoft: "#FFC96B",
        mint: "#BDE9D3",
        background: "#FFF9F5",
        textMain: "#4A4A4A",
        textSecondary: "#7A7A7A",
        borderSoft: "#F2E9E4",
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'reveal': 'reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'expand': 'expand 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards',
      },
      keyframes: {
        reveal: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        expand: {
          '0%': { width: '0' },
          '100%': { width: '100px' },
        }
      }
    },
  },
  plugins: [],
}
