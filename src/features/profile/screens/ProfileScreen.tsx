import { router } from "expo-router";
import { Text, View, Pressable, ScrollView } from "react-native";

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

            <ScrollView>
                {/* ScrollView vs FlatList? Profile page is relatively short, not THAT many elements to be rendered. Need for lazy render with Flatlist? Je ne sais pas. */}
                <View className="">
                    <View className="items-center bg-amber-200 rounded-2xl p-5 mt-2">
                        <View className="w-24 h-24 rounded-full bg-red-500 mb-3" />
                        <Text className="text-lg font-semibold color-white">
                            {userName}
                        </Text>

                        <View className="flex-row justify between w-full mt-5">
                            <View className="flex-1 items-center">
                                <Text className="font-bold">100 kg</Text>
                                <Text className="text-neutral-600">Vekt</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
