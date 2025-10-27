import { View, Text, Pressable } from "react-native";

type Props = {
    onCreateProfile: () => void; // container passes navigation action
};

export default function EmptyProfileScreen({ onCreateProfile }: Props) {
    return (
        <View className="flex-1 justify-center items-center bg-white p-10">
            <Text className="text-3xl font-bold mb-3">Welcome!!</Text>
            <Text className="text-neutral-600 text-center text-lg mb-6">
                Let's set your goals to personalize your dashboard.
            </Text>
            <Pressable
                onPress={onCreateProfile}
                className="px-6 py-3 rounded-xl theme-bg-color"
            >
                <Text className="text-white font-semibold text-lg">
                    Create your profile
                </Text>
            </Pressable>
        </View>
    );
}
