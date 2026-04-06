/**
 * サイト全体の設定を一元管理するファイル。
 * タイトル・著者情報・SNSリンクなど、複数箇所で使われる定数はここに定義し、
 * 各コンポーネントはここから import して使う。
 */
export const siteConfig = {
  /** ブラウザタブや OGP に表示されるサイト名 */
  name: "until coffee cools",

  /** サイトの説明文（メタディスクリプション・OGP 用） */
  description: "コーヒーが冷めるまで",

  /** HTML の lang 属性 */
  lang: "ja",

  /** フッターの copyright 表示名 */
  copyrightName: "untilcoffeecools",

  /** ヒーローセクションのキャッチコピー */
  tagline: "雑多な趣味ブログ",

  /** 著者プロフィール */
  author: {
    /** 表示名 */
    name: "Y.Endo",
    /** 自己紹介文 */
    bio: "コーヒー、自作キーボード、観葉植物に囲まれた生活をしてます。",
    /** アバター画像のパス（public/ からの相対パス） */
    avatar: "/avatar.jpg",
  },

  /** 外部リンク */
  links: {
    github: "https://github.com/endy-key/untilcoffeecools",
  },

  /** OGP 画像のデフォルト（記事にサムネイルがない場合のフォールバック） */
  defaultOgImage: "/heroImage.jpg",
} as const;

/**
 * 本番環境かどうかを判定するフラグ。
 * gtm.ts / clarity.ts など複数箇所で使っていたものをここに一本化。
 */
export const isProduction = process.env.NODE_ENV === "production";
