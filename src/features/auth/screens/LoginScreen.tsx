import { useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Button from "../../../components/Button";
import { useRouter } from "expo-router";
import FormInput from "../components/FormInput";
import { account } from "../../../services/appwrite/appwrite";

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
            const newSession = await account.createEmailPasswordSession({
                email: data.emailAdress,
                password: data.password,
            });
            console.log(`logging in test ${newSession}`);

            const user = await account.get();
            console.log(`user that's now logged in is ${user}`);

            router.replace("/(home)"); // TO DO THIS HAS TO BBE CHANGED TO TAKE USER SOMEWHERE
        } catch (err) {
            console.log(`logging error happend ${err}`); // TODO Better errors
        }
    };

    const handleForgotPassword = () => console.log("testing forgot password");
    const handleGoRegister = () => router.replace("/(auth)/register");

    const handleLogin = handleSubmit((data) => {
        console.log("testing login");
        onSubmit(data);
    });

    return (
        <View className="flex-1 p-safe justify-center gap-10 p-10 bg-white">
            <Pressable
                onPress={() => router.back()}
                className="absolute top-30 left-10 "
            >
                <Text className="font-semibold">← Go back</Text>
            </Pressable>
            <View className="place-self-start">
                <Text className="font-bold text-6xl">Log in</Text>
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
                            required: "Please enter a valid e-mail address",
                        }}
                    />
                    <FormInput
                        control={control}
                        name="password"
                        label="Password"
                        placeholder="*********"
                        secureTextEntry
                        rules={{ required: "Please enter a valid password" }}
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
        </View>
    );
}
