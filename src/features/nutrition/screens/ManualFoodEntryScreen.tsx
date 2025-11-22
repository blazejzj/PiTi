import { useForm } from "react-hook-form";
import {
    Pressable,
    Text,
    View,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Button from "../../../components/Button";
import FormInput from "../../../components/FormInput";
import { account } from "../../../services/appwrite/appwrite";
import { foodItemRepo } from "../repository/foodItemRepo";
import { useMealDraft } from "../state/useMealDraft";
import ScreenContainer from "../../auth/components/ScreenContainer";
import Toast from "react-native-toast-message";
import { openFoodFactsApi } from "../../../services/api/openFoodFactsApi";
import { useState, useEffect } from "react";

type CustomFoodInputs = {
    foodName: string;
    barcode?: string;
    kcal: string;
    carbs: string;
    protein: string;
    fat: string;
};

// TODO: Probably move to utils
const parseNumber = (value: string) => {
    if (!value) return 0;
    const normalized = value.replace(",", ".").trim();
    const n = Number(normalized);
    return Number.isNaN(n) ? 0 : n;
};

export default function ManualFoodEntryScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ barcode?: string }>();
    const draft = useMealDraft();
    const prefilledBarcode = params?.barcode ?? "";

    const { control, handleSubmit, reset, watch, setValue } =
        useForm<CustomFoodInputs>({
            defaultValues: {
                foodName: "",
                barcode: prefilledBarcode,
                kcal: "",
                carbs: "",
                protein: "",
                fat: "",
            },
        });

    const [isFetching, setIsFetching] = useState(false);

    const proteinWatch = watch("protein");
    const carbsWatch = watch("carbs");
    const fatWatch = watch("fat");

    useEffect(() => {
        const p = parseNumber(proteinWatch);
        const c = parseNumber(carbsWatch);
        const f = parseNumber(fatWatch);

        const kcalFromMacros = p * 4 + c * 4 + f * 9;

        if (kcalFromMacros > 0) {
            setValue("kcal", Math.round(kcalFromMacros).toString());
        } else {
            setValue("kcal", "");
        }
    }, [proteinWatch, carbsWatch, fatWatch, setValue]);

    const handleFetchfromBarcode = async (barcode: string) => {
        if (!barcode || barcode.trim() === "") {
            Toast.show({
                type: "error",
                text1: "Enter a barcode first",
            });
            return;
        }

        setIsFetching(true);

        try {
            const product = await openFoodFactsApi.getProductByBarcode(barcode);

            if (!product) {
                Toast.show({
                    type: "error",
                    text1: "Product not found",
                    text2: "Enter nutrition information manually.",
                });
                setIsFetching(false);
                return;
            }

            reset({
                foodName: product.name,
                barcode: product.barcode,
                kcal: product.kcalPer100g?.toString() ?? "",
                carbs: product.carbsPer100g?.toString() ?? "",
                protein: product.proteinPer100g?.toString() ?? "",
                fat: product.fatPer100g?.toString() ?? "",
            });

            Toast.show({
                type: "success",
                text1: `Product found!`,
                text2: `Nutrition information for ${product.name} added.`,
            });
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Error fetching product",
                text2: "Enter nutrition information manually.",
            });
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (prefilledBarcode) {
            handleFetchfromBarcode(prefilledBarcode);
        }
    }, [prefilledBarcode]);

    const onSubmit = async (data: CustomFoodInputs) => {
        try {
            const user = await account.get();
            const newFood = await foodItemRepo.create({
                userId: user.$id,
                name: data.foodName.trim(),
                barcode: data.barcode || "",
                kcalPer100g: parseNumber(data.kcal),
                carbPer100g: parseNumber(data.carbs),
                proteinPer100g: parseNumber(data.protein),
                fatPer100g: parseNumber(data.fat),
            });
            draft.addItem({
                foodItemId: newFood.$id,
                name: newFood.name,
                amountG: 100,
                kcalPer100g: newFood.kcalPer100g ?? 0,
                carbPer100g: newFood.carbPer100g ?? 0,
                fatPer100g: newFood.fatPer100g ?? 0,
                proteinPer100g: newFood.proteinPer100g ?? 0,
            });
            reset();
            Toast.show({
                type: "success",
                text1: "Saved!",
                text2: `${newFood.name} added to your meal.`,
            });
            router.replace("/food/addMeal");
        } catch {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Could not save this food. Try again.",
            });
        }
    };

    const handleAddCustomFood = handleSubmit(onSubmit);

    return (
        <ScreenContainer className="flex-1 bg-white p-safe">
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1">
                        <View className="px-5 pb-3 flex-row items-center">
                            <Pressable onPress={() => router.back()}>
                                <Text className="font-semibold text-neutral-700">
                                    ← Back
                                </Text>
                            </Pressable>
                            <Text className="flex-1 text-center text-2xl font-bold text-neutral-900 mr-10">
                                Add Food
                            </Text>
                        </View>

                        <ScrollView
                            className="flex-1"
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={{
                                paddingBottom:
                                    Platform.OS === "ios" ? 140 : 120,
                            }}
                        >
                            <View className="px-5">
                                <View className="bg-white border border-neutral-200 rounded-3xl shadow-sm p-5 mb-6">
                                    <Text className="text-neutral-700 font-medium mb-3">
                                        Food information
                                    </Text>
                                    <FormInput
                                        control={control}
                                        name="foodName"
                                        label="Food name"
                                        placeholder="e.g. Homemade Protein Bar"
                                        autoCapitalize="words"
                                        rules={{ required: "Name is required" }}
                                    />
                                    <FormInput
                                        control={control}
                                        name="barcode"
                                        label="Barcode"
                                        placeholder="e.g. 1234567890123"
                                        keyboardType="numeric"
                                        disabled={!!prefilledBarcode}
                                    />

                                    {!prefilledBarcode && (
                                        <Button
                                            title={
                                                isFetching
                                                    ? "Fetching..."
                                                    : "Fetch from Barcode"
                                            }
                                            onPress={() =>
                                                handleFetchfromBarcode(
                                                    watch("barcode") || ""
                                                )
                                            }
                                            variant="secondary"
                                            disabled={isFetching}
                                            className="mt-4 rounded-2xl"
                                            textClassName="font-medium"
                                        />
                                    )}

                                    {isFetching && (
                                        <View className="p-3 bg-blue-50 rounded-lg mt-3">
                                            <Text className="text-blue-700 text-sm text-center">
                                                Fetching product information
                                                from Open Food Facts...
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                <View className="bg-white border border-neutral-200 rounded-3xl shadow-sm p-5">
                                    <Text className="text-neutral-700 font-medium mb-3">
                                        Nutritional values (per 100g)
                                    </Text>
                                    <View className="gap-4">
                                        <View className="gap-1">
                                            <FormInput
                                                control={control}
                                                name="kcal"
                                                label="Calories (kcal)"
                                                keyboardType="numeric"
                                                disabled={true}
                                                rules={{
                                                    required:
                                                        "Kcal is required",
                                                }}
                                            />
                                            <Text className="text-xs text-neutral-400 ml-1">
                                                Auto-calculated from protein,
                                                carbs and fat
                                            </Text>
                                        </View>
                                        <FormInput
                                            control={control}
                                            name="protein"
                                            label="Protein (g)"
                                            keyboardType="numeric"
                                            rules={{
                                                required: "Protein is required",
                                            }}
                                        />
                                        <FormInput
                                            control={control}
                                            name="carbs"
                                            label="Carbohydrates (g)"
                                            keyboardType="numeric"
                                            rules={{
                                                required: "Carbs are required",
                                            }}
                                        />
                                        <FormInput
                                            control={control}
                                            name="fat"
                                            label="Fat (g)"
                                            keyboardType="numeric"
                                            rules={{
                                                required: "Fat is required",
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                        </ScrollView>

                        <View className="px-5 pb-8 pt-4 bg-white border-t border-neutral-200">
                            <Button
                                title="Save and Add to Meal"
                                variant="primary"
                                onPress={handleAddCustomFood}
                                textClassName="text-lg font-bold text-white"
                                className="w-full rounded-2xl shadow-md"
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}
