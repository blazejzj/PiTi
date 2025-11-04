import { View, Text } from "react-native";

type Props = { label: string; value: string; className?: string };

export default function MacroPill({ label, value, className = "" }: Props) {
    return (
        <View
            className={`items-center px-4 py-2 rounded-xl bg-neutral-50 border border-neutral-200 ${className}`}
        >
            <Text className="text-base font-semibold text-neutral-900">
                {value}
            </Text>
            <Text className="text-xs text-neutral-500">{label}</Text>
        </View>
    );
}
