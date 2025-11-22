import { View, Text } from "react-native";
import type { UserProfile } from "../../profile/models";
import { useDailyNutrition } from "../../nutrition/hooks/useDailyNutrition";

type Props = {
    profile: UserProfile; // already loaded profile (not null)
    userId: string | null; // to be able to fetch nutrition data for dashboardscreen.
};

// now displays REAL totals based on added meals, using the latest logic from last PR on nutrition(18) and updated useDaulyNutrition hook.)

export default function DashboardScreen({ profile, userId }: Props) {
    const { totals, loading, error } = useDailyNutrition(userId);

    const target = profile.daily_kcal_target ?? 0;
    const today = totals.kcal;
    const remaining = Math.max(0, target - today);

    return (
        <View className="flex-1 bg-white p-safe px-8 pt-20">
            <Text className="text-3xl font-bold">
                Dashboard <Text className="theme-text-color">•</Text>
            </Text>

            {/* CALORIES */}
            <View className="mt-6 rounded-2xl p-5 bg-neutral-100">
                <Text className="text-xl font-semibold">Calories</Text>
                <Text className="text-neutral-600 mt-1">
                    Target: {target || "N/A"} kcal
                </Text>
                <Text className="text-neutral-600">Today: {today} kcal</Text>
                <Text className="mt-2 text-lg font-bold">
                    Remaining: {target ? remaining : "—"} kcal
                </Text>
            </View>

            {/* MACROS */}
            <View className="mt-4 rounded-2xl p-5 bg-neutral-100">
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
        </View>
    );
}
