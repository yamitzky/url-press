import type { Config } from "tailwindcss"
const { nextui } = require("@nextui-org/react")

export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {}
  },
  darkMode: 'class',
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: '#0E8AAA'
          }
        }
      },
      dark: {
        colors: {
          primary: {
            DEFAULT: '#053B48'
          }
        }
      }
    }
  })]
} satisfies Config
