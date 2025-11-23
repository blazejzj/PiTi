import {
    View,
    Text,
    ScrollView,
    Platform,
    Alert,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams, router } from "expo-router";
import { useForm, Control, Form } from "react-hook-form";
import Button from "../../../components/Button";
import FormInput from "../../../components/FormInput";
import { workoutRepo } from "../repository/workoutRepo";
import { useEffect, useState } from "react";
import { useWorkoutDraft } from "../state/useWorkoutDraft";
import { getCurrentUserSafely } from "../../../services/appwrite/authGuard";
import Toast from "react-native-toast-message";

type AddWorkoutForm = {
    workoutName: string;
    durationMinutes: string;
    notes: string;
};

export default function AddTrainingSessionScreen() {
    const router = useRouter();

    const {
        draftedExercises,
        clearDraft,
        removeExercise,
        workoutName: draftName,
        setWorkoutName,
    } = useWorkoutDraft();

    const { watch, setValue, control, handleSubmit } = useForm<AddWorkoutForm>({
        defaultValues: {
            workoutName: draftName,
            durationMinutes: "",
            notes: "",
        },
    });

    const handleSaveSession = async (data: AddWorkoutForm) => {
        const user = await getCurrentUserSafely();
        const userId = user?.$id;
        if (typeof userId !== "string" || userId.length === 0) {
            Toast.show({
                type: "error",
                text1: "Authentication Error",
                text2: "Cannot save session. Please log in.",
            });
            return;
        }

        if (draftedExercises.length === 0) {
            Alert.alert(
                "Please add at least one exercise before saving the session."
            );
            return;
        }
        try {
            const workoutData = {
                userId: userId,
                name: data.workoutName,
                startedAt: new Date().toISOString(),
                endedAt: null,
                durationMinutes: parseInt(data.durationMinutes, 10) || null,
                notes: data.notes || null,
                caloriesBurned: null,
            };

            const createdWorkout = await workoutRepo.create(
                userId,
                workoutData
            );
            const workoutId = createdWorkout.$id;

            for (const draftExercise of draftedExercises) {
                const exerciseData = {
                    workoutId: workoutId,
                    exerciseName: draftExercise.exerciseName,
                };
                const createdWorkoutExercise = await workoutRepo.createExercise(
                    exerciseData
                );
                const workoutExerciseId = createdWorkoutExercise.$id;

                for (const draftSet of draftExercise.sets) {
                    const setData = {
                        workoutExerciseId: workoutExerciseId,
                        setNumber: draftSet.setNumber,
                        repetitions: draftSet.repetitions,
                        weightKg: draftSet.weightKg,
                    };
                    await workoutRepo.createSet(setData);
                }
            }

            clearDraft();
            Toast.show({
                type: "success",
                text1: "Workout saved successfully!",
                position: "top",
                visibilityTime: 4000,
            });
            router.back();
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to save workout.",
                position: "top",
                visibilityTime: 4000,
            });
        }
    };

    const name = watch("workoutName");

    useEffect(() => {
        if (name !== undefined && name !== null) {
            setWorkoutName(name);
        }
    }, [name, setWorkoutName]);

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 px-5">
                    <ScrollView
                        className="flex-1 p-5"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: Platform.OS === "ios" ? 40 : 20,
                        }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="mb-20" />
                        <Text className="text-xl font-bold text-neutral-800 mb-4 px-5">
                            Manual Entry
                        </Text>

                        <FormInput
                            control={control as Control<AddWorkoutForm>}
                            name="workoutName"
                            label="Workout Name (e.g. Leg Day, Pull)"
                            rules={{ required: "Name is required" }}
                            placeholder="Enter workout name"
                        />

                        <FormInput
                            control={control as Control<AddWorkoutForm>}
                            name="durationMinutes"
                            label="Duration (in minutes)"
                            placeholder="e.g. 45"
                            keyboardType="numeric"
                        />
                        <FormInput
                            control={control as Control<AddWorkoutForm>}
                            name="notes"
                            label="Notes (optional)"
                            placeholder="Any additional notes..."
                        />

                        <View className="mb-9" />

                        <View className="p-4 border border-green-700 rounded-xl bg-green-50 mb-6">
                            <Text className="text-lg font-bold text-neutral-800 mb-3">
                                Exercises: ({draftedExercises.length})
                            </Text>

                            {draftedExercises.map((exercise) => {
                                const firstSet = exercise.sets[0];
                                const summaryText = `${exercise.sets.length} sets • ${firstSet.repetitions} reps • ${firstSet.weightKg} kg`;
                                return (
                                    <View
                                        key={exercise.id}
                                        className="flex-row justify-between items-center py-2 border-b border-blue-200 last:border-b-0"
                                    >
                                        <View className="flex-1">
                                            <Text className="font-semibold text-base text-neutral-800">
                                                {exercise.exerciseName}
                                            </Text>
                                            <Text className="text-sm text-neutral-600">
                                                {summaryText}
                                            </Text>
                                        </View>
                                        <Pressable
                                            onPress={() =>
                                                removeExercise(exercise.id)
                                            }
                                            className="bg-red-500 rounded-full w-6 h-6 items-center justify-center ml-4"
                                        >
                                            <Text className="text-white font-bold text-xs">
                                                X
                                            </Text>
                                        </Pressable>
                                    </View>
                                );
                            })}
                            {draftedExercises.length === 0 && (
                                <Text className="text-sm text-neutral-500">
                                    No exercises added yet.
                                </Text>
                            )}
                        </View>

                        <Pressable
                            onPress={() => router.push("/training/addExercise")}
                            className="w-full rounded-xl py-4 border-2 border-green-500 bg-white mb-10 items-center"
                        >
                            <Text className="text-md font-medium text-green-700">
                                + Add Exercises / Sets
                            </Text>
                        </Pressable>

                        <Button
                            title="Save New Session"
                            variant="primary"
                            onPress={handleSubmit(handleSaveSession)}
                            className="w-full rounded-xl"
                            textClassName="text-lg font-bold text-white"
                        />
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
