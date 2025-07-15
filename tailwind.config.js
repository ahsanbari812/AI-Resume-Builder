module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#3b82f6', // Tailwind blue-500
        },
      },
    },
  },
  plugins: [],
}; 