import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useForm } from "react-hook-form";
import Button from "../../../components/Button";
import FormInput from "../../auth/components/FormInput";
import {
    ProfileFormValues,
    emptyProfileFormValues,
    calculateMacroCalories,
} from "../utils/profileUtils";

type ProfileFormProps = {
    initialValues?: ProfileFormValues;
    submitLabel: string;
    onSubmit: (values: ProfileFormValues) => void | Promise<void>;
};

const ProfileForm: React.FC<ProfileFormProps> = ({
    initialValues,
    submitLabel,
    onSubmit,
}) => {
    const { control, handleSubmit, reset, watch } = useForm<ProfileFormValues>({
        defaultValues: initialValues ?? emptyProfileFormValues,
    });

    useEffect(() => {
        if (initialValues) {
            reset(initialValues);
        }
    }, [initialValues, reset]);

    const protein = watch("protein_target_g") || "0";
    const carbs = watch("carb_target_g") || "0";
    const fat = watch("fat_target_g") || "0";

    const macroCalories = calculateMacroCalories(protein, carbs, fat).toFixed(
        0
    );

    const handleSave = () => handleSubmit(onSubmit)();

    return (
        <View className="w-full max-w-md self-center gap-6">
            <View>
                <Text className="text-sm font-semibold text-neutral-500 mb-2">
                    Personal info
                </Text>
                <View className="bg-neutral-50 rounded-2xl p-4 gap-4">
                    <FormInput
                        control={control}
                        name="age"
                        label="Age"
                        placeholder="Age"
                        keyboardType="numeric"
                        rules={{ required: "Please enter your age" }}
                    />
                    <FormInput
                        control={control}
                        name="sex"
                        label="Sex"
                        placeholder="male / female / other"
                        autoCapitalize="words"
                        rules={{ required: "Please enter your sex" }}
                    />
                    <FormInput
                        control={control}
                        name="height_cm"
                        label="Height (cm)"
                        placeholder="Height (cm)"
                        keyboardType="numeric"
                        rules={{ required: "Please enter your height" }}
                    />
                    <FormInput
                        control={control}
                        name="weight_kg"
                        label="Weight (kg)"
                        placeholder="Weight (kg)"
                        keyboardType="numeric"
                        rules={{ required: "Please enter your weight" }}
                    />
                    <FormInput
                        control={control}
                        name="target_weight_kg"
                        label="Target Weight (kg)"
                        placeholder="Target Weight (kg)"
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View>
                <Text className="text-sm font-semibold text-neutral-500 mb-2">
                    Nutrition targets
                </Text>
                <View className="bg-neutral-50 rounded-2xl p-4 gap-4">
                    <FormInput
                        control={control}
                        name="carb_target_g"
                        label="Carb Target (g)"
                        placeholder="Carbs (g)"
                        keyboardType="numeric"
                    />
                    <FormInput
                        control={control}
                        name="fat_target_g"
                        label="Fat Target (g)"
                        placeholder="Fat (g)"
                        keyboardType="numeric"
                    />
                    <FormInput
                        control={control}
                        name="protein_target_g"
                        label="Protein Target (g)"
                        placeholder="Protein (g)"
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View className="mt-1 p-3 rounded-2xl bg-neutral-100">
                <Text className="font-semibold text-neutral-600 text-center">
                    Your macros = approximately{" "}
                    <Text className="theme-text-color">{macroCalories}</Text>{" "}
                    kcal
                </Text>
                <Text className="text-xs text-neutral-500 text-center mt-1">
                    Calculated automatically from your macros above.
                </Text>
            </View>

            <Button
                title={submitLabel}
                onPress={handleSave}
                variant="primary"
                className="mt-4 theme-bg-color"
            />
        </View>
    );
};

export default ProfileForm;
