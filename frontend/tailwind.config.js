/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // هذا السطر يخبر Tailwind بالبحث في كل ملفات React
  ],
  theme: {
    extend: {
      colors: {
        // يمكنك إضافة ألوان مخصصة هنا إذا أردتِ مطابقة التصميم بدقة
        customTeal: '#479e8d',
        customBlue: '#6ea0ad',
      },
    },
  },
  plugins: [],
}