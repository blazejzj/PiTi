import { Stack } from "expo-router";

export default function FoodStack() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Food" }} />
        </Stack>
    );
}
