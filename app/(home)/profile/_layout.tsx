import { Stack } from "expo-router";

export default function ProfileStack() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="setup" options={{ headerShown: false }} />
        </Stack>
    );
}
