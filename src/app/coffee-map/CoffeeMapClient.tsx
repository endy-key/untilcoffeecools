'use client';

import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';
import styles from './coffee-map.module.css';
import type { CoffeeReview } from './coffeeReviews';

type PlotPoint = {
    review: CoffeeReview;
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
};

type PointStyle = CSSProperties & {
    '--point-x': string;
    '--point-y': string;
    '--point-offset-x': string;
    '--point-offset-y': string;
};

const tasteLabels = [
    '酸味・強',
    '酸味・中',
    '酸味・弱',
    'どちらともいえない',
    '苦味・弱',
    '苦味・中',
    '苦味・強',
] as const;

const occasionLabels = [
    '日常',
    '日常に近い',
    'やや日常',
    'どちらともいえない',
    'ややご褒美',
    'ご褒美に近い',
    'ご褒美',
] as const;

const scaleSteps = 7;

const collisionOffsets = [
    [0, 0],
    [-14, -10],
    [14, 10],
    [14, -10],
    [-14, 10],
] as const;

// 1〜7の評価を8〜92%へ変換し、両端の評価でもマップを広く使います。
function axisPosition(value: number) {
    return 8 + ((value - 1) / (scaleSteps - 1)) * 84;
}

// 同じ座標の記録だけを少しずらし、複数の商品を個別に選択できる位置へ配置します。
function createPlotPoints(reviews: CoffeeReview[]): PlotPoint[] {
    const coordinateCounts = new Map<string, number>();

    return reviews.map((review) => {
        const coordinateKey = `${review.tasteAxis}-${review.occasionAxis}`;
        const collisionIndex = coordinateCounts.get(coordinateKey) ?? 0;
        coordinateCounts.set(coordinateKey, collisionIndex + 1);

        const baseOffset = collisionOffsets[collisionIndex % collisionOffsets.length];
        const offsetScale = Math.floor(collisionIndex / collisionOffsets.length) + 1;

        return {
            review,
            x: axisPosition(review.tasteAxis),
            y: 100 - axisPosition(review.occasionAxis),
            offsetX: baseOffset[0] * offsetScale,
            offsetY: baseOffset[1] * offsetScale,
        };
    });
}

// 金額は日本語表記へ揃え、価格カードと100g換算の両方で再利用します。
function formatYen(value: number) {
    return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
        maximumFractionDigits: 0,
    }).format(value);
}

// 5段階評価を視覚表示しつつ、読み上げでは重複しないよう星自体は装飾として扱います。
function FavoriteStars({ value }: { value: number }) {
    return (
        <span className={styles.stars} aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
                <span key={index} className={index < value ? styles.starActive : styles.starMuted}>★</span>
            ))}
        </span>
    );
}

function SevenStepScale({
    startLabel,
    endLabel,
    value,
    valueLabel,
}: {
    startLabel: string;
    endLabel: string;
    value: number;
    valueLabel: string;
}) {
    return (
        <div
            className={styles.axisScale}
            role="img"
            aria-label={`${startLabel}から${endLabel}: ${valueLabel}（7段階の${value}）`}
        >
            <div className={styles.scaleEndpoints} aria-hidden="true">
                <span>{startLabel}</span>
                <span>{endLabel}</span>
            </div>
            <div className={styles.scaleBars} aria-hidden="true">
                {Array.from({ length: scaleSteps }, (_, index) => (
                    <span
                        key={index}
                        className={`${styles.scaleBar} ${index + 1 === value ? styles.scaleBarActive : ''}`}
                    />
                ))}
            </div>
        </div>
    );
}

