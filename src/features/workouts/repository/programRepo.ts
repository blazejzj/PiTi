import { ID, Query } from "appwrite";
import {
    tables,
    DB_ID,
    COL_PROGRAM,
    COL_PROGRAM_WORKOUT,
} from "../../../services/appwrite/appwrite";

import type { Program, ProgramWorkout } from "../models";

// helpers
const toProgramModel = (row: any): Program => ({
    $id: row.$id,
    userId: row.userId,
    name: row.name,
    description: row.description ?? null,
    $createdAt: row.$createdAt,
    $updatedAt: row.$updatedAt,
});

const toProgramWorkoutModel = (row: any): ProgramWorkout => ({
    $id: row.$id,
    programId: row.programId,
    title: row.title,
    dayOfWeek: row.dayOfWeek ?? null,
    scheduledFor: row.scheduledFor ?? null,
    focusArea: row.focusArea ?? null,
    difficultyLevel: row.difficultyLevel ?? null,
    notes: row.notes ?? null,
    $createdAt: row.$createdAt,
    $updatedAt: row.$updatedAt,
});

//repo
export const programRepo = {
    async create(userId: string, data: Omit<Program, '$id' | 'userId' | '$createdAt' | '$updatedAt'>): Promise<Program> {
        const row = await tables.createRow({
            databaseId: DB_ID,
            tableId: COL_PROGRAM,
            rowId: ID.unique(),
            data: { userId, ...data },
        });
        return toProgramModel(row);
    },

    async get(programId: string): Promise<Program> {
        const row = await tables.getRow({
            databaseId: DB_ID,
            tableId: COL_PROGRAM,
            rowId: programId,
        });
        return toProgramModel(row);
    },

    async list(userId: string): Promise<Program[]> {
        const res = await tables.listRows({
            databaseId: DB_ID,
            tableId: COL_PROGRAM,
            queries: [Query.equal("userId", userId), Query.orderDesc("$createdAt")],
        });
        return res.rows.map(toProgramModel);
    },

    async createWorkout(data: Omit<ProgramWorkout, '$id' | '$createdAt' | '$updatedAt'>): Promise<ProgramWorkout> {
        const row = await tables.createRow({
            databaseId: DB_ID,
            tableId: COL_PROGRAM_WORKOUT,
            rowId: ID.unique(),
            data,
        });
        return toProgramWorkoutModel(row);
    },

    async getWorkout(programWorkoutId: string): Promise<ProgramWorkout> {
        const row = await tables.getRow({
            databaseId: DB_ID,
            tableId: COL_PROGRAM_WORKOUT,
            rowId: programWorkoutId,
        });
        return toProgramWorkoutModel(row);
    },

    async listWorkouts(programId: string): Promise<ProgramWorkout[]> {
        const res = await tables.listRows({
            databaseId: DB_ID,
            tableId: COL_PROGRAM_WORKOUT,
            queries: [Query.equal("programId", programId), Query.orderAsc("dayOfWeek")],
        });
        return res.rows.map(toProgramWorkoutModel);
    },
};