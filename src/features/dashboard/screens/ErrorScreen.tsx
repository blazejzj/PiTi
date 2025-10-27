import { View, Text, Pressable } from "react-native";

type Props = {
    message: string; // humanlike
    onLogout: () => void; // allow user to "recover"
};

export default function ErrorView({ message, onLogout }: Props) {
    return (
        <View className="flex-1 justify-center items-center bg-white p-10">
            <Text className="text-red-600 text-lg font-semibold">
                Could not load your data
            </Text>
            <Text className="mt-2 text-neutral-500 text-center">{message}</Text>
            <Pressable
                onPress={onLogout}
                className="mt-6 bg-red-500 p-3 rounded-xl"
            >
                <Text className="text-white font-bold">Log out</Text>
            </Pressable>
        </View>
    );
}
