/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom yacht theme colors
        'yacht-navy': '#0F1419',
        'yacht-dark-blue': '#1B2937',
        'yacht-blue': '#2563EB',
        'yacht-ocean': '#0EA5E9',
        'yacht-gold': '#D4A574',
        'yacht-amber': '#F59E0B',
        'yacht-bronze': '#CD7F32',
        'yacht-champagne': '#F7E7CE',
        'yacht-off-white': '#FEFEFE',
        'yacht-cream': '#FEFCF9',
      },
      fontFamily: {
        'yacht-primary': ['Inter', 'system-ui', 'sans-serif'],
        'yacht-heading': ['Inter', 'system-ui', 'sans-serif'],
        'yacht-accent': ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'yacht-subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'yacht-elegant': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'yacht-premium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'yacht-luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'yacht-float': 'yacht-float 6s ease-in-out infinite',
        'yacht-shimmer': 'yacht-shimmer 2s infinite',
      },
      keyframes: {
        'yacht-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'yacht-shimmer': {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
      },
    },
  },
  plugins: [],
}

