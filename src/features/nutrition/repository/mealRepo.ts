import { ID, Query } from "appwrite";
import {
    tables,
    DB_ID,
    COL_MEAL_ITEM,
} from "../../../services/appwrite/appwrite";

// this is something that I am not quite sure of yet.
// TODO: Consider removing or making this more flexible
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type CreateMealItemInput = {
    userId: string;
    name: string;
    type: MealType;
    timeISO: string; // fro example new Date().toISOString() or smth
    notes?: string;
};

export type MealRow = {
    $id: string;
    userId: string;
    name: string;
    type?: MealType;
    timeISO: string;
    mealDate: string; // YYYY-MM-DD
    notes?: string;
    $createdAt: string;
    $updatedAt: string;
};

const toModel = (row: any): MealRow => ({
    $id: row.$id,
    userId: row.userId,
    name: row.name,
    type: row.type,
    timeISO: row.timeISO,
    mealDate: row.mealDate,
    notes: row.notes,
    $createdAt: row.$createdAt,
    $updatedAt: row.$updatedAt,
});

// move to helper somewhere, for now keep here
const toDateStr = (isoStr: string): string => isoStr.slice(0, 10); // YYYY-MM-DD

export const mealRepo = {
    // create a new meal item from input
    async create(input: CreateMealItemInput): Promise<MealRow> {
        const row = await tables.createRow({
            databaseId: DB_ID,
            tableId: COL_MEAL_ITEM,
            rowId: ID.unique(),
            data: {
                userId: input.userId,
                name: input.name,
                type: input.type ?? "Breakfast",
                timeISO: input.timeISO,
                mealDate: toDateStr(input.timeISO),
                notes: input.notes ?? "",
            },
        });
        return toModel(row);
    },

    // get meal by id
    async get(mealId: string): Promise<MealRow> {
        const row = await tables.getRow({
            databaseId: DB_ID,
            tableId: COL_MEAL_ITEM,
            rowId: mealId,
        });
        return toModel(row);
    },

    // list meals for a user on a specific date -> should be paginated maybe and time instead of date?
    async listByDate(userId: string, dateStr: string): Promise<MealRow[]> {
        const res = await tables.listRows({
            databaseId: DB_ID,
            tableId: COL_MEAL_ITEM,
            queries: [
                Query.equal("userId", userId),
                Query.equal("mealDate", dateStr),
                Query.orderAsc("timeISO"),
                Query.limit(50),
            ],
        });
        return res.rows.map(toModel);
    },
};
