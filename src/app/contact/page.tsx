import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
    title: "Contact",
    description: `${siteConfig.name} へのお問い合わせはこちらから。`,
};

/**
 * Googleフォームの埋め込みURL。
 * Googleフォームの「送信」→「リンク」から取得したURLを
 * ?embedded=true を付けて設定する。
 */
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdi-Fx2jrXbrgpyAd2LVLmB9YWrrZLcBciKA5j77mW7ZYXucA/viewform?embedded=true";

export default function ContactPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-12">
            {/* ページタイトル */}
            <h1 className="text-2xl font-bold text-gray-600 flex items-center gap-3 mb-4">
                <span className="inline-block w-1 h-6 bg-amber-700 rounded-full" aria-hidden="true" />
                Contact
            </h1>
            <p className="text-sm text-gray-500 mb-8">
                ご意見・ご質問・ご指摘などがあれば、以下のフォームよりお気軽にご連絡ください。
            </p>

            {/* Googleフォーム埋め込み */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <iframe
                    src={GOOGLE_FORM_URL}
                    width="100%"
                    height="700"
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                    title="お問い合わせフォーム"
                    className="block"
                >
                    読み込んでいます…
                </iframe>
            </div>
        </div>
    );
}
