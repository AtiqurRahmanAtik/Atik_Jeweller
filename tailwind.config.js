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

        // --- NEW Jewellery Brand Colors ---
        'jewel-gold': {
          100: '#FDF3D8', // Very light gold
          300: '#F8E28B', // Light highlight
          500: '#D4AF37', // STANDARD GOLD (Main)
          700: '#B49028', // Dark Antique Gold
          900: '#8A6E1E', // Deep Bronze
        },
        'jewel-black': '#050505', // Richer, deeper black than standard hex #000
      },
      fontFamily: {
        primary: ['Poppins', 'sans-serif'],
        secondary: ['Montserrat', 'sans-serif'],
        // Added serif font for the Luxury look
        serif: ['Playfair Display', 'Cinzel', 'serif'], 
      },
      fontSize: {
        'headline': ['96pt', { fontWeight: '900' }],
        'subheader': ['64pt', { fontWeight: '600' }],
        'body': ['20pt', { fontWeight: '400' }],
        'btn-text': ['24pt', { fontWeight: '600' }],
      }
    }, // <-- FIXED: Removed the extra closing brace that was below here
  },
  plugins: [require("daisyui")],
  daisyui: {
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

        // --- NEW THEME: SmartJeweler ---
        jewellery: {
          "primary": "#D4AF37",      // Gold
          "secondary": "#B49028",    // Darker Gold
          "accent": "#F8E28B",       // Light Gold Highlight
          "neutral": "#050505",      // Deep Black bg
          "base-100": "#000000",     // Main background
          "base-content": "#D4AF37", // Text color (Gold on Black)
          "info": "#147bff",
          "success": "#ccc141",
          "warning": "#cd3c84",
          "error": "#b91c1c",
        },
      },
      "light",
      "dark"
    ],
  },
};