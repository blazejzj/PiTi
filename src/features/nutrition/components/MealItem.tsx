import { View, Text, Pressable } from "react-native";
import { Meal } from "../models";

type MealItemProps = {
    meal: Meal;
    onDelete?: () => void;
};

export default function MealItem({ meal, onDelete }: MealItemProps) {
    return (
        <View className="py-2 px-5 bg-white">
            <View className="flex-row justify-between items-center mb-1">
                <View className="flex-1">
                    <Text className="text-xl font-bold" numberOfLines={1}>
                        {meal.name}
                    </Text>
                    {!!meal.time && (
                        <Text className="text-xs text-gray-500">
                            {new Date(meal.time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Text>
                    )}
                </View>

                <View className="items-end ml-2">
                    <Text className="text-xl font-bold">
                        {meal.totalKcal}kcal
                    </Text>
                    {onDelete && (
                        <Pressable onPress={onDelete}>
                            <Text className="text-xs text-red-500 mt-1">
                                Delete
                            </Text>
                        </Pressable>
                    )}
                </View>
            </View>

            {meal.foodItems.map((item, index) => (
                <View
                    key={item.mealItemId ?? index}
                    className="flex-row justify-between pl-3 pr-2"
                >
                    <Text className="text-base text-gray-700">{item.name}</Text>
                    <Text className="text-base text-gray-700">
                        {item.kcal}kcal
                    </Text>
                </View>
            ))}

            <View className="h-px bg-gray-200 mt-4" />
        </View>
    );
}
