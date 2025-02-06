import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        plugIn: {
          '0%': { transform: 'translateY(-200px)', opacity: '0' },
          '50%': { transform: 'translateY(0)', opacity: '1' },
          '75%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' }
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' }
        },
        zoomIn: {
          '0%': { transform: 'scale(1) translateZ(0)', opacity: '1' },
          '100%': { transform: 'scale(5) translateZ(500px)', opacity: '0' }
        }
      },
      animation: {
        'plugIn': 'plugIn 2s forwards',
        'blink': 'blink 1s infinite',
        'zoomIn': 'zoomIn 1s forwards'
      },
      transitionTimingFunction: {
        'zoom-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    },
  },
  plugins: [],
} satisfies Config;
