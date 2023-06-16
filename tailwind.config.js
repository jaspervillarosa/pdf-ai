/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: [
    './pages/**/*.{js,jsx,ts,tsx}', 
    './components/**/*.{js,jsx,ts,tsx}', 
    './styles/**/*.css'
  ],
  // content: [
  //   './pages/**/*.{js,ts,jsx,tsx,mdx}',
  //   './components/**/*.{js,ts,jsx,tsx,mdx}',
  //   './app/**/*.{js,ts,jsx,tsx,mdx}',
  // ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'primary-orange': '#FF5722',
      }
    },
  },
  plugins: [],
}