import { imageAttributes, readImageManifest } from '@/lib/optimized-images';

type Props = { src: string; alt: string; sizes: string; className?: string };

// 静的生成した画像候補からブラウザーに適切な幅を選ばせ、元のobject-contain表示を維持します。
export function PostThumbnail({ src, alt, sizes, className = '' }: Props) {
    const image = readImageManifest()[src];
    const attributes = image ? imageAttributes(image, 'thumbnail') : { src };
    return (
        // 静的配信用のsrcsetを直接渡すため、Next.jsの画像APIを使わずimgで表示します。
        // eslint-disable-next-line @next/next/no-img-element
        <img
            {...attributes}
            alt={alt}
            sizes={sizes}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-contain ${className}`}
        />
    );
}
