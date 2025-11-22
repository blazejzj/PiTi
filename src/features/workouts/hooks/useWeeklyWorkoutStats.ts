import { useState, useCallback, useMemo } from "react";
import { workoutRepo } from "../repository/workoutRepo";
import { Workout } from "../models"; 
import { getCurrentUserSafely } from "../../../services/appwrite/authGuard";
import Toast from "react-native-toast-message";

type WorkoutStats = {
    workouts: Workout[];
    currentDateString: string;
    sessionsThisWeek: number;
    averageTimeMinutes: number;
    isLoading: boolean;
    error: any;
    refetchWorkouts: () => void;
};

export const useWeeklyWorkoutStats = (shouldFetch: boolean = true): WorkoutStats => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const handleFetchWorkouts = useCallback(async () => {
        if (!shouldFetch) return;
        setIsLoading(true);
        setError(null);
        try {
            const user = await getCurrentUserSafely();
            const userId = user?.$id; 
            
            if (!userId) {
                console.error("User ID not found, cannot fetch workouts.");
                setWorkouts([]);
                setIsLoading(false);
                return;
            }

            const fetchedWorkouts = await workoutRepo.list(userId); 
            setWorkouts(fetchedWorkouts);
        } catch (e) {
            setError(e);
            Toast.show({
                type: "error",
                text1: "Workout Fetch Error",
                text2: "Failed during workout fetch",
            });
        } finally {
            setIsLoading(false);
        }
    }, [shouldFetch]);

    const stats = useMemo(() => {
        const today = new Date();
        const oneWeekAgo = today.getTime() - (7 * 24 * 60 * 60 * 1000); 

        const currentDateString = today.toLocaleDateString(undefined, {
            weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
        });

        const sessionsThisWeek = workouts.filter(w => 
            new Date(w.startedAt).getTime() >= oneWeekAgo
        ).length;

        const completedWorkouts = workouts.filter(w => !!w.endedAt);
        const totalTimeMinutes = completedWorkouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);
        
        const averageTimeMinutes = completedWorkouts.length > 0
            ? Math.round(totalTimeMinutes / completedWorkouts.length)
            : 0;

        return { 
            currentDateString, 
            sessionsThisWeek, 
            averageTimeMinutes 
        };
    }, [workouts]);
    
    return {
        workouts,
        ...stats,
        isLoading,
        error,
        refetchWorkouts: handleFetchWorkouts,
    };
};