"use client";

import Script from "next/script";
import {GTM_ID, isProduction} from "@/lib/gtm";

export const GtmScript = () => {
    if (!isProduction || !GTM_ID) return null;

    return (
        <>
            <Script
                id="gtm-script"
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
            />
            <Script id="gtm-init" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({ event: 'gtm.js', 'gtm.start': new Date().getTime() });
                `}
            </Script>
        </>
    );
};