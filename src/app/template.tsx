import type { ReactNode } from 'react';

// CSSアニメーションに任せることで、JavaScript無効時も本文を確実に表示します。
export default function Template({ children }: { children: ReactNode }) {
    return <div className="page-transition">{children}</div>;
}
