import { Pressable, Text, View, ScrollView, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";

import Button from "../../../components/Button";
import FormInput from "../../../components/FormInput";

import { account } from "../../../services/appwrite/appwrite";
import { MealType, mealRepo } from "../repository/mealRepo";
import { foodItemRepo } from "../repository/foodItemRepo";
import { mealItemRepo } from "../repository/mealItemRepo";
import { useMealDraft } from "../state/useMealDraft";

type MealFormInputs = {
    mealName: string;
    notes: string;
};

const MEAL_TYPES: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snacks"];

// TODO: Helper, should be moved probably
const toTodayISOWithTime = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    const d = new Date();
    d.setHours(h || 0, m || 0, 0, 0);
    return d.toISOString();
};

// TODO: Helper, should be moved probably -> note that this doesnt hit DB
const kcalForAmount = (kcalPer100g: number, amountG: number) =>
    Math.round(((kcalPer100g || 0) * amountG) / 100);

export default function AddMealScreen() {
    const router = useRouter();

    const [selectedMealType, setSelectedMealType] =
        useState<MealType>("Breakfast");
    const [selectedTime, setSelectedTime] = useState<string>("08:00");

    // draft store which means we can build meal incrementally
    // before persisting to DB
    const draft = useMealDraft();
    const totalKcal = useMemo(() => draft.totals().kcal, [draft.items]);

    const { control, handleSubmit, watch } = useForm<MealFormInputs>({
        defaultValues: { mealName: "", notes: "" },
    });

    // we can keep meal name in sync with draft for convenience
    const mealNameWatch = watch("mealName");
    if (draft.mealName !== mealNameWatch) {
        draft.setMealName(mealNameWatch ?? "");
    }

    const handleAddFoodItem = () => {
        router.push("/food/scanItem");
    };

    const onSubmit = async (data: MealFormInputs) => {
        // get current user
        const user = await account.get();

        // create the "meal" container
        const timeISO = toTodayISOWithTime(selectedTime);
        const meal = await mealRepo.create({
            userId: user.$id,
            name: data.mealName || "Untitled meal",
            type: selectedMealType,
            timeISO,
            notes: data.notes || "",
        });

        // persist each draft item to meal_item
        // We fetch foodItem to get per-100g macros, then mealItemRepo computes totals woohoooo
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

        // reset draft and go back
        draft.clear();
        router.back();
    };

    const handleAddMeal = handleSubmit(onSubmit);

    return (
        <View className="flex-1 bg-white px-5">
            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
            >
                <Pressable
                    onPress={() => router.back()}
                    className="mb-8 mt-12 self-start"
                >
                    <Text className="font-semibold">← Go Back</Text>
                </Pressable>

                <View className="w-full self-center flex gap-5">
                    <FormInput
                        control={control}
                        name="mealName"
                        label="Name of your meal"
                        placeholder="Chicken salad etc."
                        autoCapitalize="words"
                    />

                    <View className="flex gap-2">
                        <Text className="text-base font-medium text-neutral-700">
                            Meal Type
                        </Text>
                        <View className="flex-row flex-wrap">
                            {/* we use map here because its a small list, please dont judge us, we know about FlatList*/}
                            {MEAL_TYPES.map((t) => {
                                const active = t === selectedMealType;
                                return (
                                    <Pressable
                                        key={t}
                                        onPress={() => setSelectedMealType(t)}
                                        className={`px-3 py-2 mr-2 mb-2 rounded-xl border ${
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

                    <View className="flex gap-2">
                        <Text className="text-base font-medium text-neutral-700">
                            Time
                        </Text>
                        <Pressable
                            onPress={() => {
                                // TODO: open proper time picker of some sort, for now we have temporary toggle for dev
                                setSelectedTime((prev) =>
                                    prev === "08:00" ? "12:00" : "08:00"
                                );
                            }}
                            className="p-3 rounded-xl border border-neutral-200 bg-neutral-100 flex-row justify-between items-center"
                        >
                            <Text className="text-neutral-900 text-base">
                                {selectedTime}
                            </Text>
                            <Text>▼</Text>
                        </Pressable>
                    </View>

                    <View className="flex gap-2">
                        <Text className="text-base font-medium text-neutral-700">
                            Food Items
                        </Text>

                        <Button
                            onPress={handleAddFoodItem}
                            title="+ Add or Scan More Food Items"
                            variant="primary"
                            className="w-full rounded-xl py-4 mb-2"
                            textClassName="text-lg font-bold text-black"
                        />

                        {draft.items.length === 0 ? (
                            <Text className="text-neutral-500">
                                No items yet. Add or scan to start.
                            </Text>
                        ) : (
                            draft.items.map((it, idx) => (
                                <View
                                    key={`${it.foodItemId}-${idx}`}
                                    className="flex-row justify-between items-center px-1 py-1"
                                >
                                    <Text className="text-neutral-700">
                                        {it.name} • {it.amountG}g
                                    </Text>
                                    <Text className="text-neutral-700 font-semibold">
                                        {kcalForAmount(
                                            it.kcalPer100g,
                                            it.amountG
                                        )}{" "}
                                        kcal
                                    </Text>
                                </View>
                            ))
                        )}
                    </View>

                    <FormInput
                        control={control}
                        name="notes"
                        label="Notes"
                        placeholder="..."
                    />

                    <View className="flex gap-2 mt-4">
                        <Text className="text-base font-medium text-neutral-700">
                            Total kcal
                        </Text>
                        <TextInput
                            value={String(totalKcal)}
                            editable={false}
                            className="p-3 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-900 text-base text-right font-bold"
                        />
                    </View>
                </View>

                <View className="mt-8 mb-10">
                    <Button
                        title="+ Add Meal"
                        variant="primary"
                        onPress={handleAddMeal}
                        textClassName="text-lg font-bold text-white"
                        className="w-full rounded-xl py-4"
                    />
                </View>
            </ScrollView>
        </View>
    );
}
