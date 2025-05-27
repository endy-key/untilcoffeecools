import Script from 'next/script';
import React from 'react';
import { CLARITY_ID, isProduction } from "@/lib/clarity";

const ClarityScript = () => {
    if (!isProduction || !CLARITY_ID) return null;

    return (
        <Script
            id="microsoft-clarity-integration" // スクリプトに一意のIDを付与
            strategy="afterInteractive" // ページがインタラクティブになった後にスクリプトを読み込み、パフォーマンス最適化
            dangerouslySetInnerHTML={{
                __html: `
                (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${CLARITY_ID}");
                `,
            }}
        />
    );
};

export default ClarityScript;