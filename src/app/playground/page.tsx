'use client';
import { HomeSvg } from "@/components/Animation/HomeSvg";
import { PlainHomeSvg } from "@/components/Animation/PlainHomeSvg";

export default function PlaygroundPage() {
    return (
        <main className="prose mx-auto">
            <h1>実験場</h1>
            <p>筆記体アニメーションを動かしたい！</p>
            {/* ここに試したいコンポーネントやロジックを記述できます */}
            {/* HomeSvgコンポーネントを中央に配置 */}
            <p>Outline stroke</p>
            <div className="flex justify-center">
                <HomeSvg />
            </div>

            <p>plain</p>
            <div className="flex justify-center">
                <PlainHomeSvg />
            </div>

        </main>
    );
}