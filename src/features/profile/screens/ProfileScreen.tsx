import { Text, View, Pressable } from "react-native";

export default function ProfileScreen() {
    const userName = "Ola Nordamnn";
    return (
        <View className="flex-1 p-safe justify-center gap-10 p-10 bg-amber-200">
            {/* Fixed tailwind snippets, works now */}
            <Text className="font-bold text-6xl">Profile hahaaaah Screen</Text>
            {/* Hot reaload bugs as hell... */}
        </View>
    );
}
