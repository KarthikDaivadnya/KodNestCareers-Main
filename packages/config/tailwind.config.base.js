/**
 * @kodnest/config/tailwind
 * Base Tailwind configuration shared by all KodNestCareers apps.
 * 
 * Usage in app tailwind.config.js:
 *   import base from '@kodnest/config/tailwind'
 *   export default { ...base, content: ['./src/**\/*.{js,jsx}'] }
 */
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // KodNest brand palette
        brand: {
          50:  'hsl(245, 58%, 97%)',
          100: 'hsl(245, 58%, 92%)',
          200: 'hsl(245, 58%, 83%)',
          300: 'hsl(245, 58%, 72%)',
          400: 'hsl(245, 58%, 62%)',
          500: 'hsl(245, 58%, 51%)',
          600: 'hsl(245, 58%, 43%)',
          700: 'hsl(245, 58%, 35%)',
          800: 'hsl(245, 58%, 26%)',
          900: 'hsl(245, 58%, 18%)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      borderRadius: {
        xl:  '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}
