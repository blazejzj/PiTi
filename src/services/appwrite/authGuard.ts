import { account } from "./appwrite";

export async function ensureNoActiveSession() {
    try {
        await account.deleteSession({ sessionId: "current" });
    } catch {
        // no catch necessary here I believe
    }
}

export async function getCurrentUserSafely() {
    try {
        return await account.get();
    } catch {
        // if no user we just return null at this point
        return null;
    }
}
