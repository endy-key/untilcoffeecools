// lib/gtm.ts
export { isProduction } from "@/config/site";

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";