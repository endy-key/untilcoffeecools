# untilcoffeecools

This is a personal blog project built with Next.js.

☕️ **Purpose**  
This repository is for learning React and practicing individual blog development.  
It's part of my personal journey to explore frontend development, AWS hosting, and building a minimal, meaningful blog.

## 記事に画像を追加する

1. 元画像（PNG・JPEG・WebP）を `public/記事の日付/` に保存します。例: `public/20260915/keyboard.jpg`。
2. Markdown本文に `![自作キーボードの全体写真](/20260915/keyboard.jpg)` と書きます。
3. サムネイルにも使う場合は記事冒頭のfrontmatterに `thumbnail: "/20260915/keyboard.jpg"` を指定します。
4. 通常どおり公開します。`npm run build` の前処理が表示用WebPとOGP用JPEGを生成し、S3へ元画像と一緒に配信します。

手動のリサイズや変換は不要です。元画像は保持され、本文でクリックしたときだけ拡大用に読み込まれます。表示用画像は縦横比を維持し、トリミング・拡大生成はしません。変換すると容量が増える場合は元画像を使います。

ローカルでは最初に `npm ci`、続けて `npm run dev` を実行します。開発サーバーの起動後に画像を追加・変更した場合は、別のターミナルで `npm run images:generate` を実行してブラウザーを再読み込みするか、開発サーバーを再起動してください。

パスは大文字・小文字まで実ファイル名と一致させてください。空白は `%20` と書けます。存在しない画像やファイル名の大小文字の不一致は、記事名とパスを表示してビルドを停止します。Markdownの参照形式・リンク付き画像・HTMLのimgにも対応します。外部URL・SVG・アニメーション画像は変換せずそのまま表示します。

生成物は `public/_generated/images/` に保存され、Gitには追加しません。このフォルダを元画像置き場として使用しないでください。ファイル名には元画像と変換設定のハッシュが入るため、画像差し替え時にも新しいURLになります。ヒーロー・アバター・Coffee Mapの外部画像はこの処理の対象外です。

検証コマンド: `node --test scripts/image-pipeline.test.mjs`、`npm run build`、`node scripts/verify-image-export.mjs`。
