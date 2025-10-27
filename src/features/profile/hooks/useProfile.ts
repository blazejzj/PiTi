import { useEffect, useState, useCallback } from "react";
import { account } from "../../../services/appwrite/appwrite";
import { getUserProfile } from "../api/profileRepo";
import type { UserProfile } from "../models";

export function useProfile() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [error, setError] = useState<unknown>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // helper for reloading the user + profile data
    // We use callback because we want to cache the func, not sure if this is
    // the right approach here
    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const currentUser = await account.get(); // grab current logged-in user
            setUserId(currentUser.$id);

            const p = await getUserProfile(currentUser.$id); // load user profile
            setProfile(p);
        } catch (e) {
            // something exploded for now store it and move on
            setError(e);
        } finally {
            setLoading(false);
        }
    }, []);

    // run once on mount
    useEffect(() => {
        load();
    }, [load]);

    return { loading, profile, error, userId, refresh: load };
}
