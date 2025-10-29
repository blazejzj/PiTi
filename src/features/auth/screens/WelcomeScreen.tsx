import { Pressable } from "react-native";
import { Text, View } from "react-native";
import Logo from "../../../components/Logo";
import { AuthButtons } from "../components/AuthButtons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { account } from "../../../services/appwrite/appwrite";

export default function WelcomeScreen() {
    const router = useRouter();
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const currentUser = await account.get();
                if (currentUser) {
                    router.replace("/(home)");
                    return;
                }
            } catch {
                // no active session -> normal login flow
            } finally {
                setCheckingSession(false);
            }
        };

        checkSession();
    }, []);

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
                onRegister={() => router.push("/(auth)/register")}
                onLogin={() => router.push("/(auth)/login")}
            />

            <Pressable
                onPress={() => router.replace("/(home)/profile")}
                style={{ padding: 12, borderRadius: 8, borderWidth: 1 }}
            >
                <Text>Dev: Open Profile</Text>
            </Pressable>

            <Pressable
                onPress={() => router.replace("/(home)/profile/setup")}
                style={{ padding: 12, borderRadius: 8, borderWidth: 1 }}
            >
                <Text>Dev: Open CreateProfile</Text>
            </Pressable>
        </View>
    );
}
