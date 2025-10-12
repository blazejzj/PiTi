import { View, Text, Pressable } from "react-native";
import { ExerciseDisplayData } from "../../../types/training";

type WorkoutExerciseRowProps = {
    exercise: ExerciseDisplayData;
    onPress: () => void;
}

export const WorkoutExerciseRow = ({ exercise, onPress }: WorkoutExerciseRowProps) => {    
    
    const isCompleted = exercise.statusText === 'Completed';
    const isNotStarted = exercise.statusText === 'Not Started';
    
    const tagClass = isCompleted 
        ? 'bg-blue-100'             
        : isNotStarted
        ? 'bg-gray-100'              
        : 'bg-yellow-100';        
        
    const textColorClass = isCompleted 
        ? 'text-blue-700' 
        : isNotStarted
        ? 'text-gray-500' 
        : 'text-yellow-700';

    return (
        <Pressable 
            onPress={onPress}
            className="flex-row justify-between items-center bg-white rounded-xl mb-3 border border-gray-200 p-4"
        >
            <View>
                <Text className="text-lg font-bold text-neutral-800">{exercise.name}</Text>
            </View>
            
            <View className={`px-3 py-1 rounded-full ${tagClass}`}>
                <Text className={`text-xs font-bold ${textColorClass}`}>{exercise.statusText}</Text>
            </View>
            
        </Pressable>
    );
};