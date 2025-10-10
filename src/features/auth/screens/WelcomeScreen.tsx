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

            {/* Dev only button to route to profile screen so i can see hot reload in action plxz*/}
            <Pressable
                onPress={() => authRouter.replace("/(home)/profile")}
                style={{ padding: 10, borderRadius: 8, borderWidth: 1 }}
            >
                <Text>Dev: Open Profiel</Text>
            </Pressable>
        </View>
    );
}
