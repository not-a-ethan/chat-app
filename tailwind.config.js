import {nextui} from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    // ...
    // make sure it's pointing to the ROOT node_module
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    light: {
      
    },
    dark: {
      primary: {
        background: "#1C2B4F",
        foreground: "#78B6E2"
      }
    },
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui({
    prefix: "nextui", // prefix for themes variables
    addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
    defaultTheme: "light", // default theme from the themes object
    defaultExtendTheme: "light", // default theme to extend on custom themes
    layout: {}, // common layout tokens (applied to all themes)
    themes: {
      /*
      light: {
        colors: {
          background: "#338ef7", // or DEFAULT
          foreground: "#27272a", // or 50 to 900 DEFAULT
          primary: {
            //... 50 to 900
            foreground: "#338ef7",
            DEFAULT: "#006FEE",
          },
          secondary: {
            colors: {
              foreground: "#005BC4"
            }
          }
          // ... rest of the colors
        },
      },
      dark: {
        colors: {
          background: "#002e62", // or DEFAULT
          foreground: "#ECEDEE", // or 50 to 900 DEFAULT
          primary: {
            //... 50 to 900
            foreground: "#FFFFFF",
            DEFAULT: "#002e62",
          },
        },
      }
      */
    }
  })]
}

export default config;