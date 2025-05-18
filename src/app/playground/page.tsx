'use client';
import { HomeSvg } from "@/components/Animation/HomeSvg";

export default function PlaygroundPage() {
    return (
        <div className="prose">
            <h1>ソースの実験場</h1>
            <p>筆記体アニメーションを動かしたい！</p>
            {/* ここに試したいコンポーネントやロジックを記述できます */}
            {/* HomeSvgコンポーネントを中央に配置 */}
            <div className="my-8 flex justify-center">
                <HomeSvg />
            </div>
        </div>
    );
}