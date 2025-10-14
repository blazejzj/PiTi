import { Stack } from "expo-router";

export default function TrainingStack() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Training" }} />
            <Stack.Screen name="addTrainingSession" options={{ title: "Add Training Session" }} />
        </Stack>
    );
}
