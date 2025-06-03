'use client';
import { useState } from 'react';

export default function PlaygroundPage() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    // Tailwind CSSのダークモードを有効にするには、通常<html>タグに 'dark' クラスを付与しますが、
    // このページ内での実験として、コンテナ要素のスタイルを直接変更します。
    const mainBgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
    const mainTextColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
    const proseClasses = isDarkMode ? 'prose-invert' : '';

    return (
        <main className={`mx-auto p-6 min-h-screen transition-colors duration-300 ${mainBgColor} ${mainTextColor}`}>
            <div className="flex flex-col items-center mb-8"> {/* 要素を縦に並べて中央揃えに変更 */}
                <h2 className={`text-3xl font-bold mb-4 text-center`}>Playground</h2> {/* タイトルを中央揃えにし、下にマージンを追加 */}
                <button
                    onClick={toggleDarkMode}
                    className={`px-4 py-2 rounded font-semibold shadow-md transition-all duration-300
                        ${isDarkMode
                            ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 focus:ring-2 focus:ring-yellow-500'
                            : 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-2 focus:ring-gray-500'
                        }`}
                >
                    {isDarkMode ? 'ライトモードへ' : 'ダークモードへ'}
                </button>
            </div>

            <div className={`prose lg:prose-xl ${proseClasses} max-w-none`}>
                <h3>ダークモード切り替え実験</h3>
                <p>
                    このボタンで、このページ（Playground）の見た目をライトモードとダークモードで切り替えることができます。<br />
                    Tailwind CSSの <code>prose</code> クラスと、ダークモード用の <code>prose-invert</code> を使用して、テキストコンテンツのスタイルも調整しています。
                </p>
                <p>
                    現在のモード: <strong>{isDarkMode ? 'ダークモード' : 'ライトモード'}</strong>
                </p>

                <h4>コードブロックの表示テスト</h4>
                <pre><code>{`function greet(name) {\n  return \`Hello, \${name}!\`;\n}`}</code></pre>
            </div>
        </main>
    );
}