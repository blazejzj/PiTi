import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Control } from "react-hook-form";
import Button from '../../../components/Button'; 
import FormInput from '../../../components/FormInput'; 
import { useState } from 'react';

type AddWorkoutForm = {
    workoutName: string;
    workoutType: string;
    durationMinutes: string;
    notes: string;
}

export default function AddTrainingSessionScreen() {
    const router = useRouter();
    
    const { control, handleSubmit } = useForm<AddWorkoutForm>();
    
    const handleSaveSession = (data: AddWorkoutForm) => {
        console.log("Form Data Submitted:", data);
        router.back(); 
    };

    return (
        <View className="flex-1 bg-white px-5">
            <ScrollView 
                className="flex-1 p-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 40 : 20 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="mb-9" /> 
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
                    name="workoutType"
                    label="Workout Type (e.g. Strength, Cardio)"
                    placeholder="Enter type"
                    rules={{ required: 'Type is required' }}
                />

                <FormInput
                    control={control as Control<AddWorkoutForm>}
                    name="durationMinutes"
                    label="Duration (in minutes)"
                    placeholder="e.g. 45"
                    keyboardType="numeric"
                />
                
                <View className="mb-9" /> 

            
                <Pressable
                    onPress={() => console.log("Gonna navigate to Add Exercise screen")}
                    className= "w-full rounded-xl py-4 border-2 border-green-500 bg-white mb-10 items-center"
                >
                    <Text className="text-md font-medium text-black">+ Add Exercises / Sets</Text>
                </Pressable>

                <Button
                    title="Save New Session"
                    variant="primary" 
                    onPress={handleSubmit(handleSaveSession)}
                    className="w-full rounded-xl" 
                    textClassName="text-lg font-bold text-white" 
                />

                <Text className="text-center text-sm text-neutral-500 font-medium my-4">— OR —</Text>
                
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