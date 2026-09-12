'use client';

import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ImageModal } from '@/components/ImageModal';

type PostContentProps = {
    contentHtml: string;
};

type ModalState = {
    src: string;
    alt: string;
} | null;

/**
 * 記事本文を表示するクライアントコンポーネント
 * - dangerouslySetInnerHTML で生成されたHTML内の <img> クリックをイベント委譲で検知
 * - クリックされた画像をモーダルで拡大表示する
 */
export function PostContent({ contentHtml }: PostContentProps) {
    const [modalImage, setModalImage] = useState<ModalState>(null);
    const articleRef = useRef<HTMLElement>(null);

    // イベント委譲: article 内のどの <img> がクリックされたかを判定する
    const handleArticleClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'IMG') {
            const img = target as HTMLImageElement;
            // リンク付き画像もページ遷移させず、クリック時だけ元画像を拡大表示します。
            e.preventDefault();
            setModalImage({
                src: img.dataset.originalSrc || img.src,
                alt: img.alt || '',
            });
        }
    }, []);

    return (
        <>
            <article
                ref={articleRef}
                className="prose max-w-none [&_img]:cursor-zoom-in"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
                onClick={handleArticleClick}
            />

            {/* モーダルが開いている場合のみ表示 */}
            {/* ページ遷移のfilterによる固定位置のずれを避け、画面全体へモーダルを表示します。 */}
            {modalImage && createPortal(
                <ImageModal
                    src={modalImage.src}
                    alt={modalImage.alt}
                    onClose={() => setModalImage(null)}
                />,
                document.body
            )}
        </>
    );
}
