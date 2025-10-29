import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { useProfile } from "../hooks/useProfile";
import Button from "../../../components/Button";
import FormInput from "../../auth/components/FormInput";
import { useForm } from "react-hook-form";
import { upsertUserProfile } from "../api/profileRepo";
import Toast from "react-native-toast-message";

type FormInputs = {
    age: string;
    heigh_cm: string;
    weight_kg: string;
};

export default function CreateProfileScreen() {
    const router = useRouter();
    const { control, handleSubmit } = useForm<FormInputs>({
        defaultValues: {
            age: "",
            heigh_cm: "",
            weight_kg: "",
        },
    });

    const { userId } = useProfile();

    const onSubmit = async (data: FormInputs) => {
        if (!userId) {
            Toast.show({
                type: "error",
                text1: "USer not found",
                text2: "Please login again",
            });
            return;
        }

        try {
            const payload = {
                age: Number(data.age),
                heigh_cm: Number(data.heigh_cm),
                weight_kg: Number(data.weight_kg),
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

    const handleGoBack = () => {
        router.back();
    };

    const handleCreateProfile = () => {
        handleSubmit(onSubmit)();
    };

    return (
        <View className="flex-1 p-safe bg-white p-10 justify-center gap-10">
            {/* Back button right here..*/}
            <Pressable
                onPress={handleGoBack}
                className="absolute top-12 left-4 p-2"
            >
                <Text className="font-semibold">Back</Text>
            </Pressable>

            {/* Header section.. */}
            <View className="">
                <Text className="font-bold text-3xl text-center">
                    Create Your Profile
                </Text>
                <Text className="text-xl text-center">
                    Add details below/fill in stuff...
                </Text>
            </View>

            {/* Form section.. */}
            <View className="w-full max-w-md self-center">
                <View>
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
                        name="heigh_cm"
                        label="Height"
                        placeholder="Height (cm)"
                        keyboardType="numeric"
                        rules={{ required: "Please enter your height" }}
                    />
                    <FormInput
                        control={control}
                        name="weight_kg"
                        label="Weight"
                        placeholder="Weight (kg)"
                        keyboardType="numeric"
                        rules={{ required: "Please enter your weight" }}
                    />
                </View>

                {/* Submit button/save propifle.. */}
                <View>
                    <Button
                        title="Save profile"
                        onPress={handleCreateProfile}
                        variant="primary"
                        className="mt-6"
                    />
                </View>
            </View>
        </View>
    );
}
