import { Query } from "appwrite";
import {
    tables,
    DB_ID,
    COL_USER_PROFILE,
} from "../../../services/appwrite/appwrite";
import type { UserNutritionProfile } from "../models";

// TODO: THIS SHOULD PROBABLY BE MOVED TO FEATURE/USER OR SIMILAR

const toModel = (row: any): UserNutritionProfile => ({
    $id: row.$id,
    userId: row.user_id,
    heightCm: row.height_cm ?? null,
    weightKg: row.weight_kg ?? null,
    age: row.age ?? null,
    sex: row.sex ?? null,
    dailyKcalTarget: row.daily_kcal_target ?? null,
    carbTargetG: row.carb_target_g ?? null,
    fatTargetG: row.fat_target_g ?? null,
    proteinTargetG: row.protein_target_g ?? null,
    $createdAt: row.$createdAt,
    $updatedAt: row.$updatedAt,
});

export const userProfileRepo = {
    async getByUserId(userId: string): Promise<UserNutritionProfile | null> {
        const res = await tables.listRows({
            databaseId: DB_ID,
            tableId: COL_USER_PROFILE,
            queries: [Query.equal("user_id", userId), Query.limit(1)],
        });

        if (!res.rows[0]) return null;
        return toModel(res.rows[0]);
    },
};
