/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
    theme: {
    extend: {
          colors: {
          primary: '#1A227f',
          secondary:'#384FFE',
          lighBlue:'#E3f2fd',
          darkgrey:'#1F2937',
          grayBorder:'#E5E7EB',
          graytext:"#6b7288",
          success:"#18B981",
          error :'#Ef4444'
        },
        },
      },
  plugins: [],
}

