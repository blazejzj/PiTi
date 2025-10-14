import { Stack } from "expo-router";

export default function FoodStack() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Nutrition" }} />
            <Stack.Screen name="scanItem" options={{ title: "Scan Item" }} />
            <Stack.Screen name="addMeal" options={{ title: "Add Meal" }} />
            <Stack.Screen name="manualFoodEntry" options={{ title: "Manual Food Entry" }} />
        </Stack>
    );
}
