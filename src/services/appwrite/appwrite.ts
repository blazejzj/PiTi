import { Account, Client, TablesDB } from "appwrite";

export const APPWRITE_ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
export const APPWRITE_PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
export const DB_ID = process.env.EXPO_PUBLIC_APPWRITE_DB_ID!;
export const COL_USER = process.env.EXPO_PUBLIC_APPWRITE_COL_USER!;
export const COL_USER_PROFILE =
    process.env.EXPO_PUBLIC_APPWRITE_COL_USER_PROFILE!;
export const COL_FOOD_ITEM = process.env.EXPO_PUBLIC_APPWRITE_COL_FOOD_ITEM!;
export const COL_MEAL_ITEM = process.env.EXPO_PUBLIC_APPWRITE_COL_MEAL_ITEM!;
export const COL_MEAL = process.env.EXPO_PUBLIC_APPWRITE_COL_MEAL!;
export const COL_PROGRAM = process.env.EXPO_PUBLIC_APPWRITE_COL_PROGRAM!;
export const COL_PROGRAM_WORKOUT =
    process.env.EXPO_PUBLIC_APPWRITE_COL_PROGRAM_WORKOUT!;
export const COL_WORKOUT = process.env.EXPO_PUBLIC_APPWRITE_COL_WORKOUT!;
export const COL_WORKOUT_EXERCISE =
    process.env.EXPO_PUBLIC_APPWRITE_COL_WORKOUT_EXERCISE!;
export const COL_WORKOUT_SET = process.env.EXPO_PUBLIC_APPWRITE_COL_WORKOUT_SET!;
export const COL_EXERCISE_TEMPLATE =
    process.env.EXPO_PUBLIC_APPWRITE_COL_EXERCISE_TEMPLATE!;

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const tables = new TablesDB(client);
