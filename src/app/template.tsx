'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation' // usePathname をインポート

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname(); // 現在のパスを取得

    return (
        <AnimatePresence mode="wait"> {/* mode="wait" でアニメーションの重複を防ぐ */}
            <motion.div
                key={pathname} // pathname を key として設定
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}