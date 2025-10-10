import { router } from "expo-router";
import { Text, View, Pressable } from "react-native";

export default function ProfileScreen() {
    const userName = "Ola Nordamnn";
    return (
        <View className="flex-1 p-safe">
            {/* Top bar heeere - Gims, good music to code to. Allez le bleu. */}
            <View className="flex-row justify-between items-center px-5 py-4 bg-amber-200">
                <Pressable onPress={() => router.back()}>
                    <Text className="text-2xl">backBtn</Text>
                </Pressable>
                <Text className="text-2xl font-bold">Profil</Text>
                <Pressable
                    onPress={() => console.log("Pressed hamburger-meny")}
                >
                    <Text className="text-2xl">hmbgBtn</Text>
                </Pressable>
            </View>
        </View>
    );
}
