import React from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export function ProfileCard() {
    return (
        <div className="bg-white rounded-lg p-4 shadow-md">
            <Image
                src={siteConfig.author.avatar}
                alt="アバターアイコン"
                className="w-15 h-15 rounded-full mx-auto"
                width={80}
                height={80}
            />
            <h2 className="mt-3 text-center text-lg font-bold">{siteConfig.author.name}</h2>
            <p className="mt-1 text-center text-sm text-gray-500">
                {siteConfig.author.bio}
            </p>
        </div>
    );
}
