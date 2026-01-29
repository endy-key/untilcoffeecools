'use client';

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function ProfileCard() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg p-4 shadow-md transition-shadow hover:shadow-lg"
        >
            <Image
                src="/avatar.jpg"
                alt="アバターアイコン"
                className="w-15 h-15 rounded-full mx-auto"
                width={80}
                height={80}
            />
            <h2 className="mt-3 text-center text-lg font-bold">Y.E.</h2>
            <p className="mt-1 text-center text-sm text-gray-500">
                コーヒー、自作キーボード、観葉植物に囲まれた生活をしてます。
            </p>
        </motion.div>
    );
}
