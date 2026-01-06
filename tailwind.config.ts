import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default {
  // Theme configuration is now in CSS via @theme directive in tailwind.css
  // Only keeping plugins here for Tailwind v4
  plugins: [animate],
} satisfies Config;
