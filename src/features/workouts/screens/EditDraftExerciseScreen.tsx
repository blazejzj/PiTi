import { View, Text, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import Button from '../../../components/Button';
import SetRow from '../components/SetRow';
import {workoutRepo} from '../repository/workoutRepo'; 
import { WorkoutExercise, WorkoutSet } from '../models';
import Toast from "react-native-toast-message";


type ExerciseData = {
    exercise: WorkoutExercise;
    sets: WorkoutSet[];
};

export default function EditLiveExerciseScreen() {
    const router = useRouter(); 
    const { id: exerciseId } = useLocalSearchParams<{ id: string }>(); 
    
    const [data, setData] = useState<ExerciseData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSets = useCallback(async (id: string) => {
        if (!id) return;
        try {
            const exercise = await workoutRepo.getExercise(id);
            const sets = await workoutRepo.listSets(id);
            
            sets.sort((a, b) => a.setNumber - b.setNumber);

            setData({ exercise, sets });
        } catch (error) {
            Toast.show({
                            type: "error",
                            text1: "Error",
                            text2: "Could not load exercise details.",
                            position: "bottom",
                            visibilityTime: 4000,
                        });
            router.back();
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    useEffect(() => {
        if (exerciseId) {
            fetchSets(exerciseId);
        } else {
            Toast.show({
                            type: "error",
                            text1: "Error",
                            text2: "Missing Exercise ID.",
                            position: "bottom",
                            visibilityTime: 4000,
                        });
            router.back();
        }
    }, [exerciseId, fetchSets, router]);


    const handleUpdateSet = async (set: WorkoutSet, reps: number, weight: number) => {
        try {
            await workoutRepo.updateSet(set.$id, reps, weight);
            Toast.show({
                            type: "success",
                            text1: "Success",
                            text2: `Set ${set.setNumber} updated successfully.`,
                            position: "top",
                            visibilityTime: 4000,
                        });
            await fetchSets(exerciseId!);
        } catch (error) {
            Toast.show({
                            type: "error",
                            text1: "Update Failed",
                            text2: "Could not save set changes to the database.",
                            position: "top",
                            visibilityTime: 4000,
                        });
        }
    };

    const handleRemoveSet = async (setId: string, setNumber: number) => {
        Alert.alert(
            "Confirm Delete",
            `Are you sure you want to remove Set ${setNumber}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await workoutRepo.deleteSet(setId);
                            Toast.show({
                            type: "success",
                            text1: "Success",
                            text2: `Set ${setNumber} removed.`,
                            position: "top",
                            visibilityTime: 4000,
                        });
                            await fetchSets(exerciseId!); 
                        } catch (error) {
                            Toast.show({
                            type: "error",
                            text1: "Delete Failed",
                            text2: "Could not delete set from the database.",
                            position: "top",
                            visibilityTime: 4000,
                        });
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleAddSet = async () => {
        if (!data || !exerciseId) return;

        const nextSetNumber = data.sets.length > 0 
            ? Math.max(...data.sets.map(s => s.setNumber)) + 1 
            : 1;

        const lastSet = data.sets[data.sets.length - 1];
        const defaultReps = lastSet ? lastSet.repetitions : 10;
        const defaultWeight = lastSet ? (lastSet.weightKg ?? 0) : 0;
        try {
            await workoutRepo.addSet(exerciseId, nextSetNumber, defaultReps, defaultWeight);
            Toast.show({
                            type: "success",
                            text1: "Success",
                            text2: `Set ${nextSetNumber} added.`,
                            position: "top",
                            visibilityTime: 4000,
                        });
            await fetchSets(exerciseId);
        } catch (error) {
            Toast.show({
                            type: "error",
                            text1: "Add Set Failed",
                            text2: "Could not create a new set.",
                            position: "top",
                            visibilityTime: 4000,
                        });
        }
    };


    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text className="mt-4 text-neutral-600">Loading live workout data...</Text>
            </View>
        );
    }

    if (!data) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <Text className="text-lg text-red-500">Error: Exercise data not available.</Text>
            </View>
        );
    }


    return (
        <View className="mt-20 p-4 border border-gray-200 rounded-xl bg-gray-50">
            <View className="p-5 border-b border-gray-200">
                <Text className="text-2xl font-extrabold text-neutral-800">{data.exercise.exerciseName}</Text>
                <Text className="text-md text-gray-500 mt-1">Editing Active Session Sets</Text>
            </View>

            <ScrollView 
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="mt-4 p-4 border border-gray-100 rounded-xl bg-gray-50">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-sm font-semibold text-gray-600 w-1/5">Set #</Text>
                        <View className="flex-row items-center w-4/5 ml-3">
                            <Text className="text-sm font-semibold text-gray-600 w-1/4 text-center">Reps</Text>
                            <Text className="text-sm font-semibold text-gray-600 w-1/3 text-center">Weight</Text>
                            <Text className="text-sm font-semibold text-gray-600 w-1/4 text-center">Action</Text>
                        </View>
                    </View>

                    {data.sets.map((set) => (
                        <SetRow
                            key={set.$id}
                            set={set}
                            onUpdate={handleUpdateSet}
                            onRemove={handleRemoveSet}
                        />
                    ))}
                </View>

                <View className="mt-6">
                    <Button
                        title="Add New Set"
                        variant="secondary"
                        onPress={handleAddSet}
                        className="w-full rounded-xl py-3 border-2 border-green-500 bg-white" 
                        textClassName="text-md font-medium text-green-700" 
                    />
                </View>

                <View className="mt-8">
                    <Button
                        title="Done Editing Sets"
                        variant="primary" 
                        onPress={() => router.back()}
                        className="w-full rounded-xl" 
                        textClassName="text-lg font-bold text-white" 
                    />
                </View>
            </ScrollView>
        </View>
    );
}