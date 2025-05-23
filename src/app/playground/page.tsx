'use client';
import { PlainHomeSvg } from "@/components/Animation/PlainHomeSvg";

export default function PlaygroundPage() {
    return (
        <main className="prose mx-auto">
            <h1>実験場</h1>
            <p>plain</p>
            <div className="flex justify-center">
                <PlainHomeSvg />
            </div>
        </main>
    );
}