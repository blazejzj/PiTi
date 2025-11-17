import { useEffect, useState } from "react";
import { account } from "../../../services/appwrite/appwrite";
import { userProfileRepo } from "../repository/userProfileRepo";

type TargetsState = {
    kcalGoal: number | null;
    carbGoal: number | null;
    proteinGoal: number | null;
    fatGoal: number | null;
    loading: boolean;
    error: string | null;
};

export function useUserNutritionTargets(): TargetsState {
    const [state, setState] = useState<TargetsState>({
        kcalGoal: null,
        carbGoal: null,
        proteinGoal: null,
        fatGoal: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            try {
                setState((s) => ({ ...s, loading: true, error: null }));
                const user = await account.get();
                const profile = await userProfileRepo.getByUserId(user.$id);

                if (!cancelled) {
                    setState({
                        kcalGoal: profile?.dailyKcalTarget ?? null,
                        carbGoal: profile?.carbTargetG ?? null,
                        proteinGoal: profile?.proteinTargetG ?? null,
                        fatGoal: profile?.fatTargetG ?? null,
                        loading: false,
                        error: null,
                    });
                }
            } catch (e: any) {
                if (!cancelled) {
                    setState((s) => ({
                        ...s,
                        loading: false,
                        error: e?.message ?? "Failed to load targets",
                    }));
                }
            }
        };

        run();

        return () => {
            cancelled = true;
        };
    }, []);

    return state;
}
