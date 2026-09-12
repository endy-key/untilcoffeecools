import fs from 'node:fs';
import path from 'node:path';
import type { Root, Element } from 'hast';

type ImageVariant = { src: string; width: number; height: number; bytes: number };
type OptimizedImage = {
    original: ImageVariant;
    variants: Partial<Record<'thumbnail' | 'body' | 'og', ImageVariant[]>>;
};
type ImageManifest = Record<string, OptimizedImage>;

// 生成済みの対応表を読むだけにし、Next.jsのレンダリング中には画像変換を行いません。
export function readImageManifest(): ImageManifest {
    const file = path.join(process.cwd(), 'public/_generated/images/manifest.json');
    if (!fs.existsSync(file)) throw new Error('画像対応表がありません。npm run images:generate を実行してください。');
    return JSON.parse(fs.readFileSync(file, 'utf8')) as ImageManifest;
}

// サーバー側のサムネイルと本文で同じsrcsetの組み立て方を使います。
export function imageAttributes(image: OptimizedImage, profile: 'thumbnail' | 'body') {
    const variants = image.variants[profile] ?? [image.original];
    const fallback = variants.find((variant) => variant.width >= 640) ?? variants[variants.length - 1];
    return {
        src: fallback.src,
        srcSet: variants.map((variant) => `${variant.src} ${variant.width}w`).join(', '),
        width: image.original.width,
        height: image.original.height,
    };
}

// 記事の共有画像だけを最適化し、画像未設定時の共通OGPには影響させません。
export function optimizedOgImage(src: string): string {
    return readImageManifest()[src]?.variants.og?.[0]?.src ?? src;
}

// HTMLツリー上の画像だけを書き換え、コード例内の画像記法やリンク先は維持します。
export function rehypeOptimizedImages() {
    const manifest = readImageManifest();
    return (tree: Root) => {
        function walk(node: Root | Element | Root['children'][number]) {
            if (node.type === 'element' && node.tagName === 'img') {
                const src = String(node.properties.src ?? '');
                const image = manifest[src];
                if (image?.variants.body) {
                    Object.assign(node.properties, imageAttributes(image, 'body'), {
                        sizes: '(min-width: 1152px) 824px, (min-width: 1024px) calc(100vw - 328px), (min-width: 768px) calc(100vw - 64px), calc(100vw - 32px)',
                        loading: 'lazy',
                        decoding: 'async',
                        'data-original-src': image.original.src,
                    });
                }
            }
            if ('children' in node) for (const child of node.children) walk(child);
        }
        walk(tree);
    };
}
