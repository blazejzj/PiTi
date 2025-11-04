import { ID, Query } from "appwrite";
import {
    tables,
    DB_ID,
    COL_MEAL_ITEM,
} from "../../../services/appwrite/appwrite";

export type CreateMealItemInput = {
    mealId: string;
    foodItemId: string;
    amountG: number; // grams eaten
    kcalPer100g?: number | null;
    carbPer100g?: number | null;
    fatPer100g?: number | null;
    proteinPer100g?: number | null;
    kcal?: number | null;
    carbG?: number | null;
    fatG?: number | null;
    proteinG?: number | null;
};

export type MealItemRow = {
    $id: string;
    mealId: string;
    foodItemId: string;
    amountG: number;
    kcal: number;
    carbG: number;
    fatG: number;
    proteinG: number;
    $createdAt: string;
    $updatedAt: string;
};

// small helpers maybe should be moved elsewhere
const round = (n: number) => Math.round(n);
const fromPer100g = (per100: number | null | undefined, amountG: number) =>
    per100 == null ? 0 : round((per100 * amountG) / 100);

const toModel = (row: any): MealItemRow => ({
    $id: row.$id,
    mealId: row.mealId,
    foodItemId: row.foodItemId,
    amountG: row.amountG,
    kcal: row.kcal,
    carbG: row.carbG,
    fatG: row.fatG,
    proteinG: row.proteinG,
    $createdAt: row.$createdAt,
    $updatedAt: row.$updatedAt,
});

export const mealItemRepo = {
    // create a new meal item
    async create(input: CreateMealItemInput): Promise<MealItemRow> {
        const kcal =
            input.kcal ?? fromPer100g(input.kcalPer100g ?? null, input.amountG);
        const carbG =
            input.carbG ??
            fromPer100g(input.carbPer100g ?? null, input.amountG);
        const fatG =
            input.fatG ?? fromPer100g(input.fatPer100g ?? null, input.amountG);
        const proteinG =
            input.proteinG ??
            fromPer100g(input.proteinPer100g ?? null, input.amountG);

        const row = await tables.createRow({
            databaseId: DB_ID,
            tableId: COL_MEAL_ITEM,
            rowId: ID.unique(),
            data: {
                mealId: input.mealId,
                foodItemId: input.foodItemId,
                amountG: input.amountG,
                kcal,
                carbG,
                fatG,
                proteinG,
            },
        });

        return toModel(row);
    },

    // get meal item by id
    async get(mealItemId: string): Promise<MealItemRow> {
        const row = await tables.getRow({
            databaseId: DB_ID,
            tableId: COL_MEAL_ITEM,
            rowId: mealItemId,
        });
        return toModel(row);
    },

    // list all meal items for a given meal
    async listByMeal(mealId: string): Promise<MealItemRow[]> {
        const res = await tables.listRows({
            databaseId: DB_ID,
            tableId: COL_MEAL_ITEM,
            queries: [Query.equal("mealId", mealId), Query.limit(500)],
        });
        return res.rows.map(toModel);
    },

    // delete all meal items for a given meal
    async deleteByMeal(mealId: string): Promise<void> {
        const items = await this.listByMeal(mealId);
        await Promise.all(
            items.map((it) =>
                tables.deleteRow({
                    databaseId: DB_ID,
                    tableId: COL_MEAL_ITEM,
                    rowId: it.$id,
                })
            )
        );
    },
};
