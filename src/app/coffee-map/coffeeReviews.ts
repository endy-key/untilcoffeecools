type JsonObject = Record<string, unknown>;

export type CoffeeReview = {
    slug: string;
    name: string;
    priceYen: number | null;
    amountGrams: number | null;
    pricePer100gYen: number | null;
    purchaseUrl: string | null;
    imageUrl: string | null;
    tasteAxis: number;
    occasionAxis: number;
    favorite: number | null;
    comment: string;
};

function isJsonObject(value: unknown): value is JsonObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireTrimmedString(value: unknown, field: string, index: number) {
    if (typeof value !== 'string' || value.length === 0 || value !== value.trim()) {
        throw new Error(`Coffee Map: ${index + 1}件目の${field}は、前後に空白のない必須文字列にしてください。`);
    }
    return value;
}

function requireInteger(value: unknown, field: string, index: number, minimum: number, maximum: number) {
    if (!Number.isSafeInteger(value) || (value as number) < minimum || (value as number) > maximum) {
        throw new Error(`Coffee Map: ${index + 1}件目の${field}は${minimum}〜${maximum}の整数にしてください。`);
    }
    return value as number;
}

function requireNullableInteger(
    value: unknown,
    field: string,
    index: number,
    minimum: number,
    maximum: number,
) {
    if (value === null) {
        return null;
    }

    return requireInteger(value, field, index, minimum, maximum);
}

function requireHttpsUrl(value: unknown, field: string, index: number) {
    const url = requireTrimmedString(value, field, index);

    try {
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol !== 'https:') {
            throw new Error('HTTPS以外のURLです。');
        }
    } catch {
        throw new Error(`Coffee Map: ${index + 1}件目の${field}は有効なHTTPS URLにしてください。`);
    }

    return url;
}

function requireNullableHttpsUrl(value: unknown, field: string, index: number) {
    if (value === null) {
        return null;
    }

    return requireHttpsUrl(value, field, index);
}

// 手編集したJSONの誤りを静的ビルド時に検出し、不正なデータを公開しないようにします。
export function parseCoffeeReviews(value: unknown): CoffeeReview[] {
    if (!Array.isArray(value)) {
        throw new Error('Coffee Map: content/coffee-reviews.jsonのルートは配列にしてください。');
    }

    const slugs = new Set<string>();

    return value.map((item, index) => {
        if (!isJsonObject(item)) {
            throw new Error(`Coffee Map: ${index + 1}件目はオブジェクトにしてください。`);
        }

        const slug = requireTrimmedString(item.slug, 'slug', index);
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            throw new Error(`Coffee Map: ${index + 1}件目のslugは半角小文字・数字・ハイフンだけで指定してください。`);
        }
        if (slugs.has(slug)) {
            throw new Error(`Coffee Map: slug「${slug}」が重複しています。`);
        }
        slugs.add(slug);

        if (typeof item.comment !== 'string' || item.comment.length > 300) {
            throw new Error(`Coffee Map: ${index + 1}件目のcommentは300文字以内の文字列にしてください。`);
        }

        const priceYen = requireNullableInteger(item.priceYen, 'priceYen', index, 0, Number.MAX_SAFE_INTEGER);
        const amountGrams = requireNullableInteger(item.amountGrams, 'amountGrams', index, 1, Number.MAX_SAFE_INTEGER);
        const pricePer100gYen = requireNullableInteger(
            item.pricePer100gYen,
            'pricePer100gYen',
            index,
            0,
            Number.MAX_SAFE_INTEGER,
        );
        const calculatedPricePer100gYen = priceYen !== null && amountGrams !== null
            ? Math.round((priceYen / amountGrams) * 100)
            : null;
        const purchaseUrl = requireNullableHttpsUrl(item.purchaseUrl, 'purchaseUrl', index);
        const imageUrl = requireNullableHttpsUrl(item.imageUrl, 'imageUrl', index);

        if (
            calculatedPricePer100gYen !== null
            && pricePer100gYen !== null
            && pricePer100gYen !== calculatedPricePer100gYen
        ) {
            throw new Error(
                `Coffee Map: ${index + 1}件目のpricePer100gYenは、priceYenとamountGramsから計算した${calculatedPricePer100gYen}にしてください。`,
            );
        }

        if (imageUrl !== null && purchaseUrl === null) {
            throw new Error(`Coffee Map: ${index + 1}件目はimageUrlを登録する場合、purchaseUrlも登録してください。`);
        }

        return {
            slug,
            name: requireTrimmedString(item.name, 'name', index),
            priceYen,
            amountGrams,
            pricePer100gYen,
            purchaseUrl,
            imageUrl,
            tasteAxis: requireInteger(item.tasteAxis, 'tasteAxis', index, 1, 7),
            occasionAxis: requireInteger(item.occasionAxis, 'occasionAxis', index, 1, 7),
            favorite: requireNullableInteger(item.favorite, 'favorite', index, 1, 5),
            comment: item.comment,
        };
    });
}
