// lib/gtm.ts
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";

export const isProduction = process.env.NODE_ENV === "production";