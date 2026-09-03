import type { Metadata } from 'next';
import coffeeReviewsJson from '../../../content/coffee-reviews.json';
import { CoffeeMapClient } from './CoffeeMapClient';
import { parseCoffeeReviews } from './coffeeReviews';

export const metadata: Metadata = {
    title: 'Coffee Map',
    description: '飲んだコーヒーを、酸味と苦味・日常とご褒美の2軸で記録する個人的な味覚マップです。',
};

// JSONをビルド時に読み込み、公開環境で外部通信を必要としない静的スナップショットとして渡します。
export default function CoffeeMapPage() {
    const coffeeReviews = parseCoffeeReviews(coffeeReviewsJson);
    return <CoffeeMapClient initialReviews={coffeeReviews} />;
}
