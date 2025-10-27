import { ID, Query } from "appwrite";
import {
    tables,
    DB_ID,
    COL_USER_PROFILE,
} from "../../../services/appwrite/appwrite";
import type { UserProfile } from "../models";

// Fetch a single user profile by user_id.
// Returns null if no row exists (meaning: first-time user).
export async function getUserProfile(
    userId: string
): Promise<UserProfile | null> {
    const res = await tables.listRows({
        databaseId: DB_ID,
        tableId: COL_USER_PROFILE,
        queries: [Query.equal("user_id", userId), Query.limit(1)],
    });

    // TablesDB returns `rows`, not `documents` like old SDK.
    return res.total > 0 ? (res.rows[0] as unknown as UserProfile) : null;
}

// create or update a profile for a user.
// which means iff a profile already exists -> patch it. Otherwise -> create a new one.
// For MVP: no permissions
export async function upsertUserProfile(
    userId: string,
    patch: Partial<UserProfile>
): Promise<UserProfile> {
    const existing = await getUserProfile(userId);

    if (existing) {
        const updated = await tables.updateRow({
            databaseId: DB_ID,
            tableId: COL_USER_PROFILE,
            rowId: existing.$id,
            data: patch as Record<string, any>, // we're chill here xd
        });
        return updated as unknown as UserProfile;
    }

    const created = await tables.createRow({
        databaseId: DB_ID,
        tableId: COL_USER_PROFILE,
        rowId: ID.unique(), // random id is fine for now
        data: { user_id: userId, ...patch } as Record<string, any>,
    });
    return created as unknown as UserProfile;
}
