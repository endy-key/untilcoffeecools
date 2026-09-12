import { generateImages } from './image-pipeline.mjs';

// CLIとビルド前処理で同じ生成処理を使い、失敗時は公開を停止します。
try {
    const manifest = await generateImages();
    console.log(`画像最適化: ${Object.keys(manifest).length}枚の対応表を生成しました。`);
    for (const [url, entry] of Object.entries(manifest)) {
        const variants = entry.variants.thumbnail ?? entry.variants.body;
        if (!variants) continue;
        const largest = variants.at(-1);
        console.log(`${url}: ${entry.original.bytes} → ${largest.bytes} bytes (${Math.round((1 - largest.bytes / entry.original.bytes) * 100)}%削減、幅${largest.width}px)`);
    }
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
