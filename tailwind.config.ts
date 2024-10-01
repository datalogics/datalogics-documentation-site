import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default {
  darkMode: 'selector',
  safelist: ['dark'],
  prefix: '',
  content: [],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        'border': 'hsl(var(--border))',
        'input': 'hsl(var(--input))',
        'ring': 'hsl(var(--ring))',
        'background': 'hsl(var(--background))',
        'foreground': 'hsl(var(--foreground))',
        'primary': {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        'secondary': {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        'destructive': {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        'muted': {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        'accent': {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        'popover': {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        'card': {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'green': {
          50: '#EFFDF5', // RGBA: rgba(239, 253, 245, 1), HSLA: hsla(144, 80%, 96%, 1)
          100: '#D9FBE8', // RGBA: rgba(217, 251, 232, 1), HSLA: hsla(144, 80%, 92%, 1)
          200: '#B3F5D1', // RGBA: rgba(179, 245, 209, 1), HSLA: hsla(144, 80%, 83%, 1)
          300: '#75EDAE', // RGBA: rgba(117, 237, 174, 1), HSLA: hsla(144, 80%, 69%, 1)
          400: '#00DC82', // RGBA: rgba(0, 220, 130, 1), HSLA: hsla(144, 100%, 43%, 1)
          500: '#00C16A', // RGBA: rgba(0, 193, 106, 1), HSLA: hsla(144, 100%, 38%, 1)
          600: '#00A155', // RGBA: rgba(0, 161, 85, 1), HSLA: hsla(144, 100%, 32%, 1)
          700: '#007F45', // RGBA: rgba(0, 127, 69, 1), HSLA: hsla(144, 100%, 25%, 1)
          800: '#016538', // RGBA: rgba(1, 101, 56, 1), HSLA: hsla(144, 98%, 20%, 1)
          900: '#0A5331', // RGBA: rgba(10, 83, 49, 1), HSLA: hsla(144, 78%, 18%, 1)
          950: '#052e16', // RGBA: rgba(5, 46, 22, 1), HSLA: hsla(144, 80%, 10%, 1)
        },
        'midnight': {
          50: '#ecf8ff', // RGBA: rgba(236, 248, 255, 1), HSLA: hsla(204, 100%, 96%, 1)
          100: '#d5edff', // RGBA: rgba(213, 237, 255, 1), HSLA: hsla(204, 100%, 92%, 1)
          200: '#b4e2ff', // RGBA: rgba(180, 226, 255, 1), HSLA: hsla(204, 100%, 85%, 1)
          300: '#81d1ff', // RGBA: rgba(129, 209, 255, 1), HSLA: hsla(204, 100%, 75%, 1)
          400: '#45b5ff', // RGBA: rgba(69, 181, 255, 1), HSLA: hsla(204, 100%, 63%, 1)
          500: '#1b92ff', // RGBA: rgba(27, 146, 255, 1), HSLA: hsla(204, 100%, 55%, 1)
          600: '#0370ff', // RGBA: rgba(3, 112, 255, 1), HSLA: hsla(214, 100%, 51%, 1)
          700: '#0059f8', // RGBA: rgba(0, 89, 248, 1), HSLA: hsla(224, 100%, 49%, 1)
          800: '#0547c8', // RGBA: rgba(5, 71, 200, 1), HSLA: hsla(224, 95%, 40%, 1)
          900: '#0b409d', // RGBA: rgba(11, 64, 157, 1), HSLA: hsla(224, 86%, 33%, 1)
          950: '#051026', // RGBA: rgba(5, 16, 38, 1), HSLA: hsla(224, 77%, 8%, 1)
        },
        'dl-blue': '#0C70F2', // RGBA: rgba(12, 112, 242, 1), HSLA: hsla(212, 91%, 50%, 1)
        // 'primary-focus': '#063573', // RGBA: rgba(6, 53, 115, 1), HSLA: hsla(212, 90%, 24%, 1)
        // 'secondary': '#F224AC', // RGBA: rgba(242, 36, 172, 1), HSLA: hsla(320, 88%, 55%, 1)
        'dl-orange': '#F2A20C', // RGBA: rgba(242, 162, 12, 1), HSLA: hsla(36, 91%, 50%, 1)
        // 'grey': '#636363', // RGBA: rgba(99, 99, 99, 1), HSLA: hsla(0, 0%, 39%, 1)
        // 'neutral': '#063573', // RGBA: rgba(6, 53, 115, 1), HSLA: hsla(212, 90%, 24%, 1)
        // 'base-100': '#051026', // RGBA: rgba(5, 16, 38, 1), HSLA: hsla(224, 77%, 8%, 1)
        // 'base-content': '#021733', // RGBA: rgba(2, 23, 51, 1), HSLA: hsla(220, 77%, 8%)
        // 'info': '#FFFFFF', // RGBA: rgba(255, 255, 255, 1), HSLA: hsla(0, 0%, 100%, 1)
        // 'success': '#36D399', // RGBA: rgba(54, 211, 153, 1), HSLA: hsla(158, 67%, 52%, 1)
        // 'warning': '#F2D424', // RGBA: rgba(242, 212, 36, 1), HSLA: hsla(50, 89%, 55%, 1)
        // 'error': '#F23924', // RGBA: rgba(242, 57, 36, 1), HSLA: hsla(6, 88%, 55%, 1)
        'primary-text-content': '#636363', // RGBA: rgba(99, 99, 99, 1), HSLA: hsla(0, 0%, 39%, 1)
        'primary-focus': '#063573', // RGBA: rgba(6, 53, 115, 1), HSLA: hsla(212, 90%, 24%, 1)
        'base-content': '#021733', // RGBA: rgba(2, 23, 51, 1), HSLA: hsla(212, 92%, 10%, 1)
        'primary-content': '#A8CDFB', // RGBA: rgba(168, 205, 251, 1), HSLA: hsla(212, 89%, 82%, 1)
      },

      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-in-out',
        'collapsible-up': 'collapsible-up 0.2s ease-in-out',
      },
    },
  },

  plugins: [animate],
} satisfies Config;
