import { Pressable } from "react-native";
import { Text, View } from "react-native";
import Logo from "../../../components/Logo";
import { AuthButtons } from "../components/AuthButtons";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
    const authRouter = useRouter();

    return (
        <View className="flex-1 p-10 p-safe justify-center gap-5">
            <View className="items-center gap-5">
                <Logo />
                <View className="items-center gap-5">
                    <Text className="font-bold text-5xl text-center">
                        Welcome to PiTi
                    </Text>
                    <Text className="text-lg text-center">
                        Your personal training and nutrition assistant. Track
                        progress, reach goals, become
                        <Text className="font-bold"> stronger</Text>.
                    </Text>
                </View>
            </View>
            <AuthButtons
                onRegister={() => authRouter.push("/(auth)/register")}
                onLogin={() => authRouter.push("/(auth)/login")}
            />
        </View>
    );
}
