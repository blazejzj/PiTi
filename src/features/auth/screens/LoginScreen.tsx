import { useForm } from "react-hook-form";
import {
    Pressable,
    Text,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import Button from "../../../components/Button";
import { useRouter } from "expo-router";
import FormInput from "../components/FormInput";
import { account } from "../../../services/appwrite/appwrite";
import {
    ensureNoActiveSession,
    getCurrentUserSafely,
} from "../../../services/appwrite/authGuard";
import { toHumanError } from "../../../utils/humanError";
import Toast from "react-native-toast-message";

type FormInputs = {
    emailAdress: string;
    password: string;
};

export default function LoginScreen() {
    const router = useRouter();

    const { control, handleSubmit } = useForm<FormInputs>({
        defaultValues: { emailAdress: "", password: "" },
    });

    const onSubmit = async (data: any) => {
        try {
            const email = String(data.emailAdress || "")
                .trim()
                .toLowerCase();
            const password = String(data.password || "");

            const existing = await getCurrentUserSafely();
            if (existing) {
                Toast.show({
                    type: "success",
                    text1: "Welcome back!",
                });
                router.replace("/(home)");
                return;
            }

            await ensureNoActiveSession();

            await account.createEmailPasswordSession({
                email,
                password,
            });

            await account.get();
            router.replace("/(home)");
        } catch (err) {
            const humanErr = toHumanError(err);
            Toast.show({
                type: "error",
                text1: humanErr.title,
                text2: humanErr.message,
            });
        }
    };

    const handleForgotPassword = () => console.log("testing forgot password");
    const handleGoRegister = () => router.replace("/(auth)/register");

    const handleLogin = handleSubmit((data) => {
        onSubmit(data);
    });

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 p-safe pt-10">
                    <ScrollView
                        contentContainerStyle={{
                            padding: 24,
                            paddingBottom: 80,
                        }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="mb-6 right-4 top-6">
                            <Pressable
                                onPress={() => router.back()}
                                className="mb-6"
                            >
                                <Text className="font-semibold">← Go back</Text>
                            </Pressable>
                        </View>

                        <View className="mb-6 mt-6">
                            <Text className="font-bold text-5xl">Log in</Text>
                            <Text className="text-xl mt-3 text-neutral-500">
                                Welcome back!
                            </Text>
                        </View>

                        <View className="w-full max-w-md self-center">
                            <View className="flex gap-5">
                                <FormInput
                                    control={control}
                                    name="emailAdress"
                                    label="E-mail"
                                    placeholder="user@PiTi.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    rules={{
                                        required:
                                            "Please enter a valid e-mail address",
                                    }}
                                />
                                <FormInput
                                    control={control}
                                    name="password"
                                    label="Password"
                                    placeholder="*********"
                                    secureTextEntry
                                    rules={{
                                        required:
                                            "Please enter a valid password",
                                    }}
                                />
                            </View>

                            <View className="flex gap-7 mt-6">
                                <Pressable
                                    onPress={handleForgotPassword}
                                    className="self-end"
                                >
                                    <Text className="theme-text-color font-semibold text-base">
                                        Forgot your password?
                                    </Text>
                                </Pressable>

                                <Button
                                    title={"Log in"}
                                    variant="primary"
                                    onPress={handleLogin}
                                    textClassName="text-lg"
                                    className="w-full rounded-2xl py-4"
                                    testID="login-btn"
                                />
                                <View className="flex-row justify-center items-center">
                                    <Text className="text-lg text-neutral-700">
                                        Don't have an account?
                                    </Text>
                                    <Pressable onPress={handleGoRegister}>
                                        <Text className="text-lg theme-text-color font-bold ml-2">
                                            Register here!
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
