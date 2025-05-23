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
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        // proseクラス内のpreタグからTailwind Typographyのデフォルトスタイルを調整
                        'pre': {
                            backgroundColor: 'transparent', // highlight.jsのテーマに背景色を任せる
                            color: 'inherit',             // highlight.jsのテーマに文字色を任せる
                            padding: '0',                 // highlight.jsのテーマにパディングを任せる
                            // 必要に応じて、margin, borderRadiusなども調整
                        },
                        // proseクラス内のインラインコード (バッククォート1つで囲むもの) のスタイル
                        'code': {
                            // こちらはhighlight.jsのテーマとは別に、インラインコード用のスタイルを設定しても良い
                            // 例: backgroundColor: theme('colors.gray.200'), padding: '0.2em 0.4em', borderRadius: '0.25rem'
                            // もしインラインコードもhighlight.jsで処理するなら、ここも調整が必要かもしれない
                        },
                        // インラインコードの前後のバッククォートを非表示にする (多くのテーマでは不要だが、念のため)
                        'code::before': {
                            content: 'none',
                        },
                        'code::after': {
                            content: 'none',
                        },
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
    ],
}