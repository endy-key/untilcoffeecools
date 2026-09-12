'use client';

import { useEffect, useCallback } from 'react';

type ImageModalProps = {
    src: string;
    alt: string;
    onClose: () => void;
};

/**
 * 画像を拡大表示するモーダルコンポーネント
 * - オーバーレイ（背景）クリックで閉じる
 * - ESCキーで閉じる
 * - 画像本体のクリックは閉じない（バブリング停止）
 */
export function ImageModal({ src, alt, onClose }: ImageModalProps) {
    // ESCキーが押されたらモーダルを閉じる
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        },
        [onClose]
    );

    useEffect(() => {
        // モーダル表示中はスクロールを無効化
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            // クリーンアップ: スクロール復元とイベントリスナー削除
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={alt}
        >
            {/* 閉じるボタン */}
            <button
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                onClick={onClose}
                aria-label="閉じる"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            {/* 画像コンテナ: クリックイベントのバブリングを止めてオーバーレイが閉じないようにする */}
            <div
                className="relative max-w-[90vw] max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={src}
                    alt={alt}
                    className="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-2xl"
                />
            </div>
        </div>
    );
}