// 選択中の一杯について、価格・軸・お気に入り度をひとまとめにして表示します。
function SelectedCoffeeCard({ review }: { review: CoffeeReview }) {
    const favoriteLabel = review.favorite === null
        ? 'お気に入り度 未設定'
        : `お気に入り度 ${review.favorite} / 5`;

    return (
        <section className={styles.detailCard} aria-labelledby="selected-coffee-heading">
            <div className={styles.cardHeader}>
                <div>
                    <p className={styles.cardKicker}>Selected cup</p>
                    <h2 id="selected-coffee-heading">{review.name}</h2>
                </div>
                <div className={styles.favoriteValue} aria-label={favoriteLabel}>
                    {review.favorite === null ? (
                        <strong className={styles.favoriteUnset}>未設定</strong>
                    ) : (
                        <>
                            <FavoriteStars value={review.favorite} />
                            <strong>{review.favorite}.0</strong>
                        </>
                    )}
                </div>
            </div>

            {review.imageUrl !== null && review.purchaseUrl !== null ? (
                <a
                    className={styles.productImageLink}
                    href={review.purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${review.name}のAmazon商品ページを新しいタブで開く`}
                >
                    {/* Amazonの商品画像URLを加工せず、そのまま表示します。 */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        className={styles.productImage}
                        src={review.imageUrl}
                        alt={`${review.name}の商品画像`}
                        width="569"
                        height="569"
                        decoding="async"
                    />
                </a>
            ) : (
                <div className={styles.productImagePlaceholder} aria-label={`${review.name}の商品画像は未設定`}>
                    <span aria-hidden="true">☕</span>
                    <span>画像未設定</span>
                </div>
            )}

            <dl className={styles.purchaseGrid}>
                <div>
                    <dt>購入価格</dt>
                    <dd>{review.priceYen === null ? '未設定' : formatYen(review.priceYen)}</dd>
                </div>
                <div>
                    <dt>内容量</dt>
                    <dd>{review.amountGrams === null ? '未設定' : `${review.amountGrams}g`}</dd>
                </div>
                <div>
                    <dt>100gあたり</dt>
                    <dd>{review.pricePer100gYen === null ? '未設定' : formatYen(review.pricePer100gYen)}</dd>
                </div>
            </dl>

            {review.purchaseUrl === null && (
                <button
                    type="button"
                    className={styles.purchaseUnavailable}
                    disabled
                    aria-label={`${review.name}の購入先は未設定`}
                >
                    購入先 未設定
                </button>
            )}

            <div className={styles.axisSummary}>
                <SevenStepScale
                    startLabel="酸味"
                    endLabel="苦味"
                    value={review.tasteAxis}
                    valueLabel={tasteLabels[review.tasteAxis - 1]}
                />
                <SevenStepScale
                    startLabel="日常"
                    endLabel="ご褒美"
                    value={review.occasionAxis}
                    valueLabel={occasionLabels[review.occasionAxis - 1]}
                />
            </div>

            <blockquote className={styles.comment}>
                <span aria-hidden="true">“</span>
                <p>{review.comment || 'ひとことメモはまだありません。'}</p>
            </blockquote>
        </section>
    );
}

// お気に入り順の一覧からも同じ詳細を選べるよう、順位そのものをボタンにします。
function FavoriteRanking({
    reviews,
    selectedSlug,
    onSelect,
}: {
    reviews: CoffeeReview[];
    selectedSlug: string | null;
    onSelect: (slug: string) => void;
}) {
    return (
        <section className={styles.rankingCard} aria-labelledby="favorite-ranking-heading">
            <div className={styles.rankingHeading}>
                <div>
                    <p className={styles.cardKicker}>My favorites</p>
                    <h2 id="favorite-ranking-heading">お気に入り順</h2>
                </div>
                <span>{reviews.length} cups</span>
            </div>

            <ol className={styles.rankingList}>
                {reviews.map((review, index) => {
                    const isSelected = review.slug === selectedSlug;
                    return (
                        <li key={review.slug}>
                            <button
                                type="button"
                                className={`${styles.rankingButton} ${isSelected ? styles.rankingButtonSelected : ''}`}
                                onClick={() => onSelect(review.slug)}
                                aria-pressed={isSelected}
                            >
                                <span className={styles.rankNumber}>
                                    {review.favorite === null ? '--' : String(index + 1).padStart(2, '0')}
                                </span>
                                <span className={styles.rankContent}>
                                    <strong>{review.name}</strong>
                                    <span>
                                        {review.favorite === null
                                            ? 'お気に入り 未設定'
                                            : `お気に入り ${review.favorite} / 5`}
                                    </span>
                                </span>
                                <span className={styles.rankArrow} aria-hidden="true">→</span>
                            </button>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}

// 2軸の評価を位置へ変換し、マップ上の各点を選択可能なボタンとして描画します。
function CoffeeMatrix({
    reviews,
    topFavoriteSlugs,
    selectedSlug,
    onSelect,
}: {
    reviews: CoffeeReview[];
    topFavoriteSlugs: ReadonlySet<string>;
    selectedSlug: string | null;
    onSelect: (slug: string) => void;
}) {
    const plotPoints = useMemo(() => createPlotPoints(reviews), [reviews]);

    return (
        <section className={styles.matrixCard} aria-label="コーヒーマップ">
            <div className={styles.matrixHeading}>
                <p className={styles.matrixLegend}>
                    <span className={styles.legendItem}>
                        <span className={styles.legendPoint} aria-hidden="true" />
                        点を選ぶと詳細を表示
                    </span>
                    {topFavoriteSlugs.size > 0 && (
                        <span className={styles.legendItem}>
                            <span className={styles.legendFavoritePoint} aria-hidden="true" />
                            お気に入りTOP5
                        </span>
                    )}
                </p>
            </div>

            <div className={styles.matrixArea}>
                <span className={styles.axisTop} aria-hidden="true">ご褒美</span>
                <span className={styles.axisBottom} aria-hidden="true">日常</span>

                <div className={styles.plotFrame}>
                    <span className={styles.axisLeft} aria-hidden="true">酸味</span>
                    <div
                        className={styles.plot}
                        role="group"
                        aria-label="コーヒーマップ。横軸は左が酸味、右が苦味。縦軸は下が日常、上がご褒美。"
                    >
                        <div className={styles.quadrantAcidReward} aria-hidden="true" />
                        <div className={styles.quadrantBitterReward} aria-hidden="true" />
                        <div className={styles.quadrantAcidDaily} aria-hidden="true" />
                        <div className={styles.quadrantBitterDaily} aria-hidden="true" />

                        {plotPoints.map(({ review, x, y, offsetX, offsetY }) => {
                            const isSelected = review.slug === selectedSlug;
                            const isTopFavorite = topFavoriteSlugs.has(review.slug);
                            const pointStyle: PointStyle = {
                                '--point-x': `${x}%`,
                                '--point-y': `${y}%`,
                                '--point-offset-x': `${offsetX}px`,
                                '--point-offset-y': `${offsetY}px`,
                            };

                            return (
                                <button
                                    key={review.slug}
                                    type="button"
                                    style={pointStyle}
                                    className={`${styles.point} ${isTopFavorite ? styles.pointFavorite : ''} ${isSelected ? styles.pointSelected : ''}`}
                                    onClick={() => onSelect(review.slug)}
                                    aria-pressed={isSelected}
                                    aria-label={`${review.name}。${tasteLabels[review.tasteAxis - 1]}、${occasionLabels[review.occasionAxis - 1]}。${review.favorite === null ? 'お気に入り度 未設定' : `お気に入り度 ${review.favorite} / 5`}${isTopFavorite ? '。お気に入りTOP5' : ''}`}
                                >
                                    <span className={styles.pointDot} aria-hidden="true" />
                                    <span className={styles.pointLabel}>{review.name}</span>
                                </button>
                            );
                        })}
                    </div>
                    <span className={styles.axisRight} aria-hidden="true">苦味</span>
                </div>
            </div>
        </section>
    );
}

// ビルド時のJSONスナップショットを受け取り、選択とランキングだけをブラウザ上で管理します。
export function CoffeeMapClient({ initialReviews }: { initialReviews: CoffeeReview[] }) {
    // JSONの並び順に依存せず、お気に入り度の高い順を保証し、同率では入力順を保ちます。
    const rankedReviews = useMemo(
        () => initialReviews
            .map((review, originalIndex) => ({ review, originalIndex }))
            .sort((left, right) => (
                (right.review.favorite ?? -1) - (left.review.favorite ?? -1)
                || left.originalIndex - right.originalIndex
            ))
            .map(({ review }) => review),
        [initialReviews],
    );
    const topFavoriteSlugs = useMemo(
        () => new Set(
            rankedReviews
                .filter((review) => review.favorite !== null)
                .slice(0, 5)
                .map((review) => review.slug),
        ),
        [rankedReviews],
    );
    const [selectedSlug, setSelectedSlug] = useState<string | null>(
        () => rankedReviews[0]?.slug ?? null,
    );

    const selectedReview = initialReviews.find((review) => review.slug === selectedSlug) ?? null;

    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <div className={styles.heroCopy}>
                    <h1>Coffee Map</h1>
                    <p className={styles.lead}>
                        酸味と苦味、日常とご褒美。飲んだ一杯を、私自身の感覚で地図にしています。
                    </p>
                </div>
            </header>

            {initialReviews.length === 0 ? (
                <section className={styles.stateCard} aria-live="polite">
                    <span className={styles.emptyBean} aria-hidden="true" />
                    <div>
                        <h2>最初の一杯を待っています</h2>
                        <p>JSONへコーヒーを追加すると、ここに味覚マップが描かれます。</p>
                    </div>
                </section>
            ) : (
                <div className={styles.contentGrid}>
                    <CoffeeMatrix
                        reviews={initialReviews}
                        topFavoriteSlugs={topFavoriteSlugs}
                        selectedSlug={selectedSlug}
                        onSelect={setSelectedSlug}
                    />
                    <aside className={styles.sidebar} aria-label="選択したコーヒーとお気に入りランキング">
                        {selectedReview && <SelectedCoffeeCard review={selectedReview} />}
                        <FavoriteRanking
                            reviews={rankedReviews}
                            selectedSlug={selectedSlug}
                            onSelect={setSelectedSlug}
                        />
                    </aside>
                </div>
            )}
        </div>
    );
}
