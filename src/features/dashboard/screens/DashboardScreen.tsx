import { View, Text, Pressable } from "react-native";
import type { UserProfile } from "../../profile/models";

type Props = {
    profile: UserProfile; // already loaded profile (not null)
    onLogout: () => void; // container handles actual logout
};

export default function DashboardScreen({ profile, onLogout }: Props) {
    // TODO: replace when we have real daily totals
    const target = profile.daily_kcal_target ?? 0;
    const today = 0;
    const remaining = Math.max(0, target - today);

    return (
        <View className="flex-1 bg-white p-8">
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
                    Protein: {profile.protein_target_g ?? "—"} g
                </Text>
                <Text className="text-neutral-600">
                    Fat: {profile.fat_target_g ?? "—"} g
                </Text>
                <Text className="text-neutral-600">
                    Carbs: {profile.carb_target_g ?? "—"} g
                </Text>
            </View>

            <Pressable
                onPress={onLogout}
                className="mt-8 px-6 py-3 rounded-xl self-start theme-bg-color"
            >
                <Text className="text-white font-semibold">Log out</Text>
            </Pressable>
        </View>
    );
}
