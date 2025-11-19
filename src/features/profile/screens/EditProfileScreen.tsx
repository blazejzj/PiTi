import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { useProfile } from "../hooks/useProfile";
import { upsertUserProfile } from "../api/profileRepo";
import FormInput from "../../auth/components/FormInput";
import Button from "../../../components/Button";
import Toast from "react-native-toast-message";
import { useEffect } from "react";

type FormInputs = {
    age: string;
    sex: string;
    height_cm: string;
    weight_kg: string;
    target_weight_kg: string;
    daily_kcal_target: string;
    carb_target_g: string;
    fat_target_g: string;
    protein_target_g: string;
};

export default function EditProfileScreen() {
    const router = useRouter();
    const { profile, userId, refresh } = useProfile();
    const { control, handleSubmit, reset } = useForm<FormInputs>({
        defaultValues: {
            age: "",
            sex: "",
            height_cm: "",
            weight_kg: "",
            target_weight_kg: "",
            daily_kcal_target: "",
            carb_target_g: "",
            fat_target_g: "",
            protein_target_g: "",
        },
    });

    useEffect(() => {
        if (profile) {
            reset({
                age: profile.age?.toString() ?? "",
                sex: profile.sex ?? "",
                height_cm: profile.height_cm?.toString() ?? "",
                weight_kg: profile.weight_kg?.toString() ?? "",
                target_weight_kg: profile.target_weight_kg?.toString() ?? "",
                daily_kcal_target: profile.daily_kcal_target?.toString() ?? "",
                carb_target_g: profile.carb_target_g?.toString() ?? "",
                fat_target_g: profile.fat_target_g?.toString() ?? "",
                protein_target_g: profile.protein_target_g?.toString() ?? "",
            });
        }
    }, [profile, reset]);

    const onSubmit = async (data: FormInputs) => {
        if (!userId) {
            Toast.show({
                type: "error",
                text1: "User not found",
                text2: "Please log in again",
            });
            return;
        }

        try {
            const payload = {
                age: Number(data.age),
                sex: data.sex.trim().toLowerCase() as
                    | "male"
                    | "female"
                    | "other",
                height_cm: Number(data.height_cm),
                weight_kg: Number(data.weight_kg),
                target_weight_kg: Number(data.target_weight_kg), // TODO: Test after added new field to DB!!
                daily_kcal_target: Number(data.daily_kcal_target),
                carb_target_g: Number(data.carb_target_g),
                fat_target_g: Number(data.fat_target_g),
                protein_target_g: Number(data.protein_target_g),
            };
            await upsertUserProfile(userId, payload);
            Toast.show({
                type: "success",
                text1: "Profile updated",
            });
            await refresh();
            router.back();
        } catch (err) {
            console.log("Error updating profile", err);
            Toast.show({
                type: "error",
                text1: "Error updating profile",
                text2: "Please try again later",
            });
        }
    };

    const handleGoBack = () => router.back();
    const handleSaveChanges = () => handleSubmit(onSubmit)();

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: 50 }}>
            <Pressable
                onPress={handleGoBack}
                className="top-12 left-4 p-2 z-10 self-start"
            >
                <Text className="font-semibold">Back</Text>
            </Pressable>

            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 80 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="mb-6">
                    <Text className="font-bold text-3xl text-center">
                        Edit your profile
                    </Text>
                    <Text className="text-lg text-center text-neutral-600 mt-2">
                        Update your personal details below
                    </Text>
                </View>

                <View className="w-full max-w-md self-center gap-4">
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

                    <FormInput
                        control={control}
                        name="daily_kcal_target"
                        label="Daily Calorie Target"
                        placeholder="kcal"
                        keyboardType="numeric"
                    />
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

                    <Button
                        title="Save Changes"
                        onPress={handleSaveChanges}
                        variant="primary"
                        className="mt-6"
                    />
                </View>
            </ScrollView>
        </View>
    );
}
