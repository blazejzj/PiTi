import { useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Button from "../../../components/Button";
import { useRouter } from "expo-router";
import FormInput from "../components/FormInput";
import { ID } from "appwrite";
import { account } from "../../../services/appwrite/appwrite";

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
            return; // for now we return, should we do anything else?
        }

        try {
            const formattedEmail = data.emailAdress.trim().toLowerCase();
            const trimmedName = data.name.trim();

            const user = await account.create({
                userId: ID.unique(),
                email: formattedEmail,
                password: data.password,
                name: trimmedName,
            });

            // joke of the day: used an hour to find out why create and createEmailPasswordSession
            // are deprecated. Its because I havent used an object as a param. Silly me.......
            await account.createEmailPasswordSession({
                email: formattedEmail,
                password: data.password,
            });

            router.replace("/(home)");
        } catch (err) {
            // TODO BETTER ERROR HERE
            // Display in some UI / Maybe toast notifications?
            console.log(`register error ${err}`);
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
