// lib/clarity.ts
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "";

export const isProduction = process.env.NODE_ENV === "production";