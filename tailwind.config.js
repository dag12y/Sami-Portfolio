/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        cream: '#F8F7F4',
        beige: '#F3F1ED',
        taupe: '#9B8B7E',
        sage: '#C4D7C4',
        'slate-light': '#E8E6E1',
        'text-dark': '#2C2A27',
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out',
        'fade-in-up': 'fade-in-up 0.8s ease-out',
        'slide-in': 'slide-in 0.6s ease-out',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'elegant': '0 4px 24px rgba(0, 0, 0, 0.08)',
        'elevated': '0 12px 48px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
