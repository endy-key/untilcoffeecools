// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-noto-sans-jp)', ...defaultTheme.fontFamily.sans], // デフォルトフォント
                caveat: ['var(--font-caveat)'], // Caveatフォントはそのまま
            },
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
    ],
}