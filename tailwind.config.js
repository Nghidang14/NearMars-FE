module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        "85vh": "85vh"
      },
      colors: {
        'primary': "#FFFF00",
        "secondary": "#FFFFFF",
        "background": "#000000",
        "backgroundLight": "#111010",
        "imageLight": "#FF00E5"
      },
      animation: {
        blob: "blob 7s infinite"
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "tranlate(0px, 0px) scale(1)",
          },
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
    require('@tailwindcss/line-clamp'),
  ],
}
