/** @type {import('tailwindcss').Config} */
export default {
  // This line MUST be inside the main config object
  darkMode: 'class', 
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // You can add your custom Ecomet colors here later if you want
    },
  },
  plugins: [],
}