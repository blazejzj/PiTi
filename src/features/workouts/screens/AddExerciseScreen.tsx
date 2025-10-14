import { View, Text, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Control } from "react-hook-form";
import Button from '../../../components/Button';
import FormInput from '../../../components/FormInput';

type AddExerciseForm = {
    exerciseName: string;
    sets: string;
    reps: string;
    weight: string;
}

export default function AddExerciseScreen() {
    const router = useRouter();
    
    const { control, handleSubmit } = useForm<AddExerciseForm>();
    
    const handleSaveExercise = (data: AddExerciseForm) => {
        console.log("New Exercise Data Submitted:", data);
        
        // TODO: : pass data back to AddTrainingSessionScreen with router/context/global state?
        router.back(); 
    };

    return (
        <View className="flex-1 bg-white px-6">
            <ScrollView 
                className="flex-1 p-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 40 : 20 }}
                keyboardShouldPersistTaps="handled"
            >
               
                
                <Text className="text-xl font-bold text-neutral-800 mb-9">Manual Exercise Entry</Text>

                <FormInput
                    control={control as Control<AddExerciseForm>}
                    name="exerciseName"
                    label="Exercise Name"
                    rules={{ required: 'Name is required' }}
                    placeholder="e.g. Barbell Squat, Push-up"
                />

                <View className="flex-row justify-between mb-4">
                    <View className="w-1/3 pr-2">
                        <FormInput
                            control={control as Control<AddExerciseForm>}
                            name="sets"
                            label="Sets"
                            placeholder="3"
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="w-1/3 px-1">
                        <FormInput
                            control={control as Control<AddExerciseForm>}
                            name="reps"
                            label="Reps"
                            placeholder="10"
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="w-1/3 pl-2">
                        <FormInput
                            control={control as Control<AddExerciseForm>}
                            name="weight"
                            label="Weight (kg)"
                            placeholder="80"
                            keyboardType="numeric"
                        />
                    </View>
                </View>
                
                <View className="mb-10" />

                <Button
                    title="Add Exercise to Workout"
                    variant="primary" 
                    onPress={handleSubmit(handleSaveExercise)}
                    className="w-full rounded-xl" 
                    textClassName="text-lg font-bold text-white" 
                />

            </ScrollView>
        </View>
    );
}