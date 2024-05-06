/** @type {import('tailwindcss').Config} */
export default {
  content: [
    '*.html',
    'src/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        gotham: 'gotham',
        gothamXL: 'gothamXL',
        gothamBold: 'gothamBold',
      }
    },
  },
  plugins: [
  ],
}

