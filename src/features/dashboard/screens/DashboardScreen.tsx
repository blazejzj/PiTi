import { View, Text, Pressable } from "react-native";
import { useCallback } from "react"; 
import { useFocusEffect } from "expo-router"; 
import type { UserProfile } from "../../profile/models";
import { useDailyNutrition } from "../../nutrition/hooks/useDailyNutrition";
import { useWeeklyWorkoutStats } from "../../workouts/hooks/useWeeklyWorkoutStats";
import { DailyStatsHeader } from "../../workouts/components/DailyStatsHeader"; 


type Props = {
    profile: UserProfile; // already loaded profile (not null)
    userId: string | null; // to be able to fetch nutrition data for dashboardscreen.
    onLogout: () => void; // container handles actual logout
};

export default function DashboardScreen({ profile, userId, onLogout }: Props) {
    // NB! useDailyNutrition need refetch funksjon for dataupdate
    const { totals, loading: nutritionLoading } = useDailyNutrition(userId); 
    
    const {
        currentDateString,
        sessionsThisWeek,
        averageTimeMinutes,
        isLoading: workoutLoading,
        refetchWorkouts,
    } = useWeeklyWorkoutStats(!!userId); 
    
    useFocusEffect(
        useCallback(() => {
            console.log("Dashboard focused, refetching workouts...");
            refetchWorkouts();
        }, [refetchWorkouts])
    );


    const target = profile.daily_kcal_target ?? 0;
    const today = totals.kcal;
    const remaining = Math.max(0, target - today);
    
    const loading = nutritionLoading || workoutLoading;

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Text>Loading dashboard data...</Text>
            </View>
        );
    }
    
    return (
        <View className="flex-1 pt-20 px-4 bg-white p-safe"> 
            
            <View className="px-8"> 
                <Text className="text-3xl font-bold">
                    Dashboard <Text className="theme-text-color">•</Text>
                </Text>

                <DailyStatsHeader 
                    date={currentDateString}
                    sessionsThisWeek={sessionsThisWeek}
                    averageTimeMinutes={averageTimeMinutes}
                />
            
                <View className="p-4 border border-green-700 rounded-xl bg-green-50 mb-6">
                    <Text className="text-xl font-semibold">Calories</Text>
                    <Text className="text-neutral-600 mt-1">
                        Target: {target || "N/A"} kcal
                    </Text>
                    <Text className="text-neutral-600">Today: {today} kcal</Text>
                    <Text className="mt-2 text-lg font-bold">
                        Remaining: {target ? remaining : "—"} kcal
                    </Text>
                </View>

                <View className="p-4 border border-green-700 rounded-xl bg-green-50 mb-6">
                    <Text className="text-xl font-semibold">Macros</Text>
                    <Text className="text-neutral-600 mt-1">
                        Protein: {totals.proteinG.toFixed(1)}g /{" "}
                        {profile.protein_target_g ?? "—"}g
                    </Text>
                    <Text className="text-neutral-600">
                        Fat: {totals.fatG.toFixed(1)}g /{" "}
                        {profile.fat_target_g ?? "—"} g
                    </Text>
                    <Text className="text-neutral-600">
                        Carbs: {totals.carbG.toFixed(1)}g /{" "}
                        {profile.carb_target_g ?? "—"} g
                    </Text>
                </View>

                <Pressable
                    onPress={onLogout}
                    className="mt-8 px-6 py-3 rounded-xl self-start theme-bg-color"
                >
                    <Text className="text-white font-semibold">Log out</Text>
                </Pressable>
            </View>
        </View>
    );
}