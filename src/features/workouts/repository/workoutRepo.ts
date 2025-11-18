import { ID, Query } from "appwrite";
import {
    tables,
    DB_ID,
    COL_WORKOUT,
    COL_WORKOUT_EXERCISE,
    COL_WORKOUT_SET,
} from "../../../services/appwrite/appwrite";

import type { Workout, WorkoutExercise, WorkoutSet } from "../models";

// helpers
const toWorkoutModel = (row: any): Workout => ({
    $id: row.$id,
    userId: row.userId,
    name: row.name,
    startedAt: row.startedAt,
    endedAt: row.endedAt ?? null,
    notes: row.notes ?? null,
    durationMinutes: row.durationMinutes ?? null,
    caloriesBurned: row.caloriesBurned ?? null,
    $createdAt: row.$createdAt,
    $updatedAt: row.$updatedAt,
});

const toWorkoutExerciseModel = (row: any): WorkoutExercise => ({
    $id: row.$id,
    workoutId: row.workoutId,
    exerciseName: row.exerciseName,
    $createdAt: row.$createdAt,
    $updatedAt: row.$updatedAt,
});

const toWorkoutSetModel = (row: any): WorkoutSet => ({
    $id: row.$id,
    workoutExerciseId: row.workoutExerciseId,
    setNumber: row.setNumber,
    repetitions: row.repetitions,
    weightKg: row.weightKg ?? null,
    $createdAt: row.$createdAt,
    $updatedAt: row.$updatedAt,
});

//repo
export const workoutRepo = {
    async create(userId: string, data: Omit<Workout, '$id' | 'userId' | '$createdAt' | '$updatedAt'>): Promise<Workout> {
        const row = await tables.createRow({
            databaseId: DB_ID,
            tableId: COL_WORKOUT,
            rowId: ID.unique(),
            data: { userId, ...data },
        });
        return toWorkoutModel(row);
    },

    async get(workoutId: string): Promise<Workout> {
        const row = await tables.getRow({
            databaseId: DB_ID,
            tableId: COL_WORKOUT,
            rowId: workoutId,
        });
        return toWorkoutModel(row);
    },

    async list(userId: string): Promise<Workout[]> {
        const res = await tables.listRows({
            databaseId: DB_ID,
            tableId: COL_WORKOUT,
            queries: [Query.equal("userId", userId), Query.orderDesc("startedAt"), Query.limit(10)],
        });
        return res.rows.map(toWorkoutModel);
    },
    async deleteById(workoutId: string): Promise<void> {
        
        await tables.deleteRow({ 
            databaseId: DB_ID,
            tableId: COL_WORKOUT, 
            rowId: workoutId,
        });
    },

    async listExercises(workoutId: string): Promise<WorkoutExercise[]> {
        const res = await tables.listRows({
            databaseId: DB_ID,
            tableId: COL_WORKOUT_EXERCISE,
            queries: [Query.equal("workoutId", workoutId), Query.orderAsc("$createdAt")],
        });
        return res.rows.map(toWorkoutExerciseModel);
    },


    async createExercise(data: Omit<WorkoutExercise, '$id' | '$createdAt' | '$updatedAt'>): Promise<WorkoutExercise> {
        const row = await tables.createRow({
            databaseId: DB_ID,
            tableId: COL_WORKOUT_EXERCISE,
            rowId: ID.unique(),
            data,
        });
        return toWorkoutExerciseModel(row);
    },

    async listSets(workoutExerciseId: string): Promise<WorkoutSet[]> {
        const res = await tables.listRows({
            databaseId: DB_ID,
            tableId: COL_WORKOUT_SET,
            queries: [Query.equal("workoutExerciseId", workoutExerciseId), Query.orderAsc("setNumber")],
        });
        return res.rows.map(toWorkoutSetModel);
    },

    async createSet(data: Omit<WorkoutSet, '$id' | '$createdAt' | '$updatedAt'>): Promise<WorkoutSet> {
        try {
        const row = await tables.createRow({
            databaseId: DB_ID,
            tableId: COL_WORKOUT_SET,
            rowId: ID.unique(),
            data: { ...data },
        });
        return toWorkoutSetModel(row);
         } catch (error) {
             console.error("createSet failed with error:", error);
        throw error;
         }
    },
    async deleteExerciseById(exerciseId: string): Promise<void> {
        await tables.deleteRow({
            databaseId: DB_ID,
            tableId: COL_WORKOUT_EXERCISE,
            rowId: exerciseId,
        });
    },

    async updateSet(setId: string, repetitions: number, weightKg: number): Promise<WorkoutSet> {
        const row = await tables.updateRow({
            databaseId: DB_ID,
            tableId: COL_WORKOUT_SET,
            rowId: setId,
            data: { 
                repetitions, 
                weightKg: weightKg > 0 ? weightKg : null,
            },
        });
        return toWorkoutSetModel(row);
    },

    async updateExercise(exerciseId: string, data: Partial<Omit<WorkoutExercise, '$id' | 'workoutId' | '$createdAt' | '$updatedAt'>>): Promise<WorkoutExercise> {
        const row = await tables.updateRow({
            databaseId: DB_ID,
            tableId: COL_WORKOUT_EXERCISE,
            rowId: exerciseId,
            data: data,
        });
        return toWorkoutExerciseModel(row);
    },
    async finishWorkout(workoutId: string, durationMinutes: number): Promise<Workout> {
    const row = await tables.updateRow({
        databaseId: DB_ID,
        tableId: COL_WORKOUT,
        rowId: workoutId,
        data: {
            endedAt: new Date().toISOString(),
            durationMinutes: durationMinutes,
        },
    });
    return toWorkoutModel(row);
},
async getExercise(exerciseId: string): Promise<WorkoutExercise> {
        const row = await tables.getRow({
            databaseId: DB_ID,
            tableId: COL_WORKOUT_EXERCISE,
            rowId: exerciseId,
        });
        return toWorkoutExerciseModel(row);
    },
    async addSet(workoutExerciseId: string, setNumber: number, repetitions: number, weightKg: number): Promise<WorkoutSet> {
        try {
            const row = await tables.createRow({
                databaseId: DB_ID,
                tableId: COL_WORKOUT_SET,
                rowId: ID.unique(),
                data: { 
                    workoutExerciseId, 
                    setNumber, 
                    repetitions, 
                    weightKg: weightKg > 0 ? weightKg : null, 
                },
            });
            return toWorkoutSetModel(row);
        } catch (error) {
            console.error("addSet failed with error:", error);
            throw error;
        }
    },
    async deleteSet(setId: string): Promise<void> {
        await tables.deleteRow({
            databaseId: DB_ID,
            tableId: COL_WORKOUT_SET,
            rowId: setId,
        });
    },
};