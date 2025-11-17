import { ID, Query } from "appwrite";
import { tables, DB_ID, COL_MEAL } from "../../../services/appwrite/appwrite";
import { CreateMealInput, MealRow } from "../models";
import { dayRange, startOfDayISO } from "../utils/date";

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

export const mealRepo = {
    // so here we create a new meal, based on input
    async create(input: CreateMealInput): Promise<MealRow> {
        const row = await tables.createRow({
            databaseId: DB_ID,
            tableId: COL_MEAL,
            rowId: ID.unique(),
            data: {
                userId: input.userId,
                name: input.name,
                type: input.type ?? "Breakfast",
                timeISO: input.timeISO,
                mealDate: startOfDayISO(input.timeISO),
                notes: input.notes ?? "",
            },
        });
        return toModel(row);
    },

    // Get single meal by id
    async get(mealId: string): Promise<MealRow> {
        const row = await tables.getRow({
            databaseId: DB_ID,
            tableId: COL_MEAL,
            rowId: mealId,
        });
        return toModel(row);
    },

    // List all meals for a user on a specific date
    async listByDate(
        userId: string,
        anyTimeThatDayISO: string
    ): Promise<MealRow[]> {
        const { startISO, endISO } = dayRange(anyTimeThatDayISO);
        const res = await tables.listRows({
            databaseId: DB_ID,
            tableId: COL_MEAL,
            queries: [
                Query.equal("userId", userId),
                Query.greaterThanEqual("timeISO", startISO),
                Query.lessThan("timeISO", endISO),
                Query.orderAsc("timeISO"),
                Query.limit(100),
            ],
        });
        return res.rows.map(toModel);
    },

    // Delete meal by id
    async delete(mealId: string): Promise<void> {
        await tables.deleteRow({
            databaseId: DB_ID,
            tableId: COL_MEAL,
            rowId: mealId,
        });
    },
};
