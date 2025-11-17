import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../components/Button";
import MealItem from "../components/MealItem";
import MacroPill from "../components/MacroPill";
import { useDailyMeals } from "../hooks/useDailyMeals";
import { useUserNutritionTargets } from "../hooks/useUserNutritionTargets";
import { isSameDay } from "../utils/date";

const WEEKDAY_LABELS = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
] as const;

export default function NutritionScreen() {
    // We use Memos because of performance optimization, even though
    // those simple calculations probably dont need it, we still wanted some good practice

    const router = useRouter();
    const { kcalGoal, loading: targetsLoading } = useUserNutritionTargets();

    const today = useMemo(() => new Date(), []);
    const [weekOffset, setWeekOffset] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date>(today);

    const selectedISO = useMemo(
        () => selectedDate.toISOString(),
        [selectedDate]
    );

    const selectedLabel = useMemo(
        () =>
            selectedDate.toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
            }),
        [selectedDate]
    );

    const { meals, loading, deleteMeal, error } = useDailyMeals(selectedISO);

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

    const goal = kcalGoal ?? 0;
    const pct = goal > 0 ? Math.min(100, (totalKcal / goal) * 100) : 0;

    // TODO: What would be cool here is adding a calender and just jumping to the date
    // isntead of week by week navigation, but for MVP this is fine
    // week range: 7 days ending on "endDate" (never after "today")
    const weekDays = useMemo(() => {
        const endDate = new Date(today);
        endDate.setDate(today.getDate() - weekOffset * 7);

        const days: { label: string; date: Date }[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(endDate);
            d.setDate(endDate.getDate() - i);
            days.push({
                label: WEEKDAY_LABELS[d.getDay()],
                date: d,
            });
        }
        return days;
    }, [today, weekOffset]);

    const handleAddMeal = () => router.push("/food/addMeal");

    const handlePrevWeek = () => {
        setWeekOffset((prev) => {
            const next = prev + 1;
            const endDate = new Date(today);
            endDate.setDate(today.getDate() - next * 7);
            setSelectedDate(endDate);
            return next;
        });
    };

    const handleNextWeek = () => {
        setWeekOffset((prev) => {
            if (prev === 0) return prev;
            const next = prev - 1;
            const endDate = new Date(today);
            endDate.setDate(today.getDate() - next * 7);
            setSelectedDate(endDate);
            return next;
        });
    };

    const isThisWeek = weekOffset === 0;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <FlatList
                data={meals}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <MealItem
                        meal={item}
                        onDelete={() => deleteMeal(item.id)}
                    />
                )}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View className="h-4" />}
                ListHeaderComponent={() => (
                    <View>
                        <View className="px-5 pt-4">
                            <View className="bg-white border border-neutral-200 rounded-3xl shadow-sm p-5 mb-6">
                                <Text className="text-sm text-neutral-500 mb-1">
                                    {isSameDay(selectedDate, today)
                                        ? "Today"
                                        : ""}
                                </Text>

                                <Text className="text-2xl font-bold text-neutral-900 mb-3">
                                    {selectedLabel}
                                </Text>

                                <View className="flex-row justify-between items-end mb-3">
                                    <Text className="text-3xl font-extrabold text-neutral-900">
                                        {totalKcal}
                                    </Text>
                                    <Text className="text-base font-medium text-neutral-500">
                                        {goal > 0
                                            ? `/ ${goal} kcal`
                                            : "No goal set"}
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

                                {error && (
                                    <Text className="text-xs text-red-500 mt-1">
                                        {error}
                                    </Text>
                                )}
                            </View>
                        </View>

                        <View className="px-5 mb-2 flex-row items-center justify-between">
                            <Pressable
                                onPress={handlePrevWeek}
                                className="px-2 py-1"
                            >
                                <Text className="text-neutral-700">{`←`}</Text>
                            </Pressable>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                className="flex-1 mx-2"
                            >
                                {weekDays.map(({ label, date }) => {
                                    const active = isSameDay(
                                        date,
                                        selectedDate
                                    );
                                    return (
                                        <Pressable
                                            key={date.toDateString()}
                                            onPress={() =>
                                                setSelectedDate(new Date(date))
                                            }
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
                                                {label}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>

                            <Pressable
                                onPress={handleNextWeek}
                                disabled={isThisWeek}
                                className="px-2 py-1"
                            >
                                <Text
                                    className={`${
                                        isThisWeek
                                            ? "text-neutral-300"
                                            : "text-neutral-700"
                                    }`}
                                >
                                    {`→`}
                                </Text>
                            </Pressable>
                        </View>

                        <View className="px-5 mb-2">
                            <Text className="text-neutral-700 mt-6 font-bold text-2xl">
                                Meals
                            </Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    !loading ? (
                        <View className="px-5 py-10">
                            <Text className="text-center text-neutral-500">
                                No meals logged this day. Tap &quot;+ Add
                                Meal&quot; to get started.
                            </Text>
                        </View>
                    ) : null
                }
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
