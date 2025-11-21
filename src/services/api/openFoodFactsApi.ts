const BASE_URL = "https://world.openfoodfacts.org/api/v2";

export type foodProduct = {
    name: string;
    barcode: string;
    kcalPer100g: number | null;
    carbsPer100g: number | null;
    fatPer100g: number | null;
    proteinPer100g: number | null;
};

export const openFoodFactsApi = {
    async getProductByBarcode(barcode: string): Promise<foodProduct | null> {
        try {
            const response = await fetch(`${BASE_URL}/product/${barcode}`);
            if (!response.ok) {
                console.warn(
                    `Product ${barcode} not found in Open Food Facts.`
                );
                return null;
            }

            const data = await response.json();

            if (data.status === 0 || !data.product) {
                console.warn(
                    `Product ${barcode} not found in Open Food Facts.`
                );
                return null;
            }

            const product = data.product;
            const nutriments = product.nutriments || {};

            return {
                name: product.product_name || "Unknown Product",
                barcode: data.code || barcode,
                kcalPer100g: nutriments["energy-kcal_100g"] ?? null,
                carbsPer100g: nutriments["carbohydrates_100g"] ?? null,
                fatPer100g: nutriments["fat_100g"] ?? null,
                proteinPer100g: nutriments["proteins_100g"] ?? null,
            };
        } catch (error) {
            console.error(
                `Error fetching product ${barcode} from Open Food Facts:`,
                error
            );
            return null;
        }
    },
};
