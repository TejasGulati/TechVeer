/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'bg-gradient-to-br',
    'from-[#6366F1]',
    'via-[#3B82F6]',
    'to-[#06B6D4]',
    'from-indigo-600',
    'to-blue-500',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
