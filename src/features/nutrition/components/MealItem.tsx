import { View, Text } from "react-native";
import { Meal } from "../models";

type MealItemProps = {
    meal: Meal;
};

export default function MealItem({ meal }: MealItemProps) {
    return (
        <View className="py-2 px-5 bg-white">
            <View className="flex-row justify-between items-center mb-1">
                <Text className="text-xl font-bold">{meal.name}</Text>
                <Text className="text-xl font-bold">{meal.totalKcal}kcal</Text>
            </View>
            {meal.foodItems.map((item, index) => (
                <View
                    key={index}
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
