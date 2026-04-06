import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: `${siteConfig.name} のプライバシーポリシーです。`,
};

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-12">
            {/* ページタイトル */}
            <h1 className="text-2xl font-bold text-gray-600 flex items-center gap-3 mb-10">
                <span className="inline-block w-1 h-6 bg-amber-700 rounded-full" aria-hidden="true" />
                Privacy Policy
            </h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8 text-sm text-gray-600 leading-relaxed">

                {/* 基本方針 */}
                <section>
                    <h2 className="font-bold text-gray-700 text-base mb-3">基本方針</h2>
                    <p>
                        {siteConfig.name}（以下「当サイト」）は、利用者のプライバシーを尊重し、個人情報の保護に努めます。
                        本ポリシーは、当サイトにおける個人情報の取り扱いについて説明するものです。
                    </p>
                </section>

                {/* 広告について */}
                <section>
                    <h2 className="font-bold text-gray-700 text-base mb-3">広告について</h2>
                    <p>
                        当サイトは、Google が提供する広告配信サービス「Google AdSense」を利用しています。
                        Google AdSense は、ユーザーの興味に応じた広告を表示するために Cookie を使用します。
                        Cookie を無効にする方法や、Google による広告配信の詳細については
                        <a
                            href="https://policies.google.com/technologies/ads"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-700 hover:text-amber-600 underline mx-1"
                        >
                            Google のポリシーと規約
                        </a>
                        をご確認ください。
                    </p>
                </section>

                {/* アクセス解析について */}
                <section>
                    <h2 className="font-bold text-gray-700 text-base mb-3">アクセス解析ツールについて</h2>
                    <p className="mb-2">
                        当サイトは、アクセス状況を把握するために以下のツールを使用しています。
                        これらのツールはデータの収集のために Cookie を使用しており、個人を特定する情報は収集しません。
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                        <li>
                            <strong>Google タグマネージャー / Google アナリティクス</strong>（Google LLC）
                        </li>
                        <li>
                            <strong>Microsoft Clarity</strong>（Microsoft Corporation）
                        </li>
                    </ul>
                    <p className="mt-2">
                        Cookie の利用を希望しない場合は、ブラウザの設定から Cookie を無効にすることができます。
                    </p>
                </section>

                {/* コメント・お問い合わせ */}
                <section>
                    <h2 className="font-bold text-gray-700 text-base mb-3">お問い合わせフォームについて</h2>
                    <p>
                        お問い合わせフォームにご入力いただいた情報（氏名・メールアドレス等）は、
                        お問い合わせへの回答のみに使用し、第三者への提供は行いません。
                    </p>
                </section>

                {/* 免責事項 */}
                <section>
                    <h2 className="font-bold text-gray-700 text-base mb-3">免責事項</h2>
                    <p>
                        当サイトのコンテンツは正確な情報の提供を心がけていますが、
                        その内容の完全性・正確性・有用性を保証するものではありません。
                        当サイトの情報を利用することで生じた損害について、当サイトは一切の責任を負いかねます。
                    </p>
                </section>

                {/* ポリシーの変更 */}
                <section>
                    <h2 className="font-bold text-gray-700 text-base mb-3">プライバシーポリシーの変更</h2>
                    <p>
                        本ポリシーは、必要に応じて予告なく変更する場合があります。
                        変更後のポリシーはこのページに掲載します。
                    </p>
                </section>

                {/* 制定日 */}
                <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
                    制定日：2026年4月6日
                </p>
            </div>
        </div>
    );
}
