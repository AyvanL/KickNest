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
        primary: "#E96B86",
        lavender: "#9B86D9",
        peach: "#F6B37F",
        yellowSoft: "#F4C76E",
        mint: "#7BC8A4",
        background: "#FFF8F3",
        textMain: "#332A35",
        textSecondary: "#7D727B",
        borderSoft: "#F0E3DE",
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
