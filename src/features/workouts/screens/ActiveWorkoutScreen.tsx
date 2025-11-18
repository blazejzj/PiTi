import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { View, Text, ScrollView, Pressable, Alert, Platform } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { workoutRepo } from "../repository/workoutRepo";
import type { Workout, WorkoutExercise, WorkoutSet } from "../models";
import Button from '../../../components/Button'; 

type CompletionStatusMap = Record<string, boolean>; 

const ActiveWorkoutScreen = () => {
    const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
    const router = useRouter();
    const [workout, setWorkout] = useState<Workout | null>(null);
    const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
    const [setsByExercise, setSetsByExercise] = useState<Record<string, WorkoutSet[]>>({});
    const [completedStatus, setCompletedStatus] = useState<CompletionStatusMap>({});

    const loadData = useCallback(async () => {
        if (!workoutId) return;

        try {
            const w = await workoutRepo.get(workoutId);
            const ex = await workoutRepo.listExercises(workoutId);

            const setsMap: Record<string, WorkoutSet[]> = {};
            const initialCompletionMap: CompletionStatusMap = {};
            
            for (const e of ex) {
                setsMap[e.$id] = await workoutRepo.listSets(e.$id);
                initialCompletionMap[e.$id] = false; 
            }

            setWorkout(w);
            setExercises(ex);
            setSetsByExercise(setsMap);
            setCompletedStatus(initialCompletionMap);
        } catch (error) {
            console.error("Failed to load workout data:", error);
            Alert.alert("Failed to load workout data");
        }
    }, [workoutId]);
    
    const handleFinishWorkout = () => {
        if (!workout || !workoutId) return;

        Alert.alert(
            "Finish Workout?",
            "Are you sure you want to complete this session? You won't be able to edit it afterward.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Finish",
                    onPress: async () => {
                        try {
                            const startTime = new Date(workout.startedAt).getTime();
                            const endTime = new Date().getTime();
                            
                            const diffMs = endTime - startTime; 
                            const durationMinutes = Math.round(diffMs / (1000 * 60)); 
                            console.log(`[DB Check] Attempting to finish workout ID: ${workoutId} with duration: ${durationMinutes} minutes`);
                            await workoutRepo.finishWorkout(workoutId, durationMinutes);

                            await loadData();
                            console.log(`[DB Check] SUCCESSFULLY completed and updated workout ID: ${workoutId}`);
                            Alert.alert(
                                "Session Complete!", 
                                `You finished your workout in ${durationMinutes} minutes.`
                            );
                            
                            setTimeout(() => router.back(), 1000); 
                            
                        } catch (error) {
                            console.error("Failed to finish workout:", error);
                            Alert.alert("Error", "Could not complete the workout session.");
                        }
                    }
                }
            ]
        );
    };

    useFocusEffect(
    useCallback(() => {
        loadData();
    }, [loadData])
);

    
    const handleMarkCompleted = (exerciseId: string) => {
        if (!!workout?.endedAt) return;
        setCompletedStatus(prev => ({ ...prev, [exerciseId]: true }));
        Alert.alert("Completed!", "Exercise marked as finished. Great job!");
    };

    const handleRemoveExercise = async (exercise: WorkoutExercise) => {
        if (!!workout?.endedAt) return Alert.alert("Cannot Edit", "Session is finished.");
        Alert.alert(
            "Confirm Removal",
            `Are you sure you want to remove "${exercise.exerciseName}"? This is permanent.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await workoutRepo.deleteExerciseById(exercise.$id);
                            Alert.alert("Success", "Exercise removed.");
                            loadData(); 
                        } catch (error) {
                            console.error("Deletion error:", error);
                            Alert.alert("Error", "Failed to remove exercise.");
                        }
                    },
                },
            ]
        );
    };

    const handleChangeSets = (exerciseId: string) => {
        if (!!workout?.endedAt) return Alert.alert("Cannot Edit", "Session is finished.");
        router.push({
            pathname: '/training/editDraftExercise', 
            params: { id: exerciseId, workoutId: workoutId }
        });
    };

    const handleLongPressExercise = (exercise: WorkoutExercise) => {
        if (!!workout?.endedAt) {
            Alert.alert("View Only", "This session is complete and cannot be edited.");
            return;
        }
            
        Alert.alert(
            exercise.exerciseName,
            "Choose an action:",
            [
                { text: "Mark Completed", onPress: () => handleMarkCompleted(exercise.$id) },
                { text: "Change/Alter Sets", onPress: () => handleChangeSets(exercise.$id) },
                { text: "Remove Exercise", style: "destructive", onPress: () => handleRemoveExercise(exercise) },
                { text: "Cancel", style: "cancel" },
            ]
        );
    };
        
    if (!workout) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-white">
                <Text>Loading session...</Text>
            </SafeAreaView>
        );
    }

    const formatStartedAt = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString([], {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
        } catch (e) {
            return "-";
        }
    };

    const isSessionFinished = !!workout.endedAt;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                className="flex-1 p-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 40 : 20 }}
            >
                
                <Text className="text-2xl font-bold text-neutral-800 mb-2">{workout.name}</Text>

                <View className="flex-row items-center mb-4">
                    <Text className="text-sm text-neutral-500 mr-4">
                        Duration: {workout.durationMinutes ?? "-"} min
                    </Text>
                    <Text className="text-sm text-neutral-500">
                        Started: {formatStartedAt(workout.startedAt)}
                    </Text>
                </View>

                {isSessionFinished && (
                    <View className="mb-4 p-3 bg-gray-200 rounded-lg">
                        <Text className="text-base font-semibold text-gray-700">
                            Status: Completed on {new Date(workout.endedAt!).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                )}


                {workout.notes && (
                    <View className="mb-6 p-3 bg-gray-100 rounded-lg border border-gray-200">
                        <Text className="font-semibold text-neutral-700 mb-1">Notes:</Text>
                        <Text className="text-sm text-neutral-600">{workout.notes}</Text>
                    </View>
                )}
                <View className="p-4 border border-green-700 rounded-xl bg-green-50 mb-6">
                    <Text className="text-lg font-bold text-neutral-800 mb-3">
                        Exercises ({exercises.length})
                    </Text>

                    {exercises.map((exercise, index) => {
                        const exerciseSets = setsByExercise[exercise.$id] || [];
                        const isCompleted = completedStatus[exercise.$id] || false; 
                        
                        const totalSets = exerciseSets.length;
                        const summaryText = totalSets > 0
                            ? `${totalSets} sets logged`
                            : `0 sets logged`;

                        return (
                            <Pressable
                                key={exercise.$id}
                                className={`py-3 ${index < exercises.length - 1 ? 'border-b border-green-200' : ''}`}
                                onLongPress={() => handleLongPressExercise(exercise)}
                            >
                                <View className="flex-row justify-between items-start">
                                    <View className="flex-1">
                                        <View className="flex-row items-center">
                                            <Text className="font-semibold text-base text-neutral-800 mr-2">
                                                {exercise.exerciseName}
                                            </Text>
                                            {isCompleted && (
                                                <Text className="text-lg text-green-600">✅</Text> 
                                            )}
                                        </View>
                                        <Text className="text-sm text-neutral-600">{summaryText}</Text>

                                        {exerciseSets.map((set) => (
                                            <View key={set.$id} className="flex-row justify-between mt-1 pl-4">
                                                <Text className="text-sm text-neutral-700">Set {set.setNumber}</Text>
                                                <Text className="text-sm text-neutral-700">
                                                   reps: {set.repetitions}, weight:{set.weightKg ? ` ${set.weightKg} kg` : ""}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </Pressable>
                        );
                    })}

                    {exercises.length === 0 && (
                        <Text className="text-base text-neutral-500">No exercises added yet. Long-press to add/edit sets.</Text>
                    )}
                </View>

                <View className="mt-6">
                    {isSessionFinished ? (
                        <Button
                            title="Done Viewing"
                            onPress={() => router.back()}
                            className="border-2 border-gray-400 bg-gray-100"
                            textClassName="text-gray-700"
                        />
                    ) : (
                        <>
                            <Button
                                title="Finish Workout Session"
                                onPress={handleFinishWorkout}
                                className="bg-green-600"
                                textClassName="text-white font-bold text-lg" 
                            />

                        </>
                    )}
                </View>
                
                {!isSessionFinished && (
                    <Button
                        title="Go Back to Dashboard"
                        onPress={() => router.back()}
                        className="mt-3 border border-gray-300 bg-white"
                        textClassName="text-neutral-500"
                    />
                )}
                
                <View className="mb-10" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ActiveWorkoutScreen;