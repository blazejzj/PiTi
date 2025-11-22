import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import type { UserProfile } from "../../profile/models";
import { useDailyNutrition } from "../../nutrition/hooks/useDailyNutrition";
import { CalorieRing } from "../components/CalorieRing";

type Props = {
    profile: UserProfile;
    userId: string | null;
};

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

export default function DashboardScreen({ profile, userId }: Props) {
    const router = useRouter();
    const [reloadKey, setReloadKey] = useState(0);

    // we want to reload daily nutrition data when screen is focused
    useFocusEffect(
        useCallback(() => {
            setReloadKey((k) => k + 1);
        }, [])
    );

    const { totals, loading } = useDailyNutrition(userId, reloadKey);

    const targetKcal = profile.daily_kcal_target ?? 0;
    const todayKcal = totals.kcal;

    const greeting = getGreeting();
    const todayString = new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
    });

    const motivationMessages = [
        "One small step today is still a step.",
        "Future you is already grateful.",
        "You don’t need perfect, just consistent.",
        "Some movement is always better than none.",
        "Strong starts with showing up.",
    ];

    const [motivation] = useState(() => {
        const i = Math.floor(Math.random() * motivationMessages.length);
        return motivationMessages[i];
    });

    const proteinTarget = profile.protein_target_g ?? 0;
    const fatTarget = profile.fat_target_g ?? 0;
    const carbTarget = profile.carb_target_g ?? 0;

    return (
        <SafeAreaView className="flex-1 bg-neutral-50">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: 16,
                    paddingBottom: 40,
                    paddingHorizontal: 20,
                }}
            >
                <View className="mb-6">
                    <Text className="text-sm text-neutral-500">
                        {todayString}
                    </Text>
                    <Text className="text-4xl font-extrabold mt-1">
                        {greeting} <Text className="theme-text-color">•</Text>
                    </Text>
                    <Text className="text-neutral-500 mt-3 text-sm">
                        {motivation}
                    </Text>
                </View>

                <View className="rounded-2xl p-5 bg-white border border-neutral-200 shadow-sm mb-4">
                    <Text className="text-lg font-semibold mb-3">
                        Today's overview
                    </Text>

                    <CalorieRing
                        current={loading ? 0 : todayKcal}
                        target={targetKcal}
                        carbs={loading ? 0 : totals.carbG}
                        protein={loading ? 0 : totals.proteinG}
                        fat={loading ? 0 : totals.fatG}
                    />

                    <View className="mt-5">
                        <Text className="text-xs text-neutral-500 mb-1">
                            Macros today
                        </Text>

                        <View className="flex-row justify-between">
                            <View className="flex-1 mr-2 rounded-xl bg-neutral-50 p-3 border border-neutral-200">
                                <Text className="text-xs text-neutral-500">
                                    Protein
                                </Text>
                                <Text className="text-lg font-semibold mt-1">
                                    {loading ? "…" : totals.proteinG.toFixed(1)}
                                    g
                                </Text>
                                <Text className="text-xs text-neutral-500 mt-1">
                                    Target: {proteinTarget || "—"}g
                                </Text>
                            </View>

                            <View className="flex-1 mx-1 rounded-xl bg-neutral-50 p-3 border border-neutral-200">
                                <Text className="text-xs text-neutral-500">
                                    Carbs
                                </Text>
                                <Text className="text-lg font-semibold mt-1">
                                    {loading ? "…" : totals.carbG.toFixed(1)}g
                                </Text>
                                <Text className="text-xs text-neutral-500 mt-1">
                                    Target: {carbTarget || "—"}g
                                </Text>
                            </View>

                            <View className="flex-1 ml-2 rounded-xl bg-neutral-50 p-3 border border-neutral-200">
                                <Text className="text-xs text-neutral-500">
                                    Fat
                                </Text>
                                <Text className="text-lg font-semibold mt-1">
                                    {loading ? "…" : totals.fatG.toFixed(1)}g
                                </Text>
                                <Text className="text-xs text-neutral-500 mt-1">
                                    Target: {fatTarget || "—"}g
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="rounded-2xl p-4 bg-white border border-dashed border-neutral-300 mb-6">
                    <Text className="text-sm font-semibold text-neutral-700">
                        Streak
                    </Text>
                    <Text className="text-xs text-neutral-500 mt-1">
                        Streak tracking will appear here later. For now, just
                        keep showing up!
                    </Text>
                </View>

                <View className="mb-4">
                    <Text className="text-base font-semibold text-neutral-800 mb-2">
                        Quick actions
                    </Text>

                    {/* TODO: Change this to our Button Compoenet probably */}
                    <View className="gap-2">
                        <Pressable
                            onPress={() => router.push("/training")}
                            className="w-full rounded-2xl py-3 px-4 theme-bg-color"
                        >
                            <Text className="text-white font-semibold text-base text-center">
                                Start a workout
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => router.push("/nutrition")}
                            className="w-full rounded-2xl py-3 px-4 bg-white border border-neutral-200"
                        >
                            <Text className="text-neutral-800 font-medium text-base text-center">
                                Log a meal
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => router.push("/(home)/profile")}
                            className="w-full rounded-2xl py-3 px-4 bg-white border border-neutral-200"
                        >
                            <Text className="text-neutral-800 font-medium text-base text-center">
                                View profile
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
