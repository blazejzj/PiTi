import { Stack } from "expo-router";

export default function TrainingStack() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index"/>
            <Stack.Screen name="addTrainingSession"/>
            <Stack.Screen name="addExercise"/>
            <Stack.Screen name="activeWorkout"/>
            <Stack.Screen name="editDraftExercise"/>
        </Stack>
    );
}
