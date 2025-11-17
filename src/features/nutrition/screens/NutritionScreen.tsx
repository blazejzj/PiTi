import { useRouter } from "expo-router";
import { useMemo } from "react";
import { View, Text, FlatList, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../components/Button";
import MealItem from "../components/MealItem";
import MacroPill from "../components/MacroPill";
import { useDailyMeals } from "../hooks/useDailyMeals";
import { useUserNutritionTargets } from "../hooks/useUserNutritionTargets";

export default function NutritionScreen() {
    const router = useRouter();

    const { kcalGoal, loading: targetsLoading } = useUserNutritionTargets();

    // Use memos to avoid recalculations on each render
    const todayISO = useMemo(() => new Date().toISOString(), []);
    const { meals, loading } = useDailyMeals(todayISO);
    const totalKcal = useMemo(
        () => meals.reduce((sum, m) => sum + m.totalKcal, 0),
        [meals]
    );
    const totalCarbs = useMemo(
        () => meals.reduce((s, m) => s + m.carbs, 0),
        [meals]
    );
    const totalProtein = useMemo(
        () => meals.reduce((s, m) => s + m.protein, 0),
        [meals]
    );
    const totalFat = useMemo(
        () => meals.reduce((s, m) => s + m.fat, 0),
        [meals]
    );

    const goal = kcalGoal ?? 2000; // TODO: Unsure if we need a fallback here
    const pct = Math.min(100, goal === 0 ? 0 : (totalKcal / goal) * 100);

    const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const selectedDay = "Mon"; // TODO: make dynamic

    const handleAddMeal = () => router.push("/food/addMeal");

    return (
        <SafeAreaView className="flex-1 bg-white">
            <FlatList
                data={meals}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <MealItem meal={item} />}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View className="h-4" />}
                ListHeaderComponent={() => (
                    <View>
                        <View className="px-5 pt-4">
                            <View className="bg-white border border-neutral-200 rounded-3xl shadow-sm p-5 mb-6">
                                <Text className="text-sm text-neutral-500 mb-1">
                                    Today
                                </Text>
                                {/* TODO: formater dato dynamisk */}
                                <Text className="text-2xl font-bold text-neutral-900 mb-3">
                                    Monday, 1 September
                                </Text>

                                <View className="flex-row justify-between items-end mb-3">
                                    <Text className="text-3xl font-extrabold text-neutral-900">
                                        {totalKcal}
                                    </Text>
                                    <Text className="text-base font-medium text-neutral-500">
                                        / {goal} kcal
                                    </Text>
                                </View>

                                <View className="h-3 bg-neutral-200 rounded-full overflow-hidden">
                                    <View
                                        className="h-3 bg-green-500 rounded-full"
                                        style={{ width: `${pct}%` }}
                                    />
                                </View>

                                <View className="flex-row justify-between mt-4">
                                    <MacroPill
                                        label="Carbs"
                                        value={`${totalCarbs}g`}
                                    />
                                    <MacroPill
                                        label="Protein"
                                        value={`${totalProtein}g`}
                                    />
                                    <MacroPill
                                        label="Fat"
                                        value={`${totalFat}g`}
                                    />
                                </View>

                                {(loading || targetsLoading) && (
                                    <Text className="text-xs text-neutral-400 mt-2">
                                        Loading data...
                                    </Text>
                                )}
                            </View>
                        </View>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="mb-5 px-5"
                        >
                            {WEEKDAYS.map((day) => {
                                const active = day === selectedDay;
                                return (
                                    <Pressable
                                        key={day}
                                        className={`px-5 py-2 mr-2 rounded-full border ${
                                            active
                                                ? "bg-green-500 border-green-500"
                                                : "bg-neutral-100 border-neutral-200"
                                        }`}
                                    >
                                        <Text
                                            className={`font-semibold ${
                                                active
                                                    ? "text-white"
                                                    : "text-neutral-700"
                                            }`}
                                        >
                                            {day}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>

                        <View className="px-5 mb-2">
                            <Text className=" text-neutral-700 mt-6 font-bold text-2xl">
                                Meals
                            </Text>
                        </View>
                    </View>
                )}
                ListFooterComponent={() => (
                    <View className="px-5 py-5">
                        <Button
                            title="+ Add Meal"
                            variant="primary"
                            onPress={handleAddMeal}
                            className="w-full rounded-2xl shadow-md"
                            textClassName="text-lg font-bold text-white"
                        />
                    </View>
                )}
            />
        </SafeAreaView>
    );
}
