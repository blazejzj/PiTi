import { View, Text, Pressable } from "react-native";
import { WorkoutExerciseRow } from './WorkoutExerciseRow';
import { ActiveWorkout } from "../../../types/training";


type ActiveWorkoutCardProps = ActiveWorkout & {
    onTogglePause: () => void;
}

export const ActiveWorkoutCard = ({name, status, duration, exercises, onTogglePause }: ActiveWorkoutCardProps) => {  
    
    const actionText = status === 'active' ? 'Pause' : (status === 'paused' ? 'Resume' : 'Start session');
    const actionClass = status === 'active' ? 'bg-gray-400' : 'bg-green-500';

    return (
        <View className="p-6 bg-white border border-gray-200 rounded-xl mb-6 shadow-sm">
            
            <View className="flex-row justify-between items-center mb-5">
                <Text className="text-xl font-bold text-neutral-800">{name}</Text>
                
                <Pressable
                    onPress={onTogglePause}
                    className={`px-4 py-2 rounded-lg ${actionClass}`}
                >
                    <Text className="text-sm font-semibold text-white">{actionText}</Text>
                </Pressable>
            </View>
            
            <View className="flex-row justify-between mb-5 pb-2 border-b border-gray-200">
                <Text className="text-sm font-medium text-neutral-500">
                    {status === 'active' ? 'Ongoing Session' : (status === 'paused' ? 'Paused Session' : 'Not Started')}
                </Text>
                <Text className="text-sm font-medium text-neutral-500">{duration}</Text>
            </View>

            <Text className="text-base font-semibold text-neutral-700 mb-2">Exercises:</Text>
            {exercises.map((ex, index) => (
                <WorkoutExerciseRow 
                    key={index} 
                    exercise={ex}
                    onPress={() => console.log(`Navigating to ${ex.name} details...`)}
                />
            ))}
        </View>
    );
};