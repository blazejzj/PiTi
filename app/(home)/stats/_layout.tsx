import { Stack } from "expo-router";

export default function StatsStack() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Stats" }} />
        </Stack>
    );
}
