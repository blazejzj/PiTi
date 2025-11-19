export const round = (n: number) => Math.round(n);

export const fromPer100g = (
    per100: number | null | undefined,
    amountG: number
) => (per100 == null ? 0 : round((per100 * amountG) / 100));

export const kcalForAmount = (kcalPer100g: number, amountG: number) =>
    Math.round(((kcalPer100g || 0) * amountG) / 100);
