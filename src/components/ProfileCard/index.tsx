import React from "react";

export function ProfileCard() {
    return (
        <div className="bg-white rounded-lg p-4 shadow-md">
            <img
                src="/avatar.jpg"
                alt="アバターアイコン"
                className="w-20 h-20 rounded-full mx-auto"
            />
            <h2 className="mt-3 text-center text-lg font-bold">Y.E.</h2>
            <p className="mt-1 text-center text-sm text-gray-500">
                コーヒーと自作キーボードと観葉植物に囲まれた生活をしてます。
            </p>
        </div>
    );
}
