import { ID, Query } from "appwrite";
import {
    tables,
    DB_ID,
    COL_FOOD_ITEM,
} from "../../../services/appwrite/appwrite";
import type { FoodItem } from "../models";

export type CreateFoodItemInput = {
    userId: string;
    name: string;
    barcode?: string;
    kcalPer100g: number;
    carbPer100g: number;
    fatPer100g: number;
    proteinPer100g: number;
};

// helper which maps Appwrite row to FoodItem model
const toModel = (row: any): FoodItem => ({
    $id: row.$id,
    userId: row.userId,
    name: row.name,
    barcode: row.barcode,
    kcalPer100g: row.kcalPer100g ?? null,
    carbPer100g: row.carbPer100g ?? null,
    fatPer100g: row.fatPer100g ?? null,
    proteinPer100g: row.proteinPer100g ?? null,
    $createdAt: row.$createdAt,
    $updatedAt: row.$updatedAt,
});

export const foodItemRepo = {
    // create a new food item from input
    async create(input: CreateFoodItemInput): Promise<FoodItem> {
        const row = await tables.createRow({
            databaseId: DB_ID,
            tableId: COL_FOOD_ITEM,
            rowId: ID.unique(),
            data: {
                userId: input.userId,
                name: input.name,
                barcode: input.barcode ?? "",
                kcalPer100g: input.kcalPer100g,
                carbPer100g: input.carbPer100g,
                fatPer100g: input.fatPer100g,
                proteinPer100g: input.proteinPer100g,
            },
        });
        // map to model and return
        return toModel(row);
    },

    // convenience: get by id
    async get(foodItemId: string): Promise<FoodItem> {
        const row = await tables.getRow({
            databaseId: DB_ID,
            tableId: COL_FOOD_ITEM,
            rowId: foodItemId,
        });
        return toModel(row);
    },

    // search food items by name for a user
    async searchByName(userId: string, q: string): Promise<FoodItem[]> {
        const res = await tables.listRows({
            databaseId: DB_ID,
            tableId: COL_FOOD_ITEM,
            queries: [
                Query.equal("userId", userId),
                Query.search("name", q),
                Query.limit(20),
            ],
        });
        // map to model and return
        return res.rows.map(toModel);
    },

    // get food item by barcode for a user
    async getByBarcode(
        userId: string,
        barcode: string
    ): Promise<FoodItem | null> {
        const res = await tables.listRows({
            databaseId: DB_ID,
            tableId: COL_FOOD_ITEM,
            queries: [
                Query.equal("userId", userId),
                Query.equal("barcode", barcode),
                Query.limit(1),
            ],
        });
        // map to model and return if exists
        return res.rows[0] ? toModel(res.rows[0]) : null;
    },
};
