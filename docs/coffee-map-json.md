# Coffee Map JSON運用ノート

## 構成

Coffee Mapの公開データは`content/coffee-reviews.json`で管理します。Next.jsがビルド時にJSONを読み込み、静的HTMLとして`out/`へ出力し、既存のS3・CloudFront構成から配信します。

```text
content/coffee-reviews.json
  │ npm run build
  ▼
静的HTML（out/）
  │ GitHub Actions
  ▼
S3 → CloudFront → ブラウザ
```

データベース、公開API、Cloudflare API tokenは使用しません。JSONへ秘密情報や非公開メモを保存しないでください。

## データ形式

```json
[
  {
    "slug": "drip-coffee-factory-gold-classic-blend",
    "name": "ドリップコーヒーファクトリー ゴールド&クラシック ブレンド",
    "priceYen": 6150,
    "amountGrams": 2000,
    "pricePer100gYen": 308,
    "purchaseUrl": "https://amzn.to/4gArVEo",
    "imageUrl": "https://m.media-amazon.com/images/I/61r8mu1r31L._AC_SX569_.jpg",
    "tasteAxis": 6,
    "occasionAxis": 1,
    "favorite": 5,
    "comment": "苦味とコクが強めで香り高い。今のところコスパ最強"
  }
]
```

| 項目 | 制約・意味 |
|---|---|
| `slug` | 重複しない半角小文字・数字・ハイフン |
| `name` | 商品名。前後に空白を入れない |
| `priceYen` | 0以上の購入価格（円）。未登録は`null` |
| `amountGrams` | 1以上の内容量（g）。未登録は`null` |
| `pricePer100gYen` | `priceYen ÷ amountGrams × 100`を四捨五入した整数（円）。未登録は`null` |
| `purchaseUrl` | 購入先の有効なHTTPS URL。未登録は`null`。Amazonアフィリエイト用の短縮URLも登録可能 |
| `imageUrl` | 商品画像の有効なHTTPS URL。未登録は`null`。登録時は`purchaseUrl`も必須 |
| `tasteAxis` | 1＝酸味、7＝苦味の7段階評価 |
| `occasionAxis` | 1＝日常、7＝ご褒美の7段階評価 |
| `favorite` | 1〜5のお気に入り度。未登録は`null` |
| `comment` | 一言感想。300文字以内 |

未登録の項目もキーは省略せず、値を`null`にします。画面では価格・内容量・100g単価・購入先・お気に入り度を「未設定」と表示します。お気に入り度が未設定の商品は、評価済み商品の後ろへJSONの順番どおりに並びます。お気に入り度を登録した商品のうち上位5件は、マップ上の点を暖色で強調します。

### 7段階評価

| 値 | `tasteAxis` | `occasionAxis` |
|---:|---|---|
| 1 | 酸味・強 | 日常 |
| 2 | 酸味・中 | 日常に近い |
| 3 | 酸味・弱 | やや日常 |
| 4 | どちらともいえない | どちらともいえない |
| 5 | 苦味・弱 | ややご褒美 |
| 6 | 苦味・中 | ご褒美に近い |
| 7 | 苦味・強 | ご褒美 |

## 更新手順

1. `content/coffee-reviews.json`へレコードを追記または修正する。
2. `npm run build`を実行する。
3. `/coffee-map/`の表示とお気に入り順を確認する。
4. JSONと画面の変更をコミットし、通常の静的サイト更新としてデプロイする。

ビルドでは必須文字列、登録済み数値の範囲、`slug`の形式と重複、100g単価の計算結果、登録済み購入先URL、感想の文字数を検証します。不正なJSONはS3へアップロードされる前にビルドエラーになります。
