/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: "#fdf8f3",
          100: "#f9ede0",
          200: "#f2d9be",
          300: "#e9c093",
          400: "#dea066",
          500: "#d4844a",
          600: "#c56e3f",
          700: "#a45636",
          800: "#854632",
          900: "#6c3b2b",
        },
        uet: {
          50: "#e8f4fc",
          100: "#d1e9f9",
          200: "#a3d3f3",
          300: "#75bded",
          400: "#47a7e7",
          500: "#1991e1",
          600: "#1474b4",
          700: "#0f5787",
          800: "#0a3a5a",
          900: "#051d2d",
        },
      },
    },
  },
  plugins: [],
};
