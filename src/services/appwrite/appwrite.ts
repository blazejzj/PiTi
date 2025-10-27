import { Account, Client, TablesDB } from "appwrite";

export const APPWRITE_ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
export const APPWRITE_PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
export const DB_ID = process.env.EXPO_PUBLIC_APPWRITE_DB_ID!;
export const COL_USER = process.env.EXPO_PUBLIC_APPWRITE_COL_USER!;
export const COL_USER_PROFILE =
    process.env.EXPO_PUBLIC_APPWRITE_COL_USER_PROFILE!;

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const tables = new TablesDB(client);
