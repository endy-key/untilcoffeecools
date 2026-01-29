'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { PlainHomeSvg } from '@/components/Animation/PlainHomeSvg';

export function HeroSection() {
    return (
        <div className="relative flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full h-auto max-w-full"
            >
                <Image
                    src={"/heroImage.svg"}
                    alt={"untilcoffeecools heroImage"}
                    width={1200}
                    height={400}
                    priority
                    className="w-full h-auto max-w-full"
                />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <PlainHomeSvg />
            </div>
        </div>
    );
}
