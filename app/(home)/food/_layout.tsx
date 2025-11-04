import { Stack } from "expo-router";

export default function FoodStack() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="addMeal" />
            <Stack.Screen name="scanItem" />
            <Stack.Screen name="manualFoodEntry" />
        </Stack>
    );
}
