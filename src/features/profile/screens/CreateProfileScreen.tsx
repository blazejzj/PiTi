import {
    View,
    Text,
    Pressable,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import ProfileForm from "../components/ProfileForm";
import { useProfile } from "../hooks/useProfile";
import { upsertUserProfile } from "../api/profileRepo";
import { ProfileFormValues, formValuesToPayload } from "../utils/profileUtils";
import { emptyProfileFormValues } from "../utils/profileUtils";

export default function CreateProfileScreen() {
    const router = useRouter();
    const { userId } = useProfile();

    const handleGoBack = () => router.back();

    const handleSubmit = async (data: ProfileFormValues) => {
        if (!userId) {
            Toast.show({
                type: "error",
                text1: "User not found",
                text2: "Please log in again",
            });
            return;
        }

        try {
            const payload = formValuesToPayload(data);
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

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 p-safe pt-10">
                    <Pressable
                        onPress={handleGoBack}
                        className="top-12 left-4 p-2 z-10 self-start"
                    >
                        <Text className="font-semibold">← Back</Text>
                    </Pressable>

                    <ScrollView
                        contentContainerStyle={{
                            padding: 24,
                            paddingBottom: 80,
                        }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="mb-6">
                            <Text className="font-bold text-3xl text-center">
                                Setup your profile
                            </Text>
                            <Text className="text-lg text-center text-neutral-600 mt-2">
                                Add your personal details below
                            </Text>
                        </View>

                        <ProfileForm
                            initialValues={emptyProfileFormValues}
                            submitLabel="Save profile"
                            onSubmit={handleSubmit}
                        />
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
