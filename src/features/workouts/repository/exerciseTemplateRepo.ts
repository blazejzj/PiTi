import { ID, Query } from "appwrite";
import {
    tables,
    DB_ID,
    COL_EXERCISE_TEMPLATE,
} from "../../../services/appwrite/appwrite";

import type { ExerciseTemplate } from "../models";

// helpers
const toExerciseTemplateModel = (row: any): ExerciseTemplate => ({
    $id: row.$id,
    name: row.name,
    muscleGroups: row.muscleGroups,
    description: row.description ?? null,
    equipmentRequired: row.equipmentRequired ?? null,
    notes: row.notes ?? null,
    $createdAt: row.$createdAt,
    $updatedAt: row.$updatedAt,
});
//repo
export const exerciseTemplateRepo = {
    async create(data: Omit<ExerciseTemplate, '$id' | '$createdAt' | '$updatedAt'>): Promise<ExerciseTemplate> {
        const row = await tables.createRow({
            databaseId: DB_ID,
            tableId: COL_EXERCISE_TEMPLATE,
            rowId: ID.unique(),
            data,
        });
        return toExerciseTemplateModel(row);
    },

    async get(templateId: string): Promise<ExerciseTemplate> {
        const row = await tables.getRow({
            databaseId: DB_ID,
            tableId: COL_EXERCISE_TEMPLATE,
            rowId: templateId,
        });
        return toExerciseTemplateModel(row);
    },

    async list(): Promise<ExerciseTemplate[]> {
        const res = await tables.listRows({
            databaseId: DB_ID,
            tableId: COL_EXERCISE_TEMPLATE,
            queries: [Query.orderAsc("name")],
        });
        return res.rows.map(toExerciseTemplateModel);
    },

    async search(query: string): Promise<ExerciseTemplate[]> {
        const res = await tables.listRows({
            databaseId: DB_ID,
            tableId: COL_EXERCISE_TEMPLATE,
            queries: [
                Query.search("name", query),
                Query.orderAsc("name"),
                Query.limit(25),
            ],
        });
        return res.rows.map(toExerciseTemplateModel);
    },
};
