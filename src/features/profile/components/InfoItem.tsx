import { View, Text } from "react-native";

export default function InfoItem({
    label,
    value,
    className = "",
}: {
    label: string;
    value: string | number | null;
    className?: string;
}) {
    return (
        <View className={`items-center rounded-2xl px-4 py-2 ${className}`}>
            <Text className="font-semibold text-lg ">{label}</Text>
            <Text className="text-neutral-600 text-sm ">{value ?? "n/a"}</Text>
        </View>
    );
}
