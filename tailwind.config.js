/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', 
  
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#66cc00",
        secondary: "#336600",

      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {

    theme: "mytheme", 
    darkTheme: "mytheme", 
    

    themes: [
      {
        mytheme: {
          primary: "#66cc00",
          secondary: "#336600",
          accent: "#37cdbe", 
          neutral: "#3d4451",
          "base-100": "#ffffff", 
          "base-content": "#1f2937",

        },
      },

      "light",
      "dark"
    ],
  },
};