import { useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Button from "../../../components/Button";
import { useRouter } from "expo-router";
import FormInput from "../components/FormInput";
import { ID } from "appwrite";
import { account } from "../../../services/appwrite/appwrite";
import { ensureNoActiveSession } from "../../../services/appwrite/authGuard";
import { toHumanError } from "../../../utils/humanError";
import Toast from "react-native-toast-message";

type FormInputs = {
    name: string;
    emailAdress: string;
    password: string;
    confirmPassword: string;
};

export default function RegisterScreen() {
    const router = useRouter();

    const { control, handleSubmit, watch, setError } = useForm<FormInputs>({
        defaultValues: {
            name: "",
            emailAdress: "",
            password: "",
            confirmPassword: "",
        },
        shouldUnregister: false,
    });

    const onSubmit = async (data: any) => {
        if (data.password !== data.confirmPassword) {
            setError("confirmPassword", { message: "Passwords must match" });
            return; // note this is just client side
        }

        try {
            const email = String(data.emailAdress || "")
                .trim()
                .toLowerCase();
            const name = String(data.name || "").trim();

            await ensureNoActiveSession();
            await account.create({
                userId: ID.unique(),
                email,
                password: data.password,
                name,
            });
            await account.createEmailPasswordSession({
                email,
                password: data.password,
            });

            Toast.show({
                type: "success",
                text1: "Account created",
                text2: "You're now logged in",
            });

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

    const handleRegister = handleSubmit((data) => onSubmit(data));
    const handleGoLogin = () => router.replace("/(auth)/login");

    return (
        <View className="flex-1 p-safe justify-center gap-10 p-10 bg-white">
            <Pressable
                onPress={() => router.back()}
                className="absolute top-30 left-10 "
            >
                <Text className="font-semibold">← Go back</Text>
            </Pressable>
            <View className="place-self-start">
                <Text className="font-bold text-6xl">Register</Text>
                <Text className="text-xl mt-3 text-neutral-500">
                    Create your new account
                </Text>
            </View>
            <View className="w-full max-w-md self-center">
                <View className="flex gap-5">
                    <FormInput
                        control={control}
                        name="name"
                        label="Full Name"
                        placeholder="Hugh Jass"
                        autoCapitalize="words"
                        rules={{
                            required: "Please enter your name",
                            maxLength: {
                                value: 128,
                                message: "Max 128 characters",
                            },
                            validate: (val: string) =>
                                val.trim().length > 0 ||
                                "Please enter your name",
                        }}
                    />
                    <FormInput
                        control={control}
                        name="emailAdress"
                        label="E-mail"
                        placeholder="user@PiTi.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        rules={{
                            required: "Please enter a valid e-mail address",
                            pattern: {
                                // we keep it simple here, because AppWrite already has good validation,
                                // In future we we should change this, and also validate (duh) in our own backend!!
                                value: /\S+@\S+\.\S+/,
                                message: "Enter a valid email",
                            },
                        }}
                    />
                    <FormInput
                        control={control}
                        name="password"
                        label="Password"
                        placeholder="********"
                        secureTextEntry
                        rules={{
                            required: "Please enter a valid password",
                            minLength: {
                                value: 8,
                                message: "Min 8 characters",
                            },
                            maxLength: {
                                value: 128,
                                message: "Max 128 characters",
                            },
                        }}
                    />
                    <FormInput
                        control={control}
                        name="confirmPassword"
                        label="Confirm Password"
                        placeholder="********"
                        secureTextEntry
                        rules={{
                            required: "Please confirm your password",
                            validate: (val: unknown) =>
                                val === watch("password") ||
                                "Passwords must match",
                        }}
                    />
                </View>

                <View className="flex gap-7 mt-6">
                    <Button
                        title={"Register"}
                        variant="primary"
                        onPress={handleRegister}
                        textClassName="text-lg"
                        className="w-full rounded-2xl py-4"
                        testID="register-btn"
                    />
                    <View className="flex-row justify-center items-center">
                        <Text className="text-lg text-neutral-700">
                            Already have an account?
                        </Text>
                        <Pressable onPress={handleGoLogin}>
                            <Text className="text-lg theme-text-color font-bold ml-2">
                                Log in here!
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}
