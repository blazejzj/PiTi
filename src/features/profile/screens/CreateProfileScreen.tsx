import { useRouter } from "expo-router";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import Button from "../../../components/Button";
import FormInput from "../../auth/components/FormInput";
import { useProfile } from "../hooks/useProfile";
import { upsertUserProfile } from "../api/profileRepo";

type FormInputs = {
    age: string;
    sex: string;
    heigh_cm: string;
    weight_kg: string;
    daily_kcal_target: string;
    carb_target_g: string;
    fat_target_g: string;
    protein_target_g: string;
};

export default function CreateProfileScreen() {
    const router = useRouter();
    const { control, handleSubmit } = useForm<FormInputs>({
        defaultValues: {
            age: "",
            sex: "",
            heigh_cm: "",
            weight_kg: "",
            daily_kcal_target: "",
            carb_target_g: "",
            fat_target_g: "",
            protein_target_g: "",
        },
    });

    const { userId } = useProfile();

    const onSubmit = async (data: FormInputs) => {
        if (!userId) {
            Toast.show({
                type: "error",
                text1: "User not found",
                text2: "Please log in again",
            });
            return;
        }

        {
            /* for now the sex is just a string, but perhaps drop down picker later?.. */
        }
        try {
            const payload = {
                age: Number(data.age),
                sex: data.sex.trim().toLowerCase() as
                    | "male"
                    | "female"
                    | "other",
                heigh_cm: Number(data.heigh_cm),
                weight_kg: Number(data.weight_kg),
                daily_kcal_target: Number(data.daily_kcal_target),
                carb_target_g: Number(data.carb_target_g),
                fat_target_g: Number(data.fat_target_g),
                protein_target_g: Number(data.protein_target_g),
            };
            await upsertUserProfile(userId, payload);
            Toast.show({
                type: "success",
                text1: "Profile saved",
            });
            router.replace("/(home)/profile");
        } catch (err) {
            console.log("Error creating profile", err);
            Toast.show({
                type: "error",
                text1: "Error creating profile",
                text2: "Please try again later",
            });
        }
    };

    const handleGoBack = () => router.back();
    const handleCreateProfile = () => handleSubmit(onSubmit)();

    return (
        <View className="flex-1 bg-white p-safe">
            <Pressable
                onPress={handleGoBack}
                className="top-12 left-4 p-2 z-10 self-start"
            >
                <Text className="font-semibold">Back</Text>
            </Pressable>

            {/* ScrollVieww instad of Flatlist here - same as in profile screen - very limited items to render. */}
            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 80 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="mb-6">
                    <Text className="font-bold text-3xl text-center">
                        Create Your Profile
                    </Text>
                    <Text className="text-lg text-center text-neutral-600 mt-2">
                        Add your personal details below
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
                        name="heigh_cm"
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
                        title="Save profile"
                        onPress={handleCreateProfile}
                        variant="primary"
                        className="mt-6"
                    />
                </View>
            </ScrollView>
        </View>
    );
}
