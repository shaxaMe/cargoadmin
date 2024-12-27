/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // other files...
    "./node_modules/flowbite/**/*.{js,ts}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
]
}

