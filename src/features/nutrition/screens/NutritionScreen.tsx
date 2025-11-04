import { useRouter } from "expo-router";
import { useState, useMemo } from "react";
import { View, Text, FlatList, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../components/Button";
import { DummyMeals } from "../../../lib/dummyDataMeal";
import MealItem from "../components/MealItem";
import { Meal } from "../../../types/nutrition";
import MacroPill from "../components/MacroPill";

export default function NutritionScreen() {
    const router = useRouter();
    const [meals, setMeals] = useState<Meal[]>(DummyMeals);

    const totalKcal = useMemo(
        () => meals.reduce((sum, m) => sum + m.totalKcal, 0),
        [meals]
    );
    // TODO: Fetch user's kcal goal from settings
    // For now, we use a fixed value
    const kcalGoal = 2500;
    const pct = Math.min(100, (totalKcal / kcalGoal) * 100);

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

    // TODO: Implement real weekday selection
    const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const selectedDay = "Mon";

    const handleAddMeal = () => router.push("/food/addMeal");

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* TODO: Eh, btw this is dummy data, we should get real added meals from DB */}
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
                                {/* TODO: Should be dynamic together with date under */}
                                <Text className="text-sm text-neutral-500 mb-1">
                                    Today
                                </Text>
                                <Text className="text-2xl font-bold text-neutral-900 mb-3">
                                    Monday, 1 September
                                </Text>

                                <View className="flex-row justify-between items-end mb-3">
                                    <Text className="text-3xl font-extrabold text-neutral-900">
                                        {totalKcal}
                                    </Text>
                                    <Text className="text-base font-medium text-neutral-500">
                                        / {kcalGoal} kcal
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
                            </View>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="mb-5 px-5"
                        >
                            {/*plz no judge, we used map because the list is small and static, we know about FlatList*/}
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
