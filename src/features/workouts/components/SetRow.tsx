import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useState } from "react";
import { WorkoutExercise, WorkoutSet } from '../models';

type SetRowProps = {
    set: WorkoutSet;
    onUpdate: (set: WorkoutSet, reps: number, weight: number) => Promise<void>;
    onRemove: (setId: string, setNumber: number) => Promise<void>;
};

const SetRow = ({ set, onUpdate, onRemove }: SetRowProps) => {
    const [reps, setReps] = useState(String(set.repetitions));
    const [weight, setWeight] = useState(String(set.weightKg ?? ''));
    const [isSaving, setIsSaving] = useState(false);

    const isDirty = String(set.repetitions) !== reps || String(set.weightKg ?? '') !== weight;

    const handleSave = async () => {
        if (!isDirty) return;

        const newReps = parseInt(reps) || 0;
        const newWeight = parseFloat(weight) || 0;

        if (newReps <= 0) {
            Alert.alert("Invalid Input", "Reps must be a positive number.");
            return;
        }

        setIsSaving(true);
        try {
            await onUpdate(set, newReps, newWeight);
            setReps(String(newReps));
            setWeight(String(newWeight));
        } catch (error) {
        } finally {
            setIsSaving(false);
        }
    };
    
    


    return (
        <View className="flex-col py-2 border-b border-gray-100 last:border-b-0">
            <View className="flex-row items-center justify-between">
                <Text className="text-base font-medium text-neutral-800 w-1/5">Set {set.setNumber}</Text>

                <View className="flex-row items-center w-4/5 ml-3">
                    
                    <TextInput
                        value={reps}
                        onChangeText={setReps}
                        keyboardType="numeric"
                        placeholder="Reps"
                        className="border border-gray-300 p-2 rounded-md bg-white w-1/4 mr-2 text-center"
                    />

                    <TextInput
                        value={weight}
                        onChangeText={setWeight}
                        keyboardType="numeric"
                        placeholder="Weight (kg)"
                        className="border border-gray-300 p-2 rounded-md bg-white w-1/3 mr-3 text-center"
                    />

                    <Pressable
                        onPress={handleSave}
                        disabled={!isDirty || isSaving}
                        className={`p-2 rounded-md flex-row items-center justify-center ${isDirty ? 'bg-blue-600' : 'bg-gray-400'} mr-2`}
                    >
                        <Text className="text-white text-sm font-semibold">
                            {isSaving ? 'Saving...' : 'Save'}
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => onRemove(set.$id, set.setNumber)}
                        className="p-2 rounded-md bg-red-500 flex-row items-center justify-center"
                    >
                        <Text className="text-white text-sm font-semibold">X</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default SetRow;