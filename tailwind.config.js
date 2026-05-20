/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: "#F36F8F",
        lavender: "#8F7AD8",
        peach: "#FFB86B",
        yellowSoft: "#FFC96B",
        mint: "#6FD2A7",
        background: "#FFF7F2",
        textMain: "#2F2933",
        textSecondary: "#776D78",
        borderSoft: "#EFE1DC",
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
