import { Pressable, Text, View, ScrollView, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import Button from "../../../components/Button";
import FormInput from "../../../components/FormInput";
import { account } from "../../../services/appwrite/appwrite";
import { mealRepo } from "../repository/mealRepo";
import { foodItemRepo } from "../repository/foodItemRepo";
import { mealItemRepo } from "../repository/mealItemRepo";
import { useMealDraft } from "../state/useMealDraft";
import MacroPill from "../components/MacroPill";
import ScreenContainer from "../../auth/components/ScreenContainer";
import { MealType } from "../models";

type MealFormInputs = { mealName: string; notes: string };

// Like mentioned laready once, TODO: Shouuld maybe remove this or make it more flexible?
// for now its okay
const MEAL_TYPES: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snacks"];

// TODO: HELPERS, should probably go to utils later
const toTodayISOWithTime = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    const d = new Date();
    d.setHours(h || 0, m || 0, 0, 0);
    return d.toISOString();
};
const kcalForAmount = (kcalPer100g: number, amountG: number) =>
    Math.round(((kcalPer100g || 0) * amountG) / 100);

export default function AddMealScreen() {
    const router = useRouter();

    const [selectedMealType, setSelectedMealType] =
        useState<MealType>("Breakfast");
    const [selectedTime, setSelectedTime] = useState<string>("08:00");

    const draft = useMealDraft();

    // probably unnecessary use of useMemo here, and could use useState in draft directly
    const totals = useMemo(() => draft.totals(), [draft.items]);
    const totalKcal = totals.kcal;

    const { control, handleSubmit, watch } = useForm<MealFormInputs>({
        defaultValues: { mealName: "", notes: "" },
    });

    // KEep the meal name in sync with draft state
    const mealNameWatch = watch("mealName");

    useEffect(() => {
        if (draft.mealName !== mealNameWatch) {
            draft.setMealName(mealNameWatch ?? "");
        }
    }, [mealNameWatch]);

    const handleAddFoodItem = () => router.push("/food/scanItem");

    const onSubmit = async (data: MealFormInputs) => {
        // get user
        const user = await account.get();
        const timeISO = toTodayISOWithTime(selectedTime);

        // create meal
        const meal = await mealRepo.create({
            userId: user.$id,
            name: data.mealName || "Untitled meal",
            type: selectedMealType,
            timeISO,
            notes: data.notes || "",
        });

        // create meal items
        await Promise.all(
            draft.items.map(async (it) => {
                const fi = await foodItemRepo.get(it.foodItemId);
                await mealItemRepo.create({
                    mealId: meal.$id,
                    foodItemId: it.foodItemId,
                    amountG: it.amountG,
                    kcalPer100g: fi.kcalPer100g ?? 0,
                    carbPer100g: fi.carbPer100g ?? 0,
                    fatPer100g: fi.fatPer100g ?? 0,
                    proteinPer100g: fi.proteinPer100g ?? 0,
                });
            })
        );

        // clear draft and go back
        draft.clear();
        router.back();
    };

    const handleAddMeal = handleSubmit(onSubmit);

    return (
        <ScreenContainer className="flex-1 bg-white">
            <View className="px-5 pb-3 flex-row items-center">
                <Pressable onPress={() => router.back()}>
                    <Text className="font-semibold text-neutral-700">
                        ← Back
                    </Text>
                </Pressable>
                <Text className="flex-1 text-center text-2xl font-bold text-neutral-900 mr-10">
                    Add Meal
                </Text>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 }}
            >
                <View className="px-5">
                    <View className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-5 mb-5">
                        <Text className="text-neutral-700 font-medium mb-3">
                            Meal details
                        </Text>

                        <FormInput
                            control={control}
                            name="mealName"
                            label="Name"
                            placeholder="Chicken salad, Oats & berries..."
                            autoCapitalize="words"
                        />

                        <View className="mt-4">
                            <Text className="text-base font-medium text-neutral-700 mb-2">
                                Meal Type
                            </Text>
                            <View className="flex-row flex-wrap">
                                {MEAL_TYPES.map((t) => {
                                    const active = t === selectedMealType;
                                    return (
                                        <Pressable
                                            key={t}
                                            onPress={() =>
                                                setSelectedMealType(t)
                                            }
                                            className={`px-4 py-2 mr-2 mb-2 rounded-xl border ${
                                                active
                                                    ? "bg-green-500 border-green-500"
                                                    : "bg-neutral-100 border-neutral-200"
                                            }`}
                                        >
                                            <Text
                                                className={
                                                    active
                                                        ? "text-white font-semibold"
                                                        : "text-neutral-800 font-medium"
                                                }
                                            >
                                                {t}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>

                        <View className="mt-4">
                            <Text className="text-base font-medium text-neutral-700 mb-2">
                                Time
                            </Text>
                            <Pressable
                                onPress={() =>
                                    setSelectedTime((prev) =>
                                        prev === "08:00" ? "12:00" : "08:00"
                                    )
                                }
                                className="p-4 rounded-xl border border-neutral-200 bg-neutral-100 flex-row justify-between items-center"
                            >
                                <Text className="text-neutral-900 text-base">
                                    {selectedTime}
                                </Text>
                                <Text>▼</Text>
                            </Pressable>
                            {/* TODO: Implement real time picker this is shit */}
                            <Text className="text-xs text-neutral-500 mt-1">
                                Temporary time switcher.
                            </Text>
                        </View>
                    </View>

                    <View className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-5 mb-5">
                        <Text className="text-neutral-700 font-medium mb-3">
                            Food items
                        </Text>

                        <Button
                            onPress={handleAddFoodItem}
                            title="+ Add or Scan Food"
                            variant="primary"
                            className="w-full rounded-xl mb-3"
                            textClassName="text-base font-bold text-white"
                        />

                        {draft.items.length === 0 ? (
                            <Text className="text-neutral-500">
                                No items yet. Add or scan to start.
                            </Text>
                        ) : (
                            <View className="mt-1">
                                {/* 
                                    TODO: Add input or slider here so user can adjust amount eaten for ex. 60g instead of default 100g.
                                    When changed, update it.amountG in draft.items and recalc kcal/macros with kcalForAmount() aw yes
                                */}

                                {draft.items.map((it, idx) => (
                                    <View
                                        key={`${it.foodItemId}-${idx}`}
                                        className="flex-row justify-between items-center py-3 border-b border-neutral-100"
                                    >
                                        <View className="flex-1 pr-3">
                                            <Text
                                                className="text-neutral-900 font-medium"
                                                numberOfLines={1}
                                            >
                                                {it.name}
                                            </Text>
                                            <Text className="text-xs text-neutral-500">
                                                {it.amountG} g
                                            </Text>
                                        </View>
                                        <Text className="text-neutral-900 font-semibold">
                                            {kcalForAmount(
                                                it.kcalPer100g,
                                                it.amountG
                                            )}{" "}
                                            kcal
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    <View className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-5 mb-5">
                        <Text className="text-neutral-700 font-medium mb-3">
                            Notes
                        </Text>
                        <FormInput
                            control={control}
                            name="notes"
                            label="Notes"
                            placeholder="..."
                        />
                    </View>

                    <View className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-5">
                        <Text className="text-neutral-700 font-medium mb-3">
                            Summary
                        </Text>

                        <View className="flex-row items-baseline justify-between mb-3">
                            <Text className="text-2xl font-extrabold text-neutral-900">
                                {totalKcal} kcal
                            </Text>
                        </View>

                        <View className="flex-row justify-between">
                            <MacroPill
                                label="Carbs"
                                value={`${totals.carb} g`}
                            />
                            <MacroPill
                                label="Protein"
                                value={`${totals.protein} g`}
                            />
                            <MacroPill label="Fat" value={`${totals.fat} g`} />
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Sticky footer CTA */}
            <View className="px-5 pb-8 pt-4 bg-white border-t border-neutral-200">
                <Button
                    title="+ Add Meal"
                    variant="primary"
                    onPress={handleAddMeal}
                    textClassName="text-lg font-bold text-white"
                    className="w-full rounded-2xl shadow-md"
                />
            </View>
        </ScreenContainer>
    );
}
