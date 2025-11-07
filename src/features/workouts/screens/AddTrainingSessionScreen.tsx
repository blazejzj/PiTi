import { View, Text, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams, router } from 'expo-router';
import { useForm, Control, Form } from "react-hook-form";
import Button from '../../../components/Button'; 
import FormInput from '../../../components/FormInput'; 
import { workoutRepo } from '../repository/workoutRepo';
import { useEffect, useState } from 'react';
import { useWorkoutDraft } from '../state/useWorkoutDraft';

type AddWorkoutForm = {
    workoutName: string;
    durationMinutes: string;
    notes: string;
}

export default function AddTrainingSessionScreen() {
    const router = useRouter();
    //TODO: Get workoutId from params if editing existing session - leave it for now im thinking...
    //const { workoutId } = useLocalSearchParams<{ workoutId?: string }>();

    const { draftedExercises, clearDraft, removeExercise, workoutName: draftName, setWorkoutName } = useWorkoutDraft();
    const DUMMY_USER_ID = "user_abc123"; 
    //const { totalVolumeKg } = summary();
    
    const { watch, setValue, control, handleSubmit } = useForm<AddWorkoutForm>({
    defaultValues: {
        workoutName: draftName, 
        durationMinutes: '',
        notes: '',
    }
});

    const handleSaveSession = async (data: AddWorkoutForm) => {
        if (draftedExercises.length === 0) {
            Alert.alert("Please add at least one exercise before saving the session.");
            return;
        }
        try {
            const workoutData = {
                userId: DUMMY_USER_ID,
                name: data.workoutName,
                startedAt: new Date().toISOString(),
                endedAt: new Date().toISOString(),
                durationMinutes: parseInt(data.durationMinutes, 10) || null,
                notes: data.notes || null,
                caloriesBurned: null,
            };

            const createdWorkout = await workoutRepo.create(DUMMY_USER_ID, workoutData);
            const workoutId = createdWorkout.$id; 
            for (const draftExercise of draftedExercises) {
                
                const exerciseData = {
                    workoutId: workoutId, 
                    exerciseName: draftExercise.exerciseName,
                };
                const createdWorkoutExercise = await workoutRepo.createExercise(exerciseData);
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
            Alert.alert("Workout saved successfully!");
            router.back(); 

        } catch (error) {
            console.error("Error saving workout:", error);
            Alert.alert("Failed to save workout. Check console for details.");
        }
    };

    const name = watch('workoutName');

   useEffect(() => {
    if (name !== undefined && name !== null) {
        setWorkoutName(name); 
    }    
}, [name, setWorkoutName]);

    
    return (
        <View className="flex-1 bg-white px-5">
            <ScrollView 
                className="flex-1 p-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 40 : 20 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="mb-20" /> 
                <Text className="text-xl font-bold text-neutral-800 mb-4 px-5">Manual Entry</Text>

                <FormInput
                    control={control as Control<AddWorkoutForm>}
                    name="workoutName"
                    label="Workout Name (e.g. Leg Day, Pull)"
                    rules={{ required: 'Name is required' }}
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
                    {/*{totalVolumeKg > 0 && (*/}
                    {/*<Text className="text-sm font-bold text-green-700 mb-3">Total Weight Lifted: {totalVolumeKg} kg!</Text>
            )}*/}
                    {draftedExercises.map((exercise) => {
                        const firstSet = exercise.sets[0];
                        const summaryText = `${exercise.sets.length} sets • ${firstSet.repetitions} reps • ${firstSet.weightKg} kg`;
                        return(
                        <View 
                            key={exercise.id} 
                            className="flex-row justify-between items-center py-2 border-b border-blue-200 last:border-b-0"
                        >
                            <View className="flex-1">
                                <Text className="font-semibold text-base text-neutral-800">{exercise.exerciseName}</Text>
                                <Text className="text-sm text-neutral-600">{summaryText}</Text>
                            </View>
                            <Pressable 
                                onPress={() => removeExercise(exercise.id)}
                                className="bg-red-500 rounded-full w-6 h-6 items-center justify-center ml-4"
                            >
                                <Text className="text-white font-bold text-xs">X</Text>
                            </Pressable>
                        </View>);
                    })}
                    {draftedExercises.length === 0 && (
                        <Text className="text-sm text-neutral-500">No exercises added yet.</Text>
                    )}
                </View>

                <Pressable
                    onPress={() => router.push('/training/addExercise')}
                    className= "w-full rounded-xl py-4 border-2 border-green-500 bg-white mb-10 items-center"
                >
                    <Text className="text-md font-medium text-green-700">+ Add Exercises / Sets</Text>
                </Pressable>

                <Button
                    title="Save New Session"
                    variant="primary" 
                    onPress={handleSubmit(handleSaveSession)}
                    className="w-full rounded-xl" 
                    textClassName="text-lg font-bold text-white" 
                />

                <Text className="text-center text-sm text-neutral-500 font-medium my-4">— OR —</Text>
                {/* TODO: Predefined Programs implementation */}
                <View className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <Text className="text-xl font-bold mb-3 text-neutral-800">Add Predefined Programs</Text>
                    
                    <View className="mb-4">
                        <Text className="text-lg font-semibold text-neutral-800">Full Body</Text>
                        <Text className="text-sm text-neutral-600">Cardio • 3x/week</Text>
                        <Pressable className="mt-2 py-2 bg-green-500 rounded-lg items-center w-24">
                            <Text className="text-sm font-bold text-white">Use Program</Text>
                        </Pressable>
                    </View>
                    
                    <View>
                        <Text className="text-lg font-semibold text-neutral-800">Core</Text>
                        <Text className="text-sm text-neutral-600">Strength • 3x/week</Text>
                        <Pressable className="mt-2 py-2 bg-green-500 rounded-lg items-center w-24">
                            <Text className="text-sm font-bold text-white">Use Program</Text>
                        </Pressable>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}