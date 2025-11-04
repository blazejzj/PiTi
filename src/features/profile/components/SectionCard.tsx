import { View, Text } from "react-native";

export const SectionCard = ({
    title,
    children,
    className = "",
}: {
    title: string;
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <View className={`py-5 ${className}`}>
            {title && (
                <Text className="font-semibold text-lg mb-3 text-center">
                    {title}
                </Text>
            )}
            {children}
        </View>
    );
};
