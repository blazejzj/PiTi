import { ID, Query } from "appwrite";
import {
    tables,
    DB_ID,
    COL_MEAL_ITEM,
} from "../../../services/appwrite/appwrite";
import { CreateMealItemInput, MealItem } from "../models";
import { fromPer100g } from "../utils/nutrition";

const toModel = (row: any): MealItem => ({
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
    async create(input: CreateMealItemInput): Promise<MealItem> {
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
    async get(mealItemId: string): Promise<MealItem> {
        const row = await tables.getRow({
            databaseId: DB_ID,
            tableId: COL_MEAL_ITEM,
            rowId: mealItemId,
        });
        return toModel(row);
    },

    // list all meal items for a given meal
    async listByMeal(mealId: string): Promise<MealItem[]> {
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
