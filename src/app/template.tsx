'use client'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            key={usePathname()}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            // exitはこのファイル内では機能しないため削除
            transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
            {children}
        </motion.div>
    )
}